// @ts-nocheck
// /api/remind — nudges candidates who haven't finished their link.
//   GET   run by the Vercel cron in vercel.json (hourly; once a day on the Hobby plan). Protected by CRON_SECRET when set.
//   POST  "Send due reminders now" from Settings (manager/admin) — same logic, on demand.
// Rules: 48 hours after the link was sent with no completion → reminder 1; 72 hours → reminder 2 (final), which also
// refreshes the link so it still works. Re-sending a link from the pipeline restarts the clock. Candidates who finished,
// withdrew, were scheduled, or received a decision are skipped.
import { admin, staffFromRequest, appUrl, send, sendEmail, emailShell, button, esc } from '../src/server/shared';

const INVITE_DAYS = Number(process.env.INVITE_DAYS || 3);
const P = (s) => '<p style="font-size:15px;line-height:1.6;color:#D5DED7">' + s + '</p>';
const SMALL = (s) => '<p style="font-size:13px;color:#A7B5AB;line-height:1.6">' + s + '</p>';

export default async function handler(req, res) {
  try {
    const sb = admin();
    let who = 'System';
    if (req.method === 'GET') {
      const secret = process.env.CRON_SECRET;
      if (secret && String(req.headers.authorization || '') !== 'Bearer ' + secret) return send(res, 401, { error: 'Unauthorized' });
    } else if (req.method === 'POST') {
      const me = await staffFromRequest(req, sb);
      if (!me || !(me.roles || []).some(r => r === 'manager' || r === 'admin')) return send(res, 401, { error: 'Sign in as a hiring manager or admin.' });
      who = me.short;
    } else return send(res, 405, { error: 'GET or POST' });

    const [{ data: cands }, { data: sessions }, { data: decisions }] = await Promise.all([
      sb.from('candidates').select('*').eq('archived', false).not('invite_sent_at', 'is', null),
      sb.from('sessions').select('candidate_id'),
      sb.from('decisions').select('candidate_id')
    ]);
    const skip = new Set([...(sessions || []), ...(decisions || [])].map(x => x.candidate_id));
    const now = Date.now();
    const due = [];
    for (const c of cands || []) {
      const Pg = c.progress || {}, done = Pg.done || {};
      const complete = c.track === 'info' ? !!Pg.infoDone : !!done.s3;
      if (complete || Pg.withdrawn || skip.has(c.id)) continue;
      const hours = (now - new Date(c.invite_sent_at).getTime()) / 36e5;
      if (hours >= 72 && !c.reminder2_at) due.push([c, 2]);
      else if (hours >= 48 && !c.reminder1_at) due.push([c, 1]);
    }

    const sent = [], failed = [];
    for (const [c, n] of due) {
      const expires = new Date(now + INVITE_DAYS * 86400000).toISOString();
      const link = appUrl() + '/?invite=' + c.token;
      const first = String(c.name || '').split(' ')[0] || 'there';
      const info = c.track === 'info';
      const what = info ? 'share your details' : 'finish your Sales Combine assessment';
      const mins = info ? 'about two minutes' : 'about 20\u201330 minutes, all multiple choice';
      const expiresTxt = new Date(expires).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      const subject = n === 1 ? 'A quick reminder from Peak Sports MGMT' : 'Last reminder \u2014 your Peak Sports MGMT link';
      const intro = n === 1
        ? 'A quick nudge: we haven\u2019t received your ' + (info ? 'details' : 'assessment') + ' for the <strong>' + esc(c.role) + '</strong>' + (c.program ? ' role at <strong>' + esc(c.program) + '</strong>' : ' role') + ' yet. It takes ' + mins + ', and your progress is saved if you\u2019ve already started.'
        : 'This is the last reminder about the <strong>' + esc(c.role) + '</strong>' + (c.program ? ' role at <strong>' + esc(c.program) + '</strong>' : ' role') + '. We\u2019ve refreshed your link so it still works \u2014 it takes ' + mins + '. If the timing doesn\u2019t work for you, just reply to this email.';
      try {
        await sendEmail({
          to: c.email, subject,
          html: emailShell(n === 1 ? 'Still with us?' : 'Last call',
            P('Hi ' + esc(first) + ',') + P(intro) + button(link, info ? 'Share my details' : 'Open my assessment')
            + SMALL('Your link is personal and expires on <strong>' + esc(expiresTxt) + '</strong>.')),
          text: 'Hi ' + first + ',\n\n' + (n === 1 ? 'A quick reminder to ' : 'Last reminder to ') + what + ' for the ' + c.role + (c.program ? ' role at ' + c.program : ' role') + ' (' + mins + '): ' + link + '\n\nThe link expires on ' + expiresTxt + '.\n\nPeak Sports MGMT'
        });
        const patch = n === 1 ? { reminder1_at: new Date().toISOString() } : { reminder2_at: new Date().toISOString() };
        await sb.from('candidates').update({ ...patch, invite_expires_at: expires }).eq('id', c.id);
        await sb.from('audit').insert({ who, what: 'Reminder ' + n + ' of 2 emailed \u2014 ' + c.name });
        sent.push({ name: c.name, n });
      } catch (e) { failed.push({ name: c.name, n, error: (e && e.message) || String(e) }); }
    }
    return send(res, 200, { ok: true, checked: (cands || []).length, due: due.length, sent, failed });
  } catch (e) {
    return send(res, 500, { error: e && e.message ? e.message : 'Something went wrong.' });
  }
}
