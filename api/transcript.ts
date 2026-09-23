// @ts-nocheck
// POST /api/transcript — staff (manager/admin) submits a transcript for a candidate.
//   { candidateId, kind, title, txt, sourceName, notes }
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

const RULES = 'Return ONLY a JSON object — no prose, no code fences. Judge behavior and content, never polish, accent, grammar, or camera presence. Never infer or mention age, gender, race, disability, religion, family status, or anything protected. This is advisory input to human decision-makers, not a decision.';

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
    + '\n\nROLE PROFILE — ' + prof.name + '. ' + prof.tag + '. ' + prof.blurb + ' Experience weighting: ' + prof.experienceWeighting + '\nCompetencies:\n' + comps
    + (cand.program ? '\nHiring for: ' + cand.program + '.' : '')
    + '\n\nOUTPUT — a JSON object with exactly this shape:\n'
    + '{"summary": string (the executive summary, 4-8 sentences), "bullets": [string (the 5-10 facts leadership must know, one line each)], "alreadyCovered": [string (questions asked and answered on this call — do not re-ask)], "askNext": [string (3-5 questions the next round should open with, each with the reason in a few words)], "strengths": [string], "concerns": [string], "grade": one of ' + JSON.stringify(GRADES) + ', "gradeRationale": string (one sentence), "caution": string (what a transcript cannot show)}\n\n' + RULES;
}

async function ask(system, user, maxTokens) {
  const key = process.env.ANTHROPIC_API_KEY;
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens || 3000, system, messages: [{ role: 'user', content: user }] })
  });
  const data = await r.json();
  if (!r.ok) throw new Error((data.error && data.error.message) || ('Review request failed (' + r.status + ')'));
  const raw = (data.content || []).map(b => b.text || '').join('').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const start = raw.indexOf('{'), end = raw.lastIndexOf('}');
  return JSON.parse(raw.slice(start, end + 1));
}

async function review(kind, txt, cand, notes, screener, instructions) {
  if (!process.env.ANTHROPIC_API_KEY) return { status: 'off', review: null, grade: null };
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

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  try {
    const body = readBody(req);
    const sb = admin();
    const me = await staffFromRequest(req, sb);
    if (!me || !(me.roles || []).some(r => r === 'manager' || r === 'admin')) return send(res, 401, { error: 'Sign in as a hiring manager or admin.' });
    const { data: cand } = await sb.from('candidates').select('id,name,role,program,loc').eq('id', body.candidateId).maybeSingle();
    if (!cand) return send(res, 404, { error: 'Candidate not found.' });
    const txt = clean(body.txt);
    if (txt.length < 200) return send(res, 400, { error: 'That transcript is too short to review (200 characters minimum).' });
    const kind = String(body.kind || 'Mock pitch (Exercise A)').slice(0, 60);
    const notes = String(body.notes || '').slice(0, 6000);
    const { data: row, error } = await sb.from('transcripts')
      .insert({ candidate_id: cand.id, kind, title: String(body.title || '').slice(0, 120), txt, source_name: String(body.sourceName || '').slice(0, 120), uploaded_by: me.id, notes, review_status: process.env.ANTHROPIC_API_KEY ? 'pending' : 'off' })
      .select('*').single();
    if (error) throw new Error(error.message);
    let instructions = null;
    if (isFirstCall(kind)) { const { data: s } = await sb.from('settings').select('value').eq('key', 'callEvalPrompt').maybeSingle(); instructions = s && typeof s.value === 'string' ? s.value : null; }
    let out = { status: 'off', review: null, grade: null };
    try { out = await review(kind, txt, cand, notes, me.short, instructions); }
    catch (e) { out = { status: 'failed', review: { error: (e && e.message) || String(e) }, grade: null }; }
    await sb.from('transcripts').update({ review: out.review, review_status: out.status, grade: out.grade }).eq('id', row.id);
    if (out.grade) await sb.from('audit').insert({ who: me.short, what: 'First-call evaluation \u2014 ' + cand.name + ' \u00b7 grade ' + out.grade });
    return send(res, 200, { ok: true, id: row.id, status: out.status, review: out.review, grade: out.grade });
  } catch (e) {
    return send(res, 500, { error: e && e.message ? e.message : 'Something went wrong.' });
  }
}
