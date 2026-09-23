// @ts-nocheck
// Editable defaults. Each can be changed in Settings (stored in the settings table); the code falls back to these.
export const FIRST_CALL_KIND = 'First call (phone screen)';
export const DEFAULT_SCHOOLS = ['Texas State Athletics', 'Texas Tech Athletics'];
export const DEFAULT_TA_STAGES = ['Applied', 'First call', 'Assessment', 'Combine', 'Final interview', 'Offer', 'Hired', 'Not moving forward'];
export const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
export const GRADE_COLOR = g => { const l = String(g || '')[0]; return l === 'A' ? '#34D399' : l === 'B' ? '#E9F0EA' : l === 'C' ? '#F5B84A' : (l === 'D' || l === 'F') ? '#F87171' : '#7E9186'; };
export const SETTINGS_MANAGERS_MAY_EDIT = ['callEvalPrompt', 'schools', 'taStages'];

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
