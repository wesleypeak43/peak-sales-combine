// @ts-nocheck
// Demo data: competencies, anchors, source weights, questions, candidates, staff, decisions.
// Replace with real records (Supabase / API) when going to production.
export const PEAK_DATA = {
  comps: [
    {id:'hd', name:'Hunter Drive', d:'Creates opportunities instead of waiting for leads or direction.'},
    {id:'sa', name:'Self-Accountability', d:'Owns results, tells the truth about performance, avoids excuses.'},
    {id:'co', name:'Coachability', d:'Absorbs feedback, changes behavior, improves on the next attempt.'},
    {id:'re', name:'Resilience', d:'Maintains productive action through rejection and slow results.'},
    {id:'rs', name:'Resourcefulness', d:'Produces results despite limited leads, tools, budget, or brand.'},
    {id:'sj', name:'Sales Judgment', d:'Discovers needs, communicates value, handles objections, asks for commitment.'},
    {id:'de', name:'Disciplined Execution', d:'Prepares, follows through, uses systems, performs without relying on motivation.'},
    {id:'it', name:'Integrity & Team Commitment', d:'Competes hard without misleading clients or damaging the team.'}
  ],
  anchors: {
    hd:{1:'Waits for supplied leads, detailed instructions, or favorable conditions.',3:'Takes reasonable initiative but relies on familiar channels.',5:'Creates a quantified, prioritized opportunity plan and begins acting without waiting for permission.'},
    sa:{1:'Blames circumstances or other people; cannot identify a personal contribution.',3:'Acknowledges some responsibility and identifies a reasonable corrective action.',5:'Clearly owns the outcome, quantifies the gap, changes behavior, and shows improved subsequent performance.'},
    co:{1:'Defends the original approach or repeats it without meaningful adjustment.',3:'Implements part of the feedback with moderate improvement.',5:'Accurately interprets the feedback, materially changes the approach, and improves immediately.'},
    re:{1:'Effort and quality collapse after rejection or a slow stretch.',3:'Recovers after setbacks with some delay or outside prompting.',5:'Maintains or raises activity through adversity and converts setbacks into adjusted plans.'},
    rs:{1:'Stalls without leads, budget, or brand support; requests resources before acting.',3:'Finds workable paths using available channels when prompted.',5:'Invents credible new paths to opportunity from public information and existing relationships, with numbers.'},
    sj:{1:'Pitches features without discovery; concedes or freezes at the first objection.',3:'Runs basic discovery and handles common objections adequately.',5:'Uncovers the buyer\u2019s real need, tailors value, reframes objections, and asks for a specific commitment.'},
    de:{1:'No visible system; preparation and follow-through are inconsistent.',3:'Uses basic routines and follows through on most commitments.',5:'Describes a concrete operating system \u2014 preparation, tracking, review \u2014 and evidence of consistent execution.'},
    it:{1:'Willing to mislead, overpromise, or undercut teammates to win.',3:'Generally honest; navigates gray areas with guidance.',5:'Declines unethical shortcuts explicitly, protects commitments, and competes hard within the rules.'}
  },
  weights: [
    {id:'sim', label:'Sales simulation & objections', w:25, comps:['sj','hd','re','it']},
    {id:'repitch', label:'Coached re-pitch', w:15, comps:['co','sj']},
    {id:'case', label:'Resourcefulness case', w:15, comps:['rs','hd','de']},
    {id:'interview', label:'Structured behavioral interview', w:25, comps:['sa','de','it','re']},
    {id:'sjt', label:'Sales decisions (self-report + scenarios)', w:20, comps:['sj','sa','it','rs','hd','re','de']}
  ],
  scale: ['Strongly disagree','Disagree','Slightly disagree','Slightly agree','Agree','Strongly agree'],
  inventory: [
    {t:'When I see an opportunity nobody owns, I act on it before being asked.', f:'Initiative', k:1},
    {t:'I prefer to wait for clear instructions before starting new work.', f:'Initiative', k:-1},
    {t:'I have started projects with no guarantee anyone would notice or reward them.', f:'Initiative', k:1},
    {t:'After several rejections in a row, I keep the same level of effort.', f:'Persistence', k:1},
    {t:'I tend to move on quickly from goals that become difficult.', f:'Persistence', k:-1},
    {t:'I have pursued a goal for months after early results were poor.', f:'Persistence', k:1},
    {t:'When I miss a target, my first instinct is to examine what I did.', f:'Accountability', k:1},
    {t:'Most of my setbacks have come from circumstances outside my control.', f:'Accountability', k:-1},
    {t:'I report bad numbers as quickly as I report good ones.', f:'Accountability', k:1},
    {t:'I rehearse important conversations before I have them.', f:'Preparation', k:1},
    {t:'I do my best work improvising with no plan.', f:'Preparation', k:-1},
    {t:'I keep records accurate even when nobody checks them.', f:'Preparation', k:1},
    {t:'When my usual approach stops working, I change it quickly.', f:'Adaptability', k:1},
    {t:'I stick with the way I have always done things, even when conditions change.', f:'Adaptability', k:-1},
    {t:'I regularly ask people to point out what I am missing.', f:'Adaptability', k:1},
    {t:'I would rather lose a deal than overstate what we can deliver.', f:'Ethical restraint', k:1},
    {t:'Bending the truth is sometimes necessary to hit a number.', f:'Ethical restraint', k:-1},
    {t:'I honor commitments I make even when they become inconvenient.', f:'Ethical restraint', k:1},
    {t:'I set targets for myself above what is required.', f:'Achievement', k:1},
    {t:'Meeting the minimum expectation is enough for me.', f:'Achievement', k:-1},
    {t:'I track my own numbers without being asked to.', f:'Achievement', k:1},
    {t:'Blunt feedback usually improves my next attempt.', f:'Feedback response', k:1},
    {t:'Criticism of my work tends to stay on my mind and slow me down.', f:'Feedback response', k:-1},
    {t:'I have changed a specific behavior because of coaching within the last year.', f:'Feedback response', k:1}
  ],
  scenarios: [
    {title:'Empty market', ver:'1.2', body:'You have just joined a property with almost no existing prospect list. Your manager is traveling for two weeks and expects momentum when she returns.',
     opts:['Ask your manager to source lead lists before beginning outreach so your time is spent efficiently.',
       'Build a 100-account map from public sources \u2014 local businesses, past game-day programs, chamber directories \u2014 prioritize by fit and budget likelihood, and start calls today.',
       'Spend the first two weeks refining collateral and messaging so that outreach converts better once it begins.',
       'Focus exclusively on the two biggest brands in the market, since one win would change everything.'], best:1, worst:2},
    {title:'Two weeks, no meetings', ver:'1.1', body:'You have made consistent outbound attempts for two weeks and have not booked a single meeting.',
     opts:['Keep the same script and increase volume \u2014 activity solves everything eventually.',
       'Audit your own outreach data, change one variable at a time, ask a top performer to review two of your calls, and raise attempts while you test.',
       'Tell your manager the territory appears to be unworkable and ask to be reassigned.',
       'Pause outbound for a week to rebuild your target list from scratch.'], best:1, worst:2},
    {title:'Budget frozen', ver:'1.0', body:'A sponsor you have courted for a month says their budget is frozen for the fiscal year.',
     opts:['Push for a signature this quarter with a steep discount before the freeze fully applies.',
       'Ask about the freeze \u2014 timing, exceptions, and whose budget it touches \u2014 propose a smaller pilot from a different budget line, and set a specific revisit date.',
       'Mark the account closed-lost and move on to protect your time.',
       'Offer to deliver the sponsorship assets now and invoice after the freeze lifts, without approval.'], best:1, worst:3},
    {title:'Broken CRM data', ver:'1.0', body:'You discover that much of the CRM data you inherited is incomplete or inaccurate \u2014 wrong contacts, stale notes, missing history.',
     opts:['Keep a private spreadsheet with correct data and work from that instead.',
       'Verify records as you touch them, log corrections in the CRM, and flag the pattern to your manager with a proposed cleanup plan.',
       'Stop prospecting until the data is fully cleaned so no effort is wasted.',
       'Ignore the history entirely and treat every account as brand new.'], best:1, worst:2},
    {title:'The impossible promise', ver:'1.3', body:'A prospect says they will sign this week if you guarantee a specific attendance figure at sponsored events \u2014 something Peak cannot ethically promise.',
     opts:['Agree to the guarantee \u2014 attendance will probably be close enough, and you can manage it later.',
       'Decline the request and end the conversation to avoid wasting more time.',
       'State plainly what you can commit to, share the real historical attendance range, and propose measurable alternatives like impressions and activation metrics.',
       'Find contract wording that implies the figure without formally guaranteeing it.'], best:2, worst:0},
    {title:'Missed monthly target', ver:'1.0', body:'You finished the month at 70% of your revenue target. Your one-on-one with your manager is tomorrow.',
     opts:['Present the gap with exact numbers, name the parts you own, and walk in with a changed plan for next month.',
       'Prepare context on market conditions and seasonal factors that explain the shortfall.',
       'Wait for your manager to raise it \u2014 no need to lead with bad news.',
       'Commit to doubling next month\u2019s target to make up the difference.'], best:0, worst:2},
    {title:'Blunt coaching', ver:'1.0', body:'After listening to one of your calls, your manager says: \u201cYou talked the whole time. You have no idea what that buyer actually needs.\u201d',
     opts:['Explain the context of the call \u2014 that buyer was unusually quiet and needed the extra detail.',
       'Thank them for the feedback and continue with the approach that has felt most natural.',
       'Restate the feedback in your own words, ask for one example from the call, change your next call the same day, and ask them to listen again.',
       'Ask them to deliver feedback less bluntly in the future so it is easier to act on.'], best:2, worst:3},
    {title:'Whale vs. pipeline', ver:'1.1', body:'A national brand shows real interest \u2014 a deal worth more than your entire quota. Pursuing it properly would consume most of your prospecting time for a month.',
     opts:['Go all-in on the national brand \u2014 opportunities like this justify pausing everything else.',
       'Decline to chase it and keep working smaller, higher-probability deals only.',
       'Time-box the pursuit, hold a minimum weekly floor of new prospecting activity, and run the pipeline math to keep coverage if it stalls.',
       'Hand the decision to your manager and follow whatever they choose.'], best:2, worst:3}
  ],
  objections: ['\u201cI already ate.\u201d','\u201cYour competitor is cheaper.\u201d','\u201cI don\u2019t normally eat chicken.\u201d','\u201cI don\u2019t have time to decide.\u201d'],
  evQs: [
    'What is the hardest measurable goal you have pursued without someone forcing you to pursue it? Provide the starting point, goal, actions, and result.',
    'Tell us about a time you missed an important target. What portion did you personally own, and what changed afterward?',
    'Describe a situation where you outperformed the resources, leads, budget, or brand recognition available to you.',
    'What is the most difficult coaching or feedback you have received? What behavior changed as a result?',
    'Describe the personal operating system you use to perform consistently when motivation is low.'
  ],
  caseQs: ['Your first five actions','Prospect prioritization strategy','Week-one activity targets','Basic pipeline math','Three creative ways to generate opportunities','What you would ask your manager or university partner for','What you would do if the first two weeks produced no meetings'],
  realities: ['Consistent outbound prospecting, every week','Frequent rejection \u2014 most conversations end in no','Transparent performance accountability: your numbers are visible','CRM discipline is non-negotiable','Limited resources at some properties','Relationships with university stakeholders and local businesses','Pressure to produce measurable revenue','Travel or on-campus work when applicable','You create activity \u2014 you do not wait for opportunity'],
  candidates: [
    {id:'marcus', name:'Marcus Reeves', anon:'Candidate #1042', role:'Entry Level Sales Professional', loc:'Dallas, TX', school:'SMU', stage:5, stageLabel:'Combine complete \u00b7 decision pending', readiness:3.4, r1:4.4, r2:4.5, agree:'Flagged', sjt:64, wdi:71, appEv:'Medium',
     comp:{hd:4.3,sa:2.4,co:2.8,re:3.8,rs:3.5,sj:4.2,de:2.9,it:3.4},
     strength:{sim:'High',repitch:'Medium',case:'Medium',interview:'High',sjt:'Medium',app:'Medium',wdi:'Low'},
     strongest:'Commanding first pitch \u2014 surfaced buyer needs unprompted, reframed the price objection, closed with a clear ask. (Sim, R1, Eval: J. Whitfield)',
     concerns:'Attributed the missed Q3 target entirely to territory quality; could not name a personal change when asked twice. (Interview Q2; Evidence Q2 gave no owned portion.)',
     open:'Follow-through evidence is thin \u2014 probe CRM discipline and week-over-week consistency in a follow-up reference.',
     rec:'Hold',
     sar:{s:'Territory with 3 legacy accounts, quota of $180K.', a:'\u201cWorked my network hard and stayed visible with the big logos.\u201d No activity numbers provided despite prompt.', r:'Finished at 71% of quota; attributed gap to \u201cdead territory.\u201d', l:'Named no behavior change. Said next year \u201cthe territory should turn.\u201d'},
     scores:{a:{sj:4.5,hd:4.5,re:4.0,sa:4.0}, b:{sj:4.0,hd:4.0,re:3.5,sa:2.0}}},
    {id:'dana', name:'Dana Okafor', anon:'Candidate #1038', role:'Entry Level Sales Professional', loc:'San Marcos, TX', school:'UT San Antonio', stage:5, stageLabel:'Combine complete \u00b7 decision pending', readiness:4.4, r1:2.9, r2:4.3, agree:'High', sjt:88, wdi:83, appEv:'High',
     comp:{hd:3.9,sa:4.6,co:4.8,re:4.2,rs:4.7,sj:3.8,de:4.5,it:4.6},
     strength:{sim:'Medium',repitch:'High',case:'High',interview:'High',sjt:'High',app:'High',wdi:'Medium'},
     strongest:'Re-pitch fully integrated the coaching \u2014 rebuilt the opening around the buyer\u2019s stated need and asked for a specific next step. R1\u2192R2 delta +1.4, largest in cohort. (Sim R2, both evaluators)',
     concerns:'First pitch was hesitant and feature-led; needed the coaching prompt to run discovery. Watch early-call confidence in ramp.',
     open:'None material. Confirm comfort with on-campus travel cadence.',
     rec:'Advance',
     sar:{s:'Campus fundraising role, $8K prior-year baseline, no donor list.', a:'Built a 220-contact list from public directories, ran 25 calls/day, tracked everything in a sheet reviewed each Friday.', r:'$31K raised \u2014 288% of baseline \u2014 in one semester.', l:'\u201cThe list and the Friday review mattered more than any single call.\u201d'},
     scores:{a:{sj:3.0,hd:4.0,re:4.0,sa:4.5}, b:{sj:2.8,hd:3.9,re:4.3,sa:4.6}}},
    {id:'tyler', name:'Tyler Nguyen', anon:'Candidate #1051', role:'Entry Level Sales Professional', loc:'Waco, TX', school:'Baylor', stage:4, stageLabel:'Combine scheduled \u00b7 Thu 2:00 PM', readiness:null, r1:null, r2:null, agree:'\u2014', sjt:78, wdi:76, appEv:'High',
     comp:{hd:3.8,sa:3.6,co:3.9,re:3.7,rs:3.5,sj:3.4,de:3.8,it:4.1},
     strength:{sim:'\u2014',repitch:'\u2014',case:'\u2014',interview:'\u2014',sjt:'High',app:'High',wdi:'Medium'},
     strongest:'Application evidence is specific and quantified across all five questions.', concerns:'\u2014 pending combine.', open:'Run the full combine Thursday.', rec:null, sar:{s:'D2C resale side business started junior year.', a:'Sourced inventory from estate sales, built pricing model, 4 hrs/day around classes.', r:'$18K profit over 14 months.', l:'\u201cConsistency of sourcing beat any single flip.\u201d'}, scores:null},
    {id:'sofia', name:'Sofia Ramirez', anon:'Candidate #1057', role:'Director of Service', loc:'Lubbock, TX', school:'Texas Tech', stage:2, stageLabel:'Application submitted \u00b7 in review', readiness:null, r1:null, r2:null, agree:'\u2014', sjt:null, wdi:null, appEv:'In review',
     comp:null, strength:null, strongest:'\u2014', concerns:'\u2014', open:'Application review due Friday.', rec:null, sar:null, scores:null},
    {id:'jalen', name:'Jalen Brooks', anon:'Candidate #1049', role:'Director of Sales', loc:'Houston, TX', school:'U of Houston', stage:3, stageLabel:'Work-drive inventory in progress', readiness:null, r1:null, r2:null, agree:'\u2014', sjt:null, wdi:null, appEv:'Medium',
     comp:null, strength:null, strongest:'\u2014', concerns:'\u2014', open:'Awaiting Stage 3\u20134 completion.', rec:null, sar:null, scores:null},
    {id:'maya', name:'Maya Chen', anon:'Candidate #1063', role:'Entry Level Sales Professional', loc:'San Marcos, TX', school:'Texas State', stage:4, stageLabel:'SJT complete \u00b7 awaiting combine', readiness:null, r1:null, r2:null, agree:'\u2014', sjt:81, wdi:74, appEv:'High',
     comp:null, strength:null, strongest:'Evidence answers quantified on all five questions; strongest on resourcefulness (Q3).', concerns:'\u2014 pending combine.', open:'Schedule the combine.', rec:null, sar:null, scores:null},
    {id:'priya', name:'Priya Shah', anon:'Candidate #0991', role:'Entry Level Sales Professional', loc:'Austin, TX', school:'UT Austin', stage:6, stageLabel:'Hired \u00b7 Cohort 2026-A', readiness:4.1, r1:3.4, r2:4.2, agree:'High', sjt:82, wdi:80, appEv:'High',
     comp:{hd:4.2,sa:4.3,co:4.4,re:4.0,rs:4.1,sj:3.9,de:4.2,it:4.5},
     strength:{sim:'High',repitch:'High',case:'High',interview:'High',sjt:'High',app:'High',wdi:'Medium'},
     strongest:'Consistent evidence across every source; strongest resourcefulness case in her cohort.', concerns:'None recorded.', open:'\u2014', rec:'Advance', sar:null, scores:null}
  ],
  funnel: [
    {label:'Applied', n:148}, {label:'RJP acknowledged', n:121}, {label:'Application reviewed', n:64}, {label:'Sales decisions complete', n:41}, {label:'Combine complete', n:18}, {label:'Offers extended', n:6}
  ],
  // The three hiring profiles. `prop` is only a description here — the school / property a candidate is being hired for is typed per candidate when they are invited.
  roles: [
    {title:'Entry Level Sales Professional', prop:'Hiring for potential \u2014 raw traits over experience', open:3, apps:62, stage:'Combine week'},
    {title:'Director of Sales', prop:'Owns a number for a property or market', open:1, apps:38, stage:'Sourcing'},
    {title:'Director of Service', prop:'Grows the account, not just serves it', open:1, apps:22, stage:'Application review'}
  ],
  roleOptions: ['Entry Level Sales Professional', 'Director of Sales', 'Director of Service'],
  hires: [
    {name:'Priya Shah', readiness:4.1, d30:{dials:212,mtgs:9,pipe:'$41K',rev:'$0',crm:98,mgr:4.5,coach:'Strong',ret:'Active'}, d60:{dials:198,mtgs:11,pipe:'$88K',rev:'$12K',crm:97,mgr:4.5,coach:'Strong',ret:'Active'}, d90:{dials:205,mtgs:13,pipe:'$121K',rev:'$36K',crm:98,mgr:4.7,coach:'Strong',ret:'Active'}},
    {name:'Jordan Miles', readiness:3.6, d30:{dials:186,mtgs:6,pipe:'$22K',rev:'$0',crm:84,mgr:3.8,coach:'Moderate',ret:'Active'}, d60:{dials:174,mtgs:8,pipe:'$47K',rev:'$8K',crm:88,mgr:4.0,coach:'Moderate',ret:'Active'}, d90:{dials:181,mtgs:9,pipe:'$63K',rev:'$19K',crm:90,mgr:4.0,coach:'Strong',ret:'Active'}},
    {name:'Alexis Grant', readiness:3.9, d30:{dials:201,mtgs:8,pipe:'$35K',rev:'$5K',crm:95,mgr:4.2,coach:'Strong',ret:'Active'}, d60:{dials:190,mtgs:10,pipe:'$71K',rev:'$21K',crm:96,mgr:4.3,coach:'Strong',ret:'Active'}, d90:{dials:null,mtgs:null,pipe:null,rev:null,crm:null,mgr:null,coach:null,ret:'Active'}}
  ],
  audit: [
    {t:'Today 9:31 AM', who:'A. Castillo (Admin)', what:'Viewed candidate portal as M. Reeves (read-only)'},
    {t:'Today 9:14 AM', who:'J. Whitfield (Evaluator)', what:'Submitted Round 2 scores \u2014 M. Reeves (independent, pre-reveal)'},
    {t:'Tue 4:30 PM', who:'R. Delgado (Hiring manager)', what:'Recorded decision: Hold \u2014 M. Reeves'},
    {t:'Yesterday 4:02 PM', who:'A. Castillo (Admin)', what:'Edited SJT scenario \u201cThe impossible promise\u201d \u2192 saved as v1.3'},
    {t:'Yesterday 11:40 AM', who:'System', what:'Calibration flag raised: Self-Accountability \u0394 2.0 on M. Reeves'},
    {t:'Mon 3:15 PM', who:'R. Ellis (HR/Compliance)', what:'Viewed fairness audit \u2014 selection rates by stage'},
    {t:'Mon 9:00 AM', who:'System', what:'Cohort 2026-B locked to assessment version v1.2'}
  ],
  users: [
    {id:'castillo', name:'Alicia Castillo', short:'A. Castillo', title:'Director of Talent Acquisition', email:'acastillo@peaksportsmgmt.com', roles:['admin','evaluator'], status:'Active'},
    {id:'delgado', name:'Ramón Delgado', short:'R. Delgado', title:'Regional Sales Director', email:'rdelgado@peaksportsmgmt.com', roles:['manager','evaluator'], status:'Active'},
    {id:'ellis', name:'Rachel Ellis', short:'R. Ellis', title:'Chief of Staff', email:'rellis@peaksportsmgmt.com', roles:['leadership'], status:'Active'},
    {id:'whitfield', name:'Jordan Whitfield', short:'J. Whitfield', title:'Athletic Director · Texas State', email:'jwhitfield@txstate.edu', roles:['evaluator'], status:'Active', external:true}
  ],
  roleDefs: {
    evaluator:{label:'Evaluator', d:'Scores assigned combine sessions and interviews. Sees only those candidates — never the pipeline, and never the other evaluator’s scores before submitting.'},
    manager:{label:'Hiring manager', d:'Pipeline, application review, profiles, comparison, accommodation inbox, decisions, outcome entry.'},
    admin:{label:'Admin', d:'Everything a hiring manager has, plus scheduling, question bank, weights, staff & roles, settings.'},
    leadership:{label:'Leadership / Compliance', d:'Funnel, decision log, calibration, validation, fairness audit, retention & deletion. Read-only on candidates.'}
  },
  invite: {name:'Alex Carter', first:'Alex', role:'Entry Level Sales Professional', prop:'Texas State Athletics', due:'Fri, Sep 11', session:'Thu, Sep 10 · 2:00 PM CT', link:'meet.peaksportsmgmt.com/combine-1064', track:'assessment'},
  sessions: [
    {candId:'tyler', cand:'Tyler Nguyen', when:'Thu, Sep 10 · 2:00 PM CT', evals:'R. Delgado + J. Whitfield', link:'meet.peaksportsmgmt.com/combine-1051', ver:'v1.2'}
  ],
  interviewQs: [
    {comp:'sa', q:'Tell me about a target you missed. Walk me through the numbers, and the portion you personally owned.', probes:['What did you change the following month?','What would your manager say you owned?']},
    {comp:'de', q:'Describe the weekly operating system you use to perform when motivation is low — preparation, tracking, review.', probes:['Walk me through last week specifically.','What happens when you skip it?']},
    {comp:'it', q:'Tell me about a time winning would have required stretching the truth or undercutting a teammate. What did you do?', probes:['What did it cost you?','Who else knew about the choice?']},
    {comp:'re', q:'Describe the longest stretch of rejection or slow results you have worked through. What did your activity look like week to week?', probes:['When did you consider stopping?','What did you adjust, and when?']}
  ],
  applications: {
    sofia: [
      'Goal: raise $5K for our club sport program by March with no prior fundraising experience. Started at $0 in October. I built a list of 60 local businesses and alumni, sent three asks a day, and tracked every reply in a spreadsheet. Result: $6,200 by February — 124% of goal.',
      'Missed a $3K sponsorship target for our spring tournament by about $900. I owned the late start — I began outreach in February instead of December. For the next event I built the list six weeks earlier and finished 10% over target.',
      'Our team had no travel budget for a regional tournament. I negotiated a van from a local dealership in exchange for a logo on our warmups, and got a hotel to comp two rooms for a social post. Zero out-of-pocket.',
      'A coach told me I “talk past the answer.” I started writing the question down before answering and pausing two seconds. It was uncomfortable, but my sponsor meetings got shorter and closed more often.',
      'Sunday: plan the week and set a daily ask target. Every morning: 30 minutes of outreach before anything else. Friday: count asks, replies, and dollars, and write down one thing to change.'
    ]
  },
  decisions: [
    {candId:'marcus', cand:'Marcus Reeves', role:'Entry Level Sales Professional', decision:'Hold', by:'R. Delgado (Hiring manager)', t:'Tue 4:30 PM', rationale:'Self-Accountability flag open (Whitfield 4.0 vs. Delgado 2.0). Interview Q2 and Evidence Q2 both show no owned portion of the missed Q3 target. Decision deferred until the calibration discussion Thursday and one follow-through reference.', agree:'Flagged'},
    {candId:'priya', cand:'Priya Shah', role:'Entry Level Sales Professional', decision:'Advance', by:'R. Delgado (Hiring manager)', t:'Aug 28 · 11:05 AM', rationale:'Readiness 4.1. Both evaluators within 0.5 on every competency. Strongest resourcefulness case in cohort 2026-A; consistent evidence across application, SJT, and both combine exercises. Offer extended; start with cohort 2026-A.', agree:'High'}
  ],
  accoms: [
    {id:'a1', candId:'jalen', cand:'Jalen Brooks · Candidate #1049', t:'Yesterday 6:12 PM', txt:'I use a screen reader. Can you confirm the inventory and scenarios work with it, and can I have extra time on anything timed?', status:'Open'},
    {id:'a2', candId:'tyler', cand:'Tyler Nguyen · Candidate #1051', t:'Aug 30', txt:'I have a documented processing disability and am requesting extended preparation time for the live exercise.', status:'Approved', resolution:'+50% prep time on Exercise A (7:30 instead of 5:00). The cockpit timer adjusts automatically; evaluators see only “accommodation in place” — never the reason.'}
  ],
  weightsByRole: {
    'Entry Level Sales Professional': {sim:25,repitch:15,case:15,interview:25,sjt:20},
    'Director of Sales': {sim:20,repitch:10,case:25,interview:30,sjt:15},
    'Director of Service': {sim:20,repitch:10,case:20,interview:30,sjt:20}
  },
  // Role → Sales Decisions profile. Legacy titles stay mapped so candidates invited under the old names still score.
  profileByRole: {'Entry Level Sales Professional':'entry','Director of Sales':'senior','Director of Service':'service',
    'Sponsorship Sales Consultant':'entry','Ticket Sales Consultant':'entry','Partnership Development Manager':'senior','Regional Sales Director':'senior','Account Manager':'service'}
};
