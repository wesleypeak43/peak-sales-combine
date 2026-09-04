// @ts-nocheck
// Application logic — ported 1:1 from the prototype. renderVals() builds the view-model (V) the screens render;
// state lives in React and is mirrored to localStorage so a refresh keeps a candidate's or evaluator's progress.
import React from 'react';
import { Template } from './template/Template';
import { PEAK_DATA } from './data/seed';
import { PEAK_BANK } from './data/bank';

const STORAGE_KEY = 'peak-sales-combine-v3';
const TRANSIENT = ['timer', 'login']; // never persisted: running countdown, typed password

function loadState() {
  try {
    if (new URLSearchParams(window.location.search).has('reset')) { localStorage.removeItem(STORAGE_KEY); return null; }
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
let saveTimer: any;
function saveState(s: any) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { const copy = {...s}; TRANSIENT.forEach(k => delete copy[k]); localStorage.setItem(STORAGE_KEY, JSON.stringify(copy)); } catch {}
  }, 150);
}

export class PeakCombine extends React.Component<any, any> {
  _t: any;
  constructor(props: any) {
    super(props);
    const saved = loadState();
    if (saved) this.state = {...this.state, ...saved};
  }
  state = {
    mode: null, user: null, role: null, invite: 'valid', viewAs: null, resent: false,
    login: {email:'', pw:'', err:''},
    cview: 'dash', eview: 'roster', aview: 'funnel',
    done: {s1:false,s2:false,s3:false,s4:false,s5a:false,s5b:false},
    ack: false, challenge: '', accomOpen: false, accomTxt: '', accomSent: false, consentRec: false, resched: false, withdrawn: false,
    app: {name:'',email:'',phone:'',loc:'',linkedin:'',role:'Sponsorship Sales Consultant',auth:null,resume:false,consent:false},
    ev: ['','','','',''],
    bkIdx: 0, bkAns: {}, bankSettings: null,
    recorded: false,
    caseAns: ['','','','','','',''], caseMode: 'Written',
    timer: {sec:0,total:1,on:false},
    phase: 'brief', r1: {}, r2: {}, coach: '', notes: '', cite: '', rec: null, submitted: false, objUsed: {}, coi: false,
    ivScores: {}, ivNotes: '', ivSubmitted: false,
    blind: false, profileId: 'dana', cmpA: null, cmpB: null,
    arId: 'sofia', arRatings: {}, arSaved: '', arDone: {},
    dec: {rec:null, note:''}, decisions: [],
    sch: {cand:'maya', date:'Tue, Sep 15', time:'10:00 AM', e1:'delgado', e2:'whitfield', sent:''}, scheduled: [],
    inv: {name:'', email:'', roles:{}, saved:''}, invited: [], deactivated: {},
    accomState: {},
    oc: {open:false, hire:'Alexis Grant', period:'d90', vals:{}, saved:''}, ocRows: {},
    weightsRole: 'Sponsorship Sales Consultant', weightsByRole: null,
    bankIdx: 0, bank: null, savedNote: '',
    vPeriod: 'd30', retention: '24 months'
  };
  componentDidMount() {
    const D = PEAK_DATA;
    if (D && !this.state.weightsByRole) this.setState({weightsByRole: JSON.parse(JSON.stringify(D.weightsByRole || {}))});
    const dr = this.props.defaultRole;
    if (dr === 'candidate') this.setState({mode:'candidate', invite:'valid'});
    else if (dr === 'evaluator') this.signInAs('delgado', 'evaluator');
    else if (dr === 'manager') this.signInAs('delgado', 'manager');
    else if (dr === 'admin') this.signInAs('castillo', 'admin');
    else if (dr === 'leadership') this.signInAs('ellis', 'leadership');
    this._t = setInterval(() => {
      const t = this.state.timer;
      if (t.on && t.sec > 0) {
        const step = (this.props.fastTimers ?? false) ? 15 : 1;
        const s = Math.max(0, t.sec - step);
        this.setState({timer: {...t, sec: s, on: s > 0}});
      }
    }, 1000);
  }
  componentWillUnmount() { clearInterval(this._t); }
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
    const D = PEAK_DATA || {comps:[],anchors:{},weights:[],scale:[],inventory:[],scenarios:[],objections:[],evQs:[],caseQs:[],realities:[],candidates:[],funnel:[],roles:[],hires:[],audit:[],users:[],roleDefs:{},interviewQs:[],applications:{},decisions:[],accoms:[],sessions:[],weightsByRole:{},invite:null};
    const st = this.state, G = '#10B981', GL = '#34D399', AMB = '#F5B84A', RED = '#F87171', DIM = '#7E9186';
    const v = {};
    // shell
    v.texture = this.props.showTexture ?? true;
    const users = D.users || [], roleDefs = D.roleDefs || {};
    const user = st.user, roles = user ? user.roles : [];
    const inv = D.invite || {first:'Alex', name:'Alex Carter', role:'Sponsorship Sales Consultant', prop:'Texas State Athletics', due:'Fri, Sep 11', session:'Thu, Sep 10 · 2:00 PM CT', link:'meet.peaksportsmgmt.com/combine-1064'};
    const roleLabel = r => (roleDefs[r] || {}).label || r;
    const B = PEAK_BANK || null;
    const profIdFor = role => (D.profileByRole || {})[role] || 'entry';
    const isAdminRole = st.mode === 'staff' && st.role === 'admin', isLead = st.mode === 'staff' && st.role === 'leadership', isMgr = st.mode === 'staff' && (st.role === 'manager' || st.role === 'admin');
    v.isEntry = !st.mode; v.inApp = !!st.mode;
    v.viewingAs = !!st.viewAs;
    v.inviteExpired = st.mode === 'candidate' && st.invite !== 'valid';
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
    const tylerAccom = accomApproved('tyler');
    const tab = (label, on, active) => ({label, go:on, bg: active ? 'rgba(16,185,129,.12)' : 'transparent', fg: active ? GL : '#8FA396'});
    if (v.isCand) v.navTabs = [tab('My assessment', () => this.setState({cview:'dash'}), true)];
    else if (v.isEval) v.navTabs = [tab('Sessions', () => this.setState({eview:'roster'}), st.eview === 'roster'), tab('Live combine', () => this.setState({eview:'live'}), st.eview === 'live'), tab('Interviews', () => this.setState({eview:'ivlist'}), st.eview === 'ivlist' || st.eview === 'ivcard')];
    else if (v.isStaff) {
      const A = (label, id, alias) => tab(label, () => this.setState({aview:id}), st.aview === id || (alias || []).includes(st.aview));
      const T = [A('Funnel','funnel'), A('Pipeline','pipe',['profile','compare','appreview'])];
      if (isAdminRole) T.push(A('Schedule','schedule'));
      if (isMgr) T.push(A('Inbox','inbox'));
      T.push(A('Decisions','decisions'));
      if (isAdminRole) { T.push(A('Question bank','bank')); T.push(A('Weights','weights')); }
      if (isAdminRole || isLead) T.push(A('Calibration','calib'));
      T.push(A('Validation','valid'));
      if (isAdminRole) { T.push(A('Users','users')); T.push(A('Roadmap','roadmap')); }
      if (isAdminRole || isLead) T.push(A('Settings','settings'));
      v.navTabs = T;
    } else v.navTabs = [];
    // ===== candidate =====
    const stageDone = n => ({s1:n >= 2, s2:n >= 2, s3:n >= 4, s4:n >= 4, s5a:n >= 5, s5b:n >= 5});
    const done = vaCand ? stageDone(vaCand.stage) : st.done, s5Done = done.s5a && done.s5b;
    const propFor = role => ((D.roles || []).find(r => r.title === role) || {}).prop || inv.prop;
    v.candFirst = vaCand ? vaCand.name.split(' ')[0] : inv.first;
    v.candRoleLine = (vaCand ? vaCand.role : inv.role) + ' · ' + propFor(vaCand ? vaCand.role : inv.role);
    v.candDue = inv.due; v.candSession = inv.session; v.candLink = inv.link; v.joinDisabled = true;
    const mobile = this.props.mobilePreview ?? false;
    v.candMax = mobile ? '400px' : '860px'; v.candFrame = mobile ? '1px solid rgba(160,190,170,.18)' : 'none';
    v.candPE = v.viewingAs ? 'none' : 'auto';
    v.vDash = st.cview==='dash'; v.vS1 = st.cview==='s1'; v.vS2 = st.cview==='s2'; v.vS3 = st.cview==='s3'; v.vS4 = st.cview==='s4';
    v.vS5 = st.cview==='s5'; v.vS5a = st.cview==='s5a'; v.vS5b = st.cview==='s5b';
    v.goDash = () => this.setState({cview:'dash'});
    v.goS5 = () => this.setState({cview:'s5'});
    const defs = [
      {n:'01', title:'Welcome & Realistic Job Preview', time:'10 min', k:'s1', view:'s1'},
      {n:'02', title:'Evidence-Based Application', time:'25\u201340 min', k:'s2', view:'s2'},
      {n:'03', title:'Sales Decisions', time:'15 min', k:'s3', view:'s3'},
      {n:'04', title:'Sales Combine \u2014 Exercises A & B', time:'60 min', k:'s5', view:'s5'}
    ];
    const isDone = k => k==='s5' ? s5Done : done[k];
    v.stages = defs.map((d, i) => {
      const dn = isDone(d.k);
      const locked = i > 0 && !isDone(defs[i-1].k);
      const started = d.k==='s3' ? Object.keys(st.bkAns).length > 0 : d.k==='s5' ? (done.s5a||done.s5b||st.consentRec) : false;
      return {
        n:d.n, title:d.title, time:d.time,
        status: dn ? 'Complete' : locked ? 'Locked' : (d.k === 's5' && done.s5b) ? 'Case in · live ' + inv.session.split(' · ')[0] : started ? 'In progress' : 'Not started',
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
    v.progressPct = Math.round(nDone/4*100) + '%';
    v.progressTxt = nDone + ' of 4 stages complete';
    const selfDone = done.s1 && done.s2 && done.s3;
    const decision = vaCand ? (vaCand.stage >= 6 ? 'Advance' : 'none') : (this.props.candidateDecision ?? 'none');
    const decided = decision === 'Advance' || decision === 'Decline';
    v.showStatus = selfDone;
    v.statusSteps = [
      {label:'Application & assessments received', sub:'Stages 1–3 complete · reviewed by the talent team', on:true},
      {label:'Live combine', sub: done.s5a ? 'Completed · scored independently by two evaluators' : done.s5b ? 'Case submitted · session ' + inv.session : 'Scheduled ' + inv.session + ' · submit your case beforehand', on: done.s5a || done.s5b},
      {label:'Panel review', sub:'Two evaluators’ scores compared; any disagreement is discussed, never averaged away', on: done.s5a},
      {label:'Decision', sub: decided ? 'Recorded — see below' : 'Within five business days of your combine, by email and here', on: decided}
    ].map(s => ({label:s.label, sub:s.sub, mark: s.on ? '●' : '○', color: s.on ? GL : '#5C6B61'}));
    v.decisionAdvance = selfDone && decision === 'Advance'; v.decisionDecline = selfDone && decision === 'Decline';
    // s1
    v.realities = D.realities; v.ack = st.ack;
    v.toggleAck = () => this.setState({ack:!st.ack});
    v.ackBorder = st.ack ? 'rgba(16,185,129,.45)' : 'rgba(160,190,170,.13)';
    v.challenge = st.challenge; v.setChallenge = e => this.setState({challenge:e.target.value});
    const s1ok = st.ack && st.challenge.trim().length > 20;
    v.s1Blocked = !s1ok; v.s1BtnBg = s1ok ? G : '#20302680';
    v.s1Hint = s1ok ? '' : 'Check the acknowledgment and share a few sentences to continue.';
    v.submitS1 = () => { if (s1ok) this.markDone('s1', {cview:'dash'}); };
    // s2
    const ap = st.app, setA = k => e => this.setState({app:{...this.state.app, [k]:e.target.value}});
    v.appFields = [
      {label:'Full name', ph:'First and last name', val:ap.name, set:setA('name')},
      {label:'Email', ph:'you@example.com', val:ap.email, set:setA('email')},
      {label:'Phone', ph:'(555) 000-0000', val:ap.phone, set:setA('phone')},
      {label:'Preferred location', ph:'e.g. San Marcos, TX \u00b7 open to relocation', val:ap.loc, set:setA('loc')}
    ];
    v.appRole = ap.role; v.setAppRole = setA('role');
    v.appLinkedin = ap.linkedin; v.setLinkedin = setA('linkedin');
    v.authYes = () => this.setState({app:{...ap, auth:true}});
    v.authNo = () => this.setState({app:{...ap, auth:false}});
    v.authYesBg = ap.auth===true ? 'rgba(16,185,129,.16)' : '#0B120E'; v.authYesFg = ap.auth===true ? GL : '#A7B5AB';
    v.authNoBg = ap.auth===false ? 'rgba(16,185,129,.16)' : '#0B120E'; v.authNoFg = ap.auth===false ? GL : '#A7B5AB';
    v.toggleResume = () => this.setState({app:{...ap, resume:!ap.resume}});
    v.resumeTxt = ap.resume ? 'resume_alex_carter.pdf \u2713 uploaded' : 'Upload r\u00e9sum\u00e9';
    v.resumeBorder = ap.resume ? 'rgba(16,185,129,.5)' : 'rgba(160,190,170,.3)';
    v.resumeBg = ap.resume ? 'rgba(16,185,129,.06)' : 'transparent';
    v.resumeColor = ap.resume ? GL : '#A7B5AB';
    const LIM = 900;
    v.evItems = D.evQs.map((q, i) => ({
      num: 'Q' + (i+1), q, val: st.ev[i],
      set: e => { const a=[...this.state.ev]; a[i]=e.target.value.slice(0,LIM); this.setState({ev:a}); },
      count: st.ev[i].length + ' / ' + LIM,
      countColor: st.ev[i].length > LIM-60 ? AMB : '#5C6B61'
    }));
    v.consent = ap.consent;
    v.toggleConsent = () => this.setState({app:{...ap, consent:!ap.consent}});
    const s2ok = ap.name && ap.email && ap.auth!==null && ap.resume && ap.consent && st.ev.every(x => x.trim().length > 30);
    v.s2Blocked = !s2ok; v.s2BtnBg = s2ok ? G : '#20302680';
    v.s2Hint = s2ok ? '' : 'Complete contact info, r\u00e9sum\u00e9, work authorization, all five evidence answers, and consent.';
    v.submitS2 = () => { if (s2ok) this.markDone('s2', {cview:'dash'}); };
    // s3 Sales Decisions (bank flow: likert / pairs / scenarios / worst-move, interleaved)
    const candRole = vaCand ? vaCand.role : inv.role;
    const bkProf = B ? B.ROLES[profIdFor(candRole)] : null;
    const bkFlow = bkProf ? B.flowFor(bkProf) : [];
    const bkTotal = bkFlow.length || 1;
    const bkI = Math.min(st.bkIdx, bkTotal - 1);
    const bkItem = bkFlow[bkI] || {};
    const bkCur = st.bkAns[bkItem.id];
    v.bkNum = bkI + 1; v.bkTotal = bkTotal; v.bkPct = Math.round(bkI / bkTotal * 100) + '%';
    v.bkKindLabel = ({likert:'How true is this of you?', pair:'Both are good. Which is more you?', scenario:'What would you actually do?', worst:'Which is the worst move?'})[bkItem.kind] || 'Sales decisions';
    v.bkHasText = bkItem.kind !== 'pair' && !!bkItem.text; v.bkText = bkItem.text || '';
    v.bkIsLikert = bkItem.kind === 'likert'; v.bkIsPair = bkItem.kind === 'pair'; v.bkIsChoice = bkItem.kind === 'scenario' || bkItem.kind === 'worst';
    const bkPick = val => { const a = {...this.state.bkAns, [bkItem.id]: val}; const nx = bkI + 1; if (nx >= bkTotal) this.setState({bkAns:a, bkIdx:bkTotal, done:{...this.state.done, s3:true, s4:true}, cview:'dash'}); else this.setState({bkAns:a, bkIdx:nx}); };
    const selSty = on => ({bg: on ? 'rgba(16,185,129,.16)' : '#0B120E', border: on ? 'rgba(16,185,129,.6)' : 'rgba(160,190,170,.2)', fg: on ? GL : '#D5DED7'});
    v.bkScale = ['Strongly disagree','Disagree','Neutral','Agree','Strongly agree'].map((label, k) => ({label, ...selSty(bkCur === k + 1), on: () => bkPick(k + 1)}));
    v.bkPair = bkItem.kind === 'pair' ? [['a', bkItem.a[2]], ['b', bkItem.b[2]]].map(([side, text]) => ({text, ...selSty(bkCur === side), on: () => bkPick(side)})) : [];
    v.bkOpts = v.bkIsChoice ? B.shuffled(bkItem.opts, bkI * 7 + 13).map((o, k) => ({letter:'ABCD'[k], text:o.text, ...selSty(bkCur === o.i), on: () => bkPick(o.i)})) : [];
    v.bkCanBack = bkI > 0 && !done.s3; v.bkBack = () => this.setState({bkIdx: Math.max(0, this.state.bkIdx - 1)});
    // s5
    v.s5aStatus = done.s5a ? 'Completed' : 'Scheduled · ' + inv.session; v.s5aStatusColor = done.s5a ? GL : AMB;
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
    v.toggleRecorded = () => this.setState({recorded:!st.recorded});
    v.recBorder = st.recorded ? 'rgba(16,185,129,.5)' : 'rgba(160,190,170,.3)';
    v.recBg = st.recorded ? 'rgba(16,185,129,.06)' : 'transparent';
    v.recColor = st.recorded ? GL : '#A7B5AB';
    // s5b
    v.caseModes = ['Written','Slides upload','Video'].map(m => ({label:m, on:() => this.setState({caseMode:m}), bg: st.caseMode===m ? 'rgba(16,185,129,.14)' : 'transparent', fg: st.caseMode===m ? GL : '#8FA396'}));
    v.caseWritten = st.caseMode==='Written';
    v.caseUpload = st.caseMode!=='Written';
    v.caseUpTxt = st.recorded ? 'File \u2713 ready to submit' : (st.caseMode==='Video' ? '\u25cf Record / upload a short video response' : 'Drop your slide deck here (PDF, PPTX)');
    v.caseUpSub = st.caseMode==='Video' ? '5:00 max \u00b7 transcript auto-generated' : '10 MB max \u00b7 secure upload';
    v.caseItems = D.caseQs.map((q, i) => ({num: String(i+1).padStart(2,'0'), q, val: st.caseAns[i], set: e => { const a=[...this.state.caseAns]; a[i]=e.target.value; this.setState({caseAns:a}); }}));
    const s5bOk = st.caseMode==='Written' ? st.caseAns.every(x => x.trim().length > 10) : st.recorded;
    v.s5bBlocked = !s5bOk || done.s5b;
    v.s5bSubmitBg = (s5bOk && !done.s5b) ? G : '#20302680';
    v.submitS5b = () => { if (s5bOk && !done.s5b) this.markDone('s5b', {cview:'s5', recorded:false}); };
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
    v.funnelRows = D.funnel.map((f, i) => ({label:f.label, n:f.n, pct: Math.round(f.n/total*100)+'%', conv: i===0 ? '100%' : Math.round(f.n/D.funnel[i-1].n*100)+'% of prior'}));
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
        openProfile: () => this.setState({profileId:c.id, aview:'profile', dec:{rec:null, note:''}}),
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
    const reportFor = c => { if (!B || !c || c.sjt == null) return null; const prof = B.ROLES[profIdFor(c.role)]; const tier = c.sjt >= 80 ? 'strong' : c.sjt >= 62 ? 'mixed' : 'weak'; return {prof, res: B.score(prof, B.demoAnswers(prof, tier), bsAll[prof.id] || B.defaultSettings(prof))}; };
    const rp = reportFor(p);
    v.pHasReport = !!rp;
    const bandColor = b => b === 'Strong match' ? G : b === 'Meets profile' ? GL : b === 'Validate in interview' ? AMB : b === 'Below profile' ? '#F0A070' : RED;
    const sevSty = s => s === 'critical' ? {bg:RED, fg:'#04120B'} : s === 'meaningful' ? {bg:AMB, fg:'#04120B'} : {bg:'rgba(160,190,170,.18)', fg:'#D5DED7'};
    if (rp) {
      const r = rp.res;
      v.rpOverall = r.overall; v.rpBand = r.band; v.rpColor = bandColor(r.band); v.rpNote = r.bandNote;
      v.rpProfile = rp.prof.name + ' profile · ' + rp.prof.tag; v.rpProfName = rp.prof.name;
      v.rpScen = r.scenario.answered + '/' + r.scenario.total + ' scenarios · avg ' + r.scenario.avg + ' · ' + r.scenario.elite + ' elite · ' + r.scenario.weak + ' weak';
      v.rpComps = r.comps.map(c => { const col = c.breach ? RED : c.score >= 75 ? G : c.score >= 55 ? '#E9D9B0' : AMB; return {name:c.name, meta:(c.critical ? '★ ' : '') + c.weight + '%' + (c.breach ? ' · below floor ' + c.floor : ''), scoreTxt: c.scored ? String(c.score) : 'off', color: c.scored ? col : '#5C6B61', pct: (c.scored ? c.score : 0) + '%', floorPct: c.floor + '%'}; });
      v.rpFlags = r.redFlags.map(f => ({sev:f.severity, label:f.label, context:f.context, ...sevSty(f.severity)}));
      v.rpFlagCount = r.redFlags.length; v.rpNoFlags = !r.redFlags.length;
      v.rpPositives = r.positives.map(s => ({label:s.label, comp: rp.prof.competencies[s.comp].name})); v.rpPosCount = r.positives.length;
      v.rpConsistency = r.consistency.map(t => ({t})); v.rpNoConsistency = !r.consistency.length;
      v.rpFollowUps = r.followUps; v.rpRefs = r.references;
    } else { v.rpComps = []; v.rpFlags = []; v.rpPositives = []; v.rpConsistency = []; v.rpFollowUps = []; v.rpRefs = []; }
    const lvColors = {High:[GL,'rgba(16,185,129,.12)'], Medium:['#E9D9B0','rgba(245,184,74,.1)'], Low:[AMB,'rgba(245,184,74,.12)'], '\u2014':['#5C6B61','transparent'], 'In review':['#8FA396','rgba(160,190,170,.08)'], Insufficient:['#5C6B61','transparent']};
    if (p.comp) {
      v.pBars = D.comps.map(c => { const val = p.comp[c.id]; return {name:c.name, valTxt: val.toFixed(1), valColor: val>=3.5 ? GL : val>=2.8 ? '#E9F0EA' : AMB, pct: Math.round(val/5*100)+'%', fill: val>=3.5 ? 'linear-gradient(90deg,rgba(16,185,129,.5),#10B981)' : 'linear-gradient(90deg,rgba(245,184,74,.4),#F5B84A)'}; });
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
    const ca = byId(st.cmpA) || byId('dana'), cb = byId(st.cmpB) || byId('marcus');
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
    v.bkProfChips = (B ? B.ROLE_LIST : []).map(r => ({label:r.name, on: () => { const role = Object.keys(D.profileByRole || {}).find(k => D.profileByRole[k] === r.id) || this.state.weightsRole; this.setState({weightsRole:role, bank:null, bankIdx:0, savedNote:''}); }, bg: bkPid === r.id ? 'rgba(16,185,129,.14)' : 'transparent', fg: bkPid === r.id ? GL : '#8FA396'}));
    // bank (scenario items of the selected profile; edits version in place)
    const bankSeed = bkP ? bkP.scenarios.map(s => { const scores = s.opts.map(o => o.score); return {title: bkP.competencies[s.comp].name + ' \u00b7 ' + s.id.toUpperCase(), ver:'1.2', body:s.text, opts:s.opts.map(o => o.text), best: scores.indexOf(Math.max(...scores)), worst: scores.indexOf(Math.min(...scores))}; }) : D.scenarios;
    const bank = st.bank || bankSeed;
    const bi = Math.min(st.bankIdx, bank.length-1), bs = bank[bi] || {opts:[]};
    v.bankList = bank.map((b, i) => ({num: String(i+1).padStart(2,'0'), title:b.title, ver:'v'+b.ver, bg: i===bi ? 'rgba(16,185,129,.08)' : '#0F1611', border: i===bi ? 'rgba(16,185,129,.4)' : 'rgba(160,190,170,.13)', pick: () => this.setState({bankIdx:i, savedNote:''})}));
    v.bankTitle = bs.title || ''; v.bankVerTxt = 'v' + (bs.ver||'1.0');
    const bump = ver => { const p2 = String(ver).split('.'); return p2[0] + '.' + (parseInt(p2[1]||'0',10)+1); };
    v.bankNextVer = 'v' + bump(bs.ver||'1.0');
    v.bankStem = bs.body || '';
    v.setBankStem = e => { const b=[...(this.state.bank || bankSeed)]; b[bi] = {...b[bi], body:e.target.value}; this.setState({bank:b, savedNote:''}); };
    v.bankOpts = (bs.opts||[]).map((val, i) => ({letter:'ABCD'[i], val,
      set: e => { const b=[...(this.state.bank || bankSeed)]; const o=[...b[bi].opts]; o[i]=e.target.value; b[bi]={...b[bi], opts:o}; this.setState({bank:b, savedNote:''}); },
      bestBg: bs.best===i ? G : 'transparent', bestFg: bs.best===i ? '#04120B' : GL,
      worstBg: bs.worst===i ? AMB : 'transparent', worstFg: bs.worst===i ? '#04120B' : AMB,
      setBest: () => { const b=[...(this.state.bank || bankSeed)]; b[bi]={...b[bi], best:i}; this.setState({bank:b, savedNote:''}); },
      setWorst: () => { const b=[...(this.state.bank || bankSeed)]; b[bi]={...b[bi], worst:i}; this.setState({bank:b, savedNote:''}); }}));
    v.saveBank = () => { const b=[...(this.state.bank || bankSeed)]; const nv = bump(b[bi].ver||'1.0'); b[bi]={...b[bi], ver:nv}; this.setState({bank:b, savedNote:'Saved as v'+nv+' \u2014 prior versions preserved; cohort locks unchanged.'}); };
    v.bankSavedNote = st.savedNote;
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
    // validation
    v.vPeriods = [['d30','30 days'],['d60','60 days'],['d90','90 days'],['d180','180 days'],['y1','1 year']].map(pp => ({label:pp[1], off: pp[0]==='d180'||pp[0]==='y1', on: () => this.setState({vPeriod:pp[0]}), bg: st.vPeriod===pp[0] ? 'rgba(16,185,129,.14)' : 'transparent', fg: (pp[0]==='d180'||pp[0]==='y1') ? '#3A453D' : st.vPeriod===pp[0] ? GL : '#8FA396'}));
    const hires = D.hires.map(h => { const ov = st.ocRows[h.name]; return ov ? {...h, ...ov} : h; });
    v.vRows = hires.map(h => { const d = h[st.vPeriod] || {}; const f = x => x==null ? '\u2014' : x; return {name:h.name, readiness:h.readiness.toFixed(1), dials:f(d.dials), mtgs:f(d.mtgs), pipe:f(d.pipe), rev:f(d.rev), crm: d.crm!=null ? d.crm+'%' : '\u2014', mgr:f(d.mgr), coach:f(d.coach), ret:f(d.ret)}; });
    v.canRecord = isMgr;
    v.outcomeOpen = st.oc.open; v.outcomeBtnTxt = st.oc.open ? 'Close' : 'Record outcomes';
    v.toggleOutcome = () => this.setState({oc:{...this.state.oc, open:!this.state.oc.open, saved:''}});
    v.ocHire = st.oc.hire; v.setOcHire = e => this.setState({oc:{...this.state.oc, hire:e.target.value, saved:''}});
    v.ocPeriod = st.oc.period; v.setOcPeriod = e => this.setState({oc:{...this.state.oc, period:e.target.value, saved:''}});
    const OCF = [['dials','Dials / wk','e.g. 195'],['mtgs','Meetings','e.g. 10'],['pipe','Pipeline','e.g. $64K'],['rev','Revenue','e.g. $18K'],['crm','CRM %','e.g. 94'],['mgr','Mgr rating 1–5','e.g. 4.2']];
    v.ocFields = OCF.map(f => ({label:f[1], ph:f[2], val: st.oc.vals[f[0]] || '', set: e => this.setState({oc:{...this.state.oc, vals:{...this.state.oc.vals, [f[0]]:e.target.value}, saved:''}})}));
    v.saveOutcome = () => { const o = this.state.oc, vv = o.vals; const num = x => (x === undefined || x === '') ? null : (isNaN(Number(x)) ? x : Number(x)); const m = Number(vv.mgr); const row = {dials:num(vv.dials), mtgs:num(vv.mtgs), pipe:vv.pipe || null, rev:vv.rev || null, crm:num(vv.crm), mgr:num(vv.mgr), coach: vv.mgr ? (m >= 4 ? 'Strong' : m >= 3 ? 'Moderate' : 'Weak') : null, ret:'Active'}; this.setState({ocRows:{...this.state.ocRows, [o.hire]:{...(this.state.ocRows[o.hire] || {}), [o.period]:row}}, oc:{...o, vals:{}, saved:'Saved — ' + o.hire + ' · ' + o.period.replace('d','') + ' days.'}, vPeriod:o.period}); };
    v.ocSaved = st.oc.saved;
    // roadmap
    v.roadmap = [
      {phase:'Phase 1 \u00b7 wk 1\u20134', title:'Foundations', body:'Production authentication (SSO for staff, magic links for candidates), Supabase schema (candidates, stages, submissions, scores, versions, audit log), secure file & video storage with signed URLs, candidate-consent language reviewed by counsel.'},
      {phase:'Phase 2 \u00b7 wk 5\u20138', title:'Assessment engine', body:'Email invitations and reminders, interview scheduling integration (Google/Outlook), evaluator independence enforcement server-side, version-locked question bank, accommodation request routing.'},
      {phase:'Phase 3 \u00b7 wk 9\u201312', title:'Compliance & validation', body:'Employment-law review of all items and flows, I/O-psychologist review of competencies, anchors, and the work-drive inventory; adverse-impact monitoring pipeline; security review and pen test.'},
      {phase:'Phase 4 \u00b7 wk 13+', title:'Pilot & iterate', body:'Pilot with one hiring campaign, calibration training for evaluators, analytics on funnel and evaluator behavior, outcome tracking at 30/60/90/180/365 days. No predictive claims until formal validation completes (n \u2265 25).'}
    ];
    // settings
    v.retention = st.retention; v.setRetention = e => this.setState({retention:e.target.value});
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
    // schedule a combine
    const sessSeed = D.sessions || [];
    const schedCands = D.candidates.filter(c => c.stage === 4 && !sessSeed.some(s => s.candId === c.id) && !st.scheduled.some(s => s.candId === c.id));
    v.schCandOpts = schedCands.length ? schedCands.map(c => ({id:c.id, label: dispName(c) + ' · ' + c.role})) : [{id:'', label:'No candidates awaiting a session'}];
    const setS = k => e => this.setState({sch:{...this.state.sch, [k]:e.target.value, sent:''}});
    v.schCand = st.sch.cand; v.setSchCand = setS('cand'); v.schDate = st.sch.date; v.setSchDate = setS('date'); v.schTime = st.sch.time; v.setSchTime = setS('time');
    const evalUsers = users.filter(u => u.roles.includes('evaluator') && !st.deactivated[u.id]);
    v.evalOpts = evalUsers.map(u => ({id:u.id, label:u.short + ' · ' + u.title}));
    v.schE1 = st.sch.e1; v.setSchE1 = setS('e1'); v.schE2 = st.sch.e2; v.setSchE2 = setS('e2');
    const schC = schedCands.find(c => c.id === st.sch.cand);
    v.schLink = schC ? 'meet.peaksportsmgmt.com/combine-' + schC.anon.replace('Candidate #','') : '—';
    const sameEval = st.sch.e1 === st.sch.e2;
    const schOk = !!schC && !sameEval && st.sch.date.trim() && st.sch.time.trim();
    v.schWarn = st.sch.sent ? 'Invites sent — candidate portal updated; calendar holds placed for both evaluators.' : sameEval ? '⚠ Two different evaluators are required — independent scoring is the point.' : !schC ? 'Pick a candidate who has finished the SJT and has no session yet.' : '';
    v.schWarnColor = st.sch.sent ? GL : sameEval ? AMB : '#5C6B61';
    v.schBlocked = !schOk; v.schBtnBg = schOk ? G : '#20302680';
    const uShort = id => (users.find(u => u.id === id) || {}).short || id;
    v.sendSchedule = () => { const s = this.state.sch; const c = schedCands.find(x => x.id === s.cand); if (!c || s.e1 === s.e2) return; const entry = {candId:c.id, cand:c.name, when:s.date + ' · ' + s.time + ' CT', evals:uShort(s.e1) + ' + ' + uShort(s.e2), link:'meet.peaksportsmgmt.com/combine-' + c.anon.replace('Candidate #',''), ver:'v1.2', status:'Invites sent'}; const next = schedCands.filter(x => x.id !== c.id)[0]; this.setState({scheduled:[entry, ...this.state.scheduled], sch:{...s, cand: next ? next.id : '', sent:'yes'}}); };
    v.schedList = [...st.scheduled, ...sessSeed.map(s => ({...s, status:'Confirmed'}))];
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
    return v;
  }

  componentDidUpdate() { saveState(this.state); }
  render() { return <Template V={this.renderVals()} />; }
}
