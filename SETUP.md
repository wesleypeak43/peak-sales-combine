# Going live — one-time setup (about 30 minutes)

You already have the site on Vercel at **www.peaksportscareers.com**. These steps add the shared database, real logins, and email. Do them in order. Nothing here needs code.

Until the database keys are added, the site keeps running in **demo mode** (fake candidates, any password). After they are added, it switches to **live mode** automatically. Demo mode stays available at `www.peaksportscareers.com/?demo=1` for training.

---

## Part 1 — Database (Supabase, free)

1. Go to **supabase.com** → Start your project → sign up (GitHub or email).
2. **New project**
   - Name: `peak-sales-combine`
   - Database password: click **Generate** and save it somewhere safe (you rarely need it)
   - Region: **East US** (closest to Vercel's default)
   - Click **Create new project**, wait ~2 minutes.
3. Left sidebar → **SQL Editor** → **New query**.
4. Open the file `supabase/schema.sql` from this project in a text editor, copy **everything**, paste it into the query box, click **Run**. It should say "Success". (Safe to run again later.)
5. Left sidebar → **Authentication → URL Configuration**
   - Site URL: `https://www.peaksportscareers.com`
   - Redirect URLs → Add both `https://www.peaksportscareers.com/**` and `https://peaksportscareers.com/**`
   - Save.
6. Left sidebar → **Authentication → Sign In / Providers → Email**: leave **Email** enabled. Turn **off** "Confirm email" (invites are sent by the app itself, not by Supabase). Save.
7. Left sidebar → **Project Settings → API Keys**. Keep this tab open — you'll copy from it in Part 3:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **Publishable key** (`sb_publishable_…`) — or under "Legacy API keys", the **anon public** key
   - **Secret key** (`sb_secret_…`) — or the legacy **service_role** key. This one is private.

## Part 2 — Email (Resend, free up to 3,000/month)

1. Go to **resend.com** → Sign up.
2. **Domains → Add domain** → `www.peaksportscareers.com` → Add. Resend shows 3 DNS records (MX, TXT, TXT).
3. In **Vercel** → your project → **Settings → Domains** → click `www.peaksportscareers.com` → **DNS Records** (or Vercel → Domains → www.peaksportscareers.com). Add each record exactly as Resend shows (Type, Name, Value). Back in Resend click **Verify** — usually green within a few minutes.
4. Resend → **API Keys → Create API Key** → name `peak-combine`, permission **Sending access** → Create. Copy the key (`re_…`) now; it's shown once.

## Part 3 — Connect Vercel to both

1. Vercel → your project → **Settings → Environment Variables**. Add these six, one at a time (Environment: leave all three checked):

   | Key | Value |
   | --- | --- |
   | `VITE_SUPABASE_URL` | Project URL from Part 1 step 7 |
   | `VITE_SUPABASE_ANON_KEY` | Publishable (or anon) key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Secret (or service_role) key |
   | `RESEND_API_KEY` | `re_…` from Part 2 |
   | `APP_URL` | `https://www.peaksportscareers.com` |
   | `MAIL_FROM` | `Peak Sales Combine <combine@peaksportscareers.com>` |

2. Upload the new project files to GitHub (see Part 4) — or, if the files are already there, go to **Deployments → ⋯ on the latest → Redeploy**. Environment variables only take effect on a new build.

## Part 4 — Put the new code on GitHub

1. Open **github.com/wesleypeak43/peak-sales-combine** → **Add file → Upload files**.
2. From the unzipped project folder, drag in: the **`src`**, **`api`**, **`public`** and **`supabase`** folders, plus **`package.json`**, **`vercel.json`**, **`README.md`**, **`SETUP.md`**. (Dragging folders keeps the structure; existing files are replaced.)
3. **Commit changes**. Vercel builds automatically (~1–2 min). Open www.peaksportscareers.com — the sign-in card no longer shows "Prototype shortcuts". That means live mode is on.

## Part 5 — First logins

The database starts with three staff records: **Wesley (Admin + Hiring manager + Evaluator)**, **Greyson** and **Max (Hiring manager + Evaluator)**. They still need passwords:

1. Open **www.peaksportscareers.com**, type `wesley@peaksportsmgmt.com`, click **Forgot password?** → check email → **Choose a new password** → you land signed in.
2. Greyson and Max do the same with their emails. (Or: Users tab → "Invite a staff member" re-sends a set-password email.)

Any other staff member: Admin → **Users** → Invite a staff member → they get an email to create a password.

## Part 6 — Run a real candidate

1. **Pipeline → Add a candidate** → name, email, one of the three roles (**Entry Level Sales Professional / Director of Sales / Director of Service**), and the **school / property** the role is for (this is what the candidate sees in the email and portal). Attach a résumé if you already have one. Then either:
   - **Add & email assessment link** — the full assessment (job preview, details & résumé, Sales Decisions · 20–30 minutes, all multiple choice), or
   - **Details-only link** — the candidate only shares contact details and a résumé (about two minutes). Use **Send assessment link** on their row later, or
   - **Add without sending a link** — a manual record (for people you already screened). **Email assessment link** on the row whenever you're ready.
2. The candidate opens their link and finishes Stage 3. The assessment ends there — no scheduling on their side. Answers are scored on the server; the scouting report on their profile shows every red flag, positive signal, and follow-up **with the question and the answer that caused it**, plus the full answer trail.
3. **Schedule** tab → pick any candidate without a session (those who finished the assessment sort first), date, time, time zone, two evaluators. Leave the join link blank to get a Google Meet link (Part 7), or paste your own. **Save & send invites**: the candidate gets an email with their **own combine link** (separate from the assessment link) and a calendar file; with Google Calendar connected, the candidate and both evaluators get calendar invitations too.
4. The candidate opens the combine link before the session: reads the brief, submits Exercise B (written, or uploads a deck / video), confirms the recording notice.
5. Each evaluator: header role chip **Evaluator** → **Run live session** → score → submit. Scores stay hidden from the other evaluator until both submit. The brief shows the résumé, the Exercise B file, and any transcripts.
6. Ran the mock pitch or an interview elsewhere? **Profile → Submit a transcript for evaluation** — paste or upload the .txt/.vtt. Evaluators can read it; with Part 8 switched on, an advisory summary with verbatim quotes appears alongside.
7. Hiring manager: **Profile → Record decision**. The decision log and the candidate's portal update.

Assessment links expire 3 days after sending; **Resend link** / **Copy link** on the pipeline row issue a fresh one, and a candidate with an expired link can email themselves a new one. Combine links stay open until two weeks after the session.

## Part 7 — Google Calendar for combine sessions (optional, ~15 minutes, Google Workspace admin needed)

With this, scheduling a combine creates the event on a Peak calendar, invites the candidate and both evaluators, and generates a Google Meet link. Without it, everyone still gets an email with an .ics calendar file.

1. **console.cloud.google.com** → create a project (e.g. `peak-combine`) → **APIs & Services → Enable APIs** → enable **Google Calendar API**.
2. **IAM & Admin → Service Accounts → Create** → name `peak-combine` → Done. Open it → **Keys → Add key → JSON** → download. Also copy the **Unique ID** (a long number) from the service account's details.
3. **admin.google.com** (Workspace admin) → **Security → Access and data control → API controls → Manage Domain Wide Delegation → Add new** → Client ID = the Unique ID from step 2; OAuth scope = `https://www.googleapis.com/auth/calendar.events` → Authorize.
4. Vercel → **Settings → Environment Variables**, add:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` — `client_email` from the JSON file
   - `GOOGLE_PRIVATE_KEY` — `private_key` from the JSON file (paste it whole, including the BEGIN/END lines)
   - `GOOGLE_CALENDAR_OWNER` — the Workspace user whose calendar hosts the sessions, e.g. `wesley@peaksportsmgmt.com`
5. **Deployments → Redeploy**. Schedule a test session with yourself as a candidate: you should see a Google Calendar invitation and a Meet link within a minute.

## Part 8 — AI-assisted transcript evaluation (optional)

1. **console.anthropic.com** → API Keys → Create key. Add it to Vercel as `ANTHROPIC_API_KEY`, then Redeploy.
2. **First calls:** on a candidate's profile, **Submit a transcript for evaluation** → kind *First call (phone screen)* → paste the transcript, add **your initial read** → **Submit & evaluate the call**. You get an executive summary for the next round, “Already covered — don’t re-ask”, “Ask next”, strengths/concerns against the role profile, and a grade **A+ – F**. The grade shows on the pipeline row and the Jobs board.
3. **The instructions it follows** are plain English and editable: **Edit the evaluation instructions** under the transcript form, or **Settings → First-call evaluation instructions**. Max (any hiring manager) can rewrite them; they save automatically and apply to the next transcript.
4. Mock-pitch and interview transcripts still get the competency read with verbatim quotes. Everything is labelled advisory; evaluators score and the panel decides. Keep counsel in the loop — some jurisdictions regulate automated tools in hiring even when advisory.

## Part 9 — Jobs board, application links, reminders

- **Jobs tab** — one pipeline per role + school. Candidates land on a job automatically from the role and school you pick when adding them (or when they apply through a link). Stages are set by what they’ve completed until you move them with the dropdown on a card. Edit the stage list in **Settings → Pipeline stages**.
- **Copy application link** — a public page where candidates enter their own details and go straight into the assessment; no staff step. Switch it off per job with *applications off*.
- **Copy external board link** — a read-only view of that job’s board (names, stages, progress chips; no scores or flags) for people outside the team. Switch it off with *sharing off*.
- **Reminders** — a candidate who hasn’t finished their link gets an email 48 hours after it was sent and a final one at 72 hours (which refreshes the link). Vercel runs `/api/remind` hourly from `vercel.json` (Pro plan; Hobby runs cron once a day). Set `CRON_SECRET` in Vercel to any long random string so only Vercel can trigger it. **Settings → Send due reminders now** runs the same check on demand.
- **Schools** — the list candidates choose from in Stage 2 (and staff use when adding candidates or jobs) lives in **Settings → Schools / properties**.
- **Question bank** — every scenario and worst-move item shows the score behind each option and the reasoning in plain words; admins can change scores, flag labels, wording, and the rationale. Changes apply to everyone scored from then on; re-score existing reports from the profile.

## Upgrading an existing database

After uploading a new version of the code: Supabase → **SQL Editor** → paste the whole `supabase/schema.sql` → **Run** again. It adds new tables and columns without touching existing data (v3.2 adds jobs, pipeline stages, reminder tracking, transcript grades, and the public board / application functions, and attaches existing candidates to a job per role + school). Existing scouting reports show a **Re-score with evidence** button on the profile — click it once to attach the answer-level evidence to reports scored before this version.

---

## If something looks wrong

- Sign-in says **"Could not load the workspace"** → the SQL in Part 1 step 4 didn't run, or the Supabase keys in Vercel are wrong. Fix, then Redeploy.
- **"Email is not configured yet"** when sending an invite → `RESEND_API_KEY` missing or domain not verified. Use **Copy link** meanwhile.
- Scheduling says **"Google Calendar: … an .ics file was emailed instead"** → Part 7 isn't finished (usually the domain-wide delegation scope, or the private key pasted without its line breaks). The session is still saved and emailed.
- **Résumé upload fails** → `schema.sql` hasn't been re-run since this version (the `candidate-files` bucket is created by it).
- Set-password link says invalid → Part 1 step 5 (Redirect URLs) is missing `https://www.peaksportscareers.com/**`.
- Site still shows "Prototype shortcuts" → `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` weren't set before the last build. Redeploy.

## What is and isn't protected yet

- Staff need a real password; roles are enforced by the database, not just hidden in the interface. Evaluators can only read candidates assigned to them and never see the other evaluator's scores before submitting.
- Candidates never log in; their personal link is a 48-character random token, and every save goes through a server function that checks it.
- Sales Decisions scoring runs on the server and is stored with the candidate. The item bank (with option weights) still ships inside the website code; a determined candidate could dig it out of the browser. Moving the bank fully server-side is the next hardening step before large-scale use.
- Candidate data lives in your Supabase project (US East). Have counsel review consent, retention, and the recording notice before real hiring runs.
