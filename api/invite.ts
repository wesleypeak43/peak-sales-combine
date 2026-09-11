// @ts-nocheck
// POST /api/invite
//   { candidateId }                    staff (manager/admin): email the candidate their personal link; resets the 3-day expiry
//   { candidateId, track }             staff: switch the candidate to 'assessment' (full link) or 'info' (details-only link) and email it
//   { candidateId, mode: 'extend' }    staff: reset the expiry and mark as sent without emailing (for "Copy link")
//   { token }                          candidate self-service from an expired link: re-email the link
import { admin, staffFromRequest, appUrl, readBody, send, sendEmail, emailShell, button, esc } from '../src/server/shared';

const INVITE_DAYS = Number(process.env.INVITE_DAYS || 3);
const P = (s) => '<p style="font-size:15px;line-height:1.6;color:#D5DED7">' + s + '</p>';
const SMALL = (s) => '<p style="font-size:13px;color:#A7B5AB;line-height:1.6">' + s + '</p>';

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  try {
    const body = readBody(req);
    const sb = admin();
    let cand = null, staff = null, selfService = false;
    if (body.candidateId) {
      staff = await staffFromRequest(req, sb);
      if (!staff || !(staff.roles || []).some(r => r === 'manager' || r === 'admin')) return send(res, 401, { error: 'Sign in as a hiring manager or admin.' });
      const { data } = await sb.from('candidates').select('*').eq('id', body.candidateId).maybeSingle();
      cand = data;
      if (cand && (body.track === 'assessment' || body.track === 'info') && body.track !== cand.track) {
        await sb.from('candidates').update({ track: body.track }).eq('id', cand.id);
        cand.track = body.track;
      }
    } else if (body.token) {
      selfService = true;
      const { data } = await sb.from('candidates').select('*').eq('token', body.token).eq('archived', false).maybeSingle();
      cand = data;
    }
    if (!cand) return send(res, 404, { error: 'Candidate not found.' });

    const expires = new Date(Date.now() + INVITE_DAYS * 86400000).toISOString();
    const link = appUrl() + '/?invite=' + cand.token;
    const extendOnly = body.mode === 'extend';
    const info = cand.track === 'info';

    if (!extendOnly) {
      const first = String(cand.name || '').split(' ')[0] || 'there';
      const forTxt = '<strong>' + esc(cand.role) + '</strong>' + (cand.program ? ' role at <strong>' + esc(cand.program) + '</strong>' : ' role');
      const forPlain = cand.role + (cand.program ? ' role at ' + cand.program : ' role');
      const expiresTxt = new Date(expires).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      let title, subject, intro, detail, cta, plainIntro;
      if (selfService) {
        title = 'Your new Peak Sales Combine link'; subject = title;
        intro = 'Here is your fresh link. Your progress is saved, so you can pick up where you left off.';
        detail = info ? 'It takes about two minutes to share your details.' : 'The assessment takes about 20\u201330 minutes in total. You can save and return.';
        cta = info ? 'Share my details' : 'Open my assessment';
        plainIntro = 'Here is your fresh Peak Sales Combine link.';
      } else if (info) {
        title = 'Next step with Peak Sports MGMT'; subject = 'Peak Sports MGMT \u2014 a quick request for your details';
        intro = 'Thanks for your interest in the ' + forTxt + '. To keep things moving, please share your contact details and upload your r\u00e9sum\u00e9 through your personal link below.';
        detail = 'It takes about two minutes. There are no questions to answer at this step \u2014 if you move forward, the Sales Combine assessment (20\u201330 minutes) comes as a separate link.';
        cta = 'Share my details';
        plainIntro = 'Thanks for your interest in the ' + forPlain + '. Please share your contact details and upload your r\u00e9sum\u00e9 through your personal link (about two minutes).';
      } else {
        title = 'You\u2019re invited to the Peak Sales Combine'; subject = 'Your Peak Sales Combine invitation \u2014 ' + cand.role;
        intro = 'Thanks for your interest in the ' + forTxt + '. The next step is the Peak Sales Combine: a short, structured look at how you actually sell \u2014 not a personality quiz.';
        detail = 'It takes about 20\u201330 minutes in total: a realistic preview of the job, your details and r\u00e9sum\u00e9, and a set of sales decisions (all multiple choice). You can save and return. Your link is personal \u2014 please don\u2019t forward it.';
        cta = 'Open my assessment';
        plainIntro = 'You\u2019re invited to the Peak Sales Combine for the ' + forPlain + '. It takes about 20\u201330 minutes and is all multiple choice; you can save and return.';
      }
      const html = emailShell(title,
        P('Hi ' + esc(first) + ',') + P(intro) + SMALL(detail) + button(link, cta)
        + SMALL('This link expires on <strong>' + esc(expiresTxt) + '</strong>. If it expires, open it anyway and request a new one \u2014 nothing is lost.')
        + SMALL('Need an accommodation or have a question? Reply to this email.'));
      const text = 'Hi ' + first + ',\n\n' + plainIntro + '\n\nOpen your link: ' + link + '\n\nThe link expires on ' + expiresTxt + '.\n\nPeak Sports MGMT';
      await sendEmail({ to: cand.email, subject, html, text });
    }

    await sb.from('candidates').update({ invite_sent_at: new Date().toISOString(), invite_expires_at: expires, resend_requested_at: null }).eq('id', cand.id);
    await sb.from('audit').insert({ who: staff ? staff.short : 'System', what: (extendOnly ? 'Copied ' : selfService ? 'Re-sent at candidate\u2019s request \u2014 ' : 'Emailed ') + (info ? 'details link' : 'assessment link') + ' \u2014 ' + cand.name });
    return send(res, 200, { ok: true, link, expires, track: cand.track });
  } catch (e) {
    return send(res, 500, { error: e && e.message ? e.message : 'Something went wrong.' });
  }
}
