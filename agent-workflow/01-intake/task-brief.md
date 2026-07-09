# Task Brief

## Original User Task

Read the relevant prompt, agent file before conducting the task below:

Task: Run a live end-to-end flow: login as admin, create a Focus Card, save/edit/final-save, sync, reload, and confirm persistence.
Plan the next product fix around Planner validation and price auto-detect reliability.

## Objective

Run a deployed/live end-to-end Account & Backup flow for the current ICT app and produce a durable next-fix plan for Planner validation and price auto-detect reliability.

## Repo Findings

- Safety check passed in `/Users/soonjeongguan/Desktop/FRAMEWORK`.
- Git remote is `https://github.com/JGDev1215/ICT.git`.
- Initial git status was clean.
- Current app is a static HTML/CSS/JavaScript product with optional Supabase Focus Card backup.
- Relevant source-of-truth files read: `AGENTS.md`, `docs/README.md`, `README.md`, `docs/plans/supabase-focus-card-storage-plan.md`, `docs/daily-reports/2026-07-09-session-report.md`, `docs/plans/FINAL_SAFE_REFACTOR_IMPLEMENTATION_PROMPT_2026-07-09.md`, `index.html`, `assets/config.js`, `assets/app.js`, `tests/e2e/planner.spec.js`, `tests/e2e/release-qa.spec.js`, and `tests/smoke.js`.
- The daily report lists this exact live E2E and product-fix planning task as the next step.
- Profile login is user-facing `admin` mapped to Supabase Auth email `admin@ict.local`.
- README states the visible `admin/admin` login is a convenience gate, so the live test will try username `admin` and password `admin` first.

## Assumptions

- "Live" means the deployed Vercel app at the currently documented hosted app/API base, not only the local static server.
- If the admin password is not `admin`, the Supabase login portion is blocked and will be reported without inventing credentials.
- The product-fix planning deliverable belongs under `docs/plans/` because it is durable implementation planning.
- No runtime code change is requested in this task.

## Out of Scope

- Changing Planner validation, price auto-detect, storage keys, Supabase schema, or UI behavior.
- Committing or pushing changes.
- Exposing secrets or service-role keys.
- Deleting existing user or server data except any temporary test card created by this flow if safe cleanup is available.

## Success Criteria

- [ ] Live app opens and serves the current Account & Backup UI.
- [ ] Admin login succeeds or a credential blocker is documented.
- [ ] Focus Card create, save edit, final-save, sync, reload, and persistence are verified or blockers documented.
- [ ] `node tests/smoke.js` is run for static contract coverage.
- [ ] Durable next product fix plan is saved under `docs/plans/`.
- [ ] Required workflow evidence files are updated.
