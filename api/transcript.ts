// @ts-nocheck
// POST /api/transcript — staff (manager/admin) submits a transcript (mock pitch, phone screen, interview) for review.
//   { candidateId, kind, title, txt, sourceName }
// The transcript is stored for evaluators to read. When ANTHROPIC_API_KEY is set, Claude produces an advisory,
// evidence-quoted read against the eight competencies; it never decides anything and is labelled as assistance.
import { admin, staffFromRequest, readBody, send } from '../src/server/shared';
import { PEAK_DATA } from '../src/data/seed';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';

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

function schemaPrompt(kind) {
  const comps = PEAK_DATA.comps.map(c => '- ' + c.id + ' \u00b7 ' + c.name + ': ' + c.d + ' Anchors \u2014 1: ' + PEAK_DATA.anchors[c.id][1] + ' | 3: ' + PEAK_DATA.anchors[c.id][3] + ' | 5: ' + PEAK_DATA.anchors[c.id][5]).join('\n');
  return 'You assist trained evaluators at Peak Sports MGMT who are hiring salespeople. You will read a transcript of a "' + kind + '" and return ONLY a JSON object (no prose, no code fences) with this shape:\n'
    + '{"summary": string (2-3 sentences, what the candidate actually did), "competencies": [{"id": string, "rating": 1|2|3|4|5|null, "evidence": [{"quote": string (verbatim, <= 30 words), "note": string}], "note": string}], "strengths": [string], "concerns": [string], "followUps": [string (specific interview questions this transcript raises)], "caution": string}\n\n'
    + 'Competencies and behaviorally anchored scale:\n' + comps + '\n\n'
    + 'Rules: rate a competency only when the transcript contains direct evidence for it; otherwise rating null and say why in note. Quote verbatim. Judge behavior against the anchors, never polish, accent, grammar, or camera presence. Never infer or mention age, gender, race, disability, religion, family status, or anything protected. This is advisory input to human evaluators, not a decision.';
}

async function review(kind, txt) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { status: 'off', review: null };
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: 3000, system: schemaPrompt(kind), messages: [{ role: 'user', content: 'TRANSCRIPT:\n\n' + txt.slice(0, 120000) }] })
  });
  const data = await r.json();
  if (!r.ok) throw new Error((data.error && data.error.message) || ('Review request failed (' + r.status + ')'));
  const raw = (data.content || []).map(b => b.text || '').join('').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const start = raw.indexOf('{'), end = raw.lastIndexOf('}');
  const parsed = JSON.parse(raw.slice(start, end + 1));
  const names = Object.fromEntries(PEAK_DATA.comps.map(c => [c.id, c.name]));
  parsed.competencies = (parsed.competencies || []).filter(c => names[c.id]).map(c => ({ ...c, name: names[c.id], rating: [1, 2, 3, 4, 5].includes(Number(c.rating)) ? Number(c.rating) : null }));
  parsed.model = MODEL; parsed.at = new Date().toISOString();
  return { status: 'done', review: parsed };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  try {
    const body = readBody(req);
    const sb = admin();
    const me = await staffFromRequest(req, sb);
    if (!me || !(me.roles || []).some(r => r === 'manager' || r === 'admin')) return send(res, 401, { error: 'Sign in as a hiring manager or admin.' });
    const { data: cand } = await sb.from('candidates').select('id,name').eq('id', body.candidateId).maybeSingle();
    if (!cand) return send(res, 404, { error: 'Candidate not found.' });
    const txt = clean(body.txt);
    if (txt.length < 200) return send(res, 400, { error: 'That transcript is too short to review (200 characters minimum).' });
    const kind = String(body.kind || 'Mock pitch (Exercise A)').slice(0, 60);
    const { data: row, error } = await sb.from('transcripts')
      .insert({ candidate_id: cand.id, kind, title: String(body.title || '').slice(0, 120), txt, source_name: String(body.sourceName || '').slice(0, 120), uploaded_by: me.id, review_status: process.env.ANTHROPIC_API_KEY ? 'pending' : 'off' })
      .select('*').single();
    if (error) throw new Error(error.message);
    let out = { status: 'off', review: null };
    try { out = await review(kind, txt); }
    catch (e) { out = { status: 'failed', review: { error: (e && e.message) || String(e) } }; }
    await sb.from('transcripts').update({ review: out.review, review_status: out.status }).eq('id', row.id);
    return send(res, 200, { ok: true, id: row.id, status: out.status, review: out.review });
  } catch (e) {
    return send(res, 500, { error: e && e.message ? e.message : 'Something went wrong.' });
  }
}
