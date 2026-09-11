// @ts-nocheck
// Live data layer — Supabase (Postgres + Auth) behind the same view-model the screens already render.
// When VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are missing, or the URL has ?demo=1, the app stays in demo mode.
import { createClient } from '@supabase/supabase-js';

const ENV = (import.meta && import.meta.env) || {};
const SB_URL = ENV.VITE_SUPABASE_URL, SB_KEY = ENV.VITE_SUPABASE_ANON_KEY;
const wantsDemo = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('demo');
export const LIVE_ENABLED = !!(SB_URL && SB_KEY) && !wantsDemo;
export const sb = LIVE_ENABLED ? createClient(SB_URL, SB_KEY) : null;
export const FILE_BUCKET = 'candidate-files';

const EMPTY = () => ({ candidates: [], staff: [], reviews: [], sessions: [], evaluations: [], interviews: [], decisions: [], accommodations: [], details: {}, settings: {}, outcomes: [], audit: [], transcripts: [] });

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const clock = d => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
export function fmtT(iso) {
  if (!iso) return '';
  const d = new Date(iso); if (isNaN(d.getTime())) return '';
  const now = new Date(), day = 86400000;
  const midnight = x => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((midnight(now) - midnight(d)) / day);
  if (diff === 0) return 'Today ' + clock(d);
  if (diff === 1) return 'Yesterday ' + clock(d);
  if (diff > 1 && diff < 7) return DAYS[d.getDay()] + ' ' + clock(d);
  return MONTHS[d.getMonth()] + ' ' + d.getDate() + ' · ' + clock(d);
}
export function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso); if (isNaN(d.getTime())) return '';
  return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
}
export function daysLeft(iso) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / 86400000);
}
// "2026-09-15" + "10:00" + "CT" -> "Tue, Sep 15 · 10:00 AM CT" (display only; the server computes the real instant)
export function whenTxt(date, time, tzLabel) {
  if (!date || !time) return '';
  const [y, m, d] = String(date).split('-').map(Number);
  const [hh, mm] = String(time).split(':').map(Number);
  if (!y || !m || !d || isNaN(hh)) return '';
  const dt = new Date(y, m - 1, d, hh, mm || 0);
  return DAYS[dt.getDay()] + ', ' + MONTHS[dt.getMonth()] + ' ' + dt.getDate() + ' · ' + clock(dt) + ' ' + (tzLabel || '');
}
export const TZ_OPTIONS = [['America/Chicago', 'Central (CT)'], ['America/New_York', 'Eastern (ET)'], ['America/Denver', 'Mountain (MT)'], ['America/Los_Angeles', 'Pacific (PT)'], ['America/Phoenix', 'Arizona (MST)']];
export const TZ_SHORT = { 'America/Chicago': 'CT', 'America/New_York': 'ET', 'America/Denver': 'MT', 'America/Los_Angeles': 'PT', 'America/Phoenix': 'MST' };

const mean = xs => { const a = (xs || []).filter(x => typeof x === 'number' && !isNaN(x)); return a.length ? a.reduce((p, q) => p + q, 0) / a.length : null; };
const round1 = x => x == null ? null : Math.round(x * 10) / 10;
const lvl = x => x == null ? '\u2014' : x >= 4 ? 'High' : x >= 3 ? 'Medium' : 'Low';
const bandLvl = b => !b ? '\u2014' : (b === 'Strong match' || b === 'Meets profile') ? 'High' : b === 'Validate in interview' ? 'Medium' : 'Low';
const anonOf = id => 'Candidate #' + String(id || '').replace(/-/g, '').slice(-4).toUpperCase();
const origin = () => (typeof window !== 'undefined' ? window.location.origin : '');

export class LiveStore {
  constructor() {
    this.session = null; this.me = null; this.raw = EMPTY(); this.view = null;
    this.onChange = () => {}; this.channel = null; this.poll = null; this._timer = null; this._busy = false; this._again = false;
  }

  // ---- auth ----
  async restoreSession() { const { data } = await sb.auth.getSession(); this.session = (data && data.session) || null; return this.session; }
  async signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    this.session = data.session; return {};
  }
  async signOut() { this.stop(); try { await sb.auth.signOut(); } catch (e) {} this.session = null; this.me = null; this.raw = EMPTY(); this.view = null; }
  async setPassword(password) { const { error } = await sb.auth.updateUser({ password }); return error ? { error: error.message } : {}; }
  async loadMe() {
    const email = this.session && this.session.user && this.session.user.email;
    if (!email) return null;
    const { data } = await sb.from('staff').select('*').ilike('email', email).maybeSingle();
    this.me = data || null; return this.me;
  }

  // ---- reads ----
  async loadAll() {
    const desc = (t, col) => sb.from(t).select('*').order(col || 'created_at', { ascending: false });
    const res = await Promise.all([
      desc('candidates'),
      sb.from('staff').select('*').order('created_at', { ascending: true }),
      desc('reviews'), desc('sessions'),
      desc('evaluations', 'submitted_at'), desc('interviews', 'submitted_at'),
      desc('decisions'), desc('accommodations'),
      sb.from('accommodation_details').select('*'),
      sb.from('settings').select('*'),
      sb.from('outcomes').select('*'),
      sb.from('audit').select('*').order('at', { ascending: false }).limit(80),
      desc('transcripts')
    ]);
    const rows = i => (res[i] && res[i].data) || [];
    const firstErr = res.find(r => r && r.error && r.error.code !== 'PGRST116');
    if (firstErr && !rows(0).length && !rows(1).length) throw new Error(firstErr.error.message || 'Could not load data');
    this.raw = {
      candidates: rows(0), staff: rows(1), reviews: rows(2), sessions: rows(3), evaluations: rows(4), interviews: rows(5),
      decisions: rows(6), accommodations: rows(7),
      details: Object.fromEntries(rows(8).map(x => [x.accommodation_id, x.txt])),
      settings: Object.fromEntries(rows(9).map(x => [x.key, x.value])),
      outcomes: rows(10), audit: rows(11), transcripts: rows(12)
    };
    this.view = null;
    return this.raw;
  }
  start(onChange) {
    this.onChange = onChange || (() => {}); this.stop();
    try {
      this.channel = sb.channel('peak-live').on('postgres_changes', { event: '*', schema: 'public' }, () => this.refreshSoon()).subscribe();
    } catch (e) { this.channel = null; }
    this.poll = setInterval(() => this.refreshSoon(), 45000);
  }
  stop() {
    if (this.channel) { try { sb.removeChannel(this.channel); } catch (e) {} this.channel = null; }
    if (this.poll) { clearInterval(this.poll); this.poll = null; }
    if (this._timer) { clearTimeout(this._timer); this._timer = null; }
  }
  refreshSoon() { if (this._timer) clearTimeout(this._timer); this._timer = setTimeout(() => { this._timer = null; this.refresh(); }, 350); }
  async refresh() {
    if (!this.session) return;
    if (this._busy) { this._again = true; return; }
    this._busy = true;
    try { await this.loadAll(); this.onChange(); } catch (e) { console.warn('refresh failed', e); }
    this._busy = false;
    if (this._again) { this._again = false; this.refresh(); }
  }

  // ---- serverless helpers (Vercel /api) ----
  async api(path, body) {
    const token = this.session && this.session.access_token;
    const headers = { 'content-type': 'application/json' };
    if (token) headers.authorization = 'Bearer ' + token;
    const res = await fetch(path, { method: 'POST', headers, body: JSON.stringify(body || {}) });
    let out = {}; try { out = await res.json(); } catch (e) { out = {}; }
    if (!res.ok) throw new Error(out.error || ('Request failed (' + res.status + ')'));
    return out;
  }

  // ---- staff writes (RLS enforces roles server-side) ----
  async _run(q) { const { data, error } = await q; if (error) throw new Error(error.message); return data; }
  createCandidate(f) {
    return this._run(sb.from('candidates').insert({
      name: f.name, email: f.email, phone: f.phone || '', role: f.role, track: f.track === 'info' ? 'info' : 'assessment', source: f.source === 'manual' ? 'manual' : 'invite',
      loc: f.loc || '', school: f.school || '', program: f.program || '', linkedin: f.linkedin || '', notes: f.notes || '', created_by: this.me && this.me.id
    }).select('*').single());
  }
  updateCandidate(id, patch) { return this._run(sb.from('candidates').update(patch).eq('id', id)); }
  sendInvite(candidateId, track) { return this.api('/api/invite', track ? { candidateId, track } : { candidateId }); }
  extendInvite(candidateId, track) { return this.api('/api/invite', track ? { candidateId, mode: 'extend', track } : { candidateId, mode: 'extend' }); }
  insertDecision(d) { return this._run(sb.from('decisions').insert({ candidate_id: d.candidate_id, decided_by: this.me && this.me.id, by_label: d.by_label, decision: d.decision, rationale: d.rationale, agree: d.agree || '\u2014' })); }
  createSession(s) { return this.api('/api/session', s); }
  deleteSession(id) { return this._run(sb.from('sessions').delete().eq('id', id)); }
  insertReview(r) { return this._run(sb.from('reviews').insert({ candidate_id: r.candidate_id, reviewer_id: this.me && this.me.id, ratings: r.ratings || {}, level: r.level || '', outcome: r.outcome })); }
  upsertEvaluation(e) { return this._run(sb.from('evaluations').upsert({ candidate_id: e.candidate_id, evaluator_id: e.evaluator_id, r1: e.r1 || {}, r2: e.r2 || {}, coach: e.coach || '', notes: e.notes || '', cite: e.cite || '', rec: e.rec || null, obj_used: e.obj_used || {}, coi: !!e.coi, submitted_at: new Date().toISOString() }, { onConflict: 'candidate_id,evaluator_id' })); }
  upsertInterview(i) { return this._run(sb.from('interviews').upsert({ candidate_id: i.candidate_id, evaluator_id: i.evaluator_id, scores: i.scores || {}, notes: i.notes || '', submitted_at: new Date().toISOString() }, { onConflict: 'candidate_id,evaluator_id' })); }
  updateAccommodation(id, status, resolution) { return this._run(sb.from('accommodations').update({ status, resolution: resolution || '', updated_at: new Date().toISOString() }).eq('id', id)); }
  upsertSetting(key, value) { return this._run(sb.from('settings').upsert({ key, value, updated_by: this.me && this.me.id, updated_at: new Date().toISOString() }, { onConflict: 'key' })); }
  upsertOutcome(hire, period, vals) { return this._run(sb.from('outcomes').upsert({ hire_name: hire, period, vals, recorded_by: this.me && this.me.id, updated_at: new Date().toISOString() }, { onConflict: 'hire_name,period' })); }
  setStaffActive(id, active) { return this._run(sb.from('staff').update({ active }).eq('id', id)); }
  inviteStaff(f) { return this.api('/api/staff', { action: 'invite', ...f }); }
  resetPassword(email) { return this.api('/api/staff', { action: 'reset', email }); }
  audit(what) { const who = this.me ? this.me.short : 'Staff'; return sb.from('audit').insert({ who, what }).then(() => {}, () => {}); }
  rescore(candidateId) { return this.api('/api/score', { candidateId }); }
  addTranscript(t) { return this.api('/api/transcript', t); }
  fileLink(candidateId, path) { return this.api('/api/upload', { candidateId, action: 'link', path }); }

  // ---- files: signed upload URL from the server, upload straight to storage, then confirm ----
  async uploadFile({ token, combineToken, candidateId, purpose, file }) {
    const who = candidateId ? { candidateId } : combineToken ? { combineToken } : { token };
    const s = await this.api('/api/upload', { ...who, action: 'sign', purpose, filename: file.name, size: file.size, contentType: file.type });
    const { error } = await sb.storage.from(FILE_BUCKET).uploadToSignedUrl(s.path, s.token, file, { contentType: file.type || 'application/octet-stream', upsert: true });
    if (error) throw new Error(error.message || 'Upload failed.');
    return this.api('/api/upload', { ...who, action: 'confirm', purpose, path: s.path, filename: file.name });
  }

  // ---- candidate (no login; personal token) ----
  async candidateOpen(token) { const { data, error } = await sb.rpc('candidate_open', { p_token: token }); if (error) throw new Error(error.message); return data; }
  async candidateSave(token, patch) { const { data, error } = await sb.rpc('candidate_save', { p_token: token, p_patch: patch }); if (error) throw new Error(error.message); return data; }
  async combineOpen(token) { const { data, error } = await sb.rpc('combine_open', { p_token: token }); if (error) throw new Error(error.message); return data; }
  async combineSave(token, patch) { const { data, error } = await sb.rpc('combine_save', { p_token: token, p_patch: patch }); if (error) throw new Error(error.message); return data; }
  score(token) { return this.api('/api/score', { token }); }
  resendForToken(token) { return this.api('/api/invite', { token }); }

  // ---- shape live rows into what the screens already understand ----
  viewData(D) {
    if (this.view) return this.view;
    const R = this.raw, compIds = (D.comps || []).map(c => c.id);
    const staffById = Object.fromEntries(R.staff.map(s => [s.id, s]));
    const short = id => (staffById[id] || {}).short || '\u2014';
    const users = R.staff.map(s => ({ id: s.id, name: s.name, short: s.short, title: s.title || '', email: s.email, roles: s.roles || [], status: s.active ? (s.status || 'Invited') : 'Deactivated', active: !!s.active }));

    const candidates = R.candidates.filter(c => !c.archived).map(c => {
      const P = c.progress || {}, done0 = P.done || {}, app = P.app || {};
      const rv = R.reviews.find(x => x.candidate_id === c.id) || null;
      const ses = R.sessions.find(x => x.candidate_id === c.id) || null;
      const E = R.evaluations.filter(x => x.candidate_id === c.id);
      const I = R.interviews.filter(x => x.candidate_id === c.id);
      const T = (R.transcripts || []).filter(x => x.candidate_id === c.id);
      const dec = R.decisions.find(x => x.candidate_id === c.id) || null;
      const rp = c.report || null;
      const done = { ...done0, s5a: !!done0.s5a || E.length > 0 };
      const track = c.track || 'assessment', source = c.source || 'invite', info = track === 'info';
      const expired = new Date(c.invite_expires_at).getTime() < Date.now();
      const inviteState = !c.invite_sent_at ? (source === 'manual' ? 'Added manually \u00b7 no link sent' : 'Link not sent') : expired ? 'Link expired' : c.opened_at ? 'Opened' : 'Sent \u00b7 not opened';
      let stage = 1, stageLabel = (info ? 'Details link \u00b7 ' : 'Invited \u00b7 ') + inviteState.toLowerCase();
      if (source === 'manual' && !c.invite_sent_at) stageLabel = 'Added manually \u00b7 no link sent';
      if (c.opened_at && !done.s1 && !info) stageLabel = 'Opened \u00b7 stage 1 in progress';
      if (info && c.opened_at && !P.infoDone) stageLabel = 'Details link opened';
      if (P.infoDone) { stage = 1; stageLabel = 'Details received \u00b7 assessment not sent'; }
      if (done.s1 && !done.s2) stageLabel = 'In progress \u00b7 details';
      if (done.s2) { stage = 2; stageLabel = 'Details submitted \u00b7 sales decisions pending'; }
      if (rv && rv.outcome !== 'advanced') { stage = 2; stageLabel = 'Not advanced \u00b7 application stage'; }
      if (done.s3) { stage = 4; stageLabel = 'Assessment complete \u00b7 ' + (rp ? 'scored' : 'scoring') + ' \u00b7 awaiting combine'; }
      if (ses) { stage = 4; stageLabel = 'Combine scheduled \u00b7 ' + ses.when_txt; }
      if (E.length) { stage = 5; stageLabel = E.length >= 2 ? 'Combine complete \u00b7 decision pending' : 'Combine scored by 1 of 2 evaluators'; }
      if (dec) {
        if (dec.decision === 'Advance') { stage = 6; stageLabel = 'Advanced \u00b7 ' + fmtT(dec.created_at); }
        else if (dec.decision === 'Hold') stageLabel = 'On hold \u00b7 ' + fmtT(dec.created_at);
        else stageLabel = 'Not advanced \u00b7 ' + fmtT(dec.created_at);
      }
      if (P.resched) stageLabel += ' \u00b7 reschedule requested';
      if (P.withdrawn) stageLabel = 'Withdrawn by candidate';

      const pick = (e, id) => (e.r2 && e.r2[id] != null) ? e.r2[id] : (e.r1 ? e.r1[id] : null);
      const hasScores = E.length > 0 || I.length > 0;
      const comp = hasScores ? Object.fromEntries(compIds.map(id => [id, round1(mean([...E.map(e => pick(e, id)), ...I.map(i => (i.scores || {})[id])]))])) : null;
      const readiness = comp ? round1(mean(Object.values(comp))) : null;
      const r1avg = round1(mean(E.map(e => mean(Object.values(e.r1 || {})))));
      const r2avg = round1(mean(E.map(e => mean(Object.values(e.r2 || {})))));
      let agree = '\u2014', agreeMax = null, agreeComp = null;
      if (E.length >= 2) {
        const [a, b] = E;
        compIds.forEach(id => { const x = pick(a, id), y = pick(b, id); if (x != null && y != null) { const dd = Math.abs(x - y); if (agreeMax == null || dd > agreeMax) { agreeMax = dd; agreeComp = id; } } });
        agree = (agreeMax != null && agreeMax > 1.5) ? 'Flagged' : 'High';
      } else if (E.length === 1) agree = 'Pending';
      const appEv = rv ? rv.level : '\u2014';
      const ivAvg = mean(I.map(i => mean(Object.values(i.scores || {}))));
      const strength = (hasScores || rp) ? { sim: lvl(r1avg), repitch: lvl(r2avg), case: (done.s5b || P.caseFile) ? 'Submitted' : '\u2014', interview: lvl(ivAvg), sjt: rp ? bandLvl(rp.band) : '\u2014', app: appEv, wdi: '\u2014' } : null;
      const notes = E.map(e => e.notes).filter(Boolean);
      const strongest = notes.length ? notes.join(' \u00b7 ') : (rp && rp.strengths && rp.strengths.length) ? 'Sales decisions: strongest on ' + rp.strengths.map(s => s.name).join(', ') + '.' : '\u2014';
      const concerns = (rp && rp.redFlags && rp.redFlags.length) ? rp.redFlags.map(f => f.label).join(' \u00b7 ') : (rp && rp.concerns && rp.concerns.length) ? 'Sales decisions below 65 on ' + rp.concerns.map(s => s.name).join(', ') + '.' : '\u2014';
      const open = (rp && rp.followUps && rp.followUps.length) ? rp.followUps[0].q : dec ? '\u2014' : (stage >= 4 && !ses) ? 'Schedule the combine.' : '\u2014';
      const resendRequested = !!c.resend_requested_at && (!c.invite_sent_at || new Date(c.resend_requested_at) > new Date(c.invite_sent_at));
      const loc = c.loc || app.loc || '\u2014', school = c.school || app.school || '';
      const canSchedule = !P.withdrawn && !ses && !dec;
      return {
        id: c.id, name: c.name, email: c.email, phone: c.phone || app.phone || '', anon: anonOf(c.id), role: c.role,
        loc, school: school || c.email, schoolTxt: school, program: c.program || '', linkedin: c.linkedin || app.linkedin || '', notes: c.notes || '',
        track, source, infoDone: !!P.infoDone, resumePath: c.resume_path || '', resumeName: c.resume_name || (app.resume && app.resume.name) || '', caseFile: P.caseFile || null,
        auth: app.auth, consent: !!app.consent,
        stage, stageLabel, readiness, r1: r1avg, r2: r2avg, agree, agreeMax, agreeComp, sjt: rp ? rp.overall : null, wdi: null, appEv,
        comp, strength, strongest, concerns, open, rec: dec ? dec.decision : null, sar: null, scores: null,
        token: c.token, link: origin() + '/?invite=' + c.token, inviteState, expired, inviteSent: !!c.invite_sent_at, opened: !!c.opened_at,
        resendRequested, done, progress: P, report: rp, scoredAt: c.scored_at, hasSession: !!ses, sessionId: ses ? ses.id : null, canSchedule,
        evalCount: E.length, evaluations: E, transcripts: T, withdrawn: !!P.withdrawn, expiresAt: c.invite_expires_at, createdAt: c.created_at
      };
    });
    const candById = Object.fromEntries(candidates.map(c => [c.id, c]));
    const sessions = R.sessions.map(s => { const c = candById[s.candidate_id] || {}; return { id: s.id, candId: s.candidate_id, cand: c.name || '\u2014', role: c.role || '', when: s.when_txt, startsAt: s.starts_at, duration: s.duration_min || 60, e1: s.e1, e2: s.e2, evals: short(s.e1) + ' + ' + short(s.e2), link: s.link || '\u2014', combineLink: s.token ? origin() + '/?combine=' + s.token : '', calendar: s.calendar_event_id ? 'Google Calendar' : 'email + .ics', ver: s.ver || 'v1.2', status: s.status || 'Confirmed' }; });
    const accoms = R.accommodations.map(a => { const c = candById[a.candidate_id] || {}; return { id: a.id, candId: a.candidate_id, cand: (c.name || '\u2014') + ' \u00b7 ' + (c.anon || ''), t: fmtT(a.created_at), txt: R.details[a.id] || '(request details are visible to hiring managers)', status: a.status, resolution: a.resolution || '' }; });
    const transcripts = (R.transcripts || []).map(t => ({ id: t.id, candId: t.candidate_id, kind: t.kind, title: t.title || '', txt: t.txt || '', source: t.source_name || '', by: short(t.uploaded_by), t: fmtT(t.created_at), review: t.review || null, status: t.review_status || 'none' }));
    const applications = Object.fromEntries(candidates.map(c => [c.id, (c.progress && c.progress.ev) || []]));
    const decisions = R.decisions.map(d => { const c = candById[d.candidate_id] || {}; return { id: d.id, candId: d.candidate_id, cand: c.name || '\u2014', role: c.role || '', decision: d.decision, by: d.by_label || short(d.decided_by), t: fmtT(d.created_at), rationale: d.rationale || '', agree: d.agree || '\u2014' }; });
    const n = f => candidates.filter(f).length;
    const funnel = [
      { label: 'In pipeline', n: candidates.length },
      { label: 'Details submitted', n: n(c => c.done.s2 || c.infoDone) },
      { label: 'Assessment complete', n: n(c => c.done.s3) },
      { label: 'Combine scheduled', n: n(c => c.hasSession) },
      { label: 'Combine complete', n: n(c => c.evalCount >= 1) },
      { label: 'Advanced', n: n(c => c.rec === 'Advance') }
    ];
    const hires = candidates.filter(c => c.rec === 'Advance').map(c => { const h = { name: c.name, readiness: c.readiness }; R.outcomes.filter(o => o.hire_name === c.name).forEach(o => { h[o.period] = o.vals; }); return h; });
    const audit = R.audit.map(a => ({ t: fmtT(a.at), who: a.who, what: a.what }));
    const roles = (D.roles || []).map(r => { const apps = candidates.filter(c => c.role === r.title); const st = !apps.length ? 'No candidates yet' : apps.some(c => c.stage >= 5) ? 'Combine week' : apps.some(c => c.stage >= 4) ? 'Scheduling combines' : apps.some(c => c.stage >= 2) ? 'Sales decisions' : 'Invites out'; return { ...r, open: null, apps: apps.length, stage: st }; });
    this.view = { candidates, users, sessions, accoms, applications, decisions, funnel, hires, audit, roles, transcripts };
    return this.view;
  }
}
