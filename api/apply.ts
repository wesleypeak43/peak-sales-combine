// @ts-nocheck
// POST /api/apply — a candidate applies through a job's public application link (no staff involvement).
//   { applyToken, name, email, phone, loc, linkedin }
// Creates the candidate on the job's pipeline (source 'self'), emails them their personal assessment link, and
// returns that link so the browser can continue straight into the assessment. Re-applying with the same email
// re-uses the existing record and refreshes the link instead of creating a duplicate.
import { admin, appUrl, readBody, send, sendEmail, emailShell, button, esc } from '../src/server/shared';

const INVITE_DAYS = Number(process.env.INVITE_DAYS || 3);
const P = (s) => '<p style="font-size:15px;line-height:1.6;color:#D5DED7">' + s + '</p>';
const SMALL = (s) => '<p style="font-size:13px;color:#A7B5AB;line-height:1.6">' + s + '</p>';

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  try {
    const body = readBody(req);
    const sb = admin();
    const { data: job } = await sb.from('jobs').select('*').eq('apply_token', String(body.applyToken || '')).maybeSingle();
    if (!job) return send(res, 404, { error: 'This application link is not valid.' });
    if (job.apply_enabled === false || job.status !== 'Open') return send(res, 410, { error: 'Applications for this role are closed.' });
    const name = String(body.name || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    const email = String(body.email || '').trim().toLowerCase().slice(0, 120);
    if (name.length < 2) return send(res, 400, { error: 'Enter your full name.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return send(res, 400, { error: 'Enter a valid email address.' });
    const phone = String(body.phone || '').trim().slice(0, 40), loc = String(body.loc || '').trim().slice(0, 80), linkedin = String(body.linkedin || '').trim().slice(0, 200);

    const now = Date.now();
    const expires = new Date(now + INVITE_DAYS * 86400000).toISOString();
    let { data: cand } = await sb.from('candidates').select('*').eq('job_id', job.id).eq('archived', false).ilike('email', email).maybeSingle();
    let created = false;
    if (cand) {
      await sb.from('candidates').update({ phone: phone || cand.phone, loc: loc || cand.loc, linkedin: linkedin || cand.linkedin, invite_sent_at: new Date(now).toISOString(), invite_expires_at: expires, resend_requested_at: null }).eq('id', cand.id);
    } else {
      const ins = await sb.from('candidates').insert({ name, email, phone, loc, linkedin, role: job.title, program: job.program || '', job_id: job.id, source: 'self', track: 'assessment', invite_sent_at: new Date(now).toISOString(), invite_expires_at: expires }).select('*').single();
      if (ins.error) throw new Error(ins.error.message);
      cand = ins.data; created = true;
    }
    const link = appUrl() + '/?invite=' + cand.token;
    const first = name.split(' ')[0] || 'there';
    const forTxt = '<strong>' + esc(job.title) + '</strong>' + (job.program ? ' role at <strong>' + esc(job.program) + '</strong>' : ' role');
    const expiresTxt = new Date(expires).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    let emailed = false;
    try {
      await sendEmail({
        to: email,
        subject: 'Your Peak Sales Combine link \u2014 ' + job.title,
        html: emailShell('Your application is in',
          P('Hi ' + esc(first) + ',') + P('Thanks for applying for the ' + forTxt + '. Your next step is the Peak Sales Combine \u2014 about 20\u201330 minutes, all multiple choice. You can start now or come back with this link:')
          + button(link, 'Open my assessment') + SMALL('The link is personal \u2014 please don\u2019t forward it. It expires on <strong>' + esc(expiresTxt) + '</strong>; if it does, open it anyway and request a new one.')),
        text: 'Hi ' + first + ',\n\nThanks for applying for the ' + job.title + (job.program ? ' role at ' + job.program : ' role') + '. Your assessment link (20\u201330 minutes, all multiple choice): ' + link + '\n\nIt expires on ' + expiresTxt + '.\n\nPeak Sports MGMT'
      });
      emailed = true;
    } catch (e) { emailed = false; }
    await sb.from('audit').insert({ who: 'System', what: (created ? 'Applied via job link \u2014 ' : 'Re-applied via job link \u2014 ') + name + ' \u00b7 ' + job.title + (job.program ? ' \u00b7 ' + job.program : '') });
    return send(res, 200, { ok: true, link, emailed, created });
  } catch (e) {
    return send(res, 500, { error: e && e.message ? e.message : 'Something went wrong.' });
  }
}
