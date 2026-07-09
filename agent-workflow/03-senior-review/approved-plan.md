# Approved Plan

## Decision

APPROVED WITH AMENDMENTS

This is the only plan authorized for execution.

## Execution Scope

Implement CR-1 through CR-5, update tests and documentation, record production/web QA evidence, and run required checks. Do not commit or push.

## Authorized Runtime Changes

### CR-1 - Remove User-Facing Journal

- Remove `journal` from primary navigation.
- Remove the Journal route/view and render branch.
- Make old `journal` routes resolve to Home, including `go('journal')` and direct hash parsing.
- Remove Focus Card Journal lesson and behaviour-tag controls.
- Remove Journal references from current user-facing README sections, text export, saved-card search text, and tests.
- Preserve storage compatibility:
  - keep `normJournal`;
  - keep `card.journal`;
  - keep JSON export/import compatibility;
  - do not change storage keys or export schema;
  - do not break Supabase card payload compatibility.

### CR-2 - Potential R:R Calculation

- Add/normalize a `riskPlan.ratio` field.
- Use current/entry price and selected target DOL.
- Reward distance is `abs(target - entry)`.
- Stop distance is `reward / selectedRatio`.
- Long target must be above entry; invalidation is below entry.
- Short target must be below entry; invalidation is above entry.
- Display and save auto-derived target, risk points, reward points, potential R:R, and invalidation/stop.
- Preserve invalid-side guard.

### CR-3 - Concise Copy

- Condense primary-flow copy in Home, Planner, Focus Card, Risk, Profile, and docs.
- Replace the visible disclaimer with `Educational tool. Not financial advice.`
- Remove duplicate delayed-price notices in Focus Card details while retaining one useful price-delay notice.

### CR-4 - Desktop Layout

- Preserve mobile layout below `1024px`.
- At `>=1024px`, use a left sidebar style based on existing primary nav markup.
- Hide the mobile FAB on desktop and show a labeled `New analysis` action.
- Widen centered content to about `1200px`.
- Add focused multi-column layout for dense detail/dashboard panels without changing mobile order.
- Override bottom padding and sticky planner CTA behavior for desktop.

### CR-5 - Price Map DOL Taken Mirror

- Add DOL taken checkboxes to DOL rows in the editable Focus Card Price Map Dashboard.
- Keep existing DOL Stack controls.
- Add stable row metadata in `priceMapLevels()`.
- Use stable IDs such as `priceMap_dol1Taken`.
- Sync Price Map and DOL Stack checkbox state both ways before save.
- Save one shared `dolNTaken` state and verify reload behavior.

## Authorized Test Changes

- Update smoke tests for:
  - no user-facing Journal route/nav/fields/text export;
  - `go('journal')` resolves Home;
  - JSON/storage `journal` compatibility remains;
  - editable Price Map includes DOL taken controls only in Focus Card context;
  - version/cache alignment for `v0.8.6`.
- Update unit tests for:
  - Long derived stop/R:R;
  - Short derived stop/R:R;
  - invalid target side guard.
- Update Playwright tests for:
  - desktop sidebar layout at `>=1024px`;
  - mobile bottom nav below `1024px`;
  - R:R UI calculation;
  - Price Map/DOL Stack mirrored DOL taken state.
- Update release QA tests that currently expect Journal route.

## Authorized Docs/QA Changes

- Run `node tools/bump-version.js v0.8.6 release 20260709` after runtime changes.
- Update README and CHANGELOG for current behavior.
- Create or update `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- Update `docs/qa/docs-implementation-checklist-2026-07-08.md`.
- Update or cross-reference stale `v0.8.4` note in `docs/qa/live-price-provider-qa-2026-07-09.md` because production now serves `v0.8.5`.
- Record Supabase live QA as blocked by missing credentials/session if applicable.
- Inspect or update GitHub Issue `#7` if authenticated tooling permits.

## Required Checks

- `npm test`
- `npm run test:e2e`
- `git diff --check`
- `node tests/smoke.js` explicitly if needed for AGENTS.md handoff clarity.
- `python3 -m py_compile api/price.py tests/api/test_price.py` only if API files are touched.

## Stop Conditions

- Path or remote changes unexpectedly.
- Storage key/export schema changes become necessary without a tested migration.
- Manual price entry stops working.
- Supabase login becomes required for normal app use.
- GitHub Pages runtime asset references drift from service worker cache entries.
- Baseline passing tests regress and cannot be fixed within the approved scope.
