// @ts-nocheck
// POST /api/score — scores a candidate's Sales Decisions answers on the server and stores the report.
//   { token }        called by the candidate's browser when Stage 3 completes
//   { candidateId }  called by staff (manager/admin) to (re)score from the profile page
import { admin, staffFromRequest, readBody, send } from '../src/server/shared';
import { PEAK_BANK } from '../src/data/bank';
import { PEAK_DATA } from '../src/data/seed';

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  try {
    const body = readBody(req);
    const sb = admin();
    let cand = null;
    if (body.candidateId) {
      const staff = await staffFromRequest(req, sb);
      if (!staff || !(staff.roles || []).some(r => r === 'manager' || r === 'admin')) return send(res, 401, { error: 'Sign in as a hiring manager or admin.' });
      const { data } = await sb.from('candidates').select('*').eq('id', body.candidateId).maybeSingle();
      cand = data;
    } else if (body.token) {
      const { data } = await sb.from('candidates').select('*').eq('token', body.token).eq('archived', false).maybeSingle();
      cand = data;
    }
    if (!cand) return send(res, 404, { error: 'Candidate not found.' });

    const P = cand.progress || {};
    const answers = P.bkAns || {};
    if (!Object.keys(answers).length) return send(res, 400, { error: 'No Sales Decisions answers on file yet.' });
    const profId = (PEAK_DATA.profileByRole || {})[cand.role] || 'entry';
    const prof = PEAK_BANK.ROLES[profId] || PEAK_BANK.ROLES.entry;
    const { data: row } = await sb.from('settings').select('value').eq('key', 'bankSettings').maybeSingle();
    const settings = (row && row.value && row.value[profId]) || PEAK_BANK.defaultSettings(prof);
    const report = PEAK_BANK.score(prof, answers, settings);
    report.profileId = profId;
    const { error } = await sb.from('candidates').update({ report, scored_at: new Date().toISOString() }).eq('id', cand.id);
    if (error) throw new Error(error.message);
    return send(res, 200, { ok: true, overall: report.overall, band: report.band });
  } catch (e) {
    return send(res, 500, { error: e && e.message ? e.message : 'Something went wrong.' });
  }
}
