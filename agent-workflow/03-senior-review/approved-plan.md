# Approved Plan

## Goal

Complete focused remediation phases for the broad goal: documentation/process drift corrections, concrete runtime defects found by the runtime audit agent, and safe refactor/test foundation items that do not move runtime files.

## Execution Scope

- Documentation, focused runtime fixes, tests, and version/cache updates.
- No modularization.
- No storage/schema/key changes.
- No commit or push.

## Approved Changes

1. Replace current physical/real-device release gates with production web and mobile-site browser QA.
2. Keep responsive viewport, offline/service-worker browser behavior, import/export browser flow, live price provider, and accessibility follow-up as relevant QA items.
3. Update README Known Limitations so saved cards are described as local-first with optional Account & Backup sync, not browser-local-only.
4. Reconcile Supabase wording so browser localStorage remains the immediate source of truth and Supabase is optional backup/sync.
5. Update current docs/index/status language so implemented v0.8.3/v0.8.4 plans are not presented as pending source-of-truth work.
6. Record audit-agent findings and preserve the existing daily-report mobile-site clarification.
7. Align Planner completion/card status with Generate Focus Plan validation.
8. Persist and restore `manualPriceNeededAck` in planner drafts and saved cards.
9. Make Price Map source/status distinguish manual prices from hosted/local yfinance prices.
10. Import exported settings best-effort through JSON import while preserving card import behavior.
11. On local development/file contexts, allow the local price helper to run after a hosted unsupported-symbol response.
12. Bump runtime version/cache/docs to v0.8.5 because `assets/app.js` behavior changes.
13. Add/update smoke and Playwright coverage for these fixes.
14. Add Playwright import UI/file-picker coverage.
15. Add `tests/unit/` with a simple Node runner around current exported helpers.
16. Update `package.json` scripts so `npm test` runs smoke and unit tests while E2E remains separate.
17. Add `Legacy/README.md` documenting historical-only legacy files.
18. Add deterministic `/api/price` boundary tests for missing symbol, unsupported symbol, yfinance dependency unavailable, provider unavailable, and mocked successful response shape.
19. Add a `test:api` package script and include it in `npm test` if the test remains fast and network-free.

## Files Approved For Editing

- `README.md`
- `docs/README.md`
- `docs/plans/supabase-focus-card-storage-plan.md`
- `docs/plans/planner-validation-price-autodetect-plan-2026-07-09.md`
- `docs/plans/review-fix-report-2026-07-09.md`
- `docs/qa/docs-implementation-checklist-2026-07-08.md`
- `docs/qa/release-qa-evidence-2026-07-08.md`
- `docs/release/release-decision-log-2026-07-08.md`
- `docs/daily-reports/2026-07-09-session-report-2.md`
- `CHANGELOG.md`
- `index.html`
- `service-worker.js`
- `assets/app.js`
- `assets/styles.css`
- `tests/smoke.js`
- `tests/e2e/planner.spec.js`
- `tests/unit/run-tests.js`
- `tests/api/test_price.py`
- `package.json`
- `Legacy/README.md`
- `agent-workflow/*`

## Acceptance Criteria

- Current docs no longer require physical-device testing.
- Current docs still require production web/mobile-site browser QA where relevant.
- Supabase docs no longer conflict with the local-first product rule.
- Implemented v0.8.3/v0.8.4 plans are clearly historical/completed or non-source-of-truth.
- `docs/README.md` indexes current plan/report state accurately.
- Runtime fixes are limited to the approved audit findings.
- Storage key `ict_cards_v078` and export schema `ict_dol_sweep_export_v7` are preserved.
- Manual price fallback and local-first behavior are preserved.
- `npm test` includes smoke, unit, and API boundary tests.
- API boundary tests do not call live yfinance or require network access.
- Legacy folder is documented without deleting or renaming legacy files.
- No runtime files are moved or modularized.

## Checks

- `rg -n "physical|real-device|real devices|iOS Safari|Android Chrome|PWA install|Add to Home Screen" README.md docs/qa docs/release docs/daily-reports docs/plans`
- `rg -n "server-side source of truth|browser-local only|not synced across devices" README.md docs`
- `node tools/bump-version.js v0.8.5 audit-fixes 20260709`
- `node tests/smoke.js`
- `python3 tests/api/test_price.py`
- `npm test`
- `npx playwright test tests/e2e/planner.spec.js`
- `npx playwright test`
- `git diff --check`
- `git status --short`

One audit agent independently ran `node tests/smoke.js` successfully during read-only audit before runtime edits.
