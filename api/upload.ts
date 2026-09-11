// @ts-nocheck
// POST /api/upload — files (résumés, Exercise B decks/videos) go to the private 'candidate-files' bucket.
//   who:  { token }          candidate, via their assessment link
//         { combineToken }   candidate, via their combine link
//         { candidateId }    staff (manager/admin — any pipeline staff for 'link')
//   action 'sign'    { purpose: 'resume'|'case', filename, size }  -> { path, token }   short-lived signed upload URL
//   action 'confirm' { purpose, path, filename }                    -> records the file on the candidate
//   action 'link'    { path }                                       -> { url } 5-minute download link (staff / assigned evaluators)
import { admin, staffFromRequest, readBody, send } from '../src/server/shared';

const BUCKET = 'candidate-files';
const MAX = 15 * 1024 * 1024;
const OK_EXT = { resume: ['pdf', 'doc', 'docx', 'rtf', 'txt'], case: ['pdf', 'ppt', 'pptx', 'key', 'doc', 'docx', 'mp4', 'mov', 'webm', 'm4v', 'mp3', 'm4a', 'txt'] };

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  try {
    const body = readBody(req);
    const sb = admin();
    let cand = null, staff = null;
    if (body.candidateId) {
      staff = await staffFromRequest(req, sb);
      if (!staff) return send(res, 401, { error: 'Sign in first.' });
      const { data } = await sb.from('candidates').select('*').eq('id', body.candidateId).maybeSingle();
      cand = data;
    } else if (body.token) {
      const { data } = await sb.from('candidates').select('*').eq('token', body.token).eq('archived', false).maybeSingle();
      cand = data;
      if (cand && new Date(cand.invite_expires_at).getTime() < Date.now()) return send(res, 410, { error: 'This link has expired.' });
    } else if (body.combineToken) {
      const { data: s } = await sb.from('sessions').select('candidate_id').eq('token', body.combineToken).maybeSingle();
      if (s) { const { data } = await sb.from('candidates').select('*').eq('id', s.candidate_id).eq('archived', false).maybeSingle(); cand = data; }
    }
    if (!cand) return send(res, 404, { error: 'Candidate not found.' });
    const manage = staff && (staff.roles || []).some(r => r === 'manager' || r === 'admin');
    const purpose = body.purpose === 'case' ? 'case' : 'resume';
    const folder = (purpose === 'case' ? 'case/' : 'resumes/') + cand.id + '/';

    if (body.action === 'link') {
      // pipeline staff, or an evaluator assigned to this candidate
      let allowed = staff && (staff.roles || []).some(r => r === 'manager' || r === 'admin' || r === 'leadership');
      if (!allowed && staff) { const { data: s } = await sb.from('sessions').select('id').eq('candidate_id', cand.id).or('e1.eq.' + staff.id + ',e2.eq.' + staff.id).maybeSingle(); allowed = !!s; }
      if (!allowed) return send(res, 401, { error: 'Not allowed.' });
      const path = String(body.path || '');
      if (!path.startsWith('resumes/' + cand.id + '/') && !path.startsWith('case/' + cand.id + '/')) return send(res, 400, { error: 'Unknown file.' });
      const { data, error } = await sb.storage.from(BUCKET).createSignedUrl(path, 300);
      if (error) throw new Error(error.message);
      return send(res, 200, { ok: true, url: data.signedUrl });
    }

    if (staff && !manage) return send(res, 401, { error: 'Only a hiring manager or admin can upload for a candidate.' });

    if (body.action === 'sign') {
      const name = String(body.filename || 'file').replace(/[^\w.\- ]+/g, '_').slice(-80);
      const ext = (name.split('.').pop() || '').toLowerCase();
      if (!OK_EXT[purpose].includes(ext)) return send(res, 400, { error: 'That file type isn\u2019t accepted here (' + OK_EXT[purpose].join(', ') + ').' });
      if (Number(body.size) > MAX) return send(res, 400, { error: 'Files must be under 15 MB.' });
      const path = folder + Date.now() + '-' + name;
      const { data, error } = await sb.storage.from(BUCKET).createSignedUploadUrl(path);
      if (error) throw new Error(error.message);
      return send(res, 200, { ok: true, path, token: data.token });
    }

    if (body.action === 'confirm') {
      const path = String(body.path || '');
      if (!path.startsWith(folder)) return send(res, 400, { error: 'Unknown file.' });
      const base = path.slice(folder.length);
      const { data: listed, error } = await sb.storage.from(BUCKET).list(folder.replace(/\/$/, ''), { search: base, limit: 5 });
      if (error) throw new Error(error.message);
      if (!(listed || []).some(o => o.name === base)) return send(res, 400, { error: 'The upload did not finish. Try again.' });
      const display = String(body.filename || base).slice(0, 120);
      if (purpose === 'resume') {
        const { error: e2 } = await sb.from('candidates').update({ resume_path: path, resume_name: display }).eq('id', cand.id);
        if (e2) throw new Error(e2.message);
      } else {
        const progress = { ...(cand.progress || {}), caseFile: { name: display, path, at: new Date().toISOString() } };
        const { error: e2 } = await sb.from('candidates').update({ progress }).eq('id', cand.id);
        if (e2) throw new Error(e2.message);
      }
      await sb.from('audit').insert({ who: staff ? staff.short : 'System', what: (purpose === 'resume' ? 'R\u00e9sum\u00e9 uploaded \u2014 ' : 'Exercise B file uploaded \u2014 ') + cand.name + ' \u00b7 ' + display });
      return send(res, 200, { ok: true, path, name: display });
    }

    return send(res, 400, { error: 'Unknown action.' });
  } catch (e) {
    return send(res, 500, { error: e && e.message ? e.message : 'Something went wrong.' });
  }
}
