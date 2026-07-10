# Implementation Plan

## Goal

Implement v0.8.11 passcode access, per-card price mode, and Planner/Plan Review navigation copy with tests and documentation.

## Repo Findings

- Existing settings are stored under `ict_settings_v1`.
- Existing app export includes `settings: getSettings()`.
- Existing Supabase settings sync uses `getSettingsPayload`.
- Existing Focus Card save path is `read(finalSave)` and `updateCard`.
- Existing price fetch helper is `fetchPrice(symbol)` with hosted/local fallback.
- Existing version/cache updates can be coordinated with `tools/bump-version.js`.

## Files Likely Affected

- `assets/app.js`
- `assets/styles.css`
- `index.html`
- `service-worker.js`
- `tests/smoke.js`
- `tests/e2e/planner.spec.js`
- `README.md`
- `CHANGELOG.md`
- `CLAUDE.md`
- `agent-workflow/*`

## Proposed Changes

- Add local passcode helpers, lock screen rendering, unlock/session state, and passcode change UI.
- Extend card normalization with safe price mode default.
- Add Focus Card price mode selector and live fetch behavior that updates visible draft state without persisting until save.
- Rename user-facing Planner/Focus copy to one coherent Planner/Plan Review workflow.
- Bump version/cache strings to v0.8.11.
- Add smoke and Playwright coverage.

## Step-by-Step Plan

1. Update workflow evidence and obtain approved plan.
2. Implement passcode local settings and lock screen gate.
3. Add passcode settings controls in Profile and handlers.
4. Add price mode normalization, UI, live fetch state, and save integration.
5. Update Planner/Plan Review labels and docs.
6. Run version bump for v0.8.11.
7. Update tests for new behavior and cache strings.
8. Run required checks.
9. Complete review/final workflow files.

## Acceptance Criteria

- The app cannot render normal routes until unlocked.
- Existing browser data remains compatible.
- Price mode does not mutate final-saved cards.
- Stored price snapshots/history update only on save.
- Tests and docs reflect v0.8.11.

## Test Plan

- `npm test`
- `npm run test:e2e -- --reporter=dot`
- `git diff --check`

## Risks

- Lock screen can break test harnesses or route rendering if not bypassed correctly after unlock.
- Live price fetch must not create background storage writes.
- Version/cache strings must stay in sync.

## Rollback Plan

- Revert v0.8.11 product edits and restore v0.8.10 cache strings if behavior is unsafe.
