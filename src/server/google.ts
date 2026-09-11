// @ts-nocheck
// Google Calendar (server only). A Google Workspace service account with domain-wide delegation acts as the
// calendar owner (GOOGLE_CALENDAR_OWNER, e.g. wesley@peaksportsmgmt.com): events land on that calendar, every
// attendee gets a Google Calendar invitation, and a Google Meet link is created when no join link is supplied.
// Setup steps are in SETUP.md (Part 7). When the three variables are missing the app falls back to .ics emails.
import * as crypto from 'crypto';

export function googleConfigured() {
  return !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CALENDAR_OWNER);
}

const b64url = (s) => Buffer.from(s).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

async function accessToken() {
  const iss = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const sub = process.env.GOOGLE_CALENDAR_OWNER;
  const key = String(process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(JSON.stringify({ iss, sub, scope: 'https://www.googleapis.com/auth/calendar.events', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const signature = crypto.createSign('RSA-SHA256').update(header + '.' + claims).sign(key);
  const jwt = header + '.' + claims + '.' + b64url(signature);
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + jwt
  });
  const data = await r.json();
  if (!r.ok || !data.access_token) throw new Error('Google sign-in failed: ' + (data.error_description || data.error || r.status));
  return data.access_token;
}

// Creates the event and sends Google Calendar invitations to every attendee. Returns { id, meetLink, htmlLink }.
export async function createCalendarEvent({ summary, description, start, end, attendees, location, requestId }) {
  const token = await accessToken();
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
  const body: any = {
    summary, description,
    start: { dateTime: new Date(start).toISOString() },
    end: { dateTime: new Date(end).toISOString() },
    attendees: (attendees || []).filter(Boolean).map(email => ({ email })),
    reminders: { useDefault: true }
  };
  if (location) body.location = location;
  else body.conferenceData = { createRequest: { requestId: requestId || crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } } };
  const url = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(calendarId) + '/events?conferenceDataVersion=1&sendUpdates=all';
  const r = await fetch(url, { method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const data = await r.json();
  if (!r.ok) throw new Error('Google Calendar: ' + ((data.error && data.error.message) || r.status));
  return { id: data.id, meetLink: data.hangoutLink || '', htmlLink: data.htmlLink || '' };
}

// Removes the event (used when a session is cancelled). Silent when the event is already gone.
export async function deleteCalendarEvent(eventId) {
  if (!eventId) return;
  const token = await accessToken();
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
  const url = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(calendarId) + '/events/' + encodeURIComponent(eventId) + '?sendUpdates=all';
  const r = await fetch(url, { method: 'DELETE', headers: { authorization: 'Bearer ' + token } });
  if (!r.ok && r.status !== 404 && r.status !== 410) throw new Error('Google Calendar: could not remove the event (' + r.status + ')');
}
