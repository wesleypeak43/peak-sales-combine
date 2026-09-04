// @ts-nocheck
// Sales Decisions item bank + scoring engine (three role profiles). Bands describe evidence; the hiring panel decides.
// PRODUCTION NOTE: option scores, floors and thresholds must move server-side — this module must never ship to a candidate's browser.
// Peak Sports Management — sales candidate assessment bank + scoring engine.
// Option score scale: 100 elite · 78 strong · 50 neutral · 28 mild concern · 6 red flag.

const E = 100, S = 78, N = 50, M = 28, R = 6;

export const SIGNAL = s =>
  s >= 95 ? "Elite indicator" :
  s >= 70 ? "Strong indicator" :
  s >= 45 ? "Neutral" :
  s >= 20 ? "Mild concern" : "Major red flag";

// sc(id, comp, prompt, options) — options: [score, text, flagLabel?, positiveLabel?]
const sc = (id, comp, text, opts) => ({
  id, comp, text, kind: "scenario",
  opts: opts.map(([score, t, flag, positive], i) => ({ i, score, text: t, flag, positive })),
});
const lk = (id, comp, text, reverse) => ({ id, comp, text, kind: "likert", reverse: !!reverse });
const fc = (id, a, b) => ({ id, kind: "pair", a, b }); // a/b: [comp, score, text]
const bh = (id, text, hint) => ({ id, kind: "behavioral", text, hint });
// wr(id, comp, prompt, options) — options: [text, badness 0-3]. Picking the worst action scores highest.
const wr = (id, comp, text, opts) => ({
  id, comp, text, kind: "worst",
  opts: opts.map(([t, bad], i) => ({ i, text: t, bad, score: [5, 25, 55, 100][bad] })),
});

/* ─────────────────────────── ENTRY-LEVEL SALES ─────────────────────────── */

const ENTRY = {
  id: "entry",
  name: "Entry-Level Sales",
  tag: "Hiring for potential, not resume",
  blurb: "Raw traits over experience. We are looking for someone with the materials to become an elite seller.",
  experienceWeighting: "Low. Limited sales experience, unfamiliar terminology, and no quota history are not penalized.",
  competencies: {
    coach: { name: "Coachability", weight: 18, floor: 55, critical: true },
    hunger: { name: "Hunger / Drive", weight: 18, floor: 50, critical: true },
    resil: { name: "Resilience", weight: 15, floor: 45, critical: false },
    init: { name: "Initiative", weight: 14, floor: 45, critical: false },
    own: { name: "Ownership", weight: 13, floor: 55, critical: true },
    compete: { name: "Competitiveness", weight: 12, floor: 40, critical: false },
    solve: { name: "Problem Solving", weight: 10, floor: 40, critical: false },
  },
  likert: [
    lk("e-l1", "hunger", "I keep a running number in my head of where I am against my target."),
    lk("e-l2", "hunger", "When the week is already won, I start on next week rather than coast."),
    lk("e-l3", "coach", "I would rather be told exactly what I'm doing wrong than be encouraged."),
    lk("e-l4", "coach", "I need to understand why a method works before I'm willing to try it.", true),
    lk("e-l5", "resil", "A no from a decision-maker is information to me, not a verdict."),
    lk("e-l6", "resil", "A few bad days in a row changes how I show up on the fourth.", true),
    lk("e-l7", "own", "When something goes wrong, the first thing I look at is what I did."),
    lk("e-l8", "own", "I keep commitments I made to myself that nobody is checking on."),
    lk("e-l9", "compete", "I keep score even when nobody is keeping score."),
    lk("e-l10", "init", "I have started work that nobody assigned to me and finished it."),
    lk("e-l11", "solve", "I get further on my own before I ask for help than most people I work with."),
    lk("e-l12", "hunger", "I have something to prove right now."),
  ],
  pairs: [
    fc("e-p1", ["coach", E, "Work for someone who tells me exactly what I'm doing wrong"], ["own", N, "Work for someone who trusts me to figure it out"]),
    fc("e-p2", ["init", E, "Be handed a hard job with no instructions"], ["solve", N, "Be handed a hard job with a clear playbook"]),
    fc("e-p3", ["compete", E, "Be the top performer on a struggling team"], ["own", N, "Be middle of the pack on a team that's winning"]),
    fc("e-p4", ["hunger", E, "A month where I made 400 calls and closed two"], ["resil", N, "A month where I made 80 calls and closed two"]),
    fc("e-p5", ["resil", E, "A job where I get told no fifty times a week"], ["solve", M, "A job where the work is hard but people are receptive"]),
    fc("e-p6", ["init", E, "Take the territory nobody has cracked"], ["compete", N, "Take the territory that already produces"]),
  ],
  scenarios: [
    sc("e-s1", "resil", "You have made 120 calls over four days. Two conversations, zero meetings booked. Tomorrow is day five.", [
      [S, "Keep the same list and the same volume, and push through it"],
      [E, "Ask the top rep to listen to five of my calls tomorrow morning before I dial", null, "Seeks coaching under pressure"],
      [M, "Move to email for a few days so the rejection isn't constant"],
      [R, "Tell my manager the list I was given isn't working", "Excuse-oriented under pressure"],
    ]),
    sc("e-s2", "init", "It's 2pm on a Thursday and you have finished everything you were explicitly assigned this week.", [
      [S, "Ask my manager what else needs doing"],
      [E, "Build a list of forty prospects nobody assigned me and start on it", null, "Creates work without being asked"],
      [N, "Clean up my CRM notes and pipeline hygiene"],
      [M, "Get ahead on the training modules"],
    ]),
    sc("e-s3", "coach", "In a team meeting your manager says your calls sound scripted and that you aren't listening to the person on the other end.", [
      [E, "Ask for a specific example and try it differently on my next call that day", null, "Acts on feedback immediately"],
      [N, "Thank them and think about how to apply it"],
      [M, "Explain why I follow the script the way I do", "Defends rather than absorbs feedback"],
      [N, "Ask to talk privately afterward about how the feedback landed"],
    ]),
    sc("e-s4", "compete", "Someone who started two weeks after you has booked twice as many meetings as you have.", [
      [E, "Ask them to walk me through their day, hour by hour", null, "Competitive without being defensive"],
      [S, "Add an hour of dials to the front of my day"],
      [R, "Point out to my manager that their account list is stronger than mine", "Deflects to circumstances"],
      [N, "Keep my head down and focus on my own numbers"],
    ]),
    sc("e-s5", "solve", "You need to reach a decision-maker. The main line goes to a gatekeeper who will not put you through and will not give you a name.", [
      [M, "Keep calling the main line at different times of day"],
      [E, "Find three other routes in — a mutual connection, an event attendee list, someone one level down", null, "Resourceful when the obvious path closes"],
      [M, "Send an email to the general inbox and follow up"],
      [N, "Ask my manager how they'd handle it"],
    ]),
    sc("e-s6", "own", "You lose a deal you worked on for six weeks and genuinely thought you had.", [
      [E, "Ask the buyer for ten minutes to hear why they went the other way", null, "Turns a loss into information"],
      [R, "Tell my manager we weren't competitive on price", "Attributes the loss outward"],
      [S, "Write down three things I would do differently and move on"],
      [N, "Move on quickly — the next one matters more"],
    ]),
    sc("e-s7", "init", "Your manager says: \"Look into whether there's anything for us in the youth sports market.\" That's the entire brief.", [
      [N, "Ask a few clarifying questions before I start"],
      [E, "Put a rough point of view together in a day and bring it back for direction", null, "Moves without complete information"],
      [R, "Wait until I have enough detail to do it properly", "Requires excessive direction"],
      [M, "Research it thoroughly for two weeks and then present"],
    ]),
    sc("e-s8", "hunger", "You have a clean deck to finish for Friday, or thirty cold calls you could make instead. Both are on your list.", [
      [E, "Make the calls — the deck can be good enough", null, "Chooses the uncomfortable revenue work"],
      [M, "Finish the deck properly, then call if there's time"],
      [S, "Split the afternoon and do some of both"],
      [N, "Finish the deck. It has a deadline and the calls don't"],
    ]),
    sc("e-s9", "hunger", "Five days left in the month and you are 40% short of goal.", [
      [S, "Triple my activity across the whole list"],
      [E, "Call every deal that's gone quiet and ask directly where it actually stands", null, "Urgency plus judgment"],
      [N, "Tell my manager now that I'm going to miss and what I'm changing"],
      [R, "Push hard on the two that are closest and hope they land", "Low urgency under pressure"],
    ]),
    sc("e-s10", "solve", "A prospect has told you no twice and sounded irritated the second time.", [
      [M, "Keep calling weekly — persistence wins"],
      [N, "Mark it dead and move on"],
      [E, "Move them to a quarterly touch and only reach out when I have something useful for them", null, "Persistence with judgment"],
      [M, "Go around them to their boss"],
    ]),
    sc("e-s11", "own", "We ask what you are worst at.", [
      [R, "I take on too much and work too hard", "Poor self-awareness"],
      [E, "Name a real weakness and what I'm actively doing about it", null, "Honest self-assessment"],
      [S, "Name a real weakness honestly"],
      [N, "I'm early enough that I'm still learning most of it"],
    ]),
    sc("e-s12", "own", "You sent a client an email with a wrong figure in it. It's been two days and nobody has said anything.", [
      [M, "Send a corrected version quietly and move on"],
      [E, "Tell my manager today and send the correction with an apology", null, "Self-reports before being caught"],
      [N, "Raise it at the weekly one-on-one"],
      [R, "Wait and see whether it turns out to matter", "Avoids accountability"],
    ]),
  ],
  worst: [
    wr("e-w1", "own", "A client is unhappy about something your team got wrong. Which of these is the worst move?", [
      ["Call them today and say plainly what happened", 0],
      ["Wait for your manager to decide the response", 2],
      ["Explain that their brief was part of the problem", 3],
      ["Fix it first and tell them once it's solved", 1],
    ]),
    wr("e-w2", "coach", "Your manager changes how you're supposed to open calls. Which response is worst?", [
      ["Ask for the reasoning before changing anything", 1],
      ["Run it exactly as described for a week", 0],
      ["Blend it with what already works for you", 2],
      ["Keep your version until the numbers say otherwise", 3],
    ]),
    wr("e-w3", "hunger", "Last Friday of the month. You've hit your number. Worst move?", [
      ["Start building next month's list", 0],
      ["Help a teammate who's short", 1],
      ["Take the afternoon back — you earned it", 3],
      ["Clean up your pipeline data", 2],
    ]),
  ],
  behavioral: [
    bh("e-b1", "Tell us about a target, a time, or a standard you were held to that you had no realistic way to meet. What did you actually do?", "We're reading for a real number and a real sequence of actions, not a lesson learned."),
    bh("e-b2", "Describe something you kept doing for a year that nobody was checking on.", "Work, training, a habit, a relationship. Why you kept going."),
    bh("e-b3", "Who should we call, and what will each of them say your weak spot is?", "Two managers and one peer."),
  ],
  followUps: {
    coach: "Walk me through the last piece of critical feedback you got. What were the exact words, and what did you do in the following week?",
    hunger: "What did you do last week that nobody asked you to do? Be specific about the day and the hours.",
    resil: "Tell me about your longest stretch without a win. How many days, and what changed on the other side of it?",
    init: "Describe something that existed because you built it, not because it was assigned.",
    own: "Tell me about a result you missed. Don't tell me what you learned — tell me what you did wrong.",
    compete: "Who is the best person you've ever competed against, and what did you do about the gap?",
    solve: "Give me a time you got to a person or an answer that was supposed to be unreachable. How?",
  },
};

/* ───────────────────── SENIOR SALES / REVENUE LEADER ───────────────────── */

const SENIOR = {
  id: "senior",
  name: "Senior Sales / Revenue Leader",
  tag: "Owns a number for a property or market",
  blurb: "High-expectation new business. Evidence of production and repeatable sales ability, not years served.",
  experienceWeighting: "High — but weighted to evidence of production. Ten mediocre years does not outrank five exceptional ones.",
  competencies: {
    newbiz: { name: "New-Business Creation", weight: 20, floor: 60, critical: true },
    judg: { name: "Sales Judgment", weight: 16, floor: 50, critical: false },
    pipe: { name: "Pipeline Ownership", weight: 14, floor: 50, critical: false },
    close: { name: "Closing", weight: 13, floor: 50, critical: false },
    strat: { name: "Strategic Thinking", weight: 12, floor: 45, critical: false },
    acct: { name: "Accountability", weight: 12, floor: 55, critical: true },
    resil: { name: "Resilience", weight: 8, floor: 40, critical: false },
    inst: { name: "Commercial Instincts", weight: 5, floor: 40, critical: false },
  },
  likert: [
    lk("s-l1", "newbiz", "I would rather build a territory from nothing than inherit a warm one."),
    lk("s-l2", "newbiz", "Prospecting is the first block on my calendar, not the last."),
    lk("s-l3", "pipe", "I know my coverage ratio right now without looking it up."),
    lk("s-l4", "acct", "I tell leadership a deal has slipped the day I know, not at the next forecast call."),
    lk("s-l5", "acct", "When my number is short, the reasons are usually outside my control.", true),
    lk("s-l6", "close", "I ask for the business earlier in the process than most sellers I've worked with."),
    lk("s-l7", "judg", "I have walked away from a deal I could probably have won."),
    lk("s-l8", "strat", "I can name the three accounts that will make or break my year, and why."),
    lk("s-l9", "resil", "A quarter that starts badly changes how I operate in month two.", true),
    lk("s-l10", "inst", "I can usually tell within two conversations whether a deal is real."),
    lk("s-l11", "pipe", "My forecast is closer to the truth than most of my peers'."),
    lk("s-l12", "newbiz", "I have closed something without the budget, list, or introduction that normally makes it possible."),
  ],
  pairs: [
    fc("s-p1", ["newbiz", E, "A year where I opened eight new logos and missed the number"], ["pipe", N, "A year where I hit the number entirely on renewals"]),
    fc("s-p2", ["acct", E, "Give leadership a forecast that's honest and low"], ["close", M, "Give leadership a forecast that keeps pressure on the team"]),
    fc("s-p3", ["judg", E, "Kill a deal in month two that I don't believe in"], ["resil", N, "Work it to the end in case it turns"]),
    fc("s-p4", ["strat", E, "Twenty accounts with a reason to buy this year"], ["newbiz", N, "Two hundred accounts that fit the profile"]),
    fc("s-p5", ["close", E, "Hold price and lose one in three"], ["inst", M, "Discount to protect the relationship and the volume"]),
    fc("s-p6", ["newbiz", E, "Take the market nobody has cracked"], ["pipe", N, "Take the book that already produces"]),
  ],
  scenarios: [
    sc("s-s1", "pipe", "Your pipeline coverage has dropped to 1.8x against a 3x standard, with a quarter to go.", [
      [M, "Work the existing deals harder — quality over coverage"],
      [E, "Block two weeks of concentrated prospecting against forty named targets", null, "Fixes coverage at the source"],
      [R, "Ask marketing to increase lead flow into my territory", "Passive pipeline management"],
      [N, "Re-forecast down and tell leadership where I'll land"],
    ]),
    sc("s-s2", "close", "A major prospect goes completely silent three weeks after you sent the proposal.", [
      [M, "Polite check-in email every week until they respond"],
      [E, "Send a direct note naming the silence and asking them to close it out or tell me it's dead", null, "Forces a decision"],
      [S, "Call the executive sponsor and ask straight whether this is still real"],
      [R, "Respect their process and wait for the timeline they gave me", "Avoids the hard conversation"],
    ]),
    sc("s-s3", "judg", "A competitor comes in 30% under your price on a deal you're leading.", [
      [M, "Match enough of it to stay in the deal"],
      [S, "Re-anchor on the outcome we're selling and hold price"],
      [E, "Find out exactly what they cut out of scope, then reframe the comparison on what the client actually needs", null, "Competes on substance, not price"],
      [N, "Take it to leadership for approval to discount"],
    ]),
    sc("s-s4", "strat", "You inherit a territory that has underperformed for three years.", [
      [N, "Start with the biggest logos in it"],
      [E, "Segment it and pick twenty accounts with a specific reason to buy in the next two quarters", null, "Strategy before activity"],
      [R, "Make the case that the territory needs to be redrawn before it can produce", "Negotiates the job before doing it"],
      [M, "Build off whatever inbound interest already exists"],
    ]),
    sc("s-s5", "acct", "Leadership challenges your forecast in front of the group and says it looks optimistic.", [
      [M, "Defend the number — I know these deals better than they do"],
      [E, "Walk it deal by deal and cut the two I can't defend with evidence", null, "Forecasts on evidence, not hope"],
      [M, "Lower it to be safe and beat it later"],
      [N, "Hold the number and say I'll know within two weeks"],
    ]),
    sc("s-s6", "newbiz", "You are 75 days into the role and pipeline creation is well behind expectation.", [
      [R, "Explain that this market has a long ramp and the pipeline is coming", "Ramp used as cover"],
      [E, "Show leadership my leading-indicator numbers and what I'm changing this week", null, "Owns the gap with a plan"],
      [N, "Ask for more support — SDR time, marketing air cover"],
      [M, "Increase activity on the same plan"],
    ]),
    sc("s-s7", "newbiz", "Outreach that produced four meetings a week for a year now produces one.", [
      [M, "Increase volume until the numbers come back"],
      [E, "Change the message and test three angles against thirty accounts this week", null, "Adapts the approach, not just the effort"],
      [S, "Shift weight to referrals and event-based introductions"],
      [R, "Ride it out — it's a seasonal soft patch", "Waits for conditions to change"],
    ]),
    sc("s-s8", "judg", "A prospect loves the solution and tells you there is no budget this year.", [
      [M, "Offer a discount that fits what they can find"],
      [E, "Find out what they did fund this year and who moved that money", null, "Understands how money actually moves"],
      [N, "Agree to revisit at the start of the next fiscal year"],
      [S, "Propose a smaller first phase that fits inside a manager's signing authority"],
    ]),
    sc("s-s9", "strat", "You have one big stalled opportunity and three new ones. You do not have time for all four.", [
      [M, "All-in on the big one — it's worth more than the other three combined"],
      [E, "Time-box the big one to one executive conversation and put the rest into the three", null, "Prioritizes on expected value"],
      [N, "Split the time evenly and see what moves"],
      [M, "Drop the stalled deal and work the new ones"],
    ]),
    sc("s-s10", "close", "One decision-maker controls your largest deal, has stalled twice, and will not introduce you to anyone else.", [
      [M, "Keep working them — the relationship is the asset"],
      [E, "Give them something worth circulating internally, then ask who else it affects", null, "Multi-threads without burning the sponsor"],
      [M, "Go around them to their leadership"],
      [S, "Propose a mutual action plan that names the people who have to sign"],
    ]),
    sc("s-s11", "resil", "Leadership sets a new-money target 60% above last year's.", [
      [R, "Say plainly that the number isn't achievable in this market", "Negotiates down before trying"],
      [E, "Build the math backwards and come back with what has to be true to get there", null, "Engages with the number"],
      [M, "Accept it and figure it out as the year goes"],
      [N, "Push back with evidence and land on a number I can defend"],
    ]),
    sc("s-s12", "acct", "A deal you called commit slips out of the quarter.", [
      [E, "Tell leadership the day I know, with what I'm replacing it with", null, "Reports bad news early"],
      [N, "Raise it at the next forecast call with a full explanation"],
      [M, "Find a replacement deal first so I'm not just delivering bad news"],
      [R, "Explain that procurement moved the goalposts", "Attributes the slip outward"],
    ]),
  ],
  worst: [
    wr("s-w1", "acct", "Your quarter is going to miss by 20%. Which is the worst move?", [
      ["Tell leadership now, with the recovery plan", 0],
      ["Present it at the forecast call with full context", 2],
      ["Pull a deal forward with a discount to cover the gap", 3],
      ["Flag the risk and hold the number two more weeks", 1],
    ]),
    wr("s-w2", "newbiz", "Two weeks of unusually open calendar. Worst use of it?", [
      ["Forty new target accounts", 0],
      ["Depth in the accounts already open", 1],
      ["A written territory plan", 2],
      ["Refining the deck and collateral", 3],
    ]),
    wr("s-w3", "judg", "A prospect asks for 25% off to sign this week. Worst response?", [
      ["Give it — the quarter needs the deal", 3],
      ["Trade it against a longer term", 0],
      ["Hold price and risk the date", 1],
      ["Take it away for approval and come back", 2],
    ]),
  ],
  behavioral: [
    bh("s-b1", "Give us your last three years of number against quota, and the context for the worst of the three.", "Actual figures. We verify these in references."),
    bh("s-b2", "Describe the largest piece of new business you created from nothing. Where did the first conversation come from?", "We want the origin of the deal, not the close."),
    bh("s-b3", "Tell us about a deal you should have won and didn't. What was your part in it?", "Your part specifically."),
  ],
  followUps: {
    newbiz: "Take me through the last thirty days. How many hours went to creating pipeline that didn't exist before, and what did they produce?",
    judg: "Tell me about a deal you killed early. What did you see, and what did it cost you to walk?",
    pipe: "What's your coverage ratio right now, and which two deals in your forecast are weakest?",
    close: "When did you last ask for the business and get told no in the room? What did you say next?",
    strat: "Name the three accounts that would make your year, and tell me why each one would buy.",
    acct: "Tell me about the last time you missed. What did you say to your leadership, and when?",
    resil: "Describe the worst quarter of your career. What did month two look like?",
    inst: "Tell me about a deal you knew was fake before anyone else did. What tipped you off?",
  },
};

/* ────────────────── SERVICE / ACCOUNT MANAGEMENT SALES ────────────────── */

const SERVICE = {
  id: "service",
  name: "Service / Account Management Sales",
  tag: "Grows the account, not just serves it",
  blurb: "Excellent service is the entry requirement. This role sells inside the account and protects revenue.",
  experienceWeighting: "Client experience matters, but strong service history cannot offset passive commercial behavior.",
  competencies: {
    expand: { name: "Expansion Instinct", weight: 20, floor: 55, critical: true },
    courage: { name: "Commercial Courage", weight: 18, floor: 55, critical: true },
    retain: { name: "Retention Mentality", weight: 16, floor: 50, critical: false },
    cjudg: { name: "Client Judgment", weight: 14, floor: 45, critical: false },
    own: { name: "Ownership", weight: 12, floor: 50, critical: false },
    rel: { name: "Relationship Management", weight: 10, floor: 40, critical: false },
    exec: { name: "Execution", weight: 10, floor: 40, critical: false },
  },
  likert: [
    lk("v-l1", "expand", "I have raised money with a client who did not ask me for a proposal."),
    lk("v-l2", "courage", "Asking a happy client for more spend feels like a risk to the relationship.", true),
    lk("v-l3", "courage", "I would rather have one uncomfortable conversation now than a surprise non-renewal later."),
    lk("v-l4", "retain", "I know which of my accounts is most likely to leave, and why."),
    lk("v-l5", "expand", "I look for revenue in an account before the client tells me there's a need."),
    lk("v-l6", "rel", "Clients I worked with three jobs ago still call me."),
    lk("v-l7", "cjudg", "I can name what my client's boss is measured on."),
    lk("v-l8", "own", "When a deliverable goes wrong, the client hears it from me first."),
    lk("v-l9", "exec", "Nothing falls through the cracks on my accounts."),
    lk("v-l10", "courage", "I have told a client no and kept the account."),
    lk("v-l11", "expand", "Keeping an account flat but happy is a good year.", true),
    lk("v-l12", "retain", "I start the renewal conversation earlier than the client expects."),
  ],
  pairs: [
    fc("v-p1", ["expand", E, "A client who grew 40% and complains sometimes"], ["rel", N, "A client who is flat and loves us"]),
    fc("v-p2", ["courage", E, "Quote the out-of-scope request"], ["rel", M, "Absorb it and bank the goodwill"]),
    fc("v-p3", ["retain", E, "Start the renewal ninety days out"], ["exec", N, "Start it when the client raises it"]),
    fc("v-p4", ["courage", E, "Tell the client their plan won't get them what they want"], ["rel", M, "Deliver what they asked for and let the results speak"]),
    fc("v-p5", ["expand", E, "Bring a proposal to a need they haven't named"], ["cjudg", N, "Wait until they name it themselves"]),
    fc("v-p6", ["own", E, "Call about the problem before they find it"], ["exec", M, "Fix it first, then tell them it happened"]),
  ],
  scenarios: [
    sc("v-s1", "expand", "A client is happy, hitting their goals, and has an obvious need for a service they don't currently buy from us.", [
      [M, "Mention it if growth comes up in conversation", "Waits to be invited"],
      [E, "Build the case around the objective they already told me about and book a meeting on it", null, "Creates the expansion conversation"],
      [N, "Send them information about it and see if they bite"],
      [M, "Hold it for the renewal conversation"],
    ]),
    sc("v-s2", "retain", "Your main contact at a large account leaves. Renewal is in four months.", [
      [E, "Get to the new person quickly and re-run discovery on what they're measured on", null, "Rebuilds the account from the top"],
      [N, "Send the results deck to whoever picks it up"],
      [S, "Work through the departing contact's peer to get properly introduced"],
      [R, "Wait until the renewal window and handle it then", "Passive on a live retention risk"],
    ]),
    sc("v-s3", "courage", "A client asks for a piece of work that is clearly outside the contract.", [
      [M, "Do it — goodwill pays back at renewal", "Avoids the money conversation"],
      [S, "Do it once, and use it to open a conversation about scope"],
      [E, "Scope it, price it, and send it over the same week", null, "Comfortable putting a number on value"],
      [M, "Point to the contract and decline"],
    ]),
    sc("v-s4", "own", "A deliverable went out wrong. The client has not noticed yet.", [
      [N, "Fix it, then tell them it happened"],
      [E, "Call them before they find it, own it, and bring the fix and a make-good", null, "Gets ahead of bad news"],
      [N, "Escalate internally and agree a position before contacting them"],
      [R, "Correct it quietly — raising it makes it bigger than it is", "Manages optics over trust"],
    ]),
    sc("v-s5", "retain", "A client tells you their budgets are being cut across the board next year.", [
      [M, "Offer a discount to protect the renewal"],
      [E, "Find out what did survive the cut and why, then restructure around that", null, "Follows the money that's left"],
      [N, "Accept a smaller renewal and protect the relationship"],
      [M, "Escalate it to my manager to handle"],
    ]),
    sc("v-s6", "expand", "An account has been serviced well for two years and has spent exactly the same amount each year.", [
      [R, "It's stable and happy — protect it and don't rock the boat", "Passive commercial mentality"],
      [E, "Build a twelve-month growth plan and present it as a business conversation", null, "Treats flat as a problem"],
      [M, "Ask the client whether there's anything else they need"],
      [N, "Flag to leadership that the account is at its ceiling"],
    ]),
    sc("v-s7", "cjudg", "Three stakeholders at one client want three different things from your work.", [
      [M, "Serve the one who is loudest and most engaged"],
      [E, "Work out who owns the budget, align the plan to their metric, and keep the others informed", null, "Reads the commercial map"],
      [N, "Try to deliver something for each of them"],
      [N, "Ask the client to tell us which priority wins"],
    ]),
    sc("v-s8", "courage", "A client asks for meaningfully more value at the same price.", [
      [M, "Give it to them — the relationship is worth more than the margin", "Gives away value"],
      [E, "Trade it — more value for a longer term or a wider scope", null, "Trades rather than concedes"],
      [N, "Give them part of it and hold the rest"],
      [M, "Decline and explain the economics"],
    ]),
    sc("v-s9", "expand", "You notice a gap in the client's business that they have not raised and may not have seen.", [
      [N, "Mention it casually on the next call"],
      [E, "Quantify what it's costing them and bring a proposal", null, "Sells to unstated need"],
      [R, "Wait until they raise it — it isn't my place", "Will not initiate commercially"],
      [M, "Flag it to my manager and let them decide"],
    ]),
    sc("v-s10", "retain", "A renewal is ninety days out. The relationship is good and there are no obvious problems.", [
      [E, "Open it now with a results review and a proposal for next year", null, "Controls the renewal timeline"],
      [N, "Start the conversation at thirty days"],
      [R, "Let procurement start the process on their timeline", "Cedes control of the renewal"],
      [M, "Send the paperwork early so it's easy for them"],
    ]),
    sc("v-s11", "courage", "A client is sixty days late on an invoice. Your quarterly review with them is tomorrow.", [
      [M, "Leave it to finance — it isn't my conversation"],
      [E, "Raise it directly and straightforwardly in the meeting", null, "Will have the awkward conversation"],
      [N, "Send a reminder email before the meeting instead"],
      [R, "Let it ride a bit longer rather than sour the review", "Avoids financial conflict"],
    ]),
    sc("v-s12", "exec", "You can spend this week fixing a small recurring service annoyance, or building the expansion case for the same account.", [
      [M, "Fix the annoyance — service comes first"],
      [E, "Get the fix scheduled with the delivery team and spend my week on the case", null, "Protects commercial time"],
      [S, "Split the week between both"],
      [N, "Build the case — the annoyance can wait a week"],
    ]),
  ],
  worst: [
    wr("v-w1", "courage", "A client's usage has doubled. Their contract hasn't. Worst move?", [
      ["Raise it now with the numbers in front of them", 0],
      ["Wait for renewal and true it up then", 2],
      ["Leave it — they're happy and it costs us little", 3],
      ["Flag it internally and ask how to handle it", 1],
    ]),
    wr("v-w2", "retain", "Your champion at a major account stops replying. Worst move?", [
      ["Call their office directly", 0],
      ["Send a shorter email in a week", 2],
      ["Assume they're busy and pick it up at renewal", 3],
      ["Work a second contact in the account", 1],
    ]),
    wr("v-w3", "own", "A monthly report went out with an error and the client spotted it. Worst move?", [
      ["Own it and reissue the same day", 0],
      ["Walk them through exactly how the error happened", 2],
      ["Point out the underlying data came from their team", 3],
      ["Apologize and add a check to the process", 1],
    ]),
  ],
  behavioral: [
    bh("v-b1", "Describe the largest amount of additional revenue you have generated from an existing account. How did the conversation start?", "The origin, and whether you or the client raised it."),
    bh("v-b2", "Tell us about an account you lost or nearly lost. What was the first signal, and when did you see it?", "Include how early you saw it."),
    bh("v-b3", "Tell us about a time you asked a client for more money and it was uncomfortable.", "What you said, and what happened afterward."),
  ],
  followUps: {
    expand: "Give me a specific account where you raised the spend. What was the first sentence you said to open it?",
    courage: "Tell me about the last time you asked a client for money in a conversation they weren't expecting.",
    retain: "Which of your accounts was most at risk last year, and how many days before renewal did you know?",
    cjudg: "Pick your biggest client. What is your main contact's boss measured on?",
    own: "Tell me about a time your team let a client down. What did the client hear from you, and when?",
    rel: "Who is the most senior person at a client who would take your call today, and why?",
    exec: "How do you keep track of what's owed to each account? Walk me through the actual system.",
  },
};

export const ROLES = { entry: ENTRY, senior: SENIOR, service: SERVICE };
export const ROLE_LIST = [ENTRY, SENIOR, SERVICE];

export const DEFAULT_THRESHOLDS = { strongPass: 85, pass: 72, flag: 58, fail: 42 };

export const defaultSettings = role => ({
  thresholds: { ...DEFAULT_THRESHOLDS },
  weights: Object.fromEntries(Object.entries(role.competencies).map(([k, c]) => [k, c.weight])),
  floors: Object.fromEntries(Object.entries(role.competencies).map(([k, c]) => [k, c.floor])),
  critical: Object.fromEntries(Object.entries(role.competencies).map(([k, c]) => [k, c.critical])),
  scored: Object.fromEntries(Object.entries(role.competencies).map(([k]) => [k, true])),
});

// Deterministic shuffle so a candidate's option order is stable across re-renders.
export const shuffled = (arr, seed) => {
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const scoredItems = role => [...role.likert, ...role.pairs, ...role.scenarios, ...role.worst];

// Ordered candidate flow: formats are interleaved so the same competency is measured
// from different angles at different points, and patterns are harder to game.
export function flowFor(role) {
  const L = role.likert.slice(), S = role.scenarios.slice(), P = role.pairs.slice(), W = role.worst.slice();
  const out = [];
  const take = (a, n) => { for (let i = 0; i < n && a.length; i++) out.push(a.shift()); };
  take(L, 3); take(S, 3); take(P, 2); take(W, 1);
  take(S, 3); take(L, 3); take(P, 2); take(W, 1);
  take(S, 3); take(L, 3); take(P, 2); take(W, 1);
  take(S, 99); take(L, 99); take(P, 99); take(W, 99);
  return out;
}

export function score(role, answers, settings) {
  const st = settings || defaultSettings(role);
  const buckets = {};
  const add = (comp, pts) => { (buckets[comp] = buckets[comp] || []).push(pts); };
  const selfBuckets = {}, scenBuckets = {};
  const redFlags = [], positives = [];

  role.likert.forEach(q => {
    const v = answers[q.id];
    if (v == null) return;
    const pts = (q.reverse ? 6 - v : v - 1) * 25;
    add(q.comp, pts);
    (selfBuckets[q.comp] = selfBuckets[q.comp] || []).push(pts);
  });

  role.pairs.forEach(q => {
    const pick = answers[q.id];
    if (!pick) return;
    const side = pick === "a" ? q.a : q.b;
    add(side[0], side[1]);
  });

  role.scenarios.forEach(q => {
    const pick = answers[q.id];
    if (pick == null) return;
    const opt = q.opts[pick];
    add(q.comp, opt.score);
    (scenBuckets[q.comp] = scenBuckets[q.comp] || []).push(opt.score);
    if (opt.flag) redFlags.push({
      comp: q.comp, label: opt.flag, qid: q.id,
      severity: opt.score <= 10 ? "critical" : opt.score <= 30 ? "meaningful" : "minor",
      context: q.text,
    });
    if (opt.positive) positives.push({ comp: q.comp, label: opt.positive, qid: q.id });
  });

  const comps = Object.entries(role.competencies).map(([key, c]) => {
    const vals = buckets[key] || [];
    const s = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    return {
      key, name: c.name,
      weight: st.weights[key], floor: st.floors[key],
      critical: st.critical[key], scored: st.scored[key],
      score: s, answered: vals.length,
      breach: st.scored[key] && s < st.floors[key],
    };
  });

  const active = comps.filter(c => c.scored);
  const wsum = active.reduce((a, c) => a + c.weight, 0) || 1;
  const overall = Math.round(active.reduce((a, c) => a + c.score * c.weight, 0) / wsum);

  // Response-consistency checks — never phrased as an accusation.
  const consistency = [];
  const likertVals = role.likert.map(q => answers[q.id]).filter(v => v != null);
  const extremes = likertVals.filter(v => v === 5).length;
  if (likertVals.length >= 8 && extremes / likertVals.length > 0.7)
    consistency.push("Selected the top rating on " + Math.round((extremes / likertVals.length) * 100) + "% of self-assessment items. Self-ratings may be uniformly elevated.");
  Object.keys(selfBuckets).forEach(comp => {
    if (!scenBuckets[comp]) return;
    const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
    const gap = avg(selfBuckets[comp]) - avg(scenBuckets[comp]);
    if (gap >= 32) consistency.push(
      "Rates themselves highly on " + role.competencies[comp].name.toLowerCase() +
      ", but scenario choices in that area scored materially lower. Worth validating in interview."
    );
  });
  const criticalBreaches = comps.filter(c => c.critical && c.breach);
  if (criticalBreaches.length && overall >= st.thresholds.pass)
    consistency.push("Strong overall score sitting on top of a mission-critical gap. The average is hiding the risk.");

  let band, bandNote;
  if (overall >= st.thresholds.strongPass) [band, bandNote] = ["Strong match", "Exceptional alignment with the role profile."];
  else if (overall >= st.thresholds.pass) [band, bandNote] = ["Meets profile", "Meets the profile. Confirm it in the combine and interview."];
  else if (overall >= st.thresholds.flag) [band, bandNote] = ["Validate in interview", "Real upside with areas that need interview validation."];
  else if (overall >= st.thresholds.fail) [band, bandNote] = ["Below profile", "Decisions sit below the profile this role requires. Read alongside the application, combine, and interview before deciding."];
  else [band, bandNote] = ["Well below profile", "Multiple indicators well below the profile. A signal for the hiring panel, never a verdict."];

  let capped = null;
  if (criticalBreaches.length) {
    const names = criticalBreaches.map(c => c.name).join(" and ");
    if (band === "Strong match" || band === "Meets profile") {
      capped = band; band = "Validate in interview";
      bandNote = "Capped from " + capped + ": below the critical floor on " + names + ".";
    } else if (band === "Validate in interview" && criticalBreaches.length > 1) {
      capped = band; band = "Below profile";
      bandNote = "Below the critical floor on " + names + ".";
    }
  }

  const ranked = active.slice().sort((a, b) => b.score - a.score);
  const strengths = ranked.filter(c => c.score >= 75).slice(0, 5);
  const concerns = ranked.slice().reverse().filter(c => c.score < 65).slice(0, 4);

  const fuKeys = [];
  criticalBreaches.forEach(c => fuKeys.includes(c.key) || fuKeys.push(c.key));
  redFlags.forEach(f => fuKeys.includes(f.comp) || fuKeys.push(f.comp));
  concerns.forEach(c => fuKeys.includes(c.key) || fuKeys.push(c.key));
  const followUps = fuKeys.slice(0, 5).map(k => ({
    comp: role.competencies[k].name,
    q: role.followUps[k],
    why: comps.find(c => c.key === k).score + "/100 against a " + st.floors[k] + " floor",
  }));

  role.worst.forEach(q => {
    const pick = answers[q.id];
    if (pick == null) return;
    const opt = q.opts[pick];
    add(q.comp, opt.score);
    (scenBuckets[q.comp] = scenBuckets[q.comp] || []).push(opt.score);
    if (opt.bad === 0) redFlags.push({
      comp: q.comp, label: "Misread which action carries the most risk", qid: q.id,
      severity: "meaningful", context: q.text,
    });
  });

  const scen = role.scenarios.map(q => answers[q.id] != null ? q.opts[answers[q.id]].score : null).filter(v => v != null);
  const scenAvg = scen.length ? Math.round(scen.reduce((a, b) => a + b, 0) / scen.length) : 0;
  const eliteCount = scen.filter(v => v >= 95).length;
  const weakCount = scen.filter(v => v <= 30).length;

  return {
    overall, band, bandNote, capped, comps, strengths, concerns,
    redFlags: redFlags.sort((a, b) => ({ critical: 0, meaningful: 1, minor: 2 })[a.severity] - ({ critical: 0, meaningful: 1, minor: 2 })[b.severity]),
    positives, consistency, followUps, criticalBreaches,
    scenario: { avg: scenAvg, answered: scen.length, total: role.scenarios.length, elite: eliteCount, weak: weakCount },
    references: role.behavioral,
  };
}

// Three demo response sets so the report can be reviewed without taking the assessment.
export function demoAnswers(role, profile) {
  const bias = { strong: 0.82, mixed: 0.95, weak: 0.22 }[profile];
  // The mixed profile is deliberately built to clear the overall bar while failing one
  // critical competency, so the floor-cap logic is visible in the sample report.
  const weakComp = profile === "mixed"
    ? (Object.entries(role.competencies).find(([, c]) => c.critical) || [])[0]
    : null;
  let s = profile.length * 977 + role.id.length * 31;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const out = {};
  role.likert.forEach(q => {
    const hi = profile === "strong" ? 5 : profile === "mixed" ? 4 : 3;
    const v = Math.round(hi - (rnd() < 0.3 ? 1 : 0) + (q.reverse && profile !== "strong" ? 1 : 0));
    out[q.id] = q.comp === weakComp ? (q.reverse ? 4 : 2) : Math.max(1, Math.min(5, v));
  });
  role.pairs.forEach(q => {
    const hi = q.a[1] >= q.b[1] ? "a" : "b", lo = hi === "a" ? "b" : "a";
    const touchesWeak = q.a[0] === weakComp || q.b[0] === weakComp;
    out[q.id] = touchesWeak ? lo : (rnd() < bias ? hi : lo);
  });
  [...role.scenarios, ...role.worst].forEach(q => {
    const ranked = q.opts.map(o => o.i).sort((x, y) => q.opts[y].score - q.opts[x].score);
    const r = rnd();
    const idx = q.comp === weakComp ? (r < 0.5 ? 3 : 2) : r < bias ? 0 : r < bias + 0.2 ? 1 : r < bias + 0.32 ? 2 : 3;
    out[q.id] = ranked[Math.min(idx, ranked.length - 1)];
  });
  return out;
}

export const PEAK_BANK = { SIGNAL, ROLES, ROLE_LIST, DEFAULT_THRESHOLDS, defaultSettings, shuffled, scoredItems, flowFor, score, demoAnswers };
