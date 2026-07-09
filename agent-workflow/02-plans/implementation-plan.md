# Implementation Plan

## Goal

Implement the Planner validation and price auto-detect reliability fix from `docs/plans/planner-validation-price-autodetect-plan-2026-07-09.md` without changing local-first storage, export schema, Supabase optional sync, or unrelated UI.

## Repo Findings

- `assets/app.js` owns planner state, normalization, draft persistence, validation, price lookup, and save handlers.
- `savePlanner(openDetails)` is the correct gate for Save Draft and Generate Focus Plan.
- `comp(fields)` currently controls complete/draft status and should remain compatible with existing saved cards.
- `priceValidationMessages(fields)` currently only covers invalid numeric price values.
- `fetchPrice(symbol)` already tries hosted/same-origin API and local helper; it needs symbol validation and response validation/status refinement.
- `tests/e2e/planner.spec.js` can cover the browser behavior with mocked route responses.
- JS/CSS behavior changes require cache-busted asset references, service-worker cache update, smoke assertions compatibility, README, and CHANGELOG updates.

## Files Likely Affected

- `assets/app.js`
- `assets/styles.css`
- `index.html`
- `service-worker.js`
- `tests/smoke.js`
- `tests/e2e/planner.spec.js`
- `README.md`
- `CHANGELOG.md`
- `agent-workflow/*`

## Proposed Changes

- Add planner validation helpers in `assets/app.js`:
  - `plannerValidationState(fields, ctx, cardId)` with `hasMeaningfulPlannerInput`, `canSaveDraft`, and `canGenerateFocusPlan`.
  - `plannerValidationHtml(state, mode)` for visible inline planner feedback.
  - Row validation for complete/partial DOL and sweep rows.
- Add a missing-current-price acknowledgement checkbox in the Planner so Generate Focus Plan can proceed without a current price only when the user explicitly acknowledges manual price is needed.
- Block Save Draft when the planner is effectively empty/default-only.
- Block Generate Focus Plan when required fields are missing, current price is invalid/unacknowledged, DOL requirements are unmet, or DOL/sweep partial rows exist.
- Keep partial meaningful draft saves allowed.
- Improve price auto-detect:
  - Normalize symbol input by trimming and uppercasing.
  - Reject blank or invalid symbols before fetch.
  - Validate API price payload using existing `clean`/`priceNumber`.
  - Distinguish unsupported/unavailable/malformed outcomes in user-facing copy without exposing raw provider errors.
  - Preserve manual price edits unless the user explicitly clicks Auto-detect.
- Add concise CSS for planner validation/status messages if needed.
- Update E2E coverage for blocked empty save, blocked empty generation, partial draft save, complete flow, mocked price success, and mocked price failure with manual fallback.
- Update cache strings for the shipped JS/CSS behavior change and keep smoke assertions aligned.
- Update README/CHANGELOG with the new validation and price fallback behavior.

## Step-by-Step Plan

1. Add validation helper functions near existing price validation and planner helper functions.
2. Update Planner HTML to render validation feedback and the missing-price acknowledgement checkbox.
3. Update `sync()` and default-prefill logic so the acknowledgement participates in planner state but does not alter saved-card schema.
4. Gate `savePlanner(false)` and `savePlanner(true)` through validation state.
5. Update price symbol normalization, helper URL calls, response validation, and notice/status messages.
6. Export any helper functions needed by smoke tests through `window.ICTSweepState`.
7. Add or update Playwright planner tests with mocked `/api/price` and local helper responses.
8. Update cache-busted asset query strings in `index.html` and matching `STATIC_ASSETS`/`CACHE_NAME` in `service-worker.js`.
9. Update README and CHANGELOG.
10. Run `node tests/smoke.js` and relevant Playwright tests.
11. Complete workflow execution, code review, senior decision, final approval, and workflow summary files.

## Acceptance Criteria

- Empty/default-only Save Draft is blocked and no saved card is created.
- Partial meaningful Save Draft works and remains a draft.
- Generate Focus Plan shows missing-field feedback when required inputs are absent.
- Generate Focus Plan succeeds for existing complete planner input.
- Partial DOL/sweep rows are visible validation errors for Generate Focus Plan.
- Manual price entry works without price auto-detect.
- Price auto-detect succeeds from a mocked supported response and fills current price.
- Price auto-detect failure leaves existing/manual price usable and shows manual-entry fallback copy.
- `ict_cards_v078` and `ict_dol_sweep_export_v7` remain unchanged.

## Test Plan

- `node tests/smoke.js`
- `npx playwright test tests/e2e/planner.spec.js`

## Risks

- Validation could accidentally block legitimate rough drafts if "meaningful" is too strict.
- Missing-price acknowledgement must not change saved card shape.
- Price-status copy must remain educational/fallback-oriented and not imply trading advice.
- E2E tests must avoid live yfinance dependencies.

## Rollback Plan

Revert the scoped changes in `assets/app.js`, `assets/styles.css`, `index.html`, `service-worker.js`, `tests/smoke.js`, `tests/e2e/planner.spec.js`, `README.md`, and `CHANGELOG.md`. Restore the previous cache-busted references and service-worker cache name if necessary.
