// @ts-nocheck
// Shared helpers for the Vercel serverless functions in /api. Runs on the server only (service-role key).
import { createClient } from '@supabase/supabase-js';

export function admin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Server is missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY environment variables.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
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

export async function sendEmail({ to, subject, html, text }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Email is not configured yet (RESEND_API_KEY missing). Use "Copy link" instead.');
  const from = process.env.MAIL_FROM || 'Peak Sales Combine <combine@peaksportscareers.com>';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html, text })
  });
  if (!r.ok) {
    let msg = ''; try { msg = (await r.json()).message || ''; } catch (e) { msg = ''; }
    throw new Error('Email could not be sent' + (msg ? ': ' + msg : ' (' + r.status + ')'));
  }
  return r.json();
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
