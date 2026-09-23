// @ts-nocheck
// Application logic — ported 1:1 from the prototype. renderVals() builds the view-model (V) the screens render;
// state lives in React and is mirrored to localStorage so a refresh keeps a candidate's or evaluator's progress.
import React from 'react';
import { Template } from './template/Template';
import { PEAK_DATA } from './data/seed';
import { PEAK_BANK } from './data/bank';
import { LIVE_ENABLED, LiveStore, sb, fmtDate, fmtT, whenTxt, TZ_OPTIONS, TZ_SHORT } from './data/live';
import { DEFAULT_SCHOOLS, DEFAULT_TA_STAGES, DEFAULT_CALL_PROMPT, FIRST_CALL_KIND, GRADE_COLOR } from './data/defaults';

const STORAGE_KEY = 'peak-sales-combine-v3';
const TRANSIENT = ['timer', 'login', 'busy', 'flash', 'pw1', 'pw2', 'pwMsg', 'pwSetup', 'saveErr', 'resumeMsg', 'caseMsg', 'pub', 'schoolsDraft', 'stagesDraft', 'remindMsg']; // never persisted
const UI_KEYS = ['blind', 'weightsRole', 'vPeriod']; // the only local state kept between visits in live mode
const CAND_KEYS = ['done', 'ack', 'challenge', 'app', 'ev', 'bkIdx', 'bkAns', 'bkIntroSeen', 'caseAns', 'caseMode', 'caseFile', 'consentRec', 'accomSent', 'accomTxt', 'withdrawn', 'resched', 'infoDone']; // candidate progress synced to the database
const COMBINE_KEYS = ['caseAns', 'caseMode', 'caseFile', 'consentRec', 'accomSent', 'accomTxt', 'withdrawn', 'resched', 'done']; // the subset a combine link may change
const DEFAULT_ROLE = 'Entry Level Sales Professional';
const TR_KINDS = [FIRST_CALL_KIND, 'Mock pitch (Exercise A)', 'Interview', 'Other'];

function loadState() {
  try {
    if (new URLSearchParams(window.location.search).has('reset')) { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(STORAGE_KEY + '-ui'); return null; }
    const raw = localStorage.getItem(LIVE_ENABLED ? STORAGE_KEY + '-ui' : STORAGE_KEY);
    const s = raw ? JSON.parse(raw) : null;
    if (s && LIVE_ENABLED) { const o = {}; UI_KEYS.forEach(k => { if (k in s) o[k] = s[k]; }); return o; }
    return s;
  } catch { return null; }
}
let saveTimer: any;
function saveState(s: any) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      if (LIVE_ENABLED) { const ui = {}; UI_KEYS.forEach(k => { ui[k] = s[k]; }); localStorage.setItem(STORAGE_KEY + '-ui', JSON.stringify(ui)); return; }
      const copy = {...s}; TRANSIENT.forEach(k => delete copy[k]); localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
    } catch {}
  }, 150);
}

export class PeakCombine extends React.Component<any, any> {
  _t: any; live: any; token: any; combineToken: any; candInfo: any; hydrating: any; pendingPatch: any; saveT: any; saveChain: any; settingsDirty: any; settingsT: any; pendingWrites: any; _entering: any; _pwSetup: any; publicKind: any; publicToken: any;
  constructor(props: any) {
    super(props);
    const saved = loadState();
    if (saved) this.state = {...this.state, ...saved};
    this.live = LIVE_ENABLED ? new LiveStore() : null;
    this.token = null; this.combineToken = null; this.publicKind = null; this.publicToken = null; this.candInfo = null; this.hydrating = false; this.pendingPatch = null; this.saveChain = null; this.settingsDirty = {}; this.pendingWrites = 0; this._entering = false; this._pwSetup = false;
  }
  state = {
    mode: null, user: null, role: null, invite: 'valid', viewAs: null, resent: false,
    login: {email:'', pw:'', err:'', info:''},
    cview: 'dash', eview: 'roster', aview: 'funnel',
    done: {s1:false,s2:false,s3:false,s4:false,s5a:false,s5b:false},
    ack: false, challenge: '', accomOpen: false, accomTxt: '', accomSent: false, consentRec: false, resched: false, withdrawn: false,
    app: {name:'',email:'',phone:'',loc:'',school:'',program:'',linkedin:'',role:DEFAULT_ROLE,auth:null,resume:false,consent:false},
    ev: ['','','','',''],
    infoDone: false, resumeMsg: '', caseMsg: '', caseFile: null,
    bkIdx: 0, bkAns: {}, bkIntroSeen: {}, bankSettings: null,
    recorded: false,
    caseAns: ['','','','','','',''], caseMode: 'Written',
    timer: {sec:0,total:1,on:false},
    phase: 'brief', r1: {}, r2: {}, coach: '', notes: '', cite: '', rec: null, submitted: false, objUsed: {}, coi: false,
    ivScores: {}, ivNotes: '', ivSubmitted: false,
    blind: false, profileId: 'dana', cmpA: null, cmpB: null,
    arId: 'sofia', arRatings: {}, arSaved: '', arDone: {},
    dec: {rec:null, note:''}, decisions: [],
    sch: {cand:'maya', date:'', time:'10:00', tz:'America/Chicago', dur:60, e1:'delgado', e2:'whitfield', link:'', sent:'', msg:'', warn:[]}, scheduled: [],
    inv: {name:'', email:'', roles:{}, saved:''}, invited: [], deactivated: {},
    accomState: {},
    oc: {open:false, hire:'Alexis Grant', period:'d90', vals:{}, saved:''}, ocRows: {},
    weightsRole: DEFAULT_ROLE, weightsByRole: null,
    bankItemId: null, bankDraft: null, bankEdits: {}, bankSaved: '',
    schools: null, taStages: null, callEvalPrompt: null, schoolsDraft: null, stagesDraft: null, promptOpen: false, remindMsg: '',
    board: {job:'', newRole:DEFAULT_ROLE, newProgram:'', newCustom:'', open:false, msg:''}, taLocal: {},
    pub: {status:'loading', data:null, form:{name:'',email:'',phone:'',loc:'',linkedin:'',consent:false}, msg:'', busy:false, link:''},
    vPeriod: 'd30', retention: '24 months',
    // live mode
    liveCand: null, pwSetup: false, pw1: '', pw2: '', pwMsg: '', busy: '', flash: {}, resentTo: '', resentErr: '', saveErr: '',
    newCand: {name:'', email:'', phone:'', role:DEFAULT_ROLE, program:'', programPick:'', loc:'', school:'', linkedin:'', track:'assessment', file:null, saved:''},
    tr: {kind:TR_KINDS[0], title:'', txt:'', fileName:'', notes:'', msg:''}, trOpen: false, trShow: {}, rpItemsOpen: false, notesDraft: null
  };
  componentDidMount() {
    const D = PEAK_DATA;
    if (D && !this.state.weightsByRole) this.setState({weightsByRole: JSON.parse(JSON.stringify(D.weightsByRole || {}))});
    if (LIVE_ENABLED) this.initLive();
    else {
      const dr = this.props.defaultRole;
      if (dr === 'candidate') this.setState({mode:'candidate', invite:'valid'});
      else if (dr === 'evaluator') this.signInAs('delgado', 'evaluator');
      else if (dr === 'manager') this.signInAs('delgado', 'manager');
      else if (dr === 'admin') this.signInAs('castillo', 'admin');
      else if (dr === 'leadership') this.signInAs('ellis', 'leadership');
    }
    this._t = setInterval(() => {
      const t = this.state.timer;
      if (t.on && t.sec > 0) {
        const step = (this.props.fastTimers ?? false) ? 15 : 1;
        const s = Math.max(0, t.sec - step);
        this.setState({timer: {...t, sec: s, on: s > 0}});
      }
    }, 1000);
  }
  componentWillUnmount() { clearInterval(this._t); if (this.live) this.live.stop(); }

  // ===== live mode (Supabase) =====
  currentProfileId() { return ((PEAK_DATA && PEAK_DATA.profileByRole) || {})[this.state.weightsRole] || 'entry'; }
  liveD() {
    const S = PEAK_DATA;
    const V = this.live.viewData(S);
    return {...S, candidates: V.candidates, users: V.users, decisions: V.decisions, sessions: V.sessions, accoms: V.accoms, applications: V.applications, funnel: V.funnel, hires: V.hires, audit: V.audit, roles: V.roles, jobs: V.jobs, invite: this.candInfo || S.invite};
  }
  initLive() {
    const q = new URLSearchParams(window.location.search);
    const token = q.get('invite');
    if (token) { this.token = token; this.setState({mode:'candidate', invite:'loading', viewAs:null}); this.openCandidate(token); return; }
    const ctoken = q.get('combine');
    if (ctoken) { this.combineToken = ctoken; this.setState({mode:'candidate', invite:'loading', viewAs:null}); this.openCombine(ctoken); return; }
    const applyT = q.get('apply');
    if (applyT) { this.publicKind = 'apply'; this.publicToken = applyT; this.setState({mode:'public'}); this.openApply(applyT); return; }
    const boardT = q.get('board');
    if (boardT) { this.publicKind = 'board'; this.publicToken = boardT; this.setState({mode:'public'}); this.openBoard(boardT); return; }
    const hash = window.location.hash || '';
    if (/error_description=/.test(hash)) {
      let msg = 'That link is no longer valid. Use \u201cForgot password\u201d to get a new one.';
      try { msg = decodeURIComponent((hash.match(/error_description=([^&]*)/) || [])[1] || '').replace(/\+/g, ' ') || msg; } catch (e) {}
      this.setState({login:{...this.state.login, err: msg}});
      try { window.history.replaceState(null, '', window.location.pathname); } catch (e) {}
    }
    this._pwSetup = /type=(invite|recovery)/.test(hash);
    if (this._pwSetup) this.setState({pwSetup:true});
    sb.auth.onAuthStateChange((event, session) => {
      this.live.session = session;
      if (event === 'PASSWORD_RECOVERY') { this._pwSetup = true; this.setState({pwSetup:true}); return; }
      if (this._pwSetup) return;
      if (session) { if (!this.state.user && !this._entering) this.enterStaff(); }
      else if (this.state.mode === 'staff') { this.live.stop(); this.setState({mode:null, user:null, role:null, viewAs:null}); }
    });
  }
  async enterStaff() {
    if (this._entering) return;
    this._entering = true;
    try {
      const me = await this.live.loadMe();
      if (!me) { await this.live.signOut(); this.setState({login:{...this.state.login, err:'No staff account for that email. Ask an admin to invite you.'}}); return; }
      if (!me.active) { await this.live.signOut(); this.setState({login:{...this.state.login, err:'This account has been deactivated. Contact the admin.'}}); return; }
      await this.live.loadAll();
      const u = {id: me.id, name: me.name, short: me.short, title: me.title || '', email: me.email, roles: me.roles || []};
      const r = u.roles.includes('admin') ? 'admin' : u.roles.includes('manager') ? 'manager' : (u.roles[0] || 'evaluator');
      this.hydrating = true;
      this.setState({mode:'staff', user:u, role:r, viewAs:null, login:{email:'', pw:'', err:'', info:''}, aview: r === 'manager' ? 'pipe' : 'funnel', eview:'roster', ...this.derivedFromLive()}, () => { this.hydrating = false; });
      this.live.start(() => this.onLiveChange());
    } catch (e) {
      this.setState({login:{...this.state.login, err:'Could not load the workspace: ' + ((e && e.message) || e)}});
    } finally { this._entering = false; }
  }
  derivedFromLive() {
    const L = this.live, S = (L.raw && L.raw.settings) || {}, V = L.viewData(PEAK_DATA), st = this.state, o: any = {};
    const first = {};
    (L.raw.reviews || []).forEach(r => { if (!(r.candidate_id in first)) first[r.candidate_id] = r.outcome === 'advanced' ? 'Advanced to Stage 3 \u00b7 evidence ' + r.level : 'Not advanced \u00b7 application stage'; });
    o.arDone = first;
    const dirty = this.settingsDirty || {};
    const defaultsW = JSON.parse(JSON.stringify(PEAK_DATA.weightsByRole || {}));
    // Saved weights are merged onto the current role list so renamed roles and removed sources never leave stale keys behind.
    const mergedW = Object.fromEntries(Object.keys(defaultsW).map(r => { const saved = (S.weightsByRole || {})[r] || {}; const o2 = {}; Object.keys(defaultsW[r]).forEach(k => { o2[k] = saved[k] != null ? saved[k] : defaultsW[r][k]; }); return [r, o2]; }));
    if (!('weightsByRole' in dirty)) o.weightsByRole = mergedW;
    if (!('bankSettings' in dirty)) o.bankSettings = S.bankSettings || null;
    if (!('retention' in dirty)) o.retention = S.retention || '24 months';
    if (!('bankEdits' in dirty)) o.bankEdits = Object.fromEntries(Object.entries(S.bankEdits || {}).filter(([, v]) => v && typeof v === 'object' && !Array.isArray(v)));
    if (!('schools' in dirty)) o.schools = Array.isArray(S.schools) ? S.schools : null;
    if (!('taStages' in dirty)) o.taStages = Array.isArray(S.taStages) && S.taStages.length ? S.taStages : null;
    if (!('callEvalPrompt' in dirty)) o.callEvalPrompt = (typeof S.callEvalPrompt === 'string' && S.callEvalPrompt.trim()) ? S.callEvalPrompt : null;
    if (V.jobs && V.jobs.length && !V.jobs.some(j => j.id === st.board.job)) o.board = {...st.board, job: V.jobs[0].id};
    o.ocRows = {}; o.accomState = {}; o.deactivated = {}; o.decisions = []; o.scheduled = []; o.invited = [];
    const evals = V.users.filter(u => u.active && u.roles.includes('evaluator'));
    const sch = {...st.sch}; let changed = false;
    if (!evals.some(u => u.id === sch.e1)) { sch.e1 = evals[0] ? evals[0].id : ''; changed = true; }
    if (!evals.some(u => u.id === sch.e2) || sch.e2 === sch.e1) { const alt = evals.find(u => u.id !== sch.e1); sch.e2 = alt ? alt.id : ''; changed = true; }
    const pending = V.candidates.filter(c => c.canSchedule);
    if (!pending.some(c => c.id === sch.cand)) { sch.cand = pending[0] ? pending[0].id : ''; changed = true; }
    if (sch.link === undefined) { sch.link = ''; changed = true; }
    if (!sch.tz) { sch.tz = 'America/Chicago'; changed = true; }
    if (!sch.dur) { sch.dur = 60; changed = true; }
    if (changed) o.sch = sch;
    if (!Object.keys(defaultsW).includes(st.weightsRole)) o.weightsRole = DEFAULT_ROLE;
    if (V.hires.length && !V.hires.some(h => h.name === st.oc.hire)) o.oc = {...st.oc, hire: V.hires[0].name};
    if (V.candidates.length && !V.candidates.some(c => c.id === st.profileId)) o.profileId = V.candidates[0].id;
    if (V.candidates.length && !V.candidates.some(c => c.id === st.arId)) o.arId = V.candidates[0].id;
    return o;
  }
  onLiveChange() {
    if (this.state.mode !== 'staff') return;
    this.hydrating = true;
    this.setState(this.derivedFromLive(), () => { this.hydrating = false; });
  }
  async write(fn, tag) {
    this.pendingWrites++;
    try { const r = await fn(); await this.live.refresh(); return {ok:true, data:r}; }
    catch (e) { const msg = (e && e.message) || String(e); this.setState({flash:{...this.state.flash, [tag || 'err']: 'Could not save: ' + msg}}); return {ok:false, error:msg}; }
    finally { this.pendingWrites--; }
  }
  queueSetting(k, val) { this.settingsDirty[k] = val; clearTimeout(this.settingsT); this.settingsT = setTimeout(() => this.flushSettings(), 800); }
  async flushSettings() {
    const d = {...this.settingsDirty}; const keys = Object.keys(d); if (!keys.length) return;
    for (const k of keys) { try { await this.live.upsertSetting(k, d[k]); } catch (e) { this.setState({flash:{...this.state.flash, settings:'Could not save ' + k + ': ' + ((e && e.message) || e)}}); } }
    keys.forEach(k => { if (this.settingsDirty[k] === d[k]) delete this.settingsDirty[k]; });
    this.live.refreshSoon();
  }
  // ---- candidate (personal link) ----
  candInfoFrom(c, r, extra) {
    const roleRow = ((PEAK_DATA && PEAK_DATA.roles) || []).find(x => x.title === c.role) || {};
    const dec = r.decision === 'Advance' ? 'Advance' : r.decision === 'Do Not Advance' ? 'Decline' : 'none';
    const s = r.session || null;
    return {name: c.name || 'Candidate', first: (c.name || 'there').split(' ')[0], role: c.role || '', prop: c.program || 'Peak Sports MGMT', due: fmtDate(c.expires_at) || '\u2014',
      session: s ? s.when : 'Not yet scheduled', link: (s && s.link) || '\u2014', startsAt: s ? s.starts_at : null, combineLink: s && s.token ? window.location.origin + '/?combine=' + s.token : '',
      hasSession: !!s, decision: dec, track: c.track || 'assessment', source: c.source || 'invite', resumeName: c.resume_name || '', programRaw: c.program || '',
      schools: Array.isArray(r.schools) ? r.schools : [], bankEdits: (r.bank_edits && typeof r.bank_edits === 'object' && !Array.isArray(r.bank_edits)) ? r.bank_edits : null,
      decisionTxt: 'Two evaluators independently reviewed your combine, interview, and evidence. A member of the Peak Sports MGMT team will contact you within two business days about next steps.', ...(extra || {})};
  }
  async openCandidate(token) {
    try {
      const r = await this.live.candidateOpen(token);
      if (!r || r.status === 'invalid') { this.setState({invite:'invalid'}); return; }
      if (r.status === 'expired') { this.setState({invite:'expired', resent:false, resentTo: r.email || 'your email'}); return; }
      const c = r.candidate || {}, P = r.progress || {};
      this.candInfo = this.candInfoFrom(c, r);
      const info = this.candInfo.track === 'info';
      const base: any = {mode:'candidate', invite:'valid', viewAs:null, cview: info ? (P.infoDone ? 'infodone' : 'info') : 'dash', resched:false};
      CAND_KEYS.forEach(k => { if (P[k] !== undefined && P[k] !== null) base[k] = P[k]; });
      // Contact details start from what staff entered; anything the candidate already typed wins.
      const savedApp = P.app || {};
      base.app = {...this.state.app, name:c.name || '', email:c.email || '', phone:c.phone || '', loc:c.loc || '', school:c.school || '', program:c.program || '', linkedin:c.linkedin || '', role:c.role || DEFAULT_ROLE, resume: c.resume_name ? {name:c.resume_name} : false, ...savedApp};
      if (!base.app.program) base.app.program = c.program || '';
      if (r.evaluations > 0) base.done = {...(base.done || this.state.done), s5a:true};
      this.hydrating = true;
      this.setState(base, () => { this.hydrating = false; });
    } catch (e) { this.setState({invite:'invalid', saveErr: (e && e.message) || ''}); }
  }
  // ---- candidate (combine link: the live session, Exercise B, recording notice) ----
  async openCombine(token) {
    try {
      const r = await this.live.combineOpen(token);
      if (!r || r.status === 'invalid') { this.setState({invite:'invalid'}); return; }
      if (r.status === 'expired') { this.setState({invite:'cexpired'}); return; }
      const c = r.candidate || {}, P = r.progress || {};
      this.candInfo = this.candInfoFrom(c, r, {due:'\u2014'});
      const base: any = {mode:'candidate', invite:'valid', viewAs:null, cview:'s5', resched:false};
      COMBINE_KEYS.forEach(k => { if (P[k] !== undefined && P[k] !== null) base[k] = P[k]; });
      if (r.evaluations > 0) base.done = {...(base.done || this.state.done), s5a:true};
      this.hydrating = true;
      this.setState(base, () => { this.hydrating = false; });
    } catch (e) { this.setState({invite:'invalid', saveErr: (e && e.message) || ''}); }
  }
  queueSave(patch) { this.pendingPatch = {...(this.pendingPatch || {}), ...patch}; clearTimeout(this.saveT); this.saveT = setTimeout(() => this.flushSave(), 500); }
  flushSave() {
    clearTimeout(this.saveT);
    const patch = this.pendingPatch; this.pendingPatch = null;
    if (!patch || (!this.token && !this.combineToken)) return this.saveChain || Promise.resolve();
    const token = this.token, ctoken = this.combineToken;
    const save = () => ctoken ? this.live.combineSave(ctoken, patch) : this.live.candidateSave(token, patch);
    this.saveChain = (this.saveChain || Promise.resolve()).then(save).then(r => {
      if (r && r.status === 'invalid') this.setState({saveErr:'This link is no longer valid \u2014 your last change was not saved.'});
      else if (this.state.saveErr) this.setState({saveErr:''});
    }, () => { this.setState({saveErr:'Could not save \u2014 check your connection and try again.'}); });
    return this.saveChain;
  }
  scoreSoon() { const t = this.token; if (!t) return; this.flushSave().then(() => this.live.score(t)).catch(() => {}); }
  async candidateExit() { await this.flushSave(); this.setState({invite:'saved'}); }
  // ---- candidate file uploads (résumé in Stage 2 / details form; Exercise B deck or video on the combine page) ----
  async pickResume(e) {
    const file = e && e.target && e.target.files && e.target.files[0]; if (!file) return;
    if (!LIVE_ENABLED) { this.setState({app:{...this.state.app, resume:{name:file.name}}, resumeMsg:''}); return; }
    this.setState({resumeMsg:'Uploading ' + file.name + '\u2026'});
    try { const r = await this.live.uploadFile({token:this.token, purpose:'resume', file}); this.setState({app:{...this.state.app, resume:{name:r.name || file.name, path:r.path}}, resumeMsg:''}); }
    catch (err) { this.setState({resumeMsg:'Could not upload: ' + ((err && err.message) || err)}); }
    try { e.target.value = ''; } catch (x) {}
  }
  async pickCaseFile(e) {
    const file = e && e.target && e.target.files && e.target.files[0]; if (!file) return;
    if (!LIVE_ENABLED) { this.setState({caseFile:{name:file.name}, caseMsg:''}); return; }
    this.setState({caseMsg:'Uploading ' + file.name + '\u2026'});
    try { const r = await this.live.uploadFile({token:this.token, combineToken:this.combineToken, purpose:'case', file}); this.setState({caseFile:{name:r.name || file.name, path:r.path}, caseMsg:''}); }
    catch (err) { this.setState({caseMsg:'Could not upload: ' + ((err && err.message) || err)}); }
    try { e.target.value = ''; } catch (x) {}
  }
  async resendOwnLink() {
    this.setState({busy:'resend'});
    try { await this.live.resendForToken(this.token); this.setState({resent:true, resentErr:''}); }
    catch (e) { this.setState({resent:true, resentErr: (e && e.message) || 'Could not send.'}); }
    this.setState({busy:''});
  }
  // ---- staff auth ----
  async liveSignIn() {
    const em = this.state.login.email.trim().toLowerCase(), pw = this.state.login.pw;
    if (!em || !pw) { this.setState({login:{...this.state.login, err: em ? 'Enter your password.' : 'Enter your work email.'}}); return; }
    this.setState({busy:'signin'});
    const r = await this.live.signIn(em, pw);
    this.setState({busy:''});
    if (r.error) this.setState({login:{...this.state.login, err: /invalid/i.test(r.error) ? 'Email or password is incorrect.' : r.error}});
  }
  async staffSignOut() { await this.live.signOut(); this.setState({mode:null, user:null, role:null, viewAs:null, liveCand:null, login:{email:'', pw:'', err:'', info:''}}); }
  async forgotPassword() {
    const em = this.state.login.email.trim().toLowerCase();
    if (!em) { this.setState({login:{...this.state.login, err:'Enter your work email first, then click \u201cForgot password\u201d.'}}); return; }
    this.setState({busy:'reset'});
    try { await this.live.resetPassword(em); this.setState({login:{...this.state.login, err:'', info:'If that email has a staff account, a password link is on its way.'}}); }
    catch (e) { this.setState({login:{...this.state.login, err:(e && e.message) || 'Could not send.'}}); }
    this.setState({busy:''});
  }
  async savePassword() {
    const pw1 = this.state.pw1, pw2 = this.state.pw2;
    if (pw1.length < 8) { this.setState({pwMsg:'Use at least 8 characters.'}); return; }
    if (pw1 !== pw2) { this.setState({pwMsg:'The two passwords don\u2019t match.'}); return; }
    this.setState({busy:'pw'});
    const r = await this.live.setPassword(pw1);
    this.setState({busy:''});
    if (r.error) { this.setState({pwMsg:r.error}); return; }
    this._pwSetup = false;
    try { window.history.replaceState(null, '', window.location.pathname); } catch (e) {}
    this.setState({pwSetup:false, pw1:'', pw2:'', pwMsg:''});
    this.enterStaff();
  }
  // ---- staff actions ----
  flashFor(id, msg) { this.setState({flash:{...this.state.flash, [id]:msg}}); }
  async copyText(t) { try { await navigator.clipboard.writeText(t); return true; } catch (e) { return false; } }
  // mode: 'email' (create + email the link) · 'copy' (create + copy the link) · 'manual' (add to the pipeline, send nothing)
  async createCandidate(mode) {
    const f = this.state.newCand;
    if (f.name.trim().length < 2 || !/@/.test(f.email)) return;
    this.setState({busy:'invite'});
    try {
      const program = ((f.programPick && f.programPick !== '__custom') ? f.programPick : f.program).trim();
      const job = await this.live.findOrCreateJob(f.role, program);
      const row = await this.live.createCandidate({name:f.name.trim(), email:f.email.trim().toLowerCase(), phone:f.phone.trim(), role:f.role, program, loc:f.loc.trim(), school:f.school.trim(), linkedin:f.linkedin.trim(), track:f.track, source: mode === 'manual' ? 'manual' : 'invite', jobId: job ? job.id : null});
      let msg = 'Added to the pipeline';
      if (f.file) { try { const up = await this.live.uploadFile({candidateId:row.id, purpose:'resume', file:f.file}); msg += ' \u00b7 r\u00e9sum\u00e9 ' + up.name + ' attached'; } catch (e) { msg += ' \u00b7 r\u00e9sum\u00e9 upload failed: ' + ((e && e.message) || e); } }
      const what = f.track === 'info' ? 'details link' : 'assessment link';
      if (mode === 'email') { const r = await this.live.sendInvite(row.id); msg += ' \u00b7 ' + what + ' emailed to ' + row.email + ' \u00b7 expires ' + fmtDate(r.expires) + '.'; }
      else if (mode === 'copy') { const r = await this.live.extendInvite(row.id); const ok = await this.copyText(r.link); msg += (ok ? ' \u00b7 ' + what + ' copied: ' : ' \u00b7 ' + what + ': ') + r.link; }
      else msg += ' \u00b7 no link sent. Use \u201cEmail link\u201d on the row when you\u2019re ready.';
      await this.live.refresh();
      this.setState({newCand:{name:'', email:'', phone:'', role:f.role, program:f.program, programPick:f.programPick, loc:'', school:'', linkedin:'', track:f.track, file:null, saved:msg}});
    } catch (e) { this.setState({newCand:{...this.state.newCand, saved:'Could not finish: ' + ((e && e.message) || e)}}); }
    this.setState({busy:''});
  }
  async sendInviteTo(c, track) {
    this.flashFor(c.id, 'Sending\u2026');
    try { const r = await this.live.sendInvite(c.id, track); await this.live.refresh(); this.flashFor(c.id, (r.track === 'info' ? 'Details link' : 'Assessment link') + ' emailed \u00b7 expires ' + fmtDate(r.expires)); }
    catch (e) { this.flashFor(c.id, 'Email failed: ' + ((e && e.message) || e) + ' \u2014 use Copy link.'); }
  }
  async copyLinkFor(c, track) {
    try { const r = await this.live.extendInvite(c.id, track); await this.live.refresh(); const ok = await this.copyText(r.link); this.flashFor(c.id, (ok ? 'Link copied \u00b7 expires in 3 days: ' : 'Link (expires in 3 days): ') + r.link); }
    catch (e) { this.flashFor(c.id, 'Could not refresh the link: ' + ((e && e.message) || e)); }
  }
  async rescoreCandidate(id) {
    this.flashFor('score:' + id, 'Scoring\u2026');
    try { const r = await this.live.rescore(id); await this.live.refresh(); this.flashFor('score:' + id, 'Scored \u00b7 ' + r.overall + '/100 \u00b7 ' + r.band); }
    catch (e) { this.flashFor('score:' + id, 'Could not score: ' + ((e && e.message) || e)); }
  }
  async openFile(candidateId, path) {
    try { const r = await this.live.fileLink(candidateId, path); window.open(r.url, '_blank', 'noopener'); }
    catch (e) { this.flashFor('file:' + candidateId, 'Could not open the file: ' + ((e && e.message) || e)); }
  }
  async saveNotes(candidateId) {
    const txt = this.state.notesDraft; if (txt == null) return;
    const r = await this.write(() => this.live.updateCandidate(candidateId, {notes: txt}), 'err');
    if (r.ok) this.setState({notesDraft:null});
  }
  async submitTranscript(candidateId) {
    const t = this.state.tr;
    if (!candidateId || t.txt.trim().length < 200) { this.setState({tr:{...t, msg:'Paste or upload at least a few paragraphs (200 characters minimum).'}}); return; }
    this.setState({busy:'tr', tr:{...t, msg:'Saving' + '\u2026 the review can take up to a minute.'}});
    try {
      const r = await this.live.addTranscript({candidateId, kind:t.kind, title:t.title.trim(), txt:t.txt, sourceName:t.fileName, notes:(t.notes || '').trim()});
      await this.live.refresh();
      const note = r.status === 'done' ? (r.grade ? 'Saved \u00b7 graded ' + r.grade + ' \u00b7 executive summary below.' : 'Saved \u00b7 advisory read ready below.') : r.status === 'off' ? 'Saved \u00b7 stored for the team to read. The evaluation and grade need the AI key (SETUP.md Part 8).' : r.status === 'failed' ? 'Saved \u00b7 the evaluation failed: ' + ((r.review && r.review.error) || 'unknown error') : 'Saved.';
      this.setState({tr:{kind:t.kind, title:'', txt:'', fileName:'', notes:'', msg:note}, trOpen:false, trShow:{...this.state.trShow, [r.id]:true}});
    } catch (e) { this.setState({tr:{...this.state.tr, msg:'Could not save: ' + ((e && e.message) || e)}}); }
    this.setState({busy:''});
  }
  readTranscriptFile(e) {
    const file = e && e.target && e.target.files && e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.setState({tr:{...this.state.tr, txt:String(reader.result || ''), fileName:file.name, msg:''}});
    reader.onerror = () => this.setState({tr:{...this.state.tr, msg:'Could not read that file.'}});
    reader.readAsText(file);
    try { e.target.value = ''; } catch (x) {}
  }
  // ---- public pages: application form (?apply=) and read-only pipeline board (?board=) ----
  setPub(patch) { this.setState({pub:{...this.state.pub, ...patch}}); }
  async openApply(token) {
    try { const r = await this.live.applyOpen(token); if (!r || r.status === 'invalid') { this.setPub({status:'invalid'}); return; } this.setPub({status: r.status === 'closed' ? 'closed' : 'ok', data:r}); }
    catch (e) { this.setPub({status:'invalid', msg:(e && e.message) || ''}); }
  }
  async submitApply() {
    const f = this.state.pub.form;
    if (f.name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()) || !f.consent) { this.setPub({msg:'Enter your name and a valid email, and tick the consent box.'}); return; }
    this.setPub({busy:true, msg:''});
    try {
      const r = await this.live.applySubmit({applyToken:this.publicToken, name:f.name.trim(), email:f.email.trim(), phone:f.phone.trim(), loc:f.loc.trim(), linkedin:f.linkedin.trim()});
      this.setPub({busy:false, status:'done', link:r.link, msg: r.emailed ? 'We also emailed the link to ' + f.email.trim() + ' so you can come back later.' : 'Save this link if you need to come back later.'});
      setTimeout(() => { window.location.href = r.link; }, 2200);
    } catch (e) { this.setPub({busy:false, msg:'Could not submit: ' + ((e && e.message) || e)}); }
  }
  async openBoard(token) {
    try { const r = await this.live.boardOpen(token); if (!r || r.status !== 'ok') { this.setPub({status:'invalid'}); return; } this.setPub({status:'ok', data:r}); }
    catch (e) { this.setPub({status:'invalid', msg:(e && e.message) || ''}); }
  }
  // ---- pipeline board (Jobs tab) ----
  async moveStage(cid, stage) {
    if (!LIVE_ENABLED) { this.setState({taLocal:{...this.state.taLocal, [cid]:stage}}); return; }
    await this.write(() => this.live.setStage(cid, stage), 'board');
  }
  async assignJob(cid, jobId) {
    if (!LIVE_ENABLED) return;
    const job = ((this.live.view && this.live.view.jobs) || []).find(j => j.id === jobId);
    await this.write(() => this.live.assignJob(cid, jobId, job ? job.title : null, job ? job.program : null), 'board');
  }
  async createJob() {
    const b = this.state.board; const program = (b.newProgram === '__custom' ? b.newCustom : b.newProgram).trim();
    if (!LIVE_ENABLED) { this.setState({board:{...b, msg:'Jobs are created from real candidates in live mode.'}}); return; }
    this.setState({busy:'job'});
    try { const row = await this.live.findOrCreateJob(b.newRole, program); await this.live.refresh(); this.setState({board:{...this.state.board, job:row.id, open:false, newCustom:'', newProgram:'', msg:''}}); }
    catch (e) { this.setState({board:{...this.state.board, msg:'Could not create the job: ' + ((e && e.message) || e)}}); }
    this.setState({busy:''});
  }
  async toggleJobFlag(job, key, val) { if (!LIVE_ENABLED) return; await this.write(() => this.live.updateJob(job.id, {[key]: val}), 'board'); }
  async setJobStatus(job, status) { if (!LIVE_ENABLED) return; await this.write(() => this.live.updateJob(job.id, {status}), 'board'); }
  async copyBoardLink(txt) { const ok = await this.copyText(txt); this.setState({board:{...this.state.board, msg: (ok ? 'Copied \u00b7 ' : 'Link \u00b7 ') + txt}}); }
  async remindNow() {
    this.setState({remindMsg:'Checking\u2026'});
    try { const r = await this.live.remindNow(); await this.live.refresh(); const n = (r.sent || []).length, f = r.failed || []; this.setState({remindMsg:'Checked ' + r.checked + ' candidate' + (r.checked === 1 ? '' : 's') + ' \u00b7 ' + n + ' reminder' + (n === 1 ? '' : 's') + ' sent' + (f.length ? ' \u00b7 ' + f.length + ' failed: ' + f.map(x => x.name + ' (' + x.error + ')').join('; ') : '') + '.'}); }
    catch (e) { this.setState({remindMsg:'Could not run reminders: ' + ((e && e.message) || e)}); }
  }
  async toggleStaff(u) {
    if (this.state.user && u.id === this.state.user.id) { this.flashFor('users', 'You can\u2019t deactivate your own account.'); return; }
    await this.write(() => this.live.setStaffActive(u.id, !u.active), 'users');
  }
  openLiveSession(cid) {
    const me = this.state.user || {};
    const e = (this.live.raw.evaluations || []).find(x => x.candidate_id === cid && x.evaluator_id === me.id);
    const reset = {liveCand:cid, eview:'live', timer:{sec:0,total:1,on:false}};
    this.hydrating = true;
    this.setState(e ? {...reset, phase:'compare', r1:e.r1 || {}, r2:e.r2 || {}, coach:e.coach || '', notes:e.notes || '', cite:e.cite || '', rec:e.rec || null, submitted:true, objUsed:e.obj_used || {}, coi:!!e.coi}
                   : {...reset, phase:'brief', r1:{}, r2:{}, coach:'', notes:'', cite:'', rec:null, submitted:false, objUsed:{}, coi:false}, () => { this.hydrating = false; });
  }
  openLiveInterview(cid) {
    const me = this.state.user || {};
    const i = (this.live.raw.interviews || []).find(x => x.candidate_id === cid && x.evaluator_id === me.id);
    this.hydrating = true;
    this.setState({liveCand:cid, eview:'ivcard', ivScores: i ? (i.scores || {}) : {}, ivNotes: i ? (i.notes || '') : '', ivSubmitted: !!i}, () => { this.hydrating = false; });
  }
  fmt(s) { return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); }
  start(sec) { this.setState({timer:{sec, total:sec, on:true}}); }
  markDone(k, extra) { this.setState({done:{...this.state.done, [k]:true}, ...(extra||{})}); }
  signInAs(id, role) {
    const D = PEAK_DATA;
    if (!D) { setTimeout(() => this.signInAs(id, role), 300); return; }
    const u = (D.users || []).find(x => x.id === id);
    if (!u) return;
    const r = role && u.roles.includes(role) ? role : u.roles[0];
    this.setState({mode:'staff', user:u, role:r, viewAs:null, login:{email:'', pw:'', err:''}, aview: r === 'manager' ? 'pipe' : 'funnel', eview:'roster'});
  }
  renderVals() {
    const D = (LIVE_ENABLED ? this.liveD() : PEAK_DATA) || {comps:[],anchors:{},weights:[],scale:[],inventory:[],scenarios:[],objections:[],evQs:[],caseQs:[],realities:[],candidates:[],funnel:[],roles:[],hires:[],audit:[],users:[],roleDefs:{},interviewQs:[],applications:{},decisions:[],accoms:[],sessions:[],weightsByRole:{},invite:null};
    const st = this.state, G = '#10B981', GL = '#34D399', AMB = '#F5B84A', RED = '#F87171', DIM = '#7E9186';
    const v = {};
    // shell
    v.texture = this.props.showTexture ?? true;
    const users = D.users || [], roleDefs = D.roleDefs || {};
    const user = st.user, roles = user ? user.roles : [];
    const inv = D.invite || {first:'Alex', name:'Alex Carter', role:DEFAULT_ROLE, prop:'Texas State Athletics', due:'Fri, Sep 11', session:'Thu, Sep 10 · 2:00 PM CT', link:'meet.peaksportsmgmt.com/combine-1064', track:'assessment', hasSession:true};
    const isCombine = !!this.combineToken, isInfo = !isCombine && inv.track === 'info';
    const roleLabel = r => (roleDefs[r] || {}).label || r;
    const B = PEAK_BANK || null;
    const profIdFor = role => (D.profileByRole || {})[role] || 'entry';
    const isAdminRole = st.mode === 'staff' && st.role === 'admin', isLead = st.mode === 'staff' && st.role === 'leadership', isMgr = st.mode === 'staff' && (st.role === 'manager' || st.role === 'admin');
    v.isEntry = !st.mode; v.inApp = !!st.mode && st.mode !== 'public'; v.isPublic = st.mode === 'public';
    v.viewingAs = !!st.viewAs;
    v.inviteExpired = st.mode === 'candidate' && st.invite === 'expired';
    v.isDemo = true; v.inviteLoading = false; v.inviteSaved = false; v.inviteInvalid = false; v.combineExpired = false; v.pwSetup = false; v.busy = false; v.loginInfo = ''; v.saveErr = ''; v.flashErr = ''; v.showInviteForm = false; v.pipeEmpty = false; v.noSessions = false; v.inboxEmpty = false; v.validEmpty = false; v.pNeedsScore = false; v.rpNeedsEvidence = false; v.schLinkEditable = false; v.schBusy = false; v.joinHref = ''; v.trEnabled = false; v.liveTranscripts = []; v.pTranscripts = [];
    v.isCand = (st.mode === 'candidate' && st.invite === 'valid') || v.viewingAs;
    v.isEval = st.mode === 'staff' && st.role === 'evaluator' && !v.viewingAs;
    v.isStaff = st.mode === 'staff' && (isMgr || isLead) && !v.viewingAs;
    // sign-in
    v.loginEmail = st.login.email; v.loginPw = st.login.pw; v.loginErr = st.login.err;
    v.setLoginEmail = e => this.setState({login:{...this.state.login, email:e.target.value, err:''}});
    v.setLoginPw = e => this.setState({login:{...this.state.login, pw:e.target.value, err:''}});
    v.signIn = () => { const em = this.state.login.email.trim().toLowerCase(); const u = users.find(x => x.email.toLowerCase() === em); if (!u) this.setState({login:{...this.state.login, err: em ? 'No staff account for that email. Candidates: use the link in your invitation email.' : 'Enter your work email.'}}); else if (this.state.deactivated[u.id]) this.setState({login:{...this.state.login, err:'This account has been deactivated. Contact the admin.'}}); else this.signInAs(u.id); };
    v.demoUsers = users.map(u => ({name: u.name + ' · ' + u.title, rolesTxt: u.roles.map(roleLabel).join(' + '), go: () => this.signInAs(u.id)}));
    v.openInvite = () => this.setState({mode:'candidate', invite:'valid', viewAs:null});
    v.openExpired = () => this.setState({mode:'candidate', invite:'expired', resent:false, viewAs:null});
    v.notResent = !st.resent; v.resent = st.resent; v.resend = () => this.setState({resent:true});
    v.exitRole = () => this.setState({mode:null, user:null, role:null, viewAs:null, login:{email:'', pw:'', err:''}});
    v.exitLabel = st.mode === 'candidate' ? 'Save & exit' : 'Sign out';
    v.roleTitle = v.viewingAs ? 'Candidate Portal · view as' : st.mode === 'candidate' ? 'Candidate Portal' : v.isEval ? 'Evaluator Cockpit' : isLead ? 'Leadership & Compliance' : isAdminRole ? 'Admin' : 'Hiring Manager';
    v.userLabel = st.mode === 'candidate' ? inv.name : user ? (user.short + ' · ' + roleLabel(st.role)) : '';
    v.showRoleChips = !!user && roles.length > 1 && !v.viewingAs;
    v.roleChips = roles.map(r => ({label: roleLabel(r), on: () => this.setState({role:r, aview: r === 'manager' ? 'pipe' : 'funnel', eview:'roster'}), bg: st.role === r ? 'rgba(16,185,129,.16)' : 'transparent', fg: st.role === r ? GL : '#8FA396'}));
    const vaCand = st.viewAs ? (D.candidates.find(c => c.id === st.viewAs) || null) : null;
    v.viewAsName = vaCand ? vaCand.name : '';
    v.exitViewAs = () => this.setState({viewAs:null});
    v.canViewAs = isMgr;
    // accommodations (shared by cockpit + inbox)
    const seededAccoms = (D.accoms || []).map(a => ({...a}));
    if (st.accomSent) seededAccoms.unshift({id:'alex', candId:'alex', cand:'Alex Carter · Candidate #1064', t:'Just now', txt: st.accomTxt.trim() || '(no detail provided)', status:'Open'});
    const accomApproved = candId => { const a = seededAccoms.find(x => x.candId === candId); if (!a) return false; const ov = st.accomState[a.id]; return (ov ? ov.status : a.status) === 'Approved'; };
    const tylerAccom = accomApproved(LIVE_ENABLED ? st.liveCand : 'tyler');
    const tab = (label, on, active) => ({label, go:on, bg: active ? 'rgba(16,185,129,.12)' : 'transparent', fg: active ? GL : '#8FA396'});
    if (v.isCand) v.navTabs = [tab(isCombine ? 'My combine' : isInfo ? 'My details' : 'My assessment', () => this.setState({cview: isCombine ? 's5' : isInfo ? (this.state.infoDone ? 'infodone' : 'info') : 'dash'}), true)];
    else if (v.isEval) v.navTabs = [tab('Sessions', () => this.setState({eview:'roster'}), st.eview === 'roster'), tab('Live combine', () => this.setState({eview:'live'}), st.eview === 'live'), tab('Interviews', () => this.setState({eview:'ivlist'}), st.eview === 'ivlist' || st.eview === 'ivcard')];
    else if (v.isStaff) {
      const A = (label, id, alias) => tab(label, () => this.setState({aview:id}), st.aview === id || (alias || []).includes(st.aview));
      const T = [A('Funnel','funnel'), A('Pipeline','pipe',['profile','compare','appreview']), A('Jobs','board')];
      if (isMgr) T.push(A('Schedule','schedule'));
      if (isMgr) T.push(A('Inbox','inbox'));
      T.push(A('Decisions','decisions'));
      if (isAdminRole) { T.push(A('Question bank','bank')); T.push(A('Weights','weights')); }
      if (isAdminRole || isLead) T.push(A('Calibration','calib'));
      T.push(A('Validation','valid'));
      if (isAdminRole) { T.push(A('Users','users')); T.push(A('Roadmap','roadmap')); }
      T.push(A('Settings','settings'));
      v.navTabs = T;
    } else v.navTabs = [];
    // ===== candidate =====
    const stageDone = n => ({s1:n >= 2, s2:n >= 2, s3:n >= 4, s4:n >= 4, s5a:n >= 5, s5b:n >= 5});
    const done = vaCand ? (vaCand.done || stageDone(vaCand.stage)) : st.done, s5Done = done.s5a && done.s5b;
    const ap = st.app;
    v.isCombine = isCombine; v.isInfo = isInfo;
    v.candFirst = vaCand ? vaCand.name.split(' ')[0] : inv.first;
    v.candRoleLine = (vaCand ? vaCand.role : inv.role) + ' · ' + (vaCand ? (vaCand.program || 'Peak Sports MGMT') : inv.prop);
    v.candDue = inv.due; v.candSession = inv.session; v.candLink = inv.link; v.joinDisabled = true; v.candHasSession = !!inv.hasSession;
    v.combineHref = inv.combineLink || '';
    const mobile = this.props.mobilePreview ?? false;
    v.candMax = mobile ? '400px' : '860px'; v.candFrame = mobile ? '1px solid rgba(160,190,170,.18)' : 'none';
    v.candPE = v.viewingAs ? 'none' : 'auto';
    const cv = st.cview;
    v.vDash = !isCombine && !isInfo && cv === 'dash'; v.vS1 = cv === 's1'; v.vS2 = cv === 's2' || (isInfo && (cv === 'info' || cv === 'dash')); v.vS3 = cv === 's3'; v.vFinished = cv === 'finished';
    v.vInfoDone = isInfo && cv === 'infodone';
    v.vS5 = cv === 's5'; v.vS5a = cv === 's5a'; v.vS5b = cv === 's5b';
    v.goDash = () => this.setState({cview: isCombine ? 's5' : isInfo ? 'info' : 'dash'});
    v.goS5 = () => this.setState({cview:'s5'});
    const defs = [
      {n:'01', title:'Welcome & Realistic Job Preview', time:'3 min', k:'s1', view:'s1'},
      {n:'02', title:'Your details & résumé', time:'5 min', k:'s2', view:'s2'},
      {n:'03', title:'Sales Decisions', time:'15 min', k:'s3', view:'s3'}
    ];
    const isDone = k => !!done[k];
    v.stages = defs.map((d, i) => {
      const dn = isDone(d.k);
      const locked = i > 0 && !isDone(defs[i-1].k);
      const started = d.k === 's3' ? Object.keys(st.bkAns).length > 0 : d.k === 's1' ? (st.ack || !!st.challenge) : d.k === 's2' ? (!!ap.resume || ap.auth !== null || !!ap.consent) : false;
      return {
        n:d.n, title:d.title, time:d.time,
        status: dn ? 'Complete' : locked ? 'Locked' : started ? 'In progress' : 'Not started',
        statusColor: dn ? GL : locked ? '#4A554D' : started ? AMB : DIM,
        border: dn ? 'rgba(16,185,129,.3)' : 'rgba(160,190,170,.13)',
        numColor: dn ? GL : DIM,
        canGo: !locked && !dn, btn: started ? 'Resume' : 'Start',
        btnBg: started ? 'transparent' : G, btnFg: started ? '#E9F0EA' : '#04120B',
        btnBorder: started ? '1px solid rgba(160,190,170,.3)' : 'none',
        go: () => this.setState({cview:d.view})
      };
    });
    const nDone = defs.filter(d => isDone(d.k)).length;
    v.progressPct = Math.round(nDone/3*100) + '%';
    v.progressTxt = nDone + ' of 3 stages complete';
    const selfDone = done.s1 && done.s2 && done.s3;
    v.assessmentDone = selfDone;
    const decision = vaCand ? (vaCand.rec === 'Do Not Advance' ? 'Decline' : vaCand.stage >= 6 ? 'Advance' : 'none') : (LIVE_ENABLED ? ((this.candInfo && this.candInfo.decision) || 'none') : (this.props.candidateDecision ?? 'none'));
    const decided = decision === 'Advance' || decision === 'Decline';
    v.showStatus = selfDone || isCombine;
    const combineSub = done.s5a ? 'Completed · scored independently by two evaluators' : inv.hasSession ? ('Scheduled ' + inv.session + (isCombine ? '' : ' · your combine link was emailed to you separately')) : 'Scheduled separately — you’ll get a second email with the date and your combine link';
    v.statusSteps = [
      {label:'Assessment received', sub: selfDone ? 'Stages 1–3 complete · scored and reviewed by the talent team' : 'Not completed — the team will let you know if it is needed', on: selfDone},
      {label:'Live combine', sub: combineSub, on: done.s5a || !!inv.hasSession},
      {label:'Panel review', sub:'Two evaluators’ scores compared; any disagreement is discussed, never averaged away', on: done.s5a},
      {label:'Decision', sub: decided ? 'Recorded — see below' : 'Within five business days of your combine, by email and here', on: decided}
    ].map(s => ({label:s.label, sub:s.sub, mark: s.on ? '●' : '○', color: s.on ? GL : '#5C6B61'}));
    v.decisionAdvance = (selfDone || isCombine) && decision === 'Advance'; v.decisionDecline = (selfDone || isCombine) && decision === 'Decline';
    v.decisionAdvanceTxt = 'Two evaluators independently reviewed your combine, interview, and evidence. Ram\u00f3n Delgado, Regional Sales Director, will call you within two business days to walk through the offer and cohort start date. A copy of this decision was emailed to you.';
    // s1 — acknowledgment plus one multiple-choice question (no free text anywhere in the assessment)
    v.realities = D.realities; v.ack = st.ack;
    v.toggleAck = () => this.setState({ack:!st.ack});
    v.ackBorder = st.ack ? 'rgba(16,185,129,.45)' : 'rgba(160,190,170,.13)';
    v.challengeOpts = (D.realities || []).map(r => { const on = st.challenge === r; return {label:r, on: () => this.setState({challenge:r}), bg: on ? 'rgba(16,185,129,.16)' : '#0B120E', border: on ? 'rgba(16,185,129,.6)' : 'rgba(160,190,170,.2)', fg: on ? GL : '#D5DED7'}; });
    const s1ok = st.ack && !!st.challenge;
    v.s1Blocked = !s1ok; v.s1BtnBg = s1ok ? G : '#20302680';
    v.s1Hint = s1ok ? '' : 'Check the acknowledgment and pick the part you expect to be hardest.';
    v.submitS1 = () => { if (s1ok) this.markDone('s1', {cview:'dash'}); };
    // s2 — contact details and résumé (also the whole of a details-only link)
    const setA = k => e => this.setState({app:{...this.state.app, [k]:e.target.value}});
    v.appFields = [
      {label:'Full name', ph:'First and last name', val:ap.name, set:setA('name')},
      {label:'Email', ph:'you@example.com', val:ap.email, set:setA('email')},
      {label:'Phone', ph:'(555) 000-0000', val:ap.phone, set:setA('phone')},
      {label:'Location', ph:'e.g. San Marcos, TX · open to relocation', val:ap.loc, set:setA('loc')}
    ];
    // the school / property the candidate is applying to — a dropdown of Peak's schools when the list is set, free text otherwise
    const schoolList = (LIVE_ENABLED && st.mode === 'candidate') ? ((this.candInfo && this.candInfo.schools) || []) : (st.schools || DEFAULT_SCHOOLS);
    v.appProgram = ap.program || ''; v.setAppProgram = setA('program');
    v.schoolIsSelect = schoolList.length > 0;
    v.schoolOpts = [{id:'', label:'Select the school / property\u2026'}, ...(ap.program && !schoolList.includes(ap.program) ? [{id:ap.program, label:ap.program}] : []), ...schoolList.map(s => ({id:s, label:s}))];
    v.appRole = ap.role || inv.role; v.setAppRole = setA('role');
    v.appLinkedin = ap.linkedin; v.setLinkedin = setA('linkedin');
    v.authYes = () => this.setState({app:{...ap, auth:true}});
    v.authNo = () => this.setState({app:{...ap, auth:false}});
    v.authYesBg = ap.auth===true ? 'rgba(16,185,129,.16)' : '#0B120E'; v.authYesFg = ap.auth===true ? GL : '#A7B5AB';
    v.authNoBg = ap.auth===false ? 'rgba(16,185,129,.16)' : '#0B120E'; v.authNoFg = ap.auth===false ? GL : '#A7B5AB';
    const resumeName = ap.resume && typeof ap.resume === 'object' ? ap.resume.name : ap.resume ? 'Résumé on file' : '';
    v.pickResume = e => this.pickResume(e);
    v.resumeTxt = resumeName ? resumeName + ' ✓ uploaded' : 'Upload résumé';
    v.resumeSub = resumeName ? 'Click to replace it' : 'PDF or Word · 15 MB max · secure upload';
    v.resumeMsg = st.resumeMsg || ''; v.resumeMsgColor = /^Could not/.test(st.resumeMsg || '') ? RED : '#8FA396';
    v.resumeBorder = resumeName ? 'rgba(16,185,129,.5)' : 'rgba(160,190,170,.3)';
    v.resumeBg = resumeName ? 'rgba(16,185,129,.06)' : 'transparent';
    v.resumeColor = resumeName ? GL : '#A7B5AB';
    v.consent = ap.consent;
    v.toggleConsent = () => this.setState({app:{...ap, consent:!ap.consent}});
    const s2ok = ap.name && ap.email && ap.auth!==null && !!ap.resume && ap.consent && !!(ap.program || '').trim();
    v.s2Blocked = !s2ok; v.s2BtnBg = s2ok ? G : '#20302680';
    v.s2Hint = s2ok ? '' : 'Complete your contact details, the school you\u2019re applying to, your r\u00e9sum\u00e9, work authorization, and consent.';
    v.submitS2 = () => { if (!s2ok) return; if (isInfo) this.setState({infoDone:true, cview:'infodone'}); else this.markDone('s2', {cview:'dash'}); };
    v.s2Kicker = isInfo ? 'Your details' : 'Stage 02 · Your details & résumé';
    v.s2Title = isInfo ? 'A couple of minutes, then you’re done.' : 'Tell us where to reach you.';
    v.s2Intro = isInfo ? 'Peak Sports MGMT asked for your contact details and résumé. There are no questions to answer here and nothing is scored.' : 'Contact details and your résumé. Nothing on this page is scored — the hiring team just needs to reach you.';
    v.s2BtnTxt = isInfo ? 'Send my details' : 'Save & continue';
    v.infoDoneTxt = 'We have your details' + (resumeName ? ' and your résumé' : '') + '. If you move forward, the Sales Combine assessment (about 20–30 minutes, all multiple choice) arrives as a separate link from the team.';
    v.reopenInfo = () => this.setState({cview:'info'});
    // s3 Sales Decisions (bank flow: likert / pairs / scenarios / worst-move, interleaved)
    const candRole = vaCand ? vaCand.role : inv.role;
    const candEditsAll = (LIVE_ENABLED && st.mode === 'candidate') ? ((this.candInfo && this.candInfo.bankEdits) || {}) : (st.bankEdits || {});
    const editsFor = pid => { const e = (candEditsAll || {})[pid]; return (e && typeof e === 'object' && !Array.isArray(e)) ? e : null; };
    const bkProf = B ? B.applyEdits(B.ROLES[profIdFor(candRole)], editsFor(profIdFor(candRole))) : null;
    const bkFlow = bkProf ? B.flowFor(bkProf) : [];
    const bkTotal = bkFlow.length || 1;
    const bkI = Math.min(st.bkIdx, bkTotal - 1);
    const bkItem = bkFlow[bkI] || {};
    const bkCur = st.bkAns[bkItem.id];
    v.bkNum = bkI + 1; v.bkTotal = bkTotal; v.bkPct = Math.round(bkI / bkTotal * 100) + '%';
    v.bkKindLabel = ({likert:'How true is this of you?', pair:'Both are good. Which is more you?', scenario:'What would you actually do?', worst:'Which is the worst move?'})[bkItem.kind] || 'Sales decisions';
    v.bkHasText = bkItem.kind !== 'pair' && !!bkItem.text; v.bkText = bkItem.text || '';
    v.bkIsLikert = bkItem.kind === 'likert'; v.bkIsPair = bkItem.kind === 'pair'; v.bkIsChoice = bkItem.kind === 'scenario' || bkItem.kind === 'worst';
    const bkPick = val => { const a = {...this.state.bkAns, [bkItem.id]: val}; const nx = bkI + 1; if (nx >= bkTotal) this.setState({bkAns:a, bkIdx:bkTotal, done:{...this.state.done, s3:true, s4:true}, cview:'finished'}); else this.setState({bkAns:a, bkIdx:nx}); };
    const selSty = on => ({bg: on ? 'rgba(16,185,129,.16)' : '#0B120E', border: on ? 'rgba(16,185,129,.6)' : 'rgba(160,190,170,.2)', fg: on ? GL : '#D5DED7'});
    v.bkScale = ['Strongly disagree','Disagree','Neutral','Agree','Strongly agree'].map((label, k) => ({label, ...selSty(bkCur === k + 1), on: () => bkPick(k + 1)}));
    v.bkPair = bkItem.kind === 'pair' ? [['a', bkItem.a[2]], ['b', bkItem.b[2]]].map(([side, text]) => ({text, ...selSty(bkCur === side), on: () => bkPick(side)})) : [];
    v.bkOpts = v.bkIsChoice ? B.shuffled(bkItem.opts, bkI * 7 + 13).map((o, k) => ({letter:'ABCD'[k], text:o.text, ...selSty(bkCur === o.i), on: () => bkPick(o.i)})) : [];
    v.bkCanBack = bkI > 0 && !done.s3; v.bkBack = () => this.setState({bkIdx: Math.max(0, this.state.bkIdx - 1)});
    // an intro screen the first time each question format appears, so the switch between formats is explicit
    const kindIntro = {likert:{title:'Self-assessment', kicker:'How true is this of you?', body:'Rate each statement on a five-point scale. Answer for how you actually operate, not how you would like to. Your ratings are read alongside your scenario choices, so honesty is the only strategy that works.', noun:'statements'}, pair:{title:'Forced choice', kicker:'Both are good. Which is more you?', body:'Two legitimate options each time \u2014 neither is wrong. Pick the one that is more true of you.', noun:'pairs'}, scenario:{title:'Scenarios', kicker:'What would you actually do?', body:'A real situation from the job and four responses. Choose the one closest to what you would genuinely do \u2014 not the textbook answer.', noun:'scenarios'}, worst:{title:'Worst move', kicker:'Which is the worst move?', body:'This part flips the question. Of the four actions, pick the ONE you would never take \u2014 the most damaging move in that situation.', noun:'situations'}};
    const groupStart = bkI === 0 || (bkFlow[bkI - 1] || {}).kind !== bkItem.kind;
    let runLen = 0; for (let k = bkI; k < bkFlow.length && bkFlow[k].kind === bkItem.kind; k++) runLen++;
    const ki = kindIntro[bkItem.kind] || kindIntro.scenario;
    v.bkIntro = groupStart && !(st.bkIntroSeen || {})[bkI] && !done.s3 && bkFlow.length > 0;
    v.bkIntroTitle = ki.title; v.bkIntroKicker = ki.kicker; v.bkIntroBody = ki.body; v.bkIntroCount = runLen + ' ' + ki.noun + (bkI === 0 ? ' to start' : ' next');
    v.bkIntroGo = () => this.setState({bkIntroSeen:{...(this.state.bkIntroSeen || {}), [bkI]: true}});
    // s5
    v.s5aStatus = done.s5a ? 'Completed' : inv.hasSession ? 'Scheduled · ' + inv.session : 'Not yet scheduled'; v.s5aStatusColor = done.s5a ? GL : inv.hasSession ? AMB : DIM;
    v.s5bStatus = done.s5b ? 'Submitted' : 'Due before your session'; v.s5bStatusColor = done.s5b ? GL : DIM;
    v.s5aBtnTxt = done.s5a ? 'Session summary' : 'Session details';
    v.s5bBtnTxt = done.s5b ? 'View submission' : 'Begin Exercise B';
    const gBtn = dn => dn ? {bg:'transparent', fg:'#E9F0EA', bd:'1px solid rgba(160,190,170,.3)'} : {bg:G, fg:'#04120B', bd:'none'};
    const ga = gBtn(true), gb = gBtn(done.s5b);
    v.s5aBtnBg = ga.bg; v.s5aBtnFg = ga.fg; v.s5aBtnBorder = ga.bd;
    v.s5bBtnBg = gb.bg; v.s5bBtnFg = gb.fg; v.s5bBtnBorder = gb.bd;
    v.goS5a = () => this.setState({cview:'s5a'});
    v.goS5b = () => this.setState({cview:'s5b'});
    // s5a (live session details)
    v.consentRec = st.consentRec; v.toggleConsentRec = () => this.setState({consentRec:!st.consentRec});
    v.consentBorder = st.consentRec ? 'rgba(16,185,129,.45)' : 'rgba(160,190,170,.13)';
    v.notResched = !st.resched; v.resched = st.resched; v.askResched = () => this.setState({resched:true});
    const gcalHref = () => { const s = inv.startsAt ? new Date(inv.startsAt) : null; if (!s || isNaN(s.getTime())) return ''; const e = new Date(s.getTime() + 60 * 60000); const f = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z'); return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Peak Sales Combine — live session') + '&dates=' + f(s) + '/' + f(e) + '&details=' + encodeURIComponent('Combine page: ' + (inv.combineLink || '')) + (inv.link && /^https?:/.test(inv.link) ? '&location=' + encodeURIComponent(inv.link) : ''); };
    v.gcalHref = LIVE_ENABLED ? gcalHref() : '';
    // s5b — written answers, or a real file upload for slides / video
    const caseFile = st.caseFile;
    v.pickCaseFile = e => this.pickCaseFile(e);
    v.caseUpTxt = caseFile ? caseFile.name + ' ✓ ready to submit' : (st.caseMode==='Video' ? 'Upload a short video response' : 'Upload your slide deck');
    v.caseUpSub = caseFile ? 'Click to replace it' : st.caseMode==='Video' ? '5:00 max · MP4, MOV or WEBM · 15 MB' : 'PDF or PowerPoint · 15 MB max';
    v.caseMsg = st.caseMsg || ''; v.caseMsgColor = /^Could not/.test(st.caseMsg || '') ? RED : '#8FA396';
    v.recBorder = caseFile ? 'rgba(16,185,129,.5)' : 'rgba(160,190,170,.3)';
    v.recBg = caseFile ? 'rgba(16,185,129,.06)' : 'transparent';
    v.recColor = caseFile ? GL : '#A7B5AB';
    // s5b
    v.caseModes = ['Written','Slides upload','Video'].map(m => ({label:m, on:() => this.setState({caseMode:m}), bg: st.caseMode===m ? 'rgba(16,185,129,.14)' : 'transparent', fg: st.caseMode===m ? GL : '#8FA396'}));
    v.caseWritten = st.caseMode==='Written';
    v.caseUpload = st.caseMode!=='Written';
    v.caseItems = D.caseQs.map((q, i) => ({num: String(i+1).padStart(2,'0'), q, val: st.caseAns[i], set: e => { const a=[...this.state.caseAns]; a[i]=e.target.value; this.setState({caseAns:a}); }}));
    const s5bOk = st.caseMode==='Written' ? st.caseAns.every(x => x.trim().length > 10) : !!caseFile;
    v.s5bBlocked = !s5bOk || done.s5b;
    v.s5bSubmitBg = (s5bOk && !done.s5b) ? G : '#20302680';
    v.submitS5b = () => { if (s5bOk && !done.s5b) this.markDone('s5b', {cview:'s5'}); };
    // accommodation
    v.accomOpen = st.accomOpen; v.toggleAccom = () => this.setState({accomOpen:!st.accomOpen});
    v.accomTxt = st.accomTxt; v.setAccomTxt = e => this.setState({accomTxt:e.target.value});
    v.accomSent = st.accomSent; v.accomNotSent = !st.accomSent;
    v.sendAccom = () => this.setState({accomSent:true});
    v.notWithdrawn = !st.withdrawn; v.withdrawn = st.withdrawn;
    v.withdraw = () => this.setState({withdrawn:true}); v.undoWithdraw = () => this.setState({withdrawn:false});
    // timer shared
    v.timerTxt = this.fmt(st.timer.sec);
    v.timerPct = Math.round(st.timer.sec/st.timer.total*100) + '%';
    // ===== evaluator =====
    v.vRoster = st.eview==='roster'; v.vLive = st.eview==='live';
    v.liveCandName = 'Tyler Nguyen'; v.otherShort = 'JW';
    v.liveBrief = 'Tyler Nguyen \u00b7 Sponsorship Sales Consultant \u00b7 Waco, TX. Sales decisions 78/100 (Meets profile) \u00b7 application evidence rated High. Built a resale business to $18K profit over 14 months. Pending: full combine.';
    v.agreeIntro = 'Your scores vs. J. Whitfield (submitted 9:14 AM). Differences over 1.5 are flagged for a calibration discussion.';
    v.ivTitle = 'Structured interview \u2014 Tyler Nguyen'; v.ivMeta = 'Thu 3:15 PM \u00b7 after the combine \u00b7 40 min \u00b7 with J. Whitfield';
    v.ivLockNote = 'Scores lock on submit and stay hidden from J. Whitfield until she submits hers. '; v.ivSubmittedNote = 'Submitted \u00b7 waiting on J. Whitfield before agreement is shown.';
    v.goRoster = () => this.setState({eview:'roster'});
    v.sessions = [
      {initials:'TN', name:'Tyler Nguyen', sub:'Sponsorship Sales Consultant · Exercise A · Thu 2:00 PM · with J. Whitfield' + (tylerAccom ? ' · accommodation in place' : ''), status: st.submitted ? 'Scored' : 'Ready', statusColor: st.submitted ? GL : AMB, canRun: true, go: () => this.setState({eview:'live'})},
      {initials:'MR', name:'Marcus Reeves', sub:'Scored Mon \u00b7 R1 4.4 \u2192 R2 4.5 \u00b7 calibration flag open (Self-Accountability \u0394 2.0)', status:'Flagged', statusColor:AMB, canRun:false},
      {initials:'DO', name:'Dana Okafor', sub:'Scored Mon \u00b7 R1 2.9 \u2192 R2 4.3 \u00b7 strongest coached improvement in cohort', status:'Scored', statusColor:GL, canRun:false}
    ];
    const ph = st.phase;
    const phases = [['brief','Brief'],['r1','Round 1'],['score1','Score R1'],['coach','Coach'],['r2','Re-pitch'],['score2','Score R2'],['rec','Recommend'],['compare','Agreement']];
    const phIdx = phases.findIndex(p => p[0]===ph);
    v.phaseSteps = phases.map((p, i) => ({label:p[1], bg: i===phIdx ? 'rgba(16,185,129,.16)' : 'transparent', fg: i===phIdx ? GL : i<phIdx ? '#8FA396' : '#4A554D'}));
    v.liveTimerLabel = ph==='r1' ? 'Round 1 \u00b7 pitch (3:00)' : ph==='coach' ? ('Re-pitch prep (' + (tylerAccom ? '7:30' : '5:00') + ')') : ph==='r2' ? 'Round 2 \u00b7 re-pitch (3:00)' : 'Timer';
    const adv = {brief:['Start Round 1 \u25b8', () => { this.setState({phase:'r1'}); this.start(180); }],
      r1:['End pitch \u2192 score', () => this.setState({phase:'score1', timer:{...st.timer,on:false}})],
      score1:['Deliver coaching \u25b8', () => { this.setState({phase:'coach'}); this.start(tylerAccom ? 450 : 300); }],
      coach:['Start re-pitch \u25b8', () => { this.setState({phase:'r2'}); this.start(180); }],
      r2:['End re-pitch \u2192 score', () => this.setState({phase:'score2', timer:{...st.timer,on:false}})],
      score2:['Go to recommendation \u25b8', () => this.setState({phase:'rec'})],
      rec:['\u2014', () => {}], compare:['\u2014', () => {}]};
    v.liveAdvanceTxt = adv[ph][0]; v.liveAdvance = adv[ph][1];
    v.objCards = D.objections.map((text, i) => ({text, tick: st.objUsed[i] ? '\u2713' : '\u25cb', mark: st.objUsed[i] ? GL : '#5C6B61', border: st.objUsed[i] ? 'rgba(16,185,129,.35)' : 'rgba(160,190,170,.14)', toggle: () => this.setState({objUsed:{...this.state.objUsed, [i]:!this.state.objUsed[i]}})}));
    v.showCoachCard = ph==='coach' || ph==='r2' || ph==='score2' || ph==='rec' || ph==='compare';
    v.coach = st.coach; v.setCoach = e => this.setState({coach:e.target.value});
    const round2 = ph==='score2' || ph==='rec' || ph==='compare';
    v.coi = st.coi; v.toggleCoi = () => this.setState({coi:!st.coi});
    v.coiNeeded = !st.coi && ph !== 'compare';
    v.showScoring = ph!=='compare' && ph!=='rec' && st.coi;
    v.liveFlags = [
      {label: tylerAccom ? 'Accommodation in place · +50% prep time' : 'No accommodations', fg: tylerAccom ? '#E9D9B0' : '#7E9186', bg: tylerAccom ? 'rgba(245,184,74,.1)' : 'transparent', border: tylerAccom ? 'rgba(245,184,74,.35)' : 'rgba(160,190,170,.14)'},
      {label:'Recording consent ✓', fg:GL, bg:'rgba(16,185,129,.1)', border:'rgba(16,185,129,.3)'},
      {label:'Case submitted Tue · read it', fg:GL, bg:'rgba(16,185,129,.1)', border:'rgba(16,185,129,.3)'},
      {label: st.coi ? 'COI declared ✓' : 'COI declaration pending', fg: st.coi ? GL : AMB, bg: st.coi ? 'rgba(16,185,129,.1)' : 'rgba(245,184,74,.1)', border: st.coi ? 'rgba(16,185,129,.3)' : 'rgba(245,184,74,.35)'}
    ];
    v.scoreTitle = round2 ? 'Round 2 \u2014 coached re-pitch' : 'Round 1 \u2014 first attempt';
    const rKey = round2 ? 'r2' : 'r1';
    const rComps = round2 ? ['co','sj','hd','sa'] : ['sj','hd','re','sa'];
    const compName = id => (D.comps.find(c => c.id===id)||{}).name || id;
    v.scoreRows = rComps.map(id => {
      const val = st[rKey][id];
      const anch = D.anchors[id] || {};
      return {
        name: compName(id),
        anchor: val ? (anch[val] || ('Between the level-' + (val-1) + ' and level-' + (val+1) + ' anchors.')) : ('1 \u2014 ' + (anch[1]||'') + '  \u00b7  5 \u2014 ' + (anch[5]||'')),
        chips: [1,2,3,4,5].map(n => ({n, aria: compName(id)+' '+n,
          bg: val===n ? G : '#0B120E', fg: val===n ? '#04120B' : '#A7B5AB',
          border: val===n ? G : 'rgba(160,190,170,.2)',
          on: () => this.setState({[rKey]: {...this.state[rKey], [id]: n}})}))
      };
    });
    v.notes = st.notes; v.setNotes = e => this.setState({notes:e.target.value});
    v.cite = st.cite; v.setCite = e => this.setState({cite:e.target.value});
    v.showRec = ph==='rec';
    const avg = o => { const xs = Object.values(o); return xs.length ? (xs.reduce((a,b)=>a+b,0)/xs.length) : null; };
    const a1 = avg(st.r1), a2 = avg(st.r2);
    v.r1Avg = a1 ? a1.toFixed(1) : '\u2014'; v.r2Avg = a2 ? a2.toFixed(1) : '\u2014';
    v.deltaTxt = (a1 && a2) ? ((a2-a1>=0?'+':'') + (a2-a1).toFixed(1)) : '\u2014';
    v.recBtns = ['Advance','Hold','Do Not Advance'].map(r => ({label:r, on:() => this.setState({rec:r}),
      bg: st.rec===r ? (r==='Advance'?G:r==='Hold'?AMB:RED) : 'transparent',
      fg: st.rec===r ? '#04120B' : (r==='Advance'?GL:r==='Hold'?AMB:RED),
      border: r==='Advance'?'rgba(16,185,129,.4)':r==='Hold'?'rgba(245,184,74,.4)':'rgba(248,113,113,.4)'}));
    v.evalBlocked = !st.rec;
    v.evalSubmitBg = st.rec ? G : '#20302680';
    v.submitEval = () => { if (st.rec) this.setState({submitted:true, phase:'compare'}); };
    v.showCompare = ph==='compare';
    const OTHER = {sj:3.5, hd:3.5, re:3.5, sa:2.0, co:3.5};
    v.agreeRows = ['sj','hd','re','sa','co'].map(id => {
      const mine = st.r2[id] ?? st.r1[id];
      const oth = OTHER[id];
      const diff = mine!=null ? Math.abs(mine-oth) : null;
      const flag = diff!=null && diff>1.5;
      return {name: compName(id), mine: mine!=null?mine.toFixed(1):'\u2014', other: oth.toFixed(1),
        flagTxt: mine==null ? 'not scored' : flag ? '\u26a0 \u0394 '+diff.toFixed(1)+' \u2014 flagged' : '\u0394 '+diff.toFixed(1)+' \u00b7 aligned',
        flagColor: flag ? AMB : GL,
        bg: flag ? 'rgba(245,184,74,.06)' : '#0B120E',
        border: flag ? 'rgba(245,184,74,.4)' : 'rgba(160,190,170,.1)'};
    });
    // interviews
    v.vIvList = st.eview === 'ivlist'; v.vIvCard = st.eview === 'ivcard';
    v.goIvList = () => this.setState({eview:'ivlist'});
    v.ivList = [
      {initials:'TN', name:'Tyler Nguyen', sub:'Sponsorship Sales Consultant · Thu 3:15 PM · after the combine · with J. Whitfield', status: st.ivSubmitted ? 'Scored' : 'Ready', statusColor: st.ivSubmitted ? GL : AMB, canRun:true, go: () => this.setState({eview:'ivcard'})},
      {initials:'MR', name:'Marcus Reeves', sub:'Scored Mon · Self-Accountability 2.0 · cited in the open calibration flag', status:'Scored', statusColor:GL, canRun:false}
    ];
    const ivQs = D.interviewQs || [];
    v.ivRows = ivQs.map((q, i) => {
      const val = st.ivScores[q.comp], anch = D.anchors[q.comp] || {};
      return {num:'Q' + (i + 1), comp: compName(q.comp), q:q.q, probes:q.probes.join(' · '),
        anchor: val ? (anch[val] || ('Between the level-' + (val - 1) + ' and level-' + (val + 1) + ' anchors.')) : ('1 — ' + (anch[1] || '') + '  ·  5 — ' + (anch[5] || '')),
        chips:[1,2,3,4,5].map(n => ({n, aria: compName(q.comp) + ' ' + n, bg: val === n ? G : '#0B120E', fg: val === n ? '#04120B' : '#A7B5AB', border: val === n ? G : 'rgba(160,190,170,.2)', on: () => { if (!this.state.ivSubmitted) this.setState({ivScores:{...this.state.ivScores, [q.comp]:n}}); }}))};
    });
    const ivN = Object.keys(st.ivScores).length, ivTot = ivQs.length;
    v.ivProgress = ivN + ' of ' + ivTot + ' scored.';
    v.ivNotes = st.ivNotes; v.setIvNotes = e => this.setState({ivNotes:e.target.value});
    v.ivBlocked = ivN < ivTot || st.ivSubmitted; v.ivSubmitBg = (ivN >= ivTot && !st.ivSubmitted) ? G : '#20302680';
    v.ivNotSubmitted = !st.ivSubmitted; v.ivSubmitted = st.ivSubmitted;
    v.submitIv = () => { if (Object.keys(this.state.ivScores).length >= ivTot) this.setState({ivSubmitted:true}); };
    // ===== admin =====
    v.vFunnel = st.aview==='funnel'; v.vPipe = st.aview==='pipe'; v.vProfile = st.aview==='profile'; v.vCompare = st.aview==='compare';
    v.vBank = st.aview==='bank'; v.vWeights = st.aview==='weights'; v.vCalib = st.aview==='calib'; v.vValid = st.aview==='valid';
    v.vRoadmap = st.aview==='roadmap'; v.vSettings = st.aview==='settings';
    v.vSchedule = st.aview === 'schedule'; v.vDecisions = st.aview === 'decisions'; v.vUsers = st.aview === 'users'; v.vInbox = st.aview === 'inbox'; v.vAppReview = st.aview === 'appreview';
    v.goPipe = () => this.setState({aview:'pipe'});
    const total = (D.funnel[0]||{}).n || 1;
    v.funnelRows = D.funnel.map((f, i) => ({label:f.label, n:f.n, pct: Math.round(f.n/total*100)+'%', conv: i===0 ? '100%' : D.funnel[i-1].n ? Math.round(f.n/D.funnel[i-1].n*100)+'% of prior' : '\u2014'}));
    v.roleCards = D.roles;
    v.blind = st.blind; v.toggleBlind = () => this.setState({blind:!st.blind});
    v.blindState = st.blind ? 'on' : 'off'; v.blindColor = st.blind ? GL : '#8FA396';
    const dispName = c => st.blind ? c.anon : c.name;
    v.pipeRows = D.candidates.map(c => {
      const inCmp = st.cmpA===c.id || st.cmpB===c.id;
      const hasData = !!c.comp;
      return {
        dName: dispName(c), dSub: st.blind ? 'details hidden \u00b7 blind review' : (c.loc + ' \u00b7 ' + c.school),
        role: c.role, stageLabel: st.arDone[c.id] || (st.scheduled.find(s => s.candId === c.id) ? 'Combine scheduled · ' + st.scheduled.find(s => s.candId === c.id).when : c.stageLabel),
        stageColor: c.stage>=6 ? GL : c.stage>=5 ? AMB : '#8FA396',
        readiness: c.readiness ? c.readiness.toFixed(1) : '\u2014',
        readColor: c.readiness ? (c.readiness>=4 ? GL : c.readiness>=3 ? '#E9F0EA' : AMB) : '#4A554D',
        agree: c.agree, agreeColor: c.agree==='Flagged' ? AMB : c.agree==='High' ? GL : '#5C6B61',
        openProfile: () => this.setState({profileId:c.id, aview:'profile', dec:{rec:null, note:''}, notesDraft:null, trOpen:false, rpItemsOpen:false}),
        canReview: c.stage === 2 && isMgr && !st.arDone[c.id],
        review: () => this.setState({arId:c.id, aview:'appreview', arRatings:{}, arSaved:''}),
        viewAs: () => this.setState({viewAs:c.id, cview:'dash'}),
        noCmp: !hasData,
        cmpTxt: inCmp ? '\u2713 selected' : 'Compare',
        cmpBg: inCmp ? 'rgba(16,185,129,.14)' : 'transparent',
        cmpFg: !hasData ? '#3A453D' : inCmp ? GL : '#A7B5AB',
        pickCmp: () => { if (!hasData) return; const s=this.state; if (s.cmpA===c.id) this.setState({cmpA:null}); else if (s.cmpB===c.id) this.setState({cmpB:null}); else if (!s.cmpA) this.setState({cmpA:c.id}); else if (!s.cmpB) this.setState({cmpB:c.id}); else this.setState({cmpB:c.id}); }
      };
    });
    const byId = id => D.candidates.find(c => c.id===id);
    v.canCompare = !!(st.cmpA && st.cmpB);
    v.cmpBarTxt = v.canCompare ? (dispName(byId(st.cmpA)) + '  vs  ' + dispName(byId(st.cmpB))) : '';
    v.goCompare = () => this.setState({aview:'compare'});
    v.clearCmp = () => this.setState({cmpA:null, cmpB:null});
    // profile
    const p = byId(st.profileId) || D.candidates[0] || {};
    v.pName = st.blind ? p.anon : p.name;
    v.pSub = (st.blind ? 'blind review on' : (p.loc + ' \u00b7 ' + p.school)) + ' \u00b7 ' + p.role + ' \u00b7 ' + p.stageLabel;
    v.pReadiness = p.readiness ? p.readiness.toFixed(1) : '\u2014';
    v.pHasData = !!p.comp; v.pNoData = !p.comp; v.pStageLabel = p.stageLabel || '';
    const bsAll = st.bankSettings || (B ? Object.fromEntries(B.ROLE_LIST.map(r => [r.id, B.defaultSettings(r)])) : {});
    const reportFor = c => { if (LIVE_ENABLED) return (B && c && c.report) ? {prof: B.ROLES[c.report.profileId] || B.ROLES[profIdFor(c.role)], res: c.report} : null; if (!B || !c || c.sjt == null) return null; const prof = B.ROLES[profIdFor(c.role)]; const tier = c.sjt >= 80 ? 'strong' : c.sjt >= 62 ? 'mixed' : 'weak'; return {prof, res: B.score(prof, B.demoAnswers(prof, tier), bsAll[prof.id] || B.defaultSettings(prof))}; };
    const rp = reportFor(p);
    const sigColor = s => s >= 95 ? G : s >= 70 ? GL : s >= 45 ? '#A7B5AB' : s >= 20 ? AMB : RED;
    const kindLabel = k => ({likert:'Self-rating', pair:'Forced choice', scenario:'Scenario', worst:'Worst move'})[k] || k;
    const evRow = it => ({q:it.q, answer:it.answer, signal:it.signal, score:it.score, best:it.best || '', color: sigColor(it.score), kind: kindLabel(it.kind), why: it.why || '', options: (it.options || []).map(o => ({text:o.text, score:o.score, signal:o.signal, chosen:!!o.chosen, flag:o.flag || '', positive:o.positive || '', color: sigColor(o.score), weight: o.chosen ? '800' : '400'}))});
    v.rpScaleNote = B ? B.SCALE_NOTE : '';
    v.pHasReport = !!rp;
    const bandColor = b => b === 'Strong match' ? G : b === 'Meets profile' ? GL : b === 'Validate in interview' ? AMB : b === 'Below profile' ? '#F0A070' : RED;
    const sevSty = s => s === 'critical' ? {bg:RED, fg:'#04120B'} : s === 'meaningful' ? {bg:AMB, fg:'#04120B'} : {bg:'rgba(160,190,170,.18)', fg:'#D5DED7'};
    if (rp) {
      const r = rp.res;
      v.rpOverall = r.overall; v.rpBand = r.band; v.rpColor = bandColor(r.band); v.rpNote = r.bandNote;
      v.rpProfile = rp.prof.name + ' profile · ' + rp.prof.tag; v.rpProfName = rp.prof.name;
      v.rpScen = r.scenario.answered + '/' + r.scenario.total + ' scenarios · avg ' + r.scenario.avg + ' · ' + r.scenario.elite + ' elite · ' + r.scenario.weak + ' weak';
      v.rpComps = r.comps.map(c => { const col = c.breach ? RED : c.score >= 75 ? G : c.score >= 55 ? '#E9D9B0' : AMB; return {name:c.name, meta:(c.critical ? '★ ' : '') + c.weight + '%' + (c.breach ? ' · below floor ' + c.floor : ''), scoreTxt: c.scored ? String(c.score) : 'off', color: c.scored ? col : '#5C6B61', pct: (c.scored ? c.score : 0) + '%', floorPct: c.floor + '%'}; });
      v.rpFlags = r.redFlags.map(f => ({sev:f.severity, label:f.label, context:f.context, chosen:f.chosen || '', better:f.better || '', why:f.why || '', comp:(rp.prof.competencies[f.comp] || {}).name || f.comp, ...sevSty(f.severity)}));
      v.rpFlagCount = r.redFlags.length; v.rpNoFlags = !r.redFlags.length;
      const compNameOf = k => (rp.prof.competencies[k] || {}).name || k;
      v.rpPositives = r.positives.map(s => ({label:s.label, comp: compNameOf(s.comp), context:s.context || '', chosen:s.chosen || ''})); v.rpPosCount = r.positives.length;
      v.rpConsistency = r.consistency.map(t => typeof t === 'string' ? {t, evidence:[]} : {t:t.t, evidence:(t.evidence || []).map(evRow)}); v.rpNoConsistency = !r.consistency.length;
      v.rpFollowUps = (r.followUps || []).map(f => ({comp:f.comp, q:f.q, why:f.why, reasons:(f.reasons || []).join(' · '), evidence:(f.evidence || []).map(evRow)})); v.rpRefs = r.references;
      // the whole answer trail, grouped by competency, weakest answers first
      v.rpHasEvidence = !!(r.items && r.items.length);
      const groups = {};
      (r.items || []).forEach(it => { (groups[it.compName] = groups[it.compName] || []).push(evRow(it)); });
      v.rpItemGroups = Object.keys(groups).map(name => { const c = r.comps.find(x => x.name === name) || {}; return {name, scoreTxt: c.score != null ? c.score + ' / 100' : '', color: c.breach ? RED : c.score >= 75 ? G : c.score >= 55 ? '#E9D9B0' : AMB, items: groups[name].slice().sort((a, b) => a.score - b.score)}; });
      v.rpItemCount = (r.items || []).length;
      v.rpItemsOpen = !!st.rpItemsOpen; v.toggleItems = () => this.setState({rpItemsOpen: !this.state.rpItemsOpen});
      v.rpItemsBtn = st.rpItemsOpen ? 'Hide the answer trail' : 'Show every answer (' + v.rpItemCount + ')';
    } else { v.rpComps = []; v.rpFlags = []; v.rpPositives = []; v.rpConsistency = []; v.rpFollowUps = []; v.rpRefs = []; v.rpItemGroups = []; v.rpHasEvidence = false; v.rpItemsOpen = false; }
    const lvColors = {High:[GL,'rgba(16,185,129,.12)'], Medium:['#E9D9B0','rgba(245,184,74,.1)'], Low:[AMB,'rgba(245,184,74,.12)'], '\u2014':['#5C6B61','transparent'], 'In review':['#8FA396','rgba(160,190,170,.08)'], Insufficient:['#5C6B61','transparent']};
    if (p.comp) {
      v.pBars = D.comps.map(c => { const val = p.comp[c.id]; const has = val != null; return {name:c.name, valTxt: has ? val.toFixed(1) : '\u2014', valColor: !has ? '#5C6B61' : val>=3.5 ? GL : val>=2.8 ? '#E9F0EA' : AMB, pct: has ? Math.round(val/5*100)+'%' : '0%', fill: val>=3.5 ? 'linear-gradient(90deg,rgba(16,185,129,.5),#10B981)' : 'linear-gradient(90deg,rgba(245,184,74,.4),#F5B84A)'}; });
      v.pStrength = D.weights.filter(w => w.id !== 'wdi').map(w => { const lv = (p.strength||{})[w.id] || '\u2014'; const c = lvColors[lv] || lvColors['\u2014']; return {src: w.id === 'sjt' ? 'Sales decisions (bank)' : w.label, level:lv, color:c[0], bg:c[1]}; });
    } else { v.pBars = []; v.pStrength = []; }
    v.pR1 = p.r1 ? p.r1.toFixed(1) : '\u2014'; v.pR2 = p.r2 ? p.r2.toFixed(1) : '\u2014';
    const pd = (p.r1 && p.r2) ? p.r2-p.r1 : null;
    v.pDelta = pd!=null ? ((pd>=0?'+':'')+pd.toFixed(1)) : '';
    v.pDeltaColor = pd!=null && pd>=0.8 ? GL : pd!=null && pd<=0.2 ? AMB : '#A7B5AB';
    v.pAgreeTxt = 'Evaluator agreement: ' + (p.agree||'\u2014');
    v.pAgreeColor = p.agree==='Flagged' ? AMB : GL;
    v.pStrongest = p.strongest || '\u2014'; v.pConcerns = p.concerns || '\u2014'; v.pOpen = p.open || '\u2014';
    v.pWdi = p.wdi ? ('signal ' + p.wdi + ' / 100') : 'not yet completed';
    const sar = p.sar || {s:'\u2014',a:'\u2014',r:'\u2014',l:'\u2014'};
    v.pSarS = sar.s; v.pSarA = sar.a; v.pSarR = sar.r; v.pSarL = sar.l;
    v.pViewAs = () => this.setState({viewAs:p.id, cview:'dash'});
    v.pGrade = p.callGrade || ''; v.pGradeColor = GRADE_COLOR(p.callGrade); v.pBoardStage = p.stageTxt || '';
    // candidate details — contact, résumé, how they entered the pipeline (visible on every profile, scored or not)
    const dash = x => (x && x !== '\u2014') ? x : '\u2014';
    v.pDetails = [
      {label:'Email', val:dash(p.email)}, {label:'Phone', val:dash(p.phone)}, {label:'Location', val:dash(p.loc)}, {label:'School / organization', val:dash(p.schoolTxt != null ? p.schoolTxt : p.school)},
      {label:'Hiring for', val:dash(p.program)}, {label:'Work authorization', val: p.auth === true ? 'Yes' : p.auth === false ? 'No' : '\u2014'},
      {label:'Entered as', val: p.source === 'manual' ? 'Added manually' : p.track === 'info' ? 'Details-only link' : 'Assessment link'}, {label:'Added', val: p.createdAt ? fmtDate(p.createdAt) : '\u2014'}
    ];
    v.pLinkedin = p.linkedin || ''; v.pLinkedinHref = p.linkedin ? (/^https?:/.test(p.linkedin) ? p.linkedin : 'https://' + p.linkedin) : '';
    v.pResumeName = p.resumeName || ''; v.pHasResume = !!p.resumePath; v.openResume = () => this.openFile(p.id, p.resumePath);
    v.pCaseFile = p.caseFile ? p.caseFile.name : ''; v.openCaseFile = () => { if (p.caseFile) this.openFile(p.id, p.caseFile.path); };
    v.pFileMsg = st.flash['file:' + p.id] || '';
    v.pNotes = st.notesDraft != null ? st.notesDraft : (p.notes || ''); v.setPNotes = e => this.setState({notesDraft:e.target.value}); v.savePNotes = () => this.saveNotes(p.id);
    v.notesDirty = st.notesDraft != null && st.notesDraft !== (p.notes || ''); v.pCanEdit = isMgr && LIVE_ENABLED;
    // transcripts (mock pitch, phone screen, interview) — stored for evaluators; advisory AI read when switched on
    const allTr = (LIVE_ENABLED && this.live.view) ? (this.live.view.transcripts || []) : [];
    const trRow = t => { const rv = t.review || {}; const show = !!st.trShow[t.id]; return {id:t.id, kind:t.kind, title:t.title || t.kind, meta: t.t + ' · ' + t.by + (t.source ? ' · ' + t.source : ''), txt:t.txt, show, toggle: () => this.setState({trShow:{...this.state.trShow, [t.id]:!show}}), toggleTxt: show ? 'Hide transcript' : 'Read the transcript',
      hasReview: t.status === 'done' && !!rv.summary, statusTxt: t.status === 'done' ? (/^First call/i.test(t.kind || '') ? 'First-call evaluation · advisory — leadership decides' : 'AI-assisted read · advisory — evaluators decide') : t.status === 'off' ? 'No AI evaluation (key not set) — read it directly' : t.status === 'failed' ? 'Evaluation failed' + (rv.error ? ': ' + rv.error : '') : t.status === 'pending' ? 'Evaluation in progress…' : '',
      statusColor: t.status === 'done' ? GL : t.status === 'failed' ? AMB : '#7E9186',
      summary: rv.summary || '', comps: (rv.competencies || []).map(c => ({name:c.name || c.id, rating: c.rating != null ? c.rating + ' / 5' : 'no evidence', color: c.rating == null ? '#5C6B61' : c.rating >= 4 ? GL : c.rating >= 3 ? '#E9F0EA' : AMB, quotes:(c.evidence || []).slice(0, 2).map(e => ({quote:e.quote || '', note:e.note || ''})), note:c.note || ''})),
      strengths: rv.strengths || [], concerns: rv.concerns || [], followUps: rv.followUps || [], caution: rv.caution || '',
      isCall: /^First call/i.test(t.kind || ''), grade: t.grade || rv.grade || '', gradeColor: GRADE_COLOR(t.grade || rv.grade), bullets: rv.bullets || [], covered: rv.alreadyCovered || [], askNext: rv.askNext || [], gradeRationale: rv.gradeRationale || '', screenerNotes: t.notes || rv.screenerNotes || ''}; };
    v.pTranscripts = allTr.filter(t => t.candId === p.id).map(trRow);
    v.trEnabled = LIVE_ENABLED && isMgr; v.trOpen = !!st.trOpen; v.toggleTr = () => this.setState({trOpen: !this.state.trOpen, tr:{...this.state.tr, msg:''}});
    v.trKinds = TR_KINDS.map(k => ({id:k, label:k})); v.trKind = st.tr.kind; v.trTitle = st.tr.title; v.trTxt = st.tr.txt; v.trFileName = st.tr.fileName; v.trMsg = st.tr.msg || '';
    v.trMsgColor = /^Could not|^Paste/.test(st.tr.msg || '') ? AMB : GL;
    v.setTrKind = e => this.setState({tr:{...this.state.tr, kind:e.target.value}}); v.setTrTitle = e => this.setState({tr:{...this.state.tr, title:e.target.value}}); v.setTrTxt = e => this.setState({tr:{...this.state.tr, txt:e.target.value, msg:''}});
    v.pickTrFile = e => this.readTranscriptFile(e); v.submitTr = () => this.submitTranscript(p.id);
    v.trBusy = st.busy === 'tr'; v.trOk = st.tr.txt.trim().length >= 200 && st.busy !== 'tr'; v.trBtnBg = v.trOk ? G : '#20302680';
    v.trCount = st.tr.txt.trim().length ? st.tr.txt.trim().length.toLocaleString() + ' characters' : '';
    v.trNotes = st.tr.notes || ''; v.setTrNotes = e => this.setState({tr:{...this.state.tr, notes:e.target.value}});
    v.trIsCall = /^First call/i.test(st.tr.kind || '');
    v.trNotesLabel = v.trIsCall ? 'Your initial read \u2014 folded into the executive summary and weighed in the grade' : 'Your notes (optional) \u2014 stored with the transcript';
    // the instructions the first-call evaluation follows; managers can rewrite them here or in Settings
    const callPrompt = st.callEvalPrompt || DEFAULT_CALL_PROMPT;
    v.callPrompt = callPrompt; v.callPromptIsDefault = !st.callEvalPrompt || st.callEvalPrompt === DEFAULT_CALL_PROMPT;
    v.setCallPrompt = e => this.setState({callEvalPrompt:e.target.value});
    v.resetCallPrompt = () => this.setState({callEvalPrompt:DEFAULT_CALL_PROMPT});
    v.promptOpen = !!st.promptOpen; v.togglePrompt = () => this.setState({promptOpen:!this.state.promptOpen});
    v.promptBtn = st.promptOpen ? 'Hide the evaluation instructions' : 'Edit the evaluation instructions';
    const allDecisions = [...st.decisions, ...(D.decisions || [])];
    const pDec = allDecisions.find(d => d.candId === p.id);
    v.decRecorded = !!pDec; v.decEditable = !pDec && isMgr; v.decReadOnly = !pDec && !isMgr;
    v.decRoleTag = isMgr ? 'Hiring manager · Admin' : 'Read-only';
    v.decLabel = pDec ? pDec.decision : ''; v.decMeta = pDec ? (pDec.t + ' · ' + pDec.by) : ''; v.decRationale = pDec ? pDec.rationale : '';
    v.decColor = pDec ? (pDec.decision === 'Advance' ? G : pDec.decision === 'Hold' ? AMB : RED) : 'transparent';
    v.pRecBtns = ['Advance','Hold','Do Not Advance'].map(r => ({label:r,
      bg: st.dec.rec===r ? (r==='Advance'?G:r==='Hold'?AMB:RED) : 'transparent',
      fg: st.dec.rec===r ? '#04120B' : (r==='Advance'?GL:r==='Hold'?AMB:RED),
      border: r==='Advance'?'rgba(16,185,129,.4)':r==='Hold'?'rgba(245,184,74,.4)':'rgba(248,113,113,.4)',
      on: () => this.setState({dec:{...this.state.dec, rec:r}})}));
    v.decNote = st.dec.note; v.setDecNote = e => this.setState({dec:{...this.state.dec, note:e.target.value}});
    const decOk = !!st.dec.rec && st.dec.note.trim().length > 20;
    v.decBlocked = !decOk; v.decBtnBg = decOk ? G : '#20302680';
    v.recordDecision = () => { const d = this.state.dec; if (!d.rec || d.note.trim().length <= 20) return; const entry = {candId:p.id, cand:p.name, role:p.role, decision:d.rec, by:(user ? user.short : 'Staff') + ' (' + roleLabel(st.role) + ')', t:'Today ' + new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'}), rationale:d.note.trim(), agree:p.agree || '—'}; this.setState({decisions:[entry, ...this.state.decisions], dec:{rec:null, note:''}}); };
    v.decisionRows = allDecisions.map(d => ({...d, bg: d.decision === 'Advance' ? G : d.decision === 'Hold' ? AMB : RED}));
    // compare
    const ca = byId(st.cmpA) || byId('dana') || D.candidates[0] || {}, cb = byId(st.cmpB) || byId('marcus') || D.candidates[1] || D.candidates[0] || {};
    v.cmpAName = dispName(ca); v.cmpBName = dispName(cb);
    v.cmpARead = ca.readiness ? ca.readiness.toFixed(1) : '\u2014'; v.cmpBRead = cb.readiness ? cb.readiness.toFixed(1) : '\u2014';
    v.cmpASub = ca.stageLabel; v.cmpBSub = cb.stageLabel;
    v.cmpAStrong = ca.strongest; v.cmpBStrong = cb.strongest;
    v.cmpAConcern = ca.concerns; v.cmpBConcern = cb.concerns;
    v.cmpRows = D.comps.map(c => { const a = (ca.comp||{})[c.id], b = (cb.comp||{})[c.id]; return {name:c.name, aTxt: a!=null ? a.toFixed(1) : '\u2014', bTxt: b!=null ? b.toFixed(1) : '\u2014', aPct: a!=null ? Math.round(a/5*100)+'%' : '0%', bPct: b!=null ? Math.round(b/5*100)+'%' : '0%'}; });
    // sales-decisions scoring settings (per profile; follows the rubric role chip)
    const bkPid = profIdFor(st.weightsRole), bkP = B ? B.ROLES[bkPid] : null;
    const bkS = bkP ? (bsAll[bkPid] || B.defaultSettings(bkP)) : null;
    const setBk = patch => this.setState({bankSettings:{...bsAll, [bkPid]: {...bkS, ...patch}}});
    v.bkProfName = bkP ? bkP.name : ''; v.bkProfTag = bkP ? (bkP.tag + '. ' + bkP.blurb) : '';
    v.bkReset = () => { if (bkP) this.setState({bankSettings:{...bsAll, [bkPid]: B.defaultSettings(bkP)}}); };
    const TH = [['strongPass','Strong match \u2265'],['pass','Meets profile \u2265'],['flag','Validate \u2265'],['fail','Below profile \u2265']];
    v.bkThresh = bkS ? TH.map(([k, label]) => ({label, val: bkS.thresholds[k], set: e => setBk({thresholds:{...bkS.thresholds, [k]: parseInt(e.target.value, 10) || 0}})})) : [];
    v.bkCompRows = bkP ? Object.entries(bkP.competencies).map(([k, c]) => ({name:c.name, w: bkS.weights[k], floor: bkS.floors[k],
      setW: e => setBk({weights:{...bkS.weights, [k]: parseInt(e.target.value, 10)}}), setFloor: e => setBk({floors:{...bkS.floors, [k]: parseInt(e.target.value, 10)}}),
      critTxt: bkS.critical[k] ? '\u2605 critical' : 'standard', critBg: bkS.critical[k] ? 'rgba(248,113,113,.14)' : 'transparent', critFg: bkS.critical[k] ? RED : '#8FA396', toggleCrit: () => setBk({critical:{...bkS.critical, [k]: !bkS.critical[k]}}),
      scoredTxt: bkS.scored[k] ? 'on' : 'off', scoredBg: bkS.scored[k] ? 'rgba(16,185,129,.14)' : 'transparent', scoredFg: bkS.scored[k] ? GL : '#8FA396', toggleScored: () => setBk({scored:{...bkS.scored, [k]: !bkS.scored[k]}})})) : [];
    v.bkWSum = bkS ? Object.entries(bkS.weights).filter(([k]) => bkS.scored[k]).reduce((a, [, w]) => a + w, 0) + '%' : '';
    v.bkProfChips = (B ? B.ROLE_LIST : []).map(r => ({label:r.name, on: () => { const role = Object.keys(D.profileByRole || {}).find(k => D.profileByRole[k] === r.id) || this.state.weightsRole; this.setState({weightsRole:role, bankItemId:null, bankDraft:null, bankSaved:''}); }, bg: bkPid === r.id ? 'rgba(16,185,129,.14)' : 'transparent', fg: bkPid === r.id ? GL : '#8FA396'}));
    // question bank — every scored scenario / worst-move item of the selected profile with its rubric and rationale; scores, labels, wording, and rationale are editable
    const bkEdits = editsFor(bkPid) || {};
    const bkRole = bkP ? B.applyEdits(bkP, bkEdits) : null;
    const bankItems = bkRole ? [...bkRole.scenarios, ...bkRole.worst] : [];
    const bankSelId = bankItems.some(q => q.id === st.bankItemId) ? st.bankItemId : (bankItems[0] || {}).id;
    const bq = bankItems.find(q => q.id === bankSelId) || null;
    v.bankList = bankItems.map((q, i) => ({num: String(i + 1).padStart(2, '0'), title: ((bkRole.competencies[q.comp] || {}).name || q.comp) + ' \u00b7 ' + q.id.toUpperCase(), ver: q.kind === 'worst' ? 'worst move' : 'scenario', edited: !!bkEdits[q.id], bg: q.id === bankSelId ? 'rgba(16,185,129,.08)' : '#0F1611', border: q.id === bankSelId ? 'rgba(16,185,129,.4)' : 'rgba(160,190,170,.13)', pick: () => this.setState({bankItemId:q.id, bankDraft:null, bankSaved:''})}));
    const draft = (st.bankDraft && bq && st.bankDraft.id === bq.id) ? st.bankDraft : null;
    const cur = bq ? (draft || {id:bq.id, text:bq.text, why:B.whyFor(bkRole, bq), opts:bq.opts.map(o => ({text:o.text, score:o.score, flag:o.flag || '', positive:o.positive || ''}))}) : null;
    const setDraft = fn => { const d = JSON.parse(JSON.stringify(cur)); fn(d); this.setState({bankDraft:d, bankSaved:''}); };
    v.bankTitle = bq ? ((bkRole.competencies[bq.comp] || {}).name || bq.comp) + ' \u00b7 ' + bq.id.toUpperCase() : '';
    v.bankKind = bq ? (bq.kind === 'worst' ? 'Worst move \u2014 the candidate picks the most damaging action; the score is for how well they spotted it.' : 'Scenario \u2014 the candidate picks what they would actually do.') : '';
    v.bankIsWorst = !!(bq && bq.kind === 'worst');
    v.bankEdited = !!(bq && bkEdits[bq.id]); v.bankDirty = !!draft;
    v.bankStem = cur ? cur.text : ''; v.setBankStem = e => setDraft(d => { d.text = e.target.value; });
    v.bankWhy = cur ? cur.why : ''; v.setBankWhy = e => setDraft(d => { d.why = e.target.value; });
    v.bankOpts = cur ? cur.opts.map((o, i) => ({letter:'ABCD'[i], text:o.text, score:String(o.score), signal: B.SIGNAL(Number(o.score) || 0), color: sigColor(Number(o.score) || 0), flag:o.flag, positive:o.positive,
      setText: e => setDraft(d => { d.opts[i].text = e.target.value; }), setScore: e => setDraft(d => { d.opts[i].score = e.target.value; }), setFlag: e => setDraft(d => { d.opts[i].flag = e.target.value; }), setPositive: e => setDraft(d => { d.opts[i].positive = e.target.value; })})) : [];
    v.bankScaleNote = B ? B.SCALE_NOTE : '';
    v.saveBank = () => { if (!draft || !bq) return; const clean = {text: draft.text, why: draft.why, opts: draft.opts.map(o => ({text:o.text, score: Math.max(0, Math.min(100, Math.round(Number(o.score) || 0))), flag:o.flag || '', positive:o.positive || ''}))}; const all = {...(this.state.bankEdits || {})}; all[bkPid] = {...(all[bkPid] || {}), [bq.id]: clean}; this.setState({bankEdits:all, bankDraft:null, bankSaved:'Saved \u2014 applies to every candidate scored from now on. Reports already on file keep their numbers until you re-score them from the profile.'}); };
    v.revertBank = () => { if (!bq) return; const all = {...(this.state.bankEdits || {})}; const forP = {...(all[bkPid] || {})}; delete forP[bq.id]; all[bkPid] = forP; this.setState({bankEdits:all, bankDraft:null, bankSaved:'Reverted to the original wording and scores.'}); };
    v.bankSavedNote = st.bankSaved || '';
    v.bankCanEdit = isAdminRole;
    // weights
    const WBR = st.weightsByRole || D.weightsByRole || {};
    const wcur = WBR[st.weightsRole] || {};
    const wsum = Object.values(wcur).reduce((a,b)=>a+b,0);
    v.wSum = wsum; v.wSumColor = wsum===100 ? GL : AMB;
    v.wNote = wsum===100 ? 'Weights sum to 100% for ' + st.weightsRole + '. Sales decisions count once, as one source. Each role publishes its own rubric version; cohorts lock to it.' : '⚠ Weights must sum to 100% before publishing — currently ' + wsum + '%.';
    v.wRoleChips = Object.keys(WBR).map(r => ({label:r, on: () => this.setState({weightsRole:r}), bg: st.weightsRole === r ? 'rgba(16,185,129,.14)' : 'transparent', fg: st.weightsRole === r ? GL : '#8FA396'}));
    v.wRows = D.weights.filter(w => w.id !== 'wdi').map(w => ({label: w.id === 'sjt' ? 'Sales decisions (self-report + scenarios)' : w.label, val: w.id === 'sjt' ? (wcur.sjt ?? 0) + (wcur.wdi ?? 0) : (wcur[w.id] ?? 0), set: e => { const all = {...(this.state.weightsByRole || D.weightsByRole || {})}; const rk = this.state.weightsRole; all[rk] = {...(all[rk] || {}), [w.id]: parseInt(e.target.value,10), ...(w.id === 'sjt' ? {wdi:0} : {})}; this.setState({weightsByRole:all}); }}));
    v.mHead = D.comps.map(c => c.name.split(' ')[0].slice(0,6));
    v.mRows = D.weights.filter(w => w.id !== 'wdi').map(w => ({label: w.id === 'sjt' ? 'Sales decisions (bank)' : w.label, cells: D.comps.map(c => { const on = w.comps.includes(c.id); return {mark: on ? '\u25cf' : '', bg: on ? 'rgba(16,185,129,.1)' : '#0B120E', border: on ? 'rgba(16,185,129,.3)' : 'rgba(160,190,170,.07)'}; })}));
    // calibration
    v.calRows = [
      {name:'J. Whitfield', avg:'3.8', note:'skews +0.4 lenient', color:AMB},
      {name:'R. Delgado', avg:'3.1', note:'within norm', color:GL},
      {name:'S. Park', avg:'3.4', note:'within norm', color:GL}
    ];
    v.calNote = ''; v.calFlagsEmpty = false;
    v.calFlags = [
      {open:true, title:'Marcus Reeves \u2014 Self-Accountability', e1:'J. Whitfield', s1:'4.0', e2:'R. Delgado', s2:'2.0', delta:'2.0', note:'Delgado cites the interview: \u201cattributed the missed Q3 target entirely to territory; named no personal change when asked twice.\u201d Whitfield weighted the polished simulation more heavily.'},
      {open:false, title:'Dana Okafor \u2014 all competencies within 0.5'}
    ];
    v.fairNote = '';
    // validation
    v.vPeriods = [['d30','30 days'],['d60','60 days'],['d90','90 days'],['d180','180 days'],['y1','1 year']].map(pp => ({label:pp[1], off: pp[0]==='d180'||pp[0]==='y1', on: () => this.setState({vPeriod:pp[0]}), bg: st.vPeriod===pp[0] ? 'rgba(16,185,129,.14)' : 'transparent', fg: (pp[0]==='d180'||pp[0]==='y1') ? '#3A453D' : st.vPeriod===pp[0] ? GL : '#8FA396'}));
    const hires = D.hires.map(h => { const ov = st.ocRows[h.name]; return ov ? {...h, ...ov} : h; });
    v.vRows = hires.map(h => { const d = h[st.vPeriod] || {}; const f = x => x==null ? '\u2014' : x; return {name:h.name, readiness: h.readiness != null ? h.readiness.toFixed(1) : '\u2014', dials:f(d.dials), mtgs:f(d.mtgs), pipe:f(d.pipe), rev:f(d.rev), crm: d.crm!=null ? d.crm+'%' : '\u2014', mgr:f(d.mgr), coach:f(d.coach), ret:f(d.ret)}; });
    v.canRecord = isMgr;
    v.outcomeOpen = st.oc.open; v.outcomeBtnTxt = st.oc.open ? 'Close' : 'Record outcomes';
    v.toggleOutcome = () => this.setState({oc:{...this.state.oc, open:!this.state.oc.open, saved:''}});
    v.ocHire = st.oc.hire; v.setOcHire = e => this.setState({oc:{...this.state.oc, hire:e.target.value, saved:''}});
    v.ocPeriod = st.oc.period; v.setOcPeriod = e => this.setState({oc:{...this.state.oc, period:e.target.value, saved:''}});
    const OCF = [['dials','Dials / wk','e.g. 195'],['mtgs','Meetings','e.g. 10'],['pipe','Pipeline','e.g. $64K'],['rev','Revenue','e.g. $18K'],['crm','CRM %','e.g. 94'],['mgr','Mgr rating 1–5','e.g. 4.2']];
    v.ocFields = OCF.map(f => ({label:f[1], ph:f[2], val: st.oc.vals[f[0]] || '', set: e => this.setState({oc:{...this.state.oc, vals:{...this.state.oc.vals, [f[0]]:e.target.value}, saved:''}})}));
    v.saveOutcome = () => { const o = this.state.oc, vv = o.vals; const num = x => (x === undefined || x === '') ? null : (isNaN(Number(x)) ? x : Number(x)); const m = Number(vv.mgr); const row = {dials:num(vv.dials), mtgs:num(vv.mtgs), pipe:vv.pipe || null, rev:vv.rev || null, crm:num(vv.crm), mgr:num(vv.mgr), coach: vv.mgr ? (m >= 4 ? 'Strong' : m >= 3 ? 'Moderate' : 'Weak') : null, ret:'Active'}; this.setState({ocRows:{...this.state.ocRows, [o.hire]:{...(this.state.ocRows[o.hire] || {}), [o.period]:row}}, oc:{...o, vals:{}, saved:'Saved — ' + o.hire + ' · ' + o.period.replace('d','') + ' days.'}, vPeriod:o.period}); };
    v.ocSaved = st.oc.saved;
    v.ocHireOpts = D.hires.map(h => h.name);
    // roadmap
    v.roadmap = [
      {phase:'Phase 1 \u00b7 wk 1\u20134', title:'Foundations', body:'Production authentication (SSO for staff, magic links for candidates), Supabase schema (candidates, stages, submissions, scores, versions, audit log), secure file & video storage with signed URLs, candidate-consent language reviewed by counsel.'},
      {phase:'Phase 2 \u00b7 wk 5\u20138', title:'Assessment engine', body:'Email invitations and reminders, interview scheduling integration (Google/Outlook), evaluator independence enforcement server-side, version-locked question bank, accommodation request routing.'},
      {phase:'Phase 3 \u00b7 wk 9\u201312', title:'Compliance & validation', body:'Employment-law review of all items and flows, I/O-psychologist review of competencies, anchors, and the work-drive inventory; adverse-impact monitoring pipeline; security review and pen test.'},
      {phase:'Phase 4 \u00b7 wk 13+', title:'Pilot & iterate', body:'Pilot with one hiring campaign, calibration training for evaluators, analytics on funnel and evaluator behavior, outcome tracking at 30/60/90/180/365 days. No predictive claims until formal validation completes (n \u2265 25).'}
    ];
    // settings
    v.retention = st.retention; v.setRetention = e => this.setState({retention:e.target.value});
    // operational lists: schools / properties and pipeline stages (drafts commit on blur so newlines can be typed)
    const schoolsList = st.schools || DEFAULT_SCHOOLS, stagesList = st.taStages || DEFAULT_TA_STAGES;
    const parseLines = t => String(t || '').split('\n').map(x => x.trim()).filter(Boolean).filter((x, i, a) => a.indexOf(x) === i);
    v.schoolsTxt = st.schoolsDraft != null ? st.schoolsDraft : schoolsList.join('\n'); v.setSchoolsTxt = e => this.setState({schoolsDraft:e.target.value}); v.commitSchools = () => { if (this.state.schoolsDraft == null) return; this.setState({schools:parseLines(this.state.schoolsDraft), schoolsDraft:null}); };
    v.stagesTxt = st.stagesDraft != null ? st.stagesDraft : stagesList.join('\n'); v.setStagesTxt = e => this.setState({stagesDraft:e.target.value}); v.commitStages = () => { if (this.state.stagesDraft == null) return; const l = parseLines(this.state.stagesDraft); this.setState({taStages: l.length ? l : DEFAULT_TA_STAGES, stagesDraft:null}); };
    v.remindNow = () => this.remindNow(); v.remindMsg = st.remindMsg || ''; v.canRemind = LIVE_ENABLED && isMgr;
    v.settingsEditable = isAdminRole || isLead || isMgr; v.canEditCore = isAdminRole || isLead;
    v.auditRows = [...st.decisions.map(d => ({t:d.t, who:d.by, what:'Recorded decision: ' + d.decision + ' — ' + d.cand})), ...D.audit];
    v.roleTable = Object.keys(roleDefs).map(r => ({label:roleDefs[r].label, d:roleDefs[r].d})).concat([{label:'Candidate', d:'Own assessment only, through a personal expiring link. Never sees scores, evaluator names, anchors, versions, or other candidates.'}]);
    v.fairLocked = !isLead; v.fairOpen = isLead;
    v.fairRows = [
      {stage:'Applied \u2192 RJP acknowledged', a:'82%', b:'81%'},
      {stage:'RJP \u2192 application reviewed', a:'53%', b:'52%'},
      {stage:'Review \u2192 SJT + inventory', a:'64%', b:'63%'},
      {stage:'SJT \u2192 combine invited', a:'44%', b:'43%'}
    ];
    // application review
    const arC = byId(st.arId) || byId('sofia') || {};
    const arAns = (D.applications || {})[arC.id] || [];
    v.arName = dispName(arC); v.arSub = (st.blind ? 'blind review on' : (arC.loc + ' · ' + arC.school)) + ' · ' + arC.role + ' · submitted Tue';
    const LV = ['Specific & quantified','Partial','Vague'];
    v.arItems = D.evQs.map((q, i) => { const r = st.arRatings[i]; return {num:'Q' + (i + 1), q, ans: arAns[i] || 'No answer on file.', btns: LV.map((l, k) => { const col = k === 0 ? G : k === 1 ? '#E9D9B0' : AMB; const on = r === k; return {label:l, on: () => this.setState({arRatings:{...this.state.arRatings, [i]:k}, arSaved:''}), bg: on ? col : 'transparent', fg: on ? '#04120B' : col, border: on ? col : 'rgba(160,190,170,.2)'}; })}; });
    const arVals = Object.values(st.arRatings), nRated = arVals.length, arAll = nRated >= D.evQs.length;
    const arScore = nRated ? arVals.reduce((a, b) => a + (2 - b), 0) / nRated : 0;
    const arLv = arScore >= 1.5 ? 'High' : arScore >= 0.8 ? 'Medium' : 'Low';
    v.arLevel = arAll ? arLv : nRated + ' / ' + D.evQs.length; v.arLevelColor = !arAll ? '#8FA396' : arLv === 'High' ? GL : arLv === 'Medium' ? '#E9D9B0' : AMB;
    v.arSummary = st.arDone[arC.id] ? 'Recorded: ' + st.arDone[arC.id] + '.' : arAll ? 'Evidence rating ' + arLv + ' — counts 5% toward readiness. Advancing unlocks the inventory and scenarios for the candidate.' : 'Rate all five answers to unlock the stage decision.';
    v.arBlocked = !arAll || !!st.arDone[arC.id]; v.arBtnBg = (arAll && !st.arDone[arC.id]) ? G : '#20302680';
    v.arAdvance = () => { if (!arAll || this.state.arDone[arC.id]) return; this.setState({arDone:{...this.state.arDone, [arC.id]:'Advanced to Stage 3 · evidence ' + arLv}, arSaved:'Advanced — Stage 3 unlock email sent.'}); };
    v.arHold = () => { if (!arAll || this.state.arDone[arC.id]) return; this.setState({arDone:{...this.state.arDone, [arC.id]:'Not advanced · application stage'}, arSaved:'Recorded — standard decision message queued; add rationale in the decision log.'}); };
    v.arSaved = st.arSaved;
    // schedule a combine — any candidate without a session can be scheduled; those who finished the assessment sort first
    const sessSeed = D.sessions || [];
    const noSession = c => !c.hasSession && !sessSeed.some(s => s.candId === c.id) && !st.scheduled.some(s => s.candId === c.id);
    const assessed = c => !!(c.done && c.done.s3) || c.stage >= 4;
    const schedCands = D.candidates.filter(c => noSession(c) && !c.withdrawn && !c.rec).sort((a, b) => (assessed(b) ? 1 : 0) - (assessed(a) ? 1 : 0));
    const readyTxt = c => assessed(c) ? 'assessment complete' : (c.stageLabel || 'assessment pending').toLowerCase();
    v.schCandOpts = schedCands.length ? schedCands.map(c => ({id:c.id, label: dispName(c) + ' · ' + c.role + ' · ' + readyTxt(c)})) : [{id:'', label:'No candidates without a session'}];
    v.schReadyCount = schedCands.filter(assessed).length; v.schOtherCount = schedCands.length - v.schReadyCount;
    const setS = k => e => this.setState({sch:{...this.state.sch, [k]:e.target.value, sent:'', msg:'', warn:[]}});
    v.schCand = st.sch.cand; v.setSchCand = setS('cand'); v.schDate = st.sch.date || ''; v.setSchDate = setS('date'); v.schTime = st.sch.time || ''; v.setSchTime = setS('time');
    v.schTz = st.sch.tz || 'America/Chicago'; v.setSchTz = setS('tz'); v.tzOptions = TZ_OPTIONS.map(([id, label]) => ({id, label}));
    v.schDur = String(st.sch.dur || 60); v.setSchDur = e => this.setState({sch:{...this.state.sch, dur: parseInt(e.target.value, 10) || 60, sent:'', msg:'', warn:[]}}); v.durOptions = [45, 60, 75, 90].map(n => ({id:String(n), label:n + ' minutes'}));
    const tzShort = TZ_SHORT[st.sch.tz] || 'CT';
    v.schWhenPreview = whenTxt(st.sch.date, st.sch.time, tzShort);
    const evalUsers = users.filter(u => u.roles.includes('evaluator') && !st.deactivated[u.id]);
    v.evalOpts = evalUsers.map(u => ({id:u.id, label:u.short + ' · ' + u.title}));
    v.schE1 = st.sch.e1; v.setSchE1 = setS('e1'); v.schE2 = st.sch.e2; v.setSchE2 = setS('e2');
    const schC = schedCands.find(c => c.id === st.sch.cand);
    v.schLink = schC ? 'meet.peaksportsmgmt.com/combine-' + schC.anon.replace('Candidate #','') : '—';
    const sameEval = st.sch.e1 === st.sch.e2;
    const schOk = !!schC && !sameEval && (st.sch.date || '').trim() && (st.sch.time || '').trim() && st.busy !== 'sch';
    v.schWarn = st.sch.sent ? 'Invites sent — candidate portal updated; calendar holds placed for both evaluators.' : sameEval ? '⚠ Two different evaluators are required — independent scoring is the point.' : !schC ? 'Pick a candidate who has no session yet.' : !assessed(schC) ? 'This candidate has not finished the assessment yet. You can still schedule — the scouting report lands when they finish.' : '';
    v.schWarnColor = st.sch.sent ? GL : sameEval ? AMB : !schC ? '#5C6B61' : !assessed(schC) ? '#E9D9B0' : '#5C6B61';
    v.schMsg = st.sch.msg || ''; v.schWarnings = st.sch.warn || [];
    v.schBlocked = !schOk; v.schBtnBg = schOk ? G : '#20302680';
    const uShort = id => (users.find(u => u.id === id) || {}).short || id;
    v.sendSchedule = () => { const s = this.state.sch; const c = schedCands.find(x => x.id === s.cand); if (!c || s.e1 === s.e2) return; const entry = {candId:c.id, cand:c.name, when:whenTxt(s.date, s.time, tzShort), evals:uShort(s.e1) + ' + ' + uShort(s.e2), link:(s.link || '').trim() || 'meet.peaksportsmgmt.com/combine-' + c.anon.replace('Candidate #',''), ver:'v1.2', status:'Invites sent'}; const next = schedCands.filter(x => x.id !== c.id)[0]; this.setState({scheduled:[entry, ...this.state.scheduled], sch:{...s, cand: next ? next.id : '', sent:'yes', msg:'Session saved (demo) — in live mode the candidate and both evaluators are emailed, and a Google Calendar invite goes out when the calendar is connected.', warn:[]}}); };
    v.schedList = [...st.scheduled, ...sessSeed.map(s => ({...s, status: s.status || 'Confirmed'}))];
    // ===== pipeline board (Jobs tab): one column per stage, one board per role + school =====
    const stageNames = stagesList;
    const demoJobs = () => { const m = {}; D.candidates.forEach(c => { const k = c.role + '|' + (c.program || ''); if (!m[k]) m[k] = {id:k, title:c.role, program:c.program || '', label:c.role + (c.program ? ' \u00b7 ' + c.program : ''), status:'Open', shareEnabled:true, applyEnabled:true, shareLink:'', applyLink:'', n:0}; m[k].n++; }); return Object.values(m); };
    const jobs = LIVE_ENABLED ? (D.jobs || []) : demoJobs();
    const jobOf = c => LIVE_ENABLED ? c.jobId : (c.role + '|' + (c.program || ''));
    const selJobId = jobs.some(j => j.id === st.board.job) ? st.board.job : (jobs[0] || {}).id;
    const selJob = jobs.find(j => j.id === selJobId) || null;
    v.vBoard = st.aview === 'board';
    v.boardJobs = jobs.map(j => ({id:j.id, label:j.label, n:j.n, status:j.status, on: () => this.setState({board:{...this.state.board, job:j.id, msg:''}}), bg: j.id === selJobId ? 'rgba(16,185,129,.14)' : 'transparent', fg: j.id === selJobId ? GL : '#8FA396', border: j.id === selJobId ? 'rgba(16,185,129,.45)' : 'rgba(160,190,170,.2)'}));
    v.boardEmpty = jobs.length === 0; v.boardIsMgr = isMgr; v.boardLive = LIVE_ENABLED;
    v.boardTitle = selJob ? selJob.title : ''; v.boardProgram = selJob ? (selJob.program || 'No school / property set') : ''; v.boardStatus = selJob ? selJob.status : 'Open';
    v.boardShareLink = selJob ? selJob.shareLink : ''; v.boardApplyLink = selJob ? selJob.applyLink : '';
    v.boardShareOn = !!(selJob && selJob.shareEnabled); v.boardApplyOn = !!(selJob && selJob.applyEnabled);
    v.copyShare = () => { if (selJob) this.copyBoardLink(selJob.shareLink); }; v.copyApply = () => { if (selJob) this.copyBoardLink(selJob.applyLink); };
    v.toggleShare = () => { if (selJob) this.toggleJobFlag(selJob, 'share_enabled', !selJob.shareEnabled); }; v.toggleApply = () => { if (selJob) this.toggleJobFlag(selJob, 'apply_enabled', !selJob.applyEnabled); };
    v.jobStatusOpts = ['Open', 'Paused', 'Filled', 'Closed'].map(s => ({id:s, label:s})); v.setJobStatus = e => { if (selJob) this.setJobStatus(selJob, e.target.value); };
    v.boardMsg = st.board.msg || st.flash.board || '';
    const stageOf = c => (!LIVE_ENABLED && st.taLocal[c.id]) || c.stageTxt || c.taStage || (c.stage >= 6 ? 'Offer' : c.stage >= 5 ? 'Combine' : c.stage >= 4 ? 'Assessment' : 'Applied');
    const daysSince = iso => { if (!iso) return ''; const d = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5); return isNaN(d) ? '' : d <= 0 ? 'today' : d + 'd'; };
    const jobCands = D.candidates.filter(c => selJob && jobOf(c) === selJob.id);
    const card = c => { const stg = stageOf(c); return {id:c.id, name: dispName(c), sub: [c.loc && c.loc !== '\u2014' ? c.loc : '', (c.assessmentDone || (c.done && c.done.s3)) ? 'assessment done' : (c.opened ? 'in assessment' : (c.inviteSent ? 'link sent' : ''))].filter(Boolean).join(' \u00b7 '), grade: c.callGrade || '', gradeColor: GRADE_COLOR(c.callGrade), band: c.report ? c.report.band : '', days: daysSince(c.stageChangedAt || c.createdAt), auto: LIVE_ENABLED ? !!c.stageAuto : !st.taLocal[c.id], stage: stg, stageOpts: stageNames.map(s => ({id:s, label:s})), move: e => this.moveStage(c.id, e.target.value), openProfile: () => this.setState({profileId:c.id, aview:'profile', dec:{rec:null, note:''}, notesDraft:null, trOpen:false, rpItemsOpen:false}), withdrawn: !!c.withdrawn}; };
    v.boardCols = stageNames.map(s => { const cards = jobCands.filter(c => stageOf(c) === s).map(card); return {name:s, n:cards.length, cards, dim: /not moving|declined|rejected/i.test(s)}; });
    const strays = jobCands.filter(c => !stageNames.includes(stageOf(c))).map(card);
    v.boardStrays = strays; v.hasStrays = strays.length > 0; v.boardTotal = jobCands.length;
    v.boardUnassigned = LIVE_ENABLED ? D.candidates.filter(c => !c.jobId).map(c => ({id:c.id, name:dispName(c), sub:c.role + (c.program ? ' \u00b7 ' + c.program : ''), jobOpts:[{id:'', label:'Assign to a job\u2026'}, ...jobs.map(j => ({id:j.id, label:j.label}))], assign: e => { if (e.target.value) this.assignJob(c.id, e.target.value); }})) : [];
    v.hasUnassigned = v.boardUnassigned.length > 0;
    const nb = st.board;
    v.boardNewOpen = !!nb.open; v.toggleNewJob = () => this.setState({board:{...this.state.board, open:!this.state.board.open, msg:''}});
    v.nbRole = nb.newRole; v.setNbRole = e => this.setState({board:{...this.state.board, newRole:e.target.value}});
    v.nbProgramOpts = [{id:'', label:'School / property\u2026'}, ...schoolsList.map(s => ({id:s, label:s})), {id:'__custom', label:'Other \u2014 type it in'}];
    v.nbProgram = nb.newProgram; v.setNbProgram = e => this.setState({board:{...this.state.board, newProgram:e.target.value}});
    v.nbCustomOn = nb.newProgram === '__custom'; v.nbCustom = nb.newCustom; v.setNbCustom = e => this.setState({board:{...this.state.board, newCustom:e.target.value}});
    v.nbRoles = D.roleOptions || Object.keys(D.profileByRole || {});
    const nbOk = !!nb.newRole && (nb.newProgram === '__custom' ? nb.newCustom.trim().length > 1 : !!nb.newProgram) && st.busy !== 'job';
    v.nbBlocked = !nbOk; v.nbBtnBg = nbOk ? G : '#20302680'; v.createJob = () => this.createJob();
    // users
    const allUsers = [...users, ...st.invited];
    v.userRows = allUsers.map(u => { const off = !!st.deactivated[u.id]; return {name:u.name, email:u.email, title:u.title, roleTags:u.roles.map(roleLabel), status: off ? 'Deactivated' : (u.status || 'Active'), statusColor: off ? RED : u.status === 'Invited' ? AMB : GL, action: off ? 'Reactivate' : 'Deactivate', toggle: () => this.setState({deactivated:{...this.state.deactivated, [u.id]:!off}})}; });
    v.invName = st.inv.name; v.invEmail = st.inv.email;
    v.setInvName = e => this.setState({inv:{...this.state.inv, name:e.target.value, saved:''}});
    v.setInvEmail = e => this.setState({inv:{...this.state.inv, email:e.target.value, saved:''}});
    v.invRoleOpts = Object.keys(roleDefs).map(r => ({label:roleDefs[r].label, d:roleDefs[r].d, on: !!st.inv.roles[r], border: st.inv.roles[r] ? 'rgba(16,185,129,.4)' : 'rgba(160,190,170,.12)', toggle: () => this.setState({inv:{...this.state.inv, roles:{...this.state.inv.roles, [r]:!this.state.inv.roles[r]}, saved:''}})}));
    const invRoles = Object.keys(st.inv.roles).filter(r => st.inv.roles[r]);
    const invOk = st.inv.name.trim() && /@/.test(st.inv.email) && invRoles.length;
    v.invBlocked = !invOk; v.invBtnBg = invOk ? G : '#20302680';
    v.sendInvite = () => { const f = this.state.inv; const rs = Object.keys(f.roles).filter(r => f.roles[r]); if (!f.name.trim() || !/@/.test(f.email) || !rs.length) return; const nm = f.name.trim(), parts = nm.split(' '); this.setState({invited:[...this.state.invited, {id:'u' + Date.now(), name:nm, short: parts[0][0] + '. ' + parts.slice(1).join(' '), title:'Invited · pending', email:f.email.trim(), roles:rs, status:'Invited'}], inv:{name:'', email:'', roles:{}, saved:'Invite sent — expires in 7 days.'}}); };
    v.invSaved = st.inv.saved;
    // accommodation inbox
    const accomCopy = {time:'+50% time on all timed sections. Timers adjust automatically; evaluators see only “accommodation in place” — never the reason.', format:'Alternative format arranged: screen-reader-verified inventory and scenarios, captions on the live session. Reason not shared with evaluators.', info:'Asked the candidate what would help. Reply due within one business day; the candidate’s deadline is paused meanwhile.'};
    const setAccom = (id, status, resolution) => () => this.setState({accomState:{...this.state.accomState, [id]:{status, resolution}}});
    v.inboxRows = seededAccoms.map(a => { const ov = st.accomState[a.id]; const status = ov ? ov.status : a.status; const resolution = ov ? ov.resolution : (a.resolution || ''); const open = status === 'Open'; const col = open ? AMB : status === 'Needs info' ? '#5B9BFF' : G; return {cand:a.cand, t:a.t, txt:a.txt, status, resolution, open, closed:!open, bg:col, border: open ? 'rgba(245,184,74,.35)' : 'rgba(160,190,170,.13)', approveTime:setAccom(a.id, 'Approved', accomCopy.time), approveFormat:setAccom(a.id, 'Approved', accomCopy.format), needInfo:setAccom(a.id, 'Needs info', accomCopy.info)}; });
    // ===== live overrides: real accounts, real candidates, server-side writes =====
    if (LIVE_ENABLED) {
      const L = this.live, me = user || {};
      v.isDemo = false; v.demoUsers = [];
      v.loginInfo = st.login.info || ''; v.busy = !!st.busy;
      v.pwSetup = !!st.pwSetup; v.pw1 = st.pw1; v.pw2 = st.pw2; v.pwMsg = st.pwMsg || '';
      v.setPw1 = e => this.setState({pw1:e.target.value, pwMsg:''}); v.setPw2 = e => this.setState({pw2:e.target.value, pwMsg:''});
      v.savePw = () => this.savePassword(); v.forgotPw = () => this.forgotPassword(); v.signIn = () => this.liveSignIn();
      v.exitRole = st.mode === 'candidate' ? () => this.candidateExit() : () => this.staffSignOut();
      v.inviteLoading = st.mode === 'candidate' && st.invite === 'loading';
      v.inviteSaved = st.mode === 'candidate' && st.invite === 'saved';
      v.inviteInvalid = st.mode === 'candidate' && st.invite === 'invalid';
      v.combineExpired = st.mode === 'candidate' && st.invite === 'cexpired';
      v.resentTo = st.resentTo || 'your email'; v.resentErr = st.resentErr || '';
      v.resend = () => this.resendOwnLink(); v.reopenLink = () => this.setState({invite:'valid'});
      v.saveErr = st.saveErr || '';
      v.flashErr = st.flash.err || st.flash.settings || st.flash.users || '';
      v.clearFlash = () => this.setState({flash:{...this.state.flash, err:'', settings:'', users:''}});
      if (st.mode === 'candidate') v.userLabel = this.candInfo ? this.candInfo.name : '';
      v.decisionAdvanceTxt = (this.candInfo && this.candInfo.decisionTxt) || v.decisionAdvanceTxt;
      const joinLink = (this.candInfo && this.candInfo.link) || '';
      v.joinDisabled = !/^https?:\/\//.test(joinLink); v.joinHref = v.joinDisabled ? '' : joinLink;
      // pipeline: add a candidate — full assessment link, details-only link, or a manual entry with a résumé
      const nc = st.newCand;
      v.showInviteForm = v.isStaff && isMgr;
      v.ncName = nc.name; v.ncEmail = nc.email; v.ncPhone = nc.phone; v.ncRole = nc.role; v.ncProgram = nc.program || ''; v.ncLoc = nc.loc || ''; v.ncSchool = nc.school || ''; v.ncLinkedin = nc.linkedin || ''; v.ncTrack = nc.track || 'assessment';
      v.ncFileName = nc.file ? nc.file.name : '';
      const setNC = k => e => this.setState({newCand:{...this.state.newCand, [k]:e.target.value, saved:''}});
      v.setNcName = setNC('name'); v.setNcEmail = setNC('email'); v.setNcPhone = setNC('phone'); v.setNcRole = setNC('role'); v.setNcProgram = setNC('program'); v.setNcLoc = setNC('loc'); v.setNcSchool = setNC('school'); v.setNcLinkedin = setNC('linkedin');
      v.ncProgramOpts = [{id:'', label:'Hiring for \u2014 school / property\u2026'}, ...schoolsList.map(s => ({id:s, label:s})), {id:'__custom', label:'Other \u2014 type it in'}]; v.ncProgramPick = nc.programPick || ''; v.setNcProgramPick = setNC('programPick'); v.ncCustomOn = nc.programPick === '__custom';
      v.ncRoles = D.roleOptions || Object.keys(D.profileByRole || {});
      v.ncTracks = [{id:'assessment', label:'Full assessment link', d:'Job preview · details & résumé · Sales Decisions · 20–30 min'}, {id:'info', label:'Details-only link', d:'Contact details & résumé · 2 min · no questions'}].map(t => { const on = (nc.track || 'assessment') === t.id; return {...t, on: () => this.setState({newCand:{...this.state.newCand, track:t.id, saved:''}}), bg: on ? 'rgba(16,185,129,.12)' : 'transparent', fg: on ? GL : '#A7B5AB', border: on ? 'rgba(16,185,129,.45)' : 'rgba(160,190,170,.18)'}; });
      v.pickNcFile = e => { const f = e.target.files && e.target.files[0]; this.setState({newCand:{...this.state.newCand, file: f || null, saved:''}}); try { e.target.value = ''; } catch (x) {} };
      v.clearNcFile = () => this.setState({newCand:{...this.state.newCand, file:null}});
      const ncOk = nc.name.trim().length > 1 && /@/.test(nc.email) && st.busy !== 'invite';
      v.ncBlocked = !ncOk; v.ncBtnBg = ncOk ? G : '#20302680'; v.ncBusy = st.busy === 'invite';
      v.ncEmailInvite = () => this.createCandidate('email'); v.ncCopyInvite = () => this.createCandidate('copy'); v.ncManual = () => this.createCandidate('manual');
      v.ncLinkLabel = (nc.track || 'assessment') === 'info' ? 'details link' : 'assessment link';
      v.ncSaved = nc.saved || ''; v.ncSavedColor = /^Could not/.test(nc.saved || '') ? RED : GL;
      v.pipeEmpty = v.isStaff && D.candidates.length === 0;
      v.pipeRows = v.pipeRows.map((row, i) => { const c = D.candidates[i]; if (!c) return row; const info = c.track === 'info'; return {...row, stageLabel: c.stageLabel, dSub: st.blind ? row.dSub : ((c.loc && c.loc !== '\u2014' ? c.loc + ' \u00b7 ' : '') + c.email), canReview:false, showInvite: isMgr && !c.withdrawn && !c.done.s3 && !(info && c.infoDone), showUpgrade: isMgr && !c.withdrawn && (info || c.source === 'manual') && !c.done.s3, upgradeTxt: info ? 'Send assessment link' : 'Email assessment link', resendTxt: (c.inviteSent ? 'Resend ' : 'Email ') + (info ? 'details link' : 'link'), resend: () => this.sendInviteTo(c), copy: () => this.copyLinkFor(c), upgrade: () => this.sendInviteTo(c, 'assessment'), flash: st.flash[c.id] || '', inviteState: c.inviteState + (c.resendRequested ? ' \u00b7 new link requested' : ''), inviteColor: (c.resendRequested || c.expired) ? AMB : c.opened ? GL : '#8FA396', tag: c.source === 'manual' ? 'Added manually' : info ? 'Details-only link' : '', hasResume: !!c.resumePath, grade: c.callGrade || '', gradeColor: GRADE_COLOR(c.callGrade), boardStage: c.stageTxt || ''}; });
      // profile
      v.pNeedsScore = !!(p && p.done && p.done.s3 && !p.report && isMgr);
      v.rpNeedsEvidence = !!(p && p.report && !(p.report.items && p.report.items.length) && isMgr);
      // scored profiles can always be re-scored against the current rubric; flag when the bank changed after this report was scored
      const bankChanged = ((L.raw.settings || {}).bankEditsUpdatedAt) || null;
      v.rpCanRescore = !!(p && p.report && (p.report.items && p.report.items.length) && isMgr);
      v.rpScoredStale = !!(p && p.scoredAt && bankChanged && new Date(bankChanged) > new Date(p.scoredAt));
      v.rpScoredTxt = p && p.scoredAt ? ('Scored ' + fmtT(p.scoredAt) + (p.report && p.report.edited ? ' \u00b7 with bank edits' : ' \u00b7 original rubric') + (v.rpScoredStale ? ' \u00b7 the question bank changed since \u2014 re-score to apply' : '')) : '';
      v.rescore = () => this.rescoreCandidate(p.id);
      v.pScoreMsg = st.flash['score:' + p.id] || '';
      // evaluator cockpit: my sessions, the real other evaluator
      if (v.isEval) {
        const mine = (L.view ? L.view.sessions : []).filter(s => s.e1 === me.id || s.e2 === me.id);
        const initials = n => String(n || '').split(' ').map(x => x[0] || '').join('').slice(0, 2).toUpperCase();
        const otherId = s => s.e1 === me.id ? s.e2 : s.e1;
        const shortOf = id => (users.find(u => u.id === id) || {}).short || '\u2014';
        const myEval = cid => (L.raw.evaluations || []).find(e => e.candidate_id === cid && e.evaluator_id === me.id);
        const myIv = cid => (L.raw.interviews || []).find(e => e.candidate_id === cid && e.evaluator_id === me.id);
        v.sessions = mine.map(s => { const dn = !!myEval(s.candId); return {initials:initials(s.cand), name:s.cand, sub: s.role + ' \u00b7 Exercise A \u00b7 ' + s.when + ' \u00b7 with ' + shortOf(otherId(s)) + (accomApproved(s.candId) ? ' \u00b7 accommodation in place' : ''), status: dn ? 'Scored' : 'Ready', statusColor: dn ? GL : AMB, canRun:true, go: () => this.openLiveSession(s.candId)}; });
        v.ivList = mine.map(s => { const dn = !!myIv(s.candId); return {initials:initials(s.cand), name:s.cand, sub: s.role + ' \u00b7 interview after the combine \u00b7 ' + s.when + ' \u00b7 with ' + shortOf(otherId(s)), status: dn ? 'Scored' : 'Ready', statusColor: dn ? GL : AMB, canRun:true, go: () => this.openLiveInterview(s.candId)}; });
        v.noSessions = mine.length === 0;
        const lc = D.candidates.find(c => c.id === st.liveCand) || {};
        const ls = mine.find(s => s.candId === st.liveCand) || null;
        const otherName = ls ? shortOf(otherId(ls)) : 'the other evaluator';
        const lcAccom = accomApproved(st.liveCand);
        const lp = lc.progress || {}, ld = lc.done || {};
        v.liveCandName = lc.name || '';
        v.liveBrief = lc.name ? (lc.name + ' \u00b7 ' + lc.role + (lc.program ? ' \u00b7 ' + lc.program : '') + (lc.loc && lc.loc !== '\u2014' ? ' \u00b7 ' + lc.loc : '') + '. Sales decisions ' + (lc.sjt != null ? lc.sjt + '/100 (' + ((lc.report && lc.report.band) || '') + ')' : 'not yet scored') + '.' + (ld.s5b ? ' Case submitted \u2014 read it before the session.' : ' Case not yet submitted.')) : 'Pick a session from the roster.';
        v.liveTranscripts = allTr.filter(t => t.candId === st.liveCand).map(trRow);
        v.liveCaseFile = lc.caseFile ? lc.caseFile.name : ''; v.openLiveCaseFile = () => { if (lc.caseFile) this.openFile(lc.id, lc.caseFile.path); };
        v.liveResume = lc.resumeName || ''; v.openLiveResume = () => { if (lc.resumePath) this.openFile(lc.id, lc.resumePath); };
        v.liveFlags = [
          {label: lcAccom ? 'Accommodation in place \u00b7 +50% prep time' : 'No accommodations', fg: lcAccom ? '#E9D9B0' : '#7E9186', bg: lcAccom ? 'rgba(245,184,74,.1)' : 'transparent', border: lcAccom ? 'rgba(245,184,74,.35)' : 'rgba(160,190,170,.14)'},
          {label: lp.consentRec ? 'Recording consent \u2713' : 'Recording consent not given', fg: lp.consentRec ? GL : AMB, bg: lp.consentRec ? 'rgba(16,185,129,.1)' : 'rgba(245,184,74,.1)', border: lp.consentRec ? 'rgba(16,185,129,.3)' : 'rgba(245,184,74,.35)'},
          {label: ld.s5b ? 'Case submitted \u00b7 read it' : 'Case not submitted', fg: ld.s5b ? GL : AMB, bg: ld.s5b ? 'rgba(16,185,129,.1)' : 'rgba(245,184,74,.1)', border: ld.s5b ? 'rgba(16,185,129,.3)' : 'rgba(245,184,74,.35)'},
          {label: st.coi ? 'COI declared \u2713' : 'COI declaration pending', fg: st.coi ? GL : AMB, bg: st.coi ? 'rgba(16,185,129,.1)' : 'rgba(245,184,74,.1)', border: st.coi ? 'rgba(16,185,129,.3)' : 'rgba(245,184,74,.35)'}
        ];
        const oth = (L.raw.evaluations || []).find(e => e.candidate_id === st.liveCand && e.evaluator_id !== me.id) || null;
        v.otherShort = otherName;
        v.agreeIntro = oth ? ('Your scores vs. ' + otherName + ' (submitted ' + fmtT(oth.submitted_at) + '). Differences over 1.5 are flagged for a calibration discussion.') : ('Your scores are locked. ' + otherName + ' has not submitted yet \u2014 the comparison appears here once they do.');
        v.agreeRows = ['sj','hd','re','sa','co'].map(id => { const mine2 = st.r2[id] ?? st.r1[id]; const o = oth ? ((oth.r2 || {})[id] ?? (oth.r1 || {})[id]) : null; const diff = (mine2 != null && o != null) ? Math.abs(mine2 - o) : null; const flag = diff != null && diff > 1.5; return {name:compName(id), mine: mine2 != null ? Number(mine2).toFixed(1) : '\u2014', other: o != null ? Number(o).toFixed(1) : '\u2014', flagTxt: mine2 == null ? 'not scored' : o == null ? 'awaiting other evaluator' : flag ? '\u26a0 \u0394 ' + diff.toFixed(1) + ' \u2014 flagged' : '\u0394 ' + diff.toFixed(1) + ' \u00b7 aligned', flagColor: flag ? AMB : o == null ? DIM : GL, bg: flag ? 'rgba(245,184,74,.06)' : '#0B120E', border: flag ? 'rgba(245,184,74,.4)' : 'rgba(160,190,170,.1)'}; });
        v.ivTitle = 'Structured interview \u2014 ' + (lc.name || '');
        v.ivMeta = ls ? (ls.when + ' \u00b7 after the combine \u00b7 40 min \u00b7 with ' + otherName) : '';
        v.ivLockNote = 'Scores lock on submit and stay hidden from ' + otherName + ' until they submit theirs. ';
        v.ivSubmittedNote = 'Submitted \u00b7 saved. ' + otherName + '\u2019s scores stay independent.';
        v.submitEval = async () => { const s = this.state; if (!s.rec || !s.liveCand) return; const r = await this.write(() => L.upsertEvaluation({candidate_id:s.liveCand, evaluator_id:me.id, r1:s.r1, r2:s.r2, coach:s.coach, notes:s.notes, cite:s.cite, rec:s.rec, obj_used:s.objUsed, coi:s.coi}), 'err'); if (r.ok) this.setState({submitted:true, phase:'compare'}); };
        v.submitIv = async () => { const s = this.state; if (Object.keys(s.ivScores).length < ivTot || !s.liveCand) return; const r = await this.write(() => L.upsertInterview({candidate_id:s.liveCand, evaluator_id:me.id, scores:s.ivScores, notes:s.ivNotes}), 'err'); if (r.ok) this.setState({ivSubmitted:true}); };
      }
      // staff dashboard: writes go to the database, lists come from it
      if (v.isStaff) {
        v.userRows = users.map(u => { const off = !u.active; return {name:u.name, email:u.email, title:u.title, roleTags:u.roles.map(roleLabel), status: off ? 'Deactivated' : u.status, statusColor: off ? RED : u.status === 'Invited' ? AMB : GL, action: off ? 'Reactivate' : 'Deactivate', toggle: () => this.toggleStaff(u)}; });
        v.evalOpts = users.filter(u => u.active && u.roles.includes('evaluator')).map(u => ({id:u.id, label:u.short + (u.title ? ' \u00b7 ' + u.title : '')}));
        v.schLinkEditable = true; v.schLinkVal = st.sch.link || ''; v.setSchLink = setS('link');
        v.schLink = (st.sch.link || '').trim() || 'Paste a Zoom / Meet / Teams link';
        v.sendSchedule = async () => {
          const s = this.state.sch; const c = schedCands.find(x => x.id === s.cand);
          if (!c || s.e1 === s.e2 || !(s.date || '').trim() || !(s.time || '').trim() || this.state.busy === 'sch') return;
          this.setState({busy:'sch', sch:{...s, msg:'Saving the session and sending invites\u2026', warn:[]}});
          try {
            const r = await L.createSession({candidateId:c.id, date:s.date, time:s.time, tz:s.tz || 'America/Chicago', durationMin:s.dur || 60, e1:s.e1, e2:s.e2, link:(s.link || '').trim()});
            await L.refresh();
            const how = r.calendar === 'google' ? 'Google Calendar invitations sent to the candidate and both evaluators' + (r.session.link ? ' \u00b7 join link ' + r.session.link : '') : (r.emailed ? 'Candidate emailed' : 'Candidate NOT emailed') + ' with the details and a calendar (.ics) file; both evaluators emailed too';
            this.setState({sch:{...this.state.sch, cand:'', sent:'yes', link:'', msg:'Session saved for ' + r.session.when + '. ' + how + '. Candidate combine link: ' + r.combineLink, warn:r.warnings || []}});
          } catch (e) { this.setState({sch:{...this.state.sch, msg:'', warn:['Could not schedule: ' + ((e && e.message) || e)]}}); }
          this.setState({busy:''});
        };
        v.schBusy = st.busy === 'sch';
        if (st.sch.sent) v.schWarn = '';
        v.recordDecision = async () => { const d = this.state.dec; if (!d.rec || d.note.trim().length <= 20 || !p.id) return; const r = await this.write(() => L.insertDecision({candidate_id:p.id, by_label:(me.short || 'Staff') + ' (' + roleLabel(st.role) + ')', decision:d.rec, rationale:d.note.trim(), agree:p.agree || '\u2014'}), 'err'); if (r.ok) this.setState({dec:{rec:null, note:''}}); };
        v.sendInvite = async () => { const f = this.state.inv; const rs = Object.keys(f.roles).filter(r => f.roles[r]); if (!f.name.trim() || !/@/.test(f.email) || !rs.length) return; const nm = f.name.trim(), parts = nm.split(' '); this.setState({busy:'staff', inv:{...f, saved:'Sending\u2026'}}); try { await L.inviteStaff({name:nm, short:(parts[0][0] + '. ' + parts.slice(1).join(' ')).trim(), email:f.email.trim().toLowerCase(), title:'', roles:rs}); await L.refresh(); this.setState({inv:{name:'', email:'', roles:{}, saved:'Invite emailed \u2014 they create a password from the link.'}}); } catch (e) { this.setState({inv:{...this.state.inv, saved:'Could not send: ' + ((e && e.message) || e)}}); } this.setState({busy:''}); };
        const arSave = async outcome => { if (!arAll || this.state.arDone[arC.id] || !arC.id) return; const r = await this.write(() => L.insertReview({candidate_id:arC.id, ratings:this.state.arRatings, level:arLv, outcome}), 'err'); if (r.ok) this.setState({arSaved: outcome === 'advanced' ? 'Advanced \u2014 the candidate can continue to Sales Decisions.' : 'Recorded \u2014 not advanced at the application stage.'}); };
        v.arAdvance = () => arSave('advanced'); v.arHold = () => arSave('held');
        v.saveOutcome = async () => { const o = this.state.oc, vv = o.vals; if (!o.hire) return; const num = x => (x === undefined || x === '') ? null : (isNaN(Number(x)) ? x : Number(x)); const m = Number(vv.mgr); const row = {dials:num(vv.dials), mtgs:num(vv.mtgs), pipe:vv.pipe || null, rev:vv.rev || null, crm:num(vv.crm), mgr:num(vv.mgr), coach: vv.mgr ? (m >= 4 ? 'Strong' : m >= 3 ? 'Moderate' : 'Weak') : null, ret:'Active'}; const r = await this.write(() => L.upsertOutcome(o.hire, o.period, row), 'err'); if (r.ok) this.setState({oc:{...this.state.oc, vals:{}, saved:'Saved \u2014 ' + o.hire + ' \u00b7 ' + o.period.replace('d','') + ' days.'}, vPeriod:o.period}); };
        v.inboxRows = seededAccoms.map(a => { const status = a.status, resolution = a.resolution || ''; const open = status === 'Open'; const col = open ? AMB : status === 'Needs info' ? '#5B9BFF' : G; const set = (s2, res) => () => this.write(() => L.updateAccommodation(a.id, s2, res), 'err'); return {cand:a.cand, t:a.t, txt:a.txt, status, resolution, open, closed:!open, bg:col, border: open ? 'rgba(245,184,74,.35)' : 'rgba(160,190,170,.13)', approveTime:set('Approved', accomCopy.time), approveFormat:set('Approved', accomCopy.format), needInfo:set('Needs info', accomCopy.info)}; });
        v.inboxEmpty = seededAccoms.length === 0;
        const byEval = {};
        (L.raw.evaluations || []).forEach(e => { const vals = [...Object.values(e.r1 || {}), ...Object.values(e.r2 || {})].filter(x => typeof x === 'number'); if (!vals.length) return; const b = byEval[e.evaluator_id] = byEval[e.evaluator_id] || {sum:0, n:0}; vals.forEach(x => { b.sum += x; b.n += 1; }); });
        const tot = Object.keys(byEval).reduce((a, k) => ({sum:a.sum + byEval[k].sum, n:a.n + byEval[k].n}), {sum:0, n:0});
        const allAvg = tot.n ? tot.sum / tot.n : null;
        v.calRows = Object.keys(byEval).map(id => { const b = byEval[id]; const avg = b.sum / b.n; const d = allAvg != null ? avg - allAvg : 0; return {name:uShort(id), avg:avg.toFixed(1), note: Math.abs(d) < 0.3 ? 'within norm' : d > 0 ? 'skews +' + d.toFixed(1) + ' lenient' : 'skews ' + d.toFixed(1) + ' strict', color: Math.abs(d) < 0.3 ? GL : AMB}; });
        v.calNote = v.calRows.length ? '' : 'No combine scores yet. Tendencies appear once evaluators submit scores.';
        v.calFlags = D.candidates.filter(c => c.evalCount >= 2).map(c => { const a = c.evaluations[0], b = c.evaluations[1]; const pk = (e, id) => (e.r2 && e.r2[id] != null) ? e.r2[id] : (e.r1 ? e.r1[id] : null); const id = c.agreeComp; const s1 = id ? pk(a, id) : null, s2 = id ? pk(b, id) : null; const flagged = c.agree === 'Flagged'; return {open:flagged, title: c.name + ' \u2014 ' + (flagged ? compName(id) : 'all competencies within 1.5'), e1:uShort(a.evaluator_id), s1: s1 != null ? Number(s1).toFixed(1) : '\u2014', e2:uShort(b.evaluator_id), s2: s2 != null ? Number(s2).toFixed(1) : '\u2014', delta: c.agreeMax != null ? c.agreeMax.toFixed(1) : '\u2014', note: flagged ? ([a, b].map(e => e.notes ? uShort(e.evaluator_id) + ': \u201c' + e.notes + '\u201d' : '').filter(Boolean).join(' ') || 'Discuss the evidence each evaluator cited before either score changes.') : ''}; });
        v.calFlagsEmpty = v.calFlags.length === 0;
        v.fairRows = []; v.fairNote = 'Selection-rate reporting turns on once optional, separately stored demographic data is collected. Not configured yet.';
        v.ocHireOpts = D.hires.map(h => h.name);
        v.validEmpty = D.hires.length === 0;
      }
    }
    // ===== public pages (no login): the job's application form and its read-only pipeline board =====
    if (v.isPublic) {
      const pb = st.pub, pd = pb.data || {}, job = pd.job || {};
      v.pubKind = this.publicKind; v.pubLoading = pb.status === 'loading'; v.pubInvalid = pb.status === 'invalid'; v.pubClosed = pb.status === 'closed'; v.pubOk = pb.status === 'ok'; v.pubDone = pb.status === 'done';
      v.pubTitle = job.title || ''; v.pubProgram = job.program || ''; v.pubMsg = pb.msg || ''; v.pubBusy = !!pb.busy; v.pubLink = pb.link || '';
      const f = pb.form;
      const setF = k => e => this.setState({pub:{...this.state.pub, form:{...this.state.pub.form, [k]: e.target.value}, msg:''}});
      v.pubFields = [{label:'Full name', ph:'First and last name', val:f.name, set:setF('name')}, {label:'Email', ph:'you@example.com', val:f.email, set:setF('email')}, {label:'Phone', ph:'(555) 000-0000', val:f.phone, set:setF('phone')}, {label:'Location', ph:'City, State \u00b7 open to relocation?', val:f.loc, set:setF('loc')}, {label:'LinkedIn (optional)', ph:'linkedin.com/in/\u2026', val:f.linkedin, set:setF('linkedin')}];
      v.pubConsent = !!f.consent; v.togglePubConsent = () => this.setState({pub:{...this.state.pub, form:{...this.state.pub.form, consent:!this.state.pub.form.consent}, msg:''}});
      const pubOk = f.name.trim().length > 1 && /@/.test(f.email) && f.consent && !pb.busy;
      v.pubBlocked = !pubOk; v.pubBtnBg = pubOk ? G : '#20302680'; v.pubSubmit = () => this.submitApply();
      const bStages = (Array.isArray(pd.stages) && pd.stages.length) ? pd.stages : DEFAULT_TA_STAGES;
      const bc = pd.candidates || [];
      const auto = c => c.withdrawn ? 'Not moving forward' : c.decision === 'Advance' ? 'Offer' : c.decision === 'Do Not Advance' ? 'Not moving forward' : (c.evaluated || c.combine) ? 'Combine' : c.assessment_done ? 'Assessment' : c.first_call ? 'First call' : 'Applied';
      const bStage = c => c.stage || auto(c);
      const days = iso => { if (!iso) return ''; const d = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5); return isNaN(d) ? '' : d <= 0 ? 'moved today' : 'in stage ' + d + ' day' + (d === 1 ? '' : 's'); };
      const bcard = c => ({name:c.name, sub:[c.loc || '', days(c.stage_changed_at || c.created_at)].filter(Boolean).join(' \u00b7 '), chips:[c.assessment_done ? 'Assessment complete' : '', c.combine ? (c.evaluated ? 'Combine scored' : 'Combine scheduled') : '', c.decision ? 'Decision: ' + c.decision : ''].filter(Boolean)});
      v.pubCols = bStages.map(s => { const cards = bc.filter(c => bStage(c) === s).map(bcard); return {name:s, n:cards.length, cards}; });
      const stray = bc.filter(c => !bStages.includes(bStage(c)));
      if (stray.length) v.pubCols.push({name:'Other', n:stray.length, cards:stray.map(bcard)});
      v.pubTotal = bc.length; v.pubUpdated = 'Read-only view \u00b7 refreshed ' + new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
    }
    return v;
  }

  componentDidUpdate(prevProps, prevState) {
    saveState(this.state);
    if (!LIVE_ENABLED || this.hydrating || !prevState) return;
    const st = this.state;
    if (st.mode === 'candidate' && (this.token || this.combineToken) && st.invite === 'valid') {
      const keys = this.combineToken ? COMBINE_KEYS : CAND_KEYS;
      const patch = {}; let n = 0;
      keys.forEach(k => { if (prevState[k] !== st[k]) { patch[k] = st[k]; n++; } });
      if (n) this.queueSave(patch);
      if (this.token && st.done.s3 && !(prevState.done && prevState.done.s3)) this.scoreSoon();
    }
    if (st.mode === 'staff' && st.user) {
      ['weightsByRole', 'bankSettings', 'retention', 'schools', 'taStages', 'callEvalPrompt', 'bankEdits'].forEach(k => { if (prevState[k] !== st[k] && st[k] != null) this.queueSetting(k, st[k]); });
    }
  }
  render() { return <Template V={this.renderVals()} />; }
}
