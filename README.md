# Peak Sales Combine — standalone app

Vite + React 18 + TypeScript port of the Peak Sales Combine prototype (candidate portal, evaluator cockpit, hiring-manager / admin / leadership dashboards). Everything runs in the browser against demo data; nothing needs a server yet.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle in dist/
npm run preview    # serve dist/ locally
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project → Import** the repo. Framework preset **Vite** is detected automatically (build `npm run build`, output `dist`).
3. Deploy. `vercel.json` rewrites every path to `index.html` so the single-page app works on any URL.
4. Optional: add a subdomain (e.g. `combine.peaksportsmgmt.com`) under **Settings → Domains**.

Or from the CLI: `npm i -g vercel && vercel`.

## Using the demo

The landing screen is the staff sign-in. Any password works for the four seeded staff accounts (shortcuts are listed on the right of the sign-in card); "Open candidate invite link" shows what a candidate receives.

Deep links: `?role=candidate`, `?role=evaluator`, `?role=manager`, `?role=admin`, `?role=leadership`, `?decision=Advance`, `?mobile=1`, `?fast=1`.

Progress (candidate answers, evaluator scores, decisions, settings) is saved in the browser's localStorage under `peak-sales-combine-v3`. Visit any URL with `?reset=1` to wipe it.

## Project layout

- `src/PeakCombine.tsx` — all application logic and state (one class component); `renderVals()` builds the view-model the screens render.
- `src/template/Template.tsx` — root layout; `src/screens/*.tsx` — one file per surface (entry, header, candidate portal, evaluator cockpit, staff dashboard).
- `src/data/seed.ts` — demo candidates, staff, questions, rubrics. `src/data/bank.ts` — Sales Decisions item bank and scoring engine.
- `src/index.css` global resets; `src/template/template.css` hover/focus styles.
- `public/assets/` — logo.

## Before real candidates use it

- **Move scoring server-side.** `src/data/bank.ts` contains option scores and floors; today it ships to the browser. In production the candidate app must only receive item text and post answers to an API.
- Replace the sign-in and invite-link simulation with real authentication and per-candidate tokens (e.g. Supabase Auth + row-level security), and enforce roles on the server.
- Replace `seed.ts` with a database; persist decisions, scores, and the audit log server-side.
- Have counsel review consent language, recording notice, accommodation flow, and retention settings.
