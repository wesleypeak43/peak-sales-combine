// @ts-nocheck
// POST /api/invite
//   { candidateId }                 staff (manager/admin): email the candidate their personal link; resets the 3-day expiry
//   { candidateId, mode: 'extend' } staff: reset the expiry and mark as sent without emailing (for "Copy link")
//   { token }                       candidate self-service from an expired link: re-email the link
import { admin, staffFromRequest, appUrl, readBody, send, sendEmail, emailShell, button, esc } from '../src/server/shared';
import { PEAK_DATA } from '../src/data/seed';

const INVITE_DAYS = Number(process.env.INVITE_DAYS || 3);

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
    } else if (body.token) {
      selfService = true;
      const { data } = await sb.from('candidates').select('*').eq('token', body.token).eq('archived', false).maybeSingle();
      cand = data;
    }
    if (!cand) return send(res, 404, { error: 'Candidate not found.' });

    const expires = new Date(Date.now() + INVITE_DAYS * 86400000).toISOString();
    const link = appUrl() + '/?invite=' + cand.token;
    const extendOnly = body.mode === 'extend';

    if (!extendOnly) {
      const first = String(cand.name || '').split(' ')[0] || 'there';
      const roleRow = (PEAK_DATA.roles || []).find(r => r.title === cand.role) || {};
      const prop = roleRow.prop ? ' \u00b7 ' + roleRow.prop : '';
      const expiresTxt = new Date(expires).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      const html = emailShell(selfService ? 'Your new Peak Sales Combine link' : 'You\u2019re invited to the Peak Sales Combine',
        '<p style="font-size:15px;line-height:1.6;color:#D5DED7">Hi ' + esc(first) + ',</p>'
        + '<p style="font-size:15px;line-height:1.6;color:#D5DED7">' + (selfService ? 'Here is your fresh link. Your progress is saved, so you can pick up where you left off.' : 'Thanks for your interest in the <strong>' + esc(cand.role) + '</strong> role' + esc(prop) + '. The next step is the Peak Sales Combine: a short, structured look at how you actually sell \u2014 not a personality quiz.') + '</p>'
        + '<p style="font-size:14px;line-height:1.6;color:#A7B5AB">Stages 1\u20133 take about 60 minutes in total. You can save and return. Your link is personal \u2014 please don\u2019t forward it.</p>'
        + button(link, 'Open my assessment')
        + '<p style="font-size:13px;color:#A7B5AB;line-height:1.6">This link expires on <strong>' + esc(expiresTxt) + '</strong>. If it expires, open it anyway and request a new one \u2014 nothing is lost.</p>'
        + '<p style="font-size:13px;color:#A7B5AB;line-height:1.6">Need an accommodation or have a question? Reply to this email.</p>');
      const text = 'Hi ' + first + ',\n\n' + (selfService ? 'Here is your fresh Peak Sales Combine link.' : 'You\u2019re invited to the Peak Sales Combine for the ' + cand.role + ' role.') + '\n\nOpen your assessment: ' + link + '\n\nThe link expires on ' + expiresTxt + '. Stages 1\u20133 take about 60 minutes; you can save and return.\n\nPeak Sports MGMT';
      await sendEmail({ to: cand.email, subject: selfService ? 'Your new Peak Sales Combine link' : 'Your Peak Sales Combine invitation \u2014 ' + cand.role, html, text });
    }

    await sb.from('candidates').update({ invite_sent_at: new Date().toISOString(), invite_expires_at: expires, resend_requested_at: null }).eq('id', cand.id);
    await sb.from('audit').insert({ who: staff ? staff.short : 'System', what: (extendOnly ? 'Copied invite link \u2014 ' : selfService ? 'Re-sent invite at candidate\u2019s request \u2014 ' : 'Emailed invite \u2014 ') + cand.name });
    return send(res, 200, { ok: true, link, expires });
  } catch (e) {
    return send(res, 500, { error: e && e.message ? e.message : 'Something went wrong.' });
  }
}
