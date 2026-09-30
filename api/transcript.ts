// @ts-nocheck
// POST /api/transcript — staff (manager/admin) submits a transcript for a candidate, or re-runs the evaluation on a saved one.
//   { candidateId, kind, title, txt, sourceName, notes }        save + evaluate
//   { action: 'reevaluate', transcriptId }                      evaluate a saved transcript again (after fixing the key or the instructions)
// Two evaluation modes, both stored on the transcript row and advisory only:
//   • "First call (phone screen)" → executive summary for the next round, what's already covered, what to ask next,
//     strengths/concerns against the role profile, and a letter grade A+–F. Follows the editable instructions in
//     settings.callEvalPrompt and folds in the screener's own notes.
//   • anything else (mock pitch, interview) → evidence-quoted read against the eight combine competencies.
// Requires ANTHROPIC_API_KEY; without it the transcript is stored for evaluators to read and no summary is produced.
import { admin, staffFromRequest, readBody, send } from '../src/server/shared';
import { PEAK_DATA } from '../src/data/seed';
import { PEAK_BANK } from '../src/data/bank';
import { DEFAULT_CALL_PROMPT, GRADES } from '../src/data/defaults';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';
const isFirstCall = kind => /^First call/i.test(String(kind || ''));
// The key as pasted into Vercel, minus the things people paste by accident (quotes, spaces, a "NAME=" prefix, a trailing newline).
const apiKey = () => String(process.env.ANTHROPIC_API_KEY || '').trim().replace(/^ANTHROPIC_API_KEY\s*=\s*/i, '').replace(/^["'`]+|["'`,;]+$/g, '').trim();

// Strip WebVTT / SRT furniture so the reviewer (human or model) sees speech, not timestamps.
function clean(txt) {
  return String(txt || '')
    .replace(/^WEBVTT.*$/m, '')
    .replace(/^\d+\s*$/gm, '')
    .replace(/^\s*\d{1,2}:\d{2}(:\d{2})?[.,]\d{1,3}\s*-->.*$/gm, '')
    .replace(/<\/?[cv][^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const RULES = 'Return ONLY a JSON object — no prose before or after it, no code fences. Judge behavior and content, never polish, accent, grammar, or camera presence. Never infer or mention age, gender, race, disability, religion, family status, or anything protected. This is advisory input to human decision-makers, not a decision.';

function combinePrompt(kind) {
  const comps = PEAK_DATA.comps.map(c => '- ' + c.id + ' · ' + c.name + ': ' + c.d + ' Anchors — 1: ' + PEAK_DATA.anchors[c.id][1] + ' | 3: ' + PEAK_DATA.anchors[c.id][3] + ' | 5: ' + PEAK_DATA.anchors[c.id][5]).join('\n');
  return 'You assist trained evaluators at Peak Sports MGMT who are hiring salespeople. You will read a transcript of a "' + kind + '" and return a JSON object with this shape:\n'
    + '{"summary": string (2-3 sentences, what the candidate actually did), "competencies": [{"id": string, "rating": 1|2|3|4|5|null, "evidence": [{"quote": string (verbatim, <= 30 words), "note": string}], "note": string}], "strengths": [string], "concerns": [string], "followUps": [string (specific interview questions this transcript raises)], "caution": string}\n\n'
    + 'Competencies and behaviorally anchored scale:\n' + comps + '\n\nRules: rate a competency only when the transcript contains direct evidence for it; otherwise rating null and say why in note. Quote verbatim. ' + RULES;
}

function firstCallPrompt(instructions, cand) {
  const pid = (PEAK_DATA.profileByRole || {})[cand.role] || 'entry';
  const prof = PEAK_BANK.ROLES[pid] || PEAK_BANK.ROLES.entry;
  const comps = Object.entries(prof.competencies).map(([k, c]) => '- ' + c.name + (c.critical ? ' (critical)' : '') + ' — weight ' + c.weight + '%').join('\n');
  return (instructions || DEFAULT_CALL_PROMPT).trim()
    + '\n\nROLE PROFILE — ' + prof.name + (prof.version ? ' (' + prof.version + ')' : '') + '. ' + prof.tag + '. ' + prof.blurb + ' Experience weighting: ' + prof.experienceWeighting + '\nCompetencies:\n' + comps
    + (cand.program ? '\nHiring for: ' + cand.program + '.' : '')
    + '\n\nOUTPUT — a JSON object with exactly this shape:\n'
    + '{"summary": string (the executive summary, 4-8 sentences), "bullets": [string (the 5-10 facts leadership must know, one line each)], "alreadyCovered": [string (questions asked and answered on this call — do not re-ask)], "askNext": [string (3-5 questions the next round should open with, each with the reason in a few words)], "strengths": [string], "concerns": [string], "grade": one of ' + JSON.stringify(GRADES) + ', "gradeRationale": string (one sentence), "caution": string (what a transcript cannot show)}\n\n' + RULES;
}

// Pulls the JSON object out of a model reply, tolerating fences, prose around it, trailing commas, and stray control characters.
function parseModelJson(raw) {
  const s = String(raw || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const start = s.indexOf('{'), end = s.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('no JSON object in the reply');
  const body = s.slice(start, end + 1);
  try { return JSON.parse(body); } catch (e) { /* repair below */ }
  const repaired = body.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ' ').replace(/,\s*([}\]])/g, '$1').replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  return JSON.parse(repaired);
}

async function ask(system, user, maxTokens) {
  const key = apiKey();
  let r;
  try {
    r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens || 3000, system, messages: [{ role: 'user', content: user }] })
    });
  } catch (e) {
    throw new Error('Could not reach the AI service: ' + ((e && e.message) || e) + (/header/i.test(String(e && e.message)) ? ' — the key in Vercel contains characters it should not (paste only the key itself, no quotes, spaces, or line breaks).' : ''));
  }
  const text = await r.text();
  let data = null;
  try { data = JSON.parse(text); } catch (e) { data = null; }
  if (!r.ok) {
    const detail = (data && data.error && data.error.message) ? data.error.message : text.slice(0, 200).replace(/\s+/g, ' ');
    const hint = (r.status === 401 || r.status === 403) ? ' The key was rejected: in console.anthropic.com create a key with Scope set to a workspace (not Organization), paste only the key into Vercel as ANTHROPIC_API_KEY, then Redeploy.'
      : r.status === 404 ? ' The model name was not found — set ANTHROPIC_MODEL in Vercel to a current model.'
      : r.status === 429 || r.status === 529 ? ' The service is busy or the account is out of credit — try again in a minute, or top up at console.anthropic.com → Billing.'
      : r.status === 400 && /credit|billing/i.test(detail) ? ' Add credit at console.anthropic.com → Billing.' : '';
    console.error('anthropic ' + r.status + ': ' + text.slice(0, 500));
    throw new Error('AI service error (HTTP ' + r.status + '): ' + detail + hint);
  }
  if (!data) { console.error('anthropic non-JSON body: ' + text.slice(0, 500)); throw new Error('The AI service returned something unreadable (HTTP ' + r.status + '): ' + text.slice(0, 160).replace(/\s+/g, ' ')); }
  const raw = (data.content || []).map(b => b.text || '').join('');
  try { return parseModelJson(raw); }
  catch (e) { console.error('model reply not JSON: ' + raw.slice(0, 500)); throw new Error('The evaluation came back in an unexpected format. Use “Run evaluation again” — this usually clears on a retry.'); }
}

async function review(kind, txt, cand, notes, screener, instructions) {
  if (!apiKey()) return { status: 'off', review: null, grade: null };
  if (isFirstCall(kind)) {
    const user = 'CANDIDATE: ' + cand.name + ' · applying for ' + cand.role + (cand.program ? ' at ' + cand.program : '') + (cand.loc ? ' · ' + cand.loc : '')
      + '\n\nSCREENER NOTES' + (screener ? ' (from ' + screener + ')' : '') + ':\n' + (String(notes || '').trim() || '(none provided)')
      + '\n\nTRANSCRIPT:\n\n' + txt.slice(0, 120000);
    const parsed = await ask(firstCallPrompt(instructions, cand), user, 3500);
    const grade = GRADES.includes(String(parsed.grade || '').trim().toUpperCase()) ? String(parsed.grade).trim().toUpperCase() : null;
    const list = x => Array.isArray(x) ? x.map(s => String(s)).filter(Boolean) : [];
    const out = { mode: 'firstCall', summary: String(parsed.summary || ''), bullets: list(parsed.bullets), alreadyCovered: list(parsed.alreadyCovered), askNext: list(parsed.askNext), strengths: list(parsed.strengths), concerns: list(parsed.concerns), grade, gradeRationale: String(parsed.gradeRationale || ''), caution: String(parsed.caution || ''), screenerNotes: String(notes || '').trim(), screener: screener || '', model: MODEL, at: new Date().toISOString() };
    return { status: 'done', review: out, grade };
  }
  const parsed = await ask(combinePrompt(kind), 'TRANSCRIPT:\n\n' + txt.slice(0, 120000), 3000);
  const names = Object.fromEntries(PEAK_DATA.comps.map(c => [c.id, c.name]));
  parsed.competencies = (parsed.competencies || []).filter(c => names[c.id]).map(c => ({ ...c, name: names[c.id], rating: [1, 2, 3, 4, 5].includes(Number(c.rating)) ? Number(c.rating) : null }));
  parsed.mode = 'combine'; parsed.screenerNotes = String(notes || '').trim(); parsed.model = MODEL; parsed.at = new Date().toISOString();
  return { status: 'done', review: parsed, grade: null };
}

async function evaluateRow(sb, row, cand, me) {
  let instructions = null;
  if (isFirstCall(row.kind)) { const { data: s } = await sb.from('settings').select('value').eq('key', 'callEvalPrompt').maybeSingle(); instructions = s && typeof s.value === 'string' ? s.value : null; }
  let out = { status: 'off', review: null, grade: null };
  try { out = await review(row.kind, row.txt, cand, row.notes, me.short, instructions); }
  catch (e) { out = { status: 'failed', review: { error: (e && e.message) || String(e) }, grade: null }; }
  await sb.from('transcripts').update({ review: out.review, review_status: out.status, grade: out.grade }).eq('id', row.id);
  if (out.grade) await sb.from('audit').insert({ who: me.short, what: 'First-call evaluation \u2014 ' + cand.name + ' \u00b7 grade ' + out.grade });
  return out;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  try {
    const body = readBody(req);
    const sb = admin();
    const me = await staffFromRequest(req, sb);
    if (!me || !(me.roles || []).some(r => r === 'manager' || r === 'admin')) return send(res, 401, { error: 'Sign in as a hiring manager or admin.' });

    if (body.action === 'reevaluate') {
      const { data: row } = await sb.from('transcripts').select('*').eq('id', String(body.transcriptId || '')).maybeSingle();
      if (!row) return send(res, 404, { error: 'Transcript not found.' });
      const { data: cand } = await sb.from('candidates').select('id,name,role,program,loc').eq('id', row.candidate_id).maybeSingle();
      if (!cand) return send(res, 404, { error: 'Candidate not found.' });
      if (!apiKey()) return send(res, 200, { ok: true, id: row.id, status: 'off', review: null, grade: null });
      await sb.from('transcripts').update({ review_status: 'pending' }).eq('id', row.id);
      const out = await evaluateRow(sb, row, cand, me);
      return send(res, 200, { ok: true, id: row.id, status: out.status, review: out.review, grade: out.grade });
    }

    const { data: cand } = await sb.from('candidates').select('id,name,role,program,loc').eq('id', body.candidateId).maybeSingle();
    if (!cand) return send(res, 404, { error: 'Candidate not found.' });
    const txt = clean(body.txt);
    if (txt.length < 200) return send(res, 400, { error: 'That transcript is too short to review (200 characters minimum).' });
    const kind = String(body.kind || 'Mock pitch (Exercise A)').slice(0, 60);
    const notes = String(body.notes || '').slice(0, 6000);
    const { data: row, error } = await sb.from('transcripts')
      .insert({ candidate_id: cand.id, kind, title: String(body.title || '').slice(0, 120), txt, source_name: String(body.sourceName || '').slice(0, 120), uploaded_by: me.id, notes, review_status: apiKey() ? 'pending' : 'off' })
      .select('*').single();
    if (error) throw new Error(error.message);
    const out = await evaluateRow(sb, row, cand, me);
    return send(res, 200, { ok: true, id: row.id, status: out.status, review: out.review, grade: out.grade });
  } catch (e) {
    return send(res, 500, { error: e && e.message ? e.message : 'Something went wrong.' });
  }
}
