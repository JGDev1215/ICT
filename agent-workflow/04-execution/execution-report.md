# Execution Report

## Summary of Changes

- Implemented v0.8.6 feature pass for CR-1 through CR-5.
- Removed user-facing Journal navigation, route, Focus Card fields, search text, and text-export line while preserving stored/exported `journal` data compatibility.
- Added legacy `journal` route redirect to Home.
- Reworked potential R:R to derive stop/invalidation from entry/current price, selected DOL, direction, and selected ratio.
- Added editable Price Map Dashboard DOL taken controls that mirror the DOL Stack checkboxes.
- Added desktop sidebar layout at `>=1024px`, a labeled desktop `New analysis` action, wider content, and focus-detail columns while preserving mobile bottom nav.
- Condensed primary copy and changed the visible disclaimer to `Educational tool. Not financial advice.`
- Bumped runtime version/cache to `v0.8.6` / `0.8.6-release-20260709`.
- Updated tests and documentation, recorded production v0.8.5 shell evidence, and closed GitHub Issue `#7` as superseded.

## Files Changed

- `assets/app.js`
- `assets/styles.css`
- `index.html`
- `service-worker.js`
- `tools/bump-version.js`
- `tests/smoke.js`
- `tests/unit/run-tests.js`
- `tests/e2e/planner.spec.js`
- `tests/e2e/release-qa.spec.js`
- `README.md`
- `CHANGELOG.md`
- `CLAUDE.md`
- `docs/qa/docs-implementation-checklist-2026-07-08.md`
- `docs/qa/live-price-provider-qa-2026-07-09.md`
- `docs/qa/production-web-mobile-qa-2026-07-09.md`
- `agent-workflow/*`

## Implementation Notes

- Storage key `ict_cards_v078` and export schema `ict_dol_sweep_export_v7` were not changed.
- `normJournal`, `card.journal`, JSON import/export, and Supabase card payload compatibility remain intact.
- The new `riskPlan.ratio` field is normalized in the existing saved-card shape; old `invalidationPrice` can still infer a ratio when available.
- `priceMapLevels()` now includes row metadata for stable editable DOL checkboxes.
- `focusReviewFields()` reads the editable Price Map DOL checkbox where present and falls back to the DOL Stack checkbox.
- `tools/bump-version.js` was made compatible with the concise footer text and idempotent enough to rerun after a partial update.

## Deviations From Approved Plan

- `CLAUDE.md` was updated by the existing version bump helper. This is consistent with the helper’s current behavior and not a functional runtime change.
- Live Supabase Account & Backup QA was not performed because no admin password or authenticated production browser session was available.

## Checks Performed

- Baseline before runtime edits: `npm test` PASS.
- Final: `npm test` PASS.
- Final: `npm run test:e2e -- --reporter=dot` PASS, 65 passed, 1 expected WebKit offline skip.
- Final: `node tests/smoke.js` PASS.
- Final: `git diff --check` PASS.
- Production shell curl checks: Vercel and GitHub Pages both report v0.8.5 and audit-fix asset keys.
- Production price endpoint curl check: `https://ictict-lake.vercel.app/api/price?symbol=MNQ` returned HTTP 200 with yfinance JSON.
- GitHub Issue `#7`: closed as superseded by current web/mobile-site QA scope.

## Known Issues

- Local v0.8.6 is not deployed by this task.
- Live admin login and Supabase sync/reload QA remains credential-dependent.
