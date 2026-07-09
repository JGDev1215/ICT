# Implementation Plan

## Goal

Ship the requested v0.8.6 feature/update pass for the static local-first ICT app: remove user-facing Journal features, correct potential R:R behavior, tighten copy, add a desktop sidebar layout, mirror DOL taken controls in the Price Map Dashboard, update tests/docs, and record release-risk evidence without changing storage keys or requiring backend services.

## Repo Findings

- `assets/app.js` contains the relevant runtime behavior:
  - `ROUTES`, `normaliseRoute`, `render`, `renderTabBar`, `fabHtml`, and `renderShell` for routing/layout.
  - `journal()` for the Journal route.
  - `focusCard()`, `stackRows()`, and focus-card `read()` for Focus Card review/save behavior.
  - `priceMapLevels()` and `priceMapHtml()` for Price Map Dashboard rows.
  - `blankRiskPlan()`, `calculateRiskPlan()`, `normRiskPlan()`, and `riskPlanHtml()` for potential R:R.
  - `text()` and import/export helpers for backup output.
- `assets/styles.css` contains the bottom nav, sticky CTA, FAB, cards, grids, and responsive styling.
- `index.html`, `service-worker.js`, `tests/smoke.js`, README, and CHANGELOG pin/cache current version strings.
- `tools/bump-version.js` is the required version/cache helper.
- `tests/unit/run-tests.js` already loads `assets/app.js` in a VM and can directly test helper behavior.
- `tests/e2e/planner.spec.js` and `tests/e2e/release-qa.spec.js` cover routes, mobile widths, service worker, and focus-card flows.

## Files Likely Affected

- `assets/app.js`
- `assets/styles.css`
- `index.html`
- `service-worker.js`
- `tests/smoke.js`
- `tests/unit/run-tests.js`
- `tests/e2e/planner.spec.js`
- `tests/e2e/release-qa.spec.js`
- `README.md`
- `CHANGELOG.md`
- `docs/qa/*`
- `docs/implementation-reports/*` or `docs/plans/*`
- `agent-workflow/*`

## Proposed Changes

1. Preserve data shape but remove visible Journal UX:
   - Remove `journal` from primary route list and tab/sidebar navigation.
   - Make `normaliseRoute('journal')` resolve to Home.
   - Remove `journal()` route rendering and `render()` branch.
   - Remove Journal fields from Focus Card review UI.
   - Stop including Journal fields in search text and user-facing text export.
   - Keep `normJournal`, stored `card.journal`, and import/export compatibility.

2. Revise potential R:R:
   - Add a supported target ratio list, defaulting to existing/planned settings where possible.
   - Interpret ratio as reward:risk, e.g. `2R` means stop distance is reward distance / 2.
   - Use entry/current price from risk input or card current price.
   - Use selected target DOL to populate target price.
   - Derive reward points as `abs(target - entry)`.
   - Derive invalidation/stop on the opposite side of entry from target direction.
   - Preserve invalid guard: Long target must be above entry; Short target must be below entry.
   - Render target/invalidation/risk/reward/R:R as auto-populated values while still saving the calculated plan.

3. Reduce wordiness:
   - Shorten Home, Planner, price, Market Context, Risk, Profile, and detail copy.
   - Replace duplicate price-delay notices with a single concise notice per relevant detail area.
   - Use the concise disclaimer: `Educational tool. Not financial advice.`

4. Add responsive desktop layout:
   - At `>=1024px`, widen `--app-max-width` to about `1200px`.
   - Render a left sidebar-style primary nav using the existing `renderTabBar` output/classes with CSS layout changes.
   - Use `New analysis` labeled action in desktop instead of floating icon-only FAB; keep mobile FAB/bottom nav below `1024px`.
   - Add multi-column desktop layout classes for focus-card/dashboard dense panels without changing mobile order.

5. Mirror DOL taken in Price Map Dashboard:
   - Include checkbox controls for DOL rows in `priceMapHtml()` when rendered in editable focus-card context.
   - Use IDs like `priceMap_dol1Taken`.
   - Ensure focus-card `read()` reads either Price Map or DOL Stack checkbox state and saves one shared `dolNTaken` field.
   - Ensure re-render updates both locations.

6. Version/cache/docs:
   - Run `node tools/bump-version.js v0.8.6 release 20260709` after runtime JS/CSS changes.
   - Review generated changes to `index.html`, `service-worker.js`, README, and cache assertions.
   - Update README and CHANGELOG for current behavior.

7. Tests:
   - Update smoke tests for Journal removal from user-facing routes/nav/text while retaining storage compatibility.
   - Add/update unit tests for auto-derived R:R helper behavior.
   - Add Playwright coverage for:
     - desktop sidebar layout at `>=1024px`,
     - mobile bottom navigation below `1024px`,
     - R:R calculation,
     - mirrored Price Map DOL taken state.
   - Update release QA tests that currently expect Journal route.

8. Release-risk evidence:
   - Check production shell/version/assets with curl or browser automation.
   - Record what can be verified in a new or updated `docs/qa/` file.
   - Inspect GitHub Issue `#7` where credentials/tooling allow and record status.
   - Record any Supabase live-login limitation if credentials are not available.

## Step-by-Step Plan

1. Spawn four review subagents requested by the user:
   - Runtime/product feature review.
   - QA/release-risk review.
   - UI/responsive layout review.
   - Test coverage review.
2. Incorporate their feedback into senior plan review and approved plan before runtime edits.
3. Edit `assets/app.js` for Journal removal, R:R calculation, Price Map DOL taken controls, concise copy, and desktop-aware layout hooks.
4. Edit `assets/styles.css` for desktop sidebar/wider layout and mobile preservation.
5. Update tests.
6. Run `node tools/bump-version.js v0.8.6 release 20260709`.
7. Update README, CHANGELOG, docs QA/implementation report.
8. Run required checks:
   - `npm test`
   - `npm run test:e2e`
   - `git diff --check`
   - `python3 -m py_compile api/price.py tests/api/test_price.py` only if API files are touched.
9. Run local static server for manual/browser checks where useful, then stop it.
10. Complete code review, fix round if needed, final approval, and workflow summary.

## Acceptance Criteria

- User-facing app has no Journal nav/route/view/labels/copy.
- Old `#journal` route lands on Home.
- Saved card normalization/import/export still preserves existing `journal` objects.
- Potential R:R is deterministic from current/entry, selected DOL target, selected ratio, direction, and derived invalidation/stop.
- Price Map Dashboard DOL taken control and DOL Stack control share the same saved state.
- Desktop `>=1024px` uses sidebar navigation and wider content; mobile widths keep bottom nav and mobile ergonomics.
- Manual price entry and optional hosted/local price helper fallback remain available.
- Supabase Account & Backup remains optional.
- GitHub Pages and service worker runtime asset references remain aligned.
- Required tests pass or blockers are clearly documented.

## Test Plan

- `npm test`
- `npm run test:e2e`
- `git diff --check`
- If API files are touched: `python3 -m py_compile api/price.py tests/api/test_price.py`
- Static/manual checks via `python3 -m http.server 8000` if needed:
  - Home, Planner, Saved, Profile.
  - Create/save/final-save/reload Focus Card.
  - Desktop sidebar at 1024+.
  - Mobile bottom nav at 390/430.
  - Price Map DOL taken mirror.
  - R:R output.

## Risks

- `assets/app.js` is monolithic; edits must stay narrow.
- Removing visible Journal while keeping stored/exported journal compatibility can confuse string-based tests if assertions are too broad.
- Desktop layout must not break the existing mobile-first flow.
- Supabase live QA may be impossible without the admin password or existing authenticated session.
- Production deployment verification may show the old version until the user deploys these local changes.

## Rollback Plan

- Use `git diff` to inspect each touched file.
- Revert only this task's changes by applying reverse patches to touched files if a blocker appears.
- Do not use destructive git commands.
- If tests reveal a narrow regression, apply a focused fix round and rerun the relevant tests.
