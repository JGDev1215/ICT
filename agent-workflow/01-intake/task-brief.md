# Task Brief

## Original User Task

`/goal achieve the attached goal.`

Attachment path read: `/Users/soonjeongguan/.codex/attachments/5a7a9cb0-c195-4dc4-9608-01adb8d4773e/pasted-text-1.txt`

## Objective

Implement the requested feature changes and release-risk evidence updates for the static ICT DOL Sweep Tracker app while preserving local-first browser storage, existing saved-card compatibility, optional Supabase Account & Backup, manual price fallback, GitHub Pages support, and the optional Vercel price API.

## Repo Findings

- Safety check passed on 2026-07-09:
  - `pwd`: `/Users/soonjeongguan/Desktop/FRAMEWORK`
  - `git remote -v`: origin fetch/push are `https://github.com/JGDev1215/ICT.git`
  - `git status`: clean worktree on `main`, up to date with `origin/main`
- App is a no-build static app.
- Runtime files inspected so far:
  - `index.html`
  - `assets/config.js`
  - `assets/app.js`
  - `assets/styles.css`
  - `service-worker.js`
  - `api/price.py`
- Current version is `v0.8.5`.
- `assets/app.js` owns routes, rendering, storage normalization, risk calculation, price map, Supabase sync, import/export, and app bindings.
- Current user-facing Journal artifacts exist in nav, route rendering, Focus Card fields, README, CHANGELOG, smoke tests, and E2E fixtures.
- `calculateRiskPlan` currently requires a manually entered invalidation/stop and calculates R:R from entry/target/stop. The change request requires deriving stop from selected ratio and current-to-DOL reward distance.
- Price Map Dashboard currently renders DOL/Sweep rows but DOL taken checkboxes exist only in the DOL Stack section.
- Mobile-first layout currently uses a bottom tab bar and floating add button for eligible routes.
- Tests exist:
  - `npm test`
  - `npm run test:e2e`
  - `python3 tests/api/test_price.py`

## Assumptions

- Existing `journal` fields in stored/exported card objects should remain normalized and export-compatible, but no user-facing Journal route, nav, labels, or copy should remain.
- Old `#journal` URLs should route to Home.
- "No user-facing Journal artifacts remain" applies to rendered app UI and current user-facing docs, not historical changelog entries for old versions or internal migration/storage compatibility names.
- "DOL taken" mirrored state can be saved through the existing Focus Card save flow and should use the existing `dol1Taken`/`dol2Taken`/`dol3Taken` fields.
- Live Supabase and production admin login may require credentials/session not available to Codex. If unavailable, record the limitation clearly in QA docs and final risks instead of fabricating evidence.
- GitHub Issue `#7` can be inspected with `gh`/GitHub tooling if authenticated; if authentication is unavailable, record the blocker.

## Out of Scope

- No modularization of `assets/app.js`.
- No storage key change.
- No export schema bump unless a backward-compatible migration is deliberately added; this task should avoid schema changes.
- No backend saved-card storage beyond existing optional Supabase sync.
- No real-device QA.
- No commit or push.

## Success Criteria

- [ ] CR-1 removes user-facing Journal nav, route/view, labels, copy, and stats/search references while preserving stored data compatibility.
- [ ] CR-2 computes potential R:R from current/entry price to selected target DOL using a selected ratio and derived opposite-side invalidation/stop, with invalid-side guard preserved.
- [ ] CR-3 reduces primary-flow copy and removes duplicate delayed-price notices; disclaimer becomes concise.
- [ ] CR-4 desktop layout at `>=1024px` uses a left sidebar nav, labeled New analysis action, and wider centered content while mobile layout below `1024px` remains bottom-nav based.
- [ ] CR-5 Price Map Dashboard includes DOL taken controls that mirror the DOL Stack state.
- [ ] Version/cache/docs are bumped through `node tools/bump-version.js` for shipped JS/CSS behavior changes.
- [ ] Smoke/unit/E2E tests cover the changed behaviors.
- [ ] README, CHANGELOG, QA docs, and workflow files are updated.
- [ ] Required checks pass or any blocker is recorded accurately.
