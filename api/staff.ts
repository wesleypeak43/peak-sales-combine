// @ts-nocheck
// POST /api/staff
//   { action: 'invite', name, short, email, title, roles }  admin only: create/update the staff record and email a set-password link
//   { action: 'reset', email }                              anyone: email a password-reset link if that email belongs to active staff
import { admin, staffFromRequest, appUrl, readBody, send, sendEmail, emailShell, button, esc } from '../src/server/shared';

async function actionLink(sb, email, preferInvite) {
  const opts = { redirectTo: appUrl() + '/' };
  const order = preferInvite ? ['invite', 'recovery'] : ['recovery', 'invite'];
  let lastErr = null;
  for (const type of order) {
    const { data, error } = await sb.auth.admin.generateLink({ type, email, options: opts });
    if (!error && data && data.properties && data.properties.action_link) return data.properties.action_link;
    lastErr = error;
  }
  throw new Error(lastErr && lastErr.message ? lastErr.message : 'Could not create a sign-in link.');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  try {
    const body = readBody(req);
    const sb = admin();
    const email = String(body.email || '').trim().toLowerCase();
    if (!/@/.test(email)) return send(res, 400, { error: 'A valid email is required.' });

    if (body.action === 'invite') {
      const me = await staffFromRequest(req, sb);
      if (!me || !(me.roles || []).includes('admin')) return send(res, 401, { error: 'Only an admin can invite staff.' });
      const roles = Array.isArray(body.roles) ? body.roles.filter(r => ['admin', 'manager', 'evaluator', 'leadership'].includes(r)) : [];
      if (!roles.length) return send(res, 400, { error: 'Pick at least one role.' });
      const name = String(body.name || '').trim() || email;
      const parts = name.split(' ');
      const short = String(body.short || '').trim() || (parts[0][0] + '. ' + parts.slice(1).join(' ')).trim();
      const { error } = await sb.from('staff').upsert({ email, name, short, title: String(body.title || ''), roles, active: true }, { onConflict: 'email' });
      if (error) throw new Error(error.message);
      const link = await actionLink(sb, email, true);
      const roleTxt = roles.map(r => ({ admin: 'Admin', manager: 'Hiring manager', evaluator: 'Evaluator', leadership: 'Leadership / Compliance' }[r] || r)).join(', ');
      await sendEmail({
        to: email,
        subject: 'Your Peak Sales Combine staff account',
        html: emailShell('Welcome to the Peak Sales Combine',
          '<p style="font-size:15px;line-height:1.6;color:#D5DED7">Hi ' + esc(parts[0]) + ', ' + esc(me.name) + ' set you up as <strong>' + esc(roleTxt) + '</strong>.</p>'
          + '<p style="font-size:14px;line-height:1.6;color:#A7B5AB">Click below to create your password. Afterwards, sign in at ' + esc(appUrl()) + ' with this email.</p>'
          + button(link, 'Create my password')
          + '<p style="font-size:12px;color:#7E9186">The link is single-use. If it has expired, use \u201cForgot password\u201d on the sign-in page.</p>'),
        text: 'Hi ' + parts[0] + ',\n\n' + me.name + ' set you up on the Peak Sales Combine as ' + roleTxt + '.\n\nCreate your password: ' + link + '\n\nThen sign in at ' + appUrl() + '.'
      });
      await sb.from('audit').insert({ who: me.short, what: 'Invited staff \u2014 ' + name + ' (' + roleTxt + ')' });
      return send(res, 200, { ok: true });
    }

    if (body.action === 'reset') {
      const { data: staff } = await sb.from('staff').select('*').ilike('email', email).eq('active', true).maybeSingle();
      if (staff) {
        const link = await actionLink(sb, email, false);
        await sendEmail({
          to: email,
          subject: 'Reset your Peak Sales Combine password',
          html: emailShell('Reset your password',
            '<p style="font-size:15px;line-height:1.6;color:#D5DED7">Hi ' + esc(staff.name.split(' ')[0]) + ', use the button below to choose a new password.</p>'
            + button(link, 'Choose a new password')
            + '<p style="font-size:12px;color:#7E9186">If you didn\u2019t ask for this, you can ignore it \u2014 your password stays the same.</p>'),
          text: 'Choose a new password: ' + link
        });
      }
      return send(res, 200, { ok: true });
    }

    return send(res, 400, { error: 'Unknown action.' });
  } catch (e) {
    return send(res, 500, { error: e && e.message ? e.message : 'Something went wrong.' });
  }
}
