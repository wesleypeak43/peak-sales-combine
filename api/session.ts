// @ts-nocheck
// POST /api/session — staff (manager/admin) schedules a live combine.
//   { candidateId, date: 'YYYY-MM-DD', time: 'HH:MM', tz, durationMin, e1, e2, link? }
// Saves the session, creates the Google Calendar event (when connected — Meet link + invitations to the candidate
// and both evaluators), and emails the candidate their separate combine link with an .ics file. Evaluators get an
// email with the .ics too when Google Calendar is not connected.
import { admin, staffFromRequest, appUrl, readBody, send, sendEmail, emailShell, button, esc, zonedToUtc, whenText, ics, icsAttachment } from '../src/server/shared';
import { googleConfigured, createCalendarEvent } from '../src/server/google';

const P = (s) => '<p style="font-size:15px;line-height:1.6;color:#D5DED7">' + s + '</p>';
const SMALL = (s) => '<p style="font-size:13px;color:#A7B5AB;line-height:1.6">' + s + '</p>';

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  try {
    const body = readBody(req);
    const sb = admin();
    const me = await staffFromRequest(req, sb);
    if (!me || !(me.roles || []).some(r => r === 'manager' || r === 'admin')) return send(res, 401, { error: 'Sign in as a hiring manager or admin.' });

    const tz = body.tz || 'America/Chicago';
    const durationMin = Math.max(15, Math.min(240, Number(body.durationMin) || 60));
    const start = zonedToUtc(body.date, body.time, tz);
    if (!start) return send(res, 400, { error: 'Pick a date and a time.' });
    if (start.getTime() < Date.now() - 3600000) return send(res, 400, { error: 'That time is in the past.' });
    if (!body.e1 || !body.e2 || body.e1 === body.e2) return send(res, 400, { error: 'Two different evaluators are required.' });
    const end = new Date(start.getTime() + durationMin * 60000);

    const { data: cand } = await sb.from('candidates').select('*').eq('id', body.candidateId).eq('archived', false).maybeSingle();
    if (!cand) return send(res, 404, { error: 'Candidate not found.' });
    const { data: evals } = await sb.from('staff').select('*').in('id', [body.e1, body.e2]);
    const E1 = (evals || []).find(s => s.id === body.e1), E2 = (evals || []).find(s => s.id === body.e2);
    if (!E1 || !E2) return send(res, 400, { error: 'Evaluator not found.' });
    const { data: existing } = await sb.from('sessions').select('id').eq('candidate_id', cand.id).maybeSingle();
    if (existing) return send(res, 409, { error: 'This candidate already has a session. Cancel it first to reschedule.' });

    const when = whenText(start, tz);
    let link = String(body.link || '').trim();
    const { data: row, error } = await sb.from('sessions')
      .insert({ candidate_id: cand.id, when_txt: when, starts_at: start.toISOString(), duration_min: durationMin, e1: E1.id, e2: E2.id, link, created_by: me.id })
      .select('*').single();
    if (error) throw new Error(error.message);

    const combineLink = appUrl() + '/?combine=' + row.token;
    const warnings = [];
    let calendar = 'ics';

    // 1) Google Calendar — invitations to everyone, Meet link if none was pasted.
    if (googleConfigured()) {
      try {
        const ev = await createCalendarEvent({
          summary: 'Peak Sales Combine \u2014 ' + cand.name + ' (' + cand.role + ')',
          description: 'Live combine, Exercise A: Sell the Chicken Sandwich.\n\nCandidate: ' + cand.name + ' \u00b7 ' + cand.role + (cand.program ? ' \u00b7 ' + cand.program : '')
            + '\nEvaluator 1 (buyer): ' + E1.name + '\nEvaluator 2 (observer): ' + E2.name
            + '\n\nCandidate combine page (Exercise B, recording notice): ' + combineLink
            + '\nEvaluators: sign in at ' + appUrl() + ' \u2192 Sessions.',
          start, end,
          attendees: [cand.email, E1.email, E2.email],
          location: link || '',
          requestId: 'peak-' + row.id
        });
        if (!link && ev.meetLink) link = ev.meetLink;
        await sb.from('sessions').update({ calendar_event_id: ev.id, link }).eq('id', row.id);
        calendar = 'google';
      } catch (e) {
        warnings.push('Google Calendar: ' + ((e && e.message) || e) + ' \u2014 an .ics file was emailed instead.');
      }
    }

    // 2) Email the candidate their combine link (always).
    const first = String(cand.name || '').split(' ')[0] || 'there';
    const summary = 'Peak Sales Combine \u2014 live session';
    const icsText = ics({
      uid: 'peak-combine-' + row.id + '@peaksportscareers.com', start, end, summary,
      description: 'Your live Sales Combine with Peak Sports MGMT. Combine page: ' + combineLink + (link ? '\nJoin: ' + link : ''),
      location: link || '', organizer: '', attendees: []
    });
    const joinHtml = link ? SMALL('Join link: <a href="' + esc(link) + '" style="color:#34D399">' + esc(link) + '</a>') : SMALL('Your video link will be sent before the session.');
    let emailed = false;
    try {
      await sendEmail({
        to: cand.email,
        subject: 'Your live Sales Combine \u2014 ' + when,
        html: emailShell('Your live combine is scheduled',
          P('Hi ' + esc(first) + ',')
          + P('Your live Sales Combine is on <strong>' + esc(when) + '</strong> (' + durationMin + ' minutes) with two Peak evaluators. You\u2019ll get five minutes to prepare, three minutes to sell, one piece of coaching, and a second attempt.')
          + joinHtml
          + P('Before the session, open your combine page to read the brief, submit Exercise B (the Resourcefulness Case), and confirm the recording notice:')
          + button(combineLink, 'Open my combine page')
          + SMALL('A calendar file is attached. Need a different time? Reply to this email.')),
        text: 'Hi ' + first + ',\n\nYour live Sales Combine is on ' + when + ' (' + durationMin + ' minutes).' + (link ? '\nJoin: ' + link : '') + '\n\nBefore the session, open your combine page to submit Exercise B and confirm the recording notice: ' + combineLink + '\n\nPeak Sports MGMT',
        attachments: [icsAttachment('peak-sales-combine.ics', icsText)]
      });
      emailed = true;
      await sb.from('sessions').update({ notified_at: new Date().toISOString() }).eq('id', row.id);
    } catch (e) {
      warnings.push('Candidate email: ' + ((e && e.message) || e) + ' \u2014 share the combine link yourself: ' + combineLink);
    }

    // 3) Evaluators — Google already invited them; otherwise send the details with the .ics.
    if (calendar !== 'google') {
      for (const [ev, role] of [[E1, 'Evaluator 1 \u2014 you play the buyer'], [E2, 'Evaluator 2 \u2014 you observe']]) {
        try {
          await sendEmail({
            to: ev.email,
            subject: 'Combine session \u2014 ' + cand.name + ' \u00b7 ' + when,
            html: emailShell('You\u2019re evaluating a live combine',
              P('Hi ' + esc(ev.name.split(' ')[0]) + ', you\u2019re scheduled with <strong>' + esc(cand.name) + '</strong> (' + esc(cand.role) + ') on <strong>' + esc(when) + '</strong>. ' + esc(role) + '; the other evaluator is ' + esc(ev.id === E1.id ? E2.name : E1.name) + '.')
              + (link ? SMALL('Join link: <a href="' + esc(link) + '" style="color:#34D399">' + esc(link) + '</a>') : SMALL('No join link yet \u2014 the scheduler will add one.'))
              + button(appUrl(), 'Open the evaluator cockpit')
              + SMALL('Score independently; the other evaluator\u2019s scores stay hidden until you both submit. A calendar file is attached.')),
            text: 'You\u2019re scheduled with ' + cand.name + ' on ' + when + '. ' + role + '.' + (link ? '\nJoin: ' + link : '') + '\nCockpit: ' + appUrl(),
            attachments: [icsAttachment('peak-sales-combine.ics', icsText)]
          });
        } catch (e) { warnings.push('Evaluator email (' + ev.short + '): ' + ((e && e.message) || e)); }
      }
    }

    await sb.from('audit').insert({ who: me.short, what: 'Combine invites sent \u2014 ' + cand.name + ' \u00b7 ' + when + (calendar === 'google' ? ' \u00b7 Google Calendar' : ' \u00b7 email + .ics') });
    return send(res, 200, { ok: true, session: { id: row.id, token: row.token, link, when }, combineLink, calendar, emailed, warnings });
  } catch (e) {
    return send(res, 500, { error: e && e.message ? e.message : 'Something went wrong.' });
  }
}
