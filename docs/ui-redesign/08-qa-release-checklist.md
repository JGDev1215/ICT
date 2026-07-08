# 08 - QA and Release Checklist

## Automated Gate

Run before every handoff and release:

```bash
npm test
npm run test:e2e
```

The smoke test must cover:

- App script syntax.
- Bias extension syntax.
- Storage key and schema references.
- Normalised saved-card shape.
- Market Context migration and route rendering.
- Legacy migration.
- Export/import round trip.
- Final hit-rate analytics.
- Primary route/screen rendering.

The Playwright E2E suite must cover:

- Planner creates a Focus Card and preserves it after reload.
- Planner keyboard skip link reaches sticky actions without route loss.
- Home session chips filter the visible focus card on desktop and mobile Chrome projects.

### Recorded Automated Result - 2026-07-08

- `npm test` passed.
- `npm run test:e2e` passed: 6 browser tests across desktop Chrome and mobile Chrome emulation.
- Syntax checks passed for `assets/config.js`, `assets/app.js`, `tests/smoke.js`, and `tools/bump-version.js`.

## Manual Mobile QA

Test at 390px and 430px wide viewports, then on real devices where available.

### iOS Safari

- App loads without horizontal scroll.
- Bottom tab bar is not blocked by the safe area.
- Planner sticky CTA remains tappable.
- Inputs focus without hiding the active field.
- Export/download fallback is understandable.
- Add to Home Screen launch opens the app.

### Android Chrome

- App loads without horizontal scroll.
- Bottom tab bar and FAB are visible.
- Planner, Saved, Focus Card and Profile routes are reachable.
- JSON import file picker opens.
- Add to Home Screen install flow works where supported.

## Data QA

- Existing `ict_cards_v078` cards still load.
- Existing cards without Market Context load with blank context rows.
- Market Context phase, note, and potential-next-phase fields survive export/import.
- Legacy keys migrate without deleting source data unexpectedly.
- Draft cards can be saved with incomplete fields.
- Final save requires an outcome other than `Open`.
- Final hit rate counts only final-saved `Hit` and `Miss`.
- Breakeven and Read outcomes do not enter the hit-rate sample.
- Exported JSON can be re-imported after clearing test storage.
- Import deduplicates by card id and does not wipe existing cards.

## Product Safety QA

- UI copy describes planning, review, and education only.
- No screen promises profit, accuracy, forecasts, or entry signals.
- Liquidity Map actions add concepts to a draft plan; they do not recommend trades.
- Risk Tracker shows historical/planned review metrics, not predictions.

## Release Gate

- Smoke test passes.
- Playwright E2E passes.
- Manual iOS or responsive Safari check passes.
- Manual Android or responsive Chrome check passes.
- README and CHANGELOG mention the redesign scope.
- Known gaps are documented before pushing to `main`.

### Current Release Status - 2026-07-08

- Automated release gate: PASS.
- Manual iOS Safari: PENDING real-device check.
- Manual Android Chrome: PENDING real-device check.
- PWA install: PENDING device/browser check.
- Offline/service-worker behavior: PENDING device/browser check.
- Public release recommendation: beta-only until the manual device/PWA/offline checks above are recorded.
