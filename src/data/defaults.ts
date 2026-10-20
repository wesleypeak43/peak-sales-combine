// @ts-nocheck
// Editable defaults. Each can be changed in Settings (stored in the settings table); the code falls back to these.
export const FIRST_CALL_KIND = 'First call (phone screen)';
// Schools / properties. A line may carry alternate names after '|' — "Incarnate Word Athletics | UIW | University of the Incarnate Word".
export const DEFAULT_SCHOOLS = ['Texas State Athletics | TXST | Texas State University', 'Texas Tech Athletics | TTU | Texas Tech University'];
export const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
export const GRADE_COLOR = g => { const l = String(g || '')[0]; return l === 'A' ? 'var(--c-hex-34d399)' : l === 'B' ? 'var(--c-hex-e9f0ea)' : l === 'C' ? 'var(--c-hex-f5b84a)' : (l === 'D' || l === 'F') ? 'var(--c-hex-f87171)' : 'var(--c-hex-7e9186)'; };
export const SETTINGS_MANAGERS_MAY_EDIT = ['callEvalPrompt', 'schools', 'taStages'];

// The hiring pipeline. Fixed in code because the board's behaviour depends on the stages: Mock pitch is optional (skippable),
// AD interview leads to an offer letter, an accepted offer with a confirmed start date fills the job.
export const TA_STAGES = [
  { id: 'initial', name: 'Initial interview', sub: '' },
  { id: 'second', name: '2nd round (RSD / Chief of Staff)', short: '2nd round', sub: 'Regional Sales Director / Chief of Staff' },
  { id: 'mock', name: 'Mock pitch', sub: 'Optional, not every candidate' },
  { id: 'vp', name: 'VP interview', sub: 'Quick conversation' },
  { id: 'h2h', name: 'Heart-to-heart', sub: 'Just a conversation' },
  { id: 'ad', name: 'AD interview', sub: '' },
  { id: 'offer', name: 'Offer letter', sub: 'Sent, waiting on an answer' },
  { id: 'hired', name: 'Hired', sub: 'Accepted · job marked Filled' },
  { id: 'nmf', name: 'Not moving forward', sub: 'Told and closed out' },
];
export const STAGE_NAMES = TA_STAGES.map(s => s.name);
export const DEFAULT_TA_STAGES = STAGE_NAMES;
// Stage names from the earlier board that still mean the same thing. Anything else is "stranded" and shown in a banner.
export const LEGACY_STAGE_MAP = { 'Offer': 'Offer letter', 'Hired': 'Hired', 'Not moving forward': 'Not moving forward' };
export const stageIndex = name => STAGE_NAMES.indexOf(name);

// ---- schools: parse the setting, normalize names, find likely duplicates ----
const STOP = new Set(['university', 'univ', 'college', 'athletics', 'athletic', 'the', 'of', 'at', 'sports', 'dept', 'department', 'and', '&']);
export function normSchool(s) {
  return String(s || '').toLowerCase().replace(/[’'".,()]/g, '').replace(/[-_/]+/g, ' ').split(/\s+/).filter(t => t && !STOP.has(t)).join(' ').trim();
}
// Acronyms a name is commonly shortened to: initials of every word, initials without filler words, and the same with a
// leading "University" assumed ("Incarnate Word" → iw, uiw; "Texas Tech University" → ttu, tt).
const MINOR = new Set(['of', 'the', 'and', 'at', '&']);
export function acronyms(name) {
  const words = String(name || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  if (words.length < 2 && !(words.length === 1 && words[0].length > 3)) return [];
  const all = words.map(w => w[0]).join('');
  const core = words.filter(w => !MINOR.has(w)).map(w => w[0]).join('');
  const noKind = words.filter(w => !MINOR.has(w) && !STOP.has(w)).map(w => w[0]).join('');
  const out = new Set([all, core, noKind, 'u' + noKind, noKind + 'u'].filter(a => a.length >= 2));
  return [...out];
}
// "Name | alias | alias" → { name, aliases, norms, acros }
export function parseSchools(list) {
  return (Array.isArray(list) ? list : []).map(line => {
    const parts = String(line || '').split('|').map(x => x.trim()).filter(Boolean);
    if (!parts.length) return null;
    const name = parts[0], aliases = parts.slice(1);
    const names = [name, ...aliases];
    return { name, aliases, norms: names.map(normSchool).filter(Boolean), acros: [...new Set(names.flatMap(acronyms))] };
  }).filter(Boolean);
}
export const schoolNames = list => parseSchools(list).map(s => s.name);
// The saved property a typed school refers to: exact (by any alias) → { exact }, close (shared words / prefix) → { suggest }, else null.
export function matchSchool(input, list) {
  const n = normSchool(input); if (!n) return null;
  const schools = parseSchools(list);
  const raw = String(input || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const exact = schools.find(s => s.norms.includes(n) || (raw.length >= 2 && raw.length <= 6 && s.acros.includes(raw)));
  if (exact) return { exact: exact.name };
  const toks = new Set(n.split(' '));
  let best = null, bestScore = 0;
  schools.forEach(s => s.norms.forEach(m => {
    const mt = new Set(m.split(' '));
    const inter = [...toks].filter(t => mt.has(t)).length;
    const score = inter / Math.max(toks.size, mt.size) + (m.startsWith(n) || n.startsWith(m) ? 0.5 : 0) + (String(s.name).toLowerCase().replace(/[^a-z]/g, '').startsWith(n.replace(/[^a-z]/g, '')) ? 0.3 : 0);
    if (score > bestScore) { bestScore = score; best = s; }
  }));
  return best && bestScore >= 0.5 ? { suggest: best.name } : null;
}
// Jobs that are probably the same job: same role, same normalized school (via the saved aliases). Returns { key → [jobs] }.
export function dupeGroups(jobs, schoolList) {
  const schools = parseSchools(schoolList);
  const canon = prog => { const n = normSchool(prog); const hit = schools.find(s => s.norms.includes(n)); return hit ? normSchool(hit.name) : n; };
  const groups = {};
  (jobs || []).forEach(j => { if (j.merged) return; const k = (j.title || '') + '|' + canon(j.program); (groups[k] = groups[k] || []).push(j); });
  return groups;
}

// Where a self-applied candidate came from, read from the utm_* / src / fbclid parameters the browser captured.
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'ref', 'fbclid', 'gclid'];
export function sourceLabel(c) {
  const src = (c && c.source) || 'invite';
  if (src === 'manual') return 'Added by staff';
  if (src !== 'self') return 'Invited by staff';
  const u = (c && c.utm) || {};
  const s = String(u.utm_source || u.src || u.ref || '').toLowerCase();
  if (/facebook|^fb$|meta|instagram|^ig$/.test(s) || u.fbclid) return 'Facebook ad';
  if (/teamwork/.test(s)) return 'Teamworks';
  if (/linkedin/.test(s)) return 'LinkedIn';
  if (/indeed/.test(s)) return 'Indeed';
  if (/google/.test(s) || u.gclid) return 'Google';
  if (s) return s.charAt(0).toUpperCase() + s.slice(1);
  return 'Careers page';
}
// Ready-made tracking links per channel: the job's application link with the parameters Facebook / Teamworks reports need.
export const CHANNEL_LINKS = [
  { id: 'facebook', label: 'Facebook / Instagram ad', q: 'utm_source=facebook&utm_medium=paid_social' },
  { id: 'teamworks', label: 'Teamworks posting', q: 'utm_source=teamworks&utm_medium=job_board' },
  { id: 'linkedin', label: 'LinkedIn', q: 'utm_source=linkedin&utm_medium=social' },
];
export const slugify = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

// The instructions the first-call evaluation follows. Max (or any manager) can rewrite this in Settings or from the transcript form.
export const DEFAULT_CALL_PROMPT = `You are preparing the next round of Peak Sports MGMT leadership for a candidate they have not met. You will read the transcript of the candidate's first phone call with our screener, plus the screener's own notes.

Produce:
1. An executive summary of the call: what the candidate actually said about their background, why they want this role, their sales experience and any numbers they gave, compensation expectations, timeline, location and relocation, and anything unusual.
2. "Already covered": the questions the screener asked and the candidate answered, so the next interviewer does not spend the first ten minutes repeating them.
3. "Ask next": the three to five questions the next round should open with, based on what was vague, contradictory, or promising.
4. Strengths and concerns against the role profile provided.
5. A letter grade from A+ to F for fit with THIS role, with one sentence of rationale.

Grade guide: A range = strong evidence on the critical competencies, clear motivation, no red flags. B = solid, with specific gaps to validate. C = mixed, meaningful concerns. D = weak fit. F = disqualifying (dishonesty, unwillingness to do the core work, not authorized to work, compensation far outside range).

Weigh the screener's notes heavily where they report things a transcript cannot show (energy, preparedness, punctuality). Be specific and quote the candidate where it matters. Never comment on age, gender, race, disability, religion, family status, accent, or appearance.`;
