// @ts-nocheck
// Shared helpers for the Vercel serverless functions in /api. Runs on the server only (service-role key).
import { createClient } from '@supabase/supabase-js';

export function admin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Server is missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY environment variables.');
  // These functions never open a realtime socket; on Node < 22 (no native WebSocket) the client refuses to construct without one.
  const NoSocket = class { constructor() { throw new Error('Realtime is not used on the server.'); } };
  if (typeof globalThis.WebSocket === 'undefined') globalThis.WebSocket = NoSocket;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, realtime: { transport: NoSocket } });
}

export async function staffFromRequest(req, sb) {
  const auth = (req.headers && (req.headers.authorization || req.headers.Authorization)) || '';
  const token = String(auth).replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data || !data.user || !data.user.email) return null;
  const { data: staff } = await sb.from('staff').select('*').ilike('email', data.user.email).eq('active', true).maybeSingle();
  return staff || null;
}

export function appUrl() {
  return (process.env.APP_URL || 'https://www.peaksportscareers.com').replace(/\/+$/, '');
}

export function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (e) { return {}; }
}

export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
}

export async function sendEmail({ to, subject, html, text, attachments, cc }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Email is not configured yet (RESEND_API_KEY missing). Use "Copy link" instead.');
  const from = process.env.MAIL_FROM || 'Peak Sales Combine <combine@peaksportscareers.com>';
  const payload: any = { from, to: Array.isArray(to) ? to : [to], subject, html, text };
  if (cc && cc.length) payload.cc = cc;
  if (attachments && attachments.length) payload.attachments = attachments; // [{ filename, content (base64) }]
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!r.ok) {
    let msg = ''; try { msg = (await r.json()).message || ''; } catch (e) { msg = ''; }
    throw new Error('Email could not be sent' + (msg ? ': ' + msg : ' (' + r.status + ')'));
  }
  return r.json();
}

// ---- time helpers (no libraries; Intl does the zone math) ----
export const TZ_LABEL = { 'America/Chicago': 'CT', 'America/New_York': 'ET', 'America/Denver': 'MT', 'America/Los_Angeles': 'PT', 'America/Phoenix': 'MST' };
function tzOffsetMs(ts, tz) {
  const dtf = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const p: any = Object.fromEntries(dtf.formatToParts(new Date(ts)).map(x => [x.type, x.value]));
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour === 24 ? 0 : +p.hour, +p.minute, +p.second);
  return asUtc - Math.floor(ts / 1000) * 1000;
}
// "2026-09-15" + "10:00" in America/Chicago -> the exact instant.
export function zonedToUtc(dateStr, timeStr, tz) {
  const [y, m, d] = String(dateStr).split('-').map(Number);
  const [hh, mm] = String(timeStr).split(':').map(Number);
  if (!y || !m || !d || isNaN(hh) || isNaN(mm)) return null;
  const guess = Date.UTC(y, m - 1, d, hh, mm || 0);
  let ts = guess - tzOffsetMs(guess, tz);
  const off2 = tzOffsetMs(ts, tz);
  if (guess - off2 !== ts) ts = guess - off2;
  return new Date(ts);
}
// -> "Tue, Sep 15 · 10:00 AM CT"
export function whenText(date, tz) {
  const day = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' }).format(date);
  const time = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' }).format(date);
  const label = TZ_LABEL[tz] || (new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' }).formatToParts(date).find(p => p.type === 'timeZoneName') || {}).value || tz;
  return day + ' \u00b7 ' + time + ' ' + label;
}

// ---- calendar file (.ics) so every invite can be added to any calendar, Google-connected or not ----
const icsDate = d => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const icsEsc = s => String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
export function ics({ uid, start, end, summary, description, location, organizer, attendees }) {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Peak Sports MGMT//Peak Sales Combine//EN', 'METHOD:REQUEST', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:' + uid,
    'DTSTAMP:' + icsDate(new Date()),
    'DTSTART:' + icsDate(start),
    'DTEND:' + icsDate(end),
    'SUMMARY:' + icsEsc(summary),
    'DESCRIPTION:' + icsEsc(description),
    location ? 'LOCATION:' + icsEsc(location) : null,
    organizer ? 'ORGANIZER;CN=Peak Sports MGMT:mailto:' + organizer : null,
    ...(attendees || []).map(a => 'ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:' + a),
    'STATUS:CONFIRMED',
    'END:VEVENT', 'END:VCALENDAR'
  ].filter(Boolean);
  return lines.join('\r\n');
}
export function icsAttachment(filename, content) {
  return { filename, content: Buffer.from(content, 'utf8').toString('base64') };
}

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

export function emailShell(title, bodyHtml) {
  return '<!doctype html><html><body style="margin:0;background:#0B120E;padding:32px 16px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#E9F0EA">'
    + '<div style="max-width:560px;margin:0 auto;background:#0F1611;border:1px solid rgba(160,190,170,.18);border-radius:14px;padding:32px">'
    + '<div style="font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#7E9186;margin-bottom:14px">Peak Sports MGMT</div>'
    + '<h1 style="margin:0 0 18px;font-size:24px;line-height:1.15">' + esc(title) + '</h1>'
    + bodyHtml
    + '<p style="margin:28px 0 0;font-size:12px;color:#5C6B61;line-height:1.5">This message was sent by Peak Sports MGMT. If you were not expecting it, you can ignore it.</p>'
    + '</div></body></html>';
}

export function button(href, label) {
  return '<p style="margin:22px 0"><a href="' + esc(href) + '" style="display:inline-block;background:#10B981;color:#04120B;text-decoration:none;font-weight:800;padding:13px 22px;border-radius:10px">' + esc(label) + '</a></p>'
    + '<p style="font-size:12px;color:#7E9186;word-break:break-all">Or copy this link: ' + esc(href) + '</p>';
}

export { esc };
