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

1. **Pipeline → Invite a candidate** → name, email, role → **Create & email invite** (or **Create & copy link** to send it yourself).
2. The candidate opens their link, completes Stages 1–3 (~60 min, can save and return). Their answers are scored on the server; the scouting report appears on their profile.
3. **Schedule** tab → pick the candidate, date, time, two evaluators, paste your Zoom/Meet link → **Send invites**. The session shows in the candidate's portal and both evaluators' rosters.
4. Each evaluator: header role chip **Evaluator** → **Run live session** → score → submit. Scores stay hidden from the other evaluator until both submit.
5. Hiring manager: **Profile → Record decision**. The decision log and the candidate's portal update.

Links expire 3 days after sending; **Resend link** / **Copy link** on the pipeline row issue a fresh one, and a candidate with an expired link can email themselves a new one.

---

## If something looks wrong

- Sign-in says **"Could not load the workspace"** → the SQL in Part 1 step 4 didn't run, or the Supabase keys in Vercel are wrong. Fix, then Redeploy.
- **"Email is not configured yet"** when sending an invite → `RESEND_API_KEY` missing or domain not verified. Use **Copy link** meanwhile.
- Set-password link says invalid → Part 1 step 5 (Redirect URLs) is missing `https://www.peaksportscareers.com/**`.
- Site still shows "Prototype shortcuts" → `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` weren't set before the last build. Redeploy.

## What is and isn't protected yet

- Staff need a real password; roles are enforced by the database, not just hidden in the interface. Evaluators can only read candidates assigned to them and never see the other evaluator's scores before submitting.
- Candidates never log in; their personal link is a 48-character random token, and every save goes through a server function that checks it.
- Sales Decisions scoring runs on the server and is stored with the candidate. The item bank (with option weights) still ships inside the website code; a determined candidate could dig it out of the browser. Moving the bank fully server-side is the next hardening step before large-scale use.
- Candidate data lives in your Supabase project (US East). Have counsel review consent, retention, and the recording notice before real hiring runs.
