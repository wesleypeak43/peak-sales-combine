# Peak Sales Combine

Vite + React 18 + TypeScript app: candidate portal, evaluator cockpit, hiring-manager / admin / leadership dashboards, with a Supabase (Postgres + Auth) backend and Vercel serverless functions for email and server-side scoring.

Live at **https://www.peaksportscareers.com** (repo → Vercel, auto-deploys from `main`).

## Two modes

- **Live mode** — on when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set at build time. Real staff logins, shared database, candidate invite links, email via Resend. Setup: **[SETUP.md](SETUP.md)**.
- **Demo mode** — otherwise, or at any URL with `?demo=1`. Seeded fake candidates and staff, any password works, progress saved in the browser only. Deep links: `?role=candidate|evaluator|manager|admin|leadership`, `?decision=Advance|Decline`, `?mobile=1`, `?fast=1`, `?reset=1`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173 (demo mode unless you add a .env with the VITE_ keys)
npm run build      # production bundle in dist/
```

Copy `.env.example` to `.env` and fill in the keys to run live mode locally. The API functions compile as CommonJS (see `api/tsconfig.json`); the site itself is bundled by Vite (`vite.config.mts`). The `/api` functions run only on Vercel (`npx vercel dev` runs them locally).

## Project layout

- `src/PeakCombine.tsx` — all application logic and state (one class component); `renderVals()` builds the view-model the screens render. The `LIVE_ENABLED` block at the end swaps demo handlers for database writes.
- `src/data/live.ts` — Supabase client, reads/writes, realtime refresh, and the mapping from database rows to the shapes the screens expect.
- `src/data/seed.ts` — demo data plus static content (competencies, anchors, questions, roles). `src/data/bank.ts` — Sales Decisions item bank and scoring engine.
- `src/screens/*.tsx` — one file per surface; `src/template/Template.tsx` — root layout.
- `api/invite.ts` — emails / refreshes a candidate's personal link (full assessment or details-only). `api/apply.ts` — public application through a job's apply link (creates the candidate, emails the link). `api/remind.ts` — 48h / 72h reminders (Vercel cron + on-demand). `api/session.ts` — schedules a combine: Google Calendar event + Meet link when connected, candidate/evaluator emails with .ics, and the candidate's separate combine link. `api/upload.ts` — signed uploads for résumés and Exercise B files (private `candidate-files` bucket). `api/transcript.ts` — stores a transcript and, with `ANTHROPIC_API_KEY`, either a first-call executive summary + A+–F grade (following the editable instructions in settings) or a competency read. `api/score.ts` — scores Sales Decisions answers on the server, applying Question-bank edits; the report carries the full rubric and rationale behind every answer. `api/staff.ts` — staff invites and password-reset emails. Shared helpers in `src/server/shared.ts`; Google auth in `src/server/google.ts`.
- `supabase/schema.sql` — tables, row-level security, candidate RPC functions, audit triggers, starter staff. Paste into the Supabase SQL editor.
- `public/assets/` — logo.

## Data model (live mode)


`staff` (roles: admin, manager, evaluator, leadership) · `jobs` (role + school pipelines with share/apply tokens) · `candidates` (token, expiry, track = assessment | info, source = invite | manual | self, job_id, ta_stage, reminder timestamps, contact columns, résumé path, `progress` JSON, `report` JSON) · `reviews` · `sessions` (own `token` for the combine link, `starts_at`, calendar event id) · `evaluations` · `interviews` · `decisions` · `accommodations` (+ `accommodation_details`, visible to managers only) · `transcripts` (+ screener notes, grade) · `settings` (weights, thresholds, retention, schools, taStages, callEvalPrompt, bankEdits) · `outcomes` · `audit` · storage bucket `candidate-files`.

Candidates never authenticate: the assessment link carries the candidate token (`candidate_open` / `candidate_save`), the combine link carries the session token (`combine_open` / `combine_save`), the public board and application pages carry the job's tokens (`board_open` / `apply_open`); all are `security definer` functions that validate it. Staff use Supabase Auth; every table has row-level-security policies keyed on the signed-in email's staff record.
