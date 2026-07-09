> Status: Historical
> Last reviewed: 2026-07-09
> Source of truth: No
> Implementation status: Completed in v0.8.3; verify current behavior against runtime code, tests, README, and CHANGELOG.

# Planner Validation and Price Auto-Detect Fix Plan

## Goal

Prevent accidental empty Focus Cards while keeping the Planner local-first, deterministic, and usable when live price lookup fails.

## Evidence From Live QA

- Live URL tested: `https://ictict-lake.vercel.app`
- Test time: 2026-07-09 13:35 UTC
- Admin login: passed with visible username `admin`.
- Price auto-detect: passed for `MNQ`; Planner populated `29750.5`.
- Focus Card flow: passed.
- Save changes: passed.
- Final save: passed with `Hit`.
- Backup sync: passed; Profile showed `Local cards8` and `Cloud backup8`.
- Reload persistence: passed; saved card `PWQA104766` appeared after reload with Final saved and Hit.

## Problem Statement

Planner currently permits too much progress with little or no meaningful input. That is useful for partial drafts, but it also allows accidental empty or near-empty cards to enter Saved. Price auto-detect works on the live deployment for supported symbols, but reliability should be tightened around symbol handling, visible status, and fallback behavior so users understand when manual entry is required.

## Files Likely Affected

- `assets/app.js`
- `assets/styles.css`
- `index.html`
- `service-worker.js`
- `tests/smoke.js`
- `tests/e2e/planner.spec.js`
- `README.md`
- `CHANGELOG.md`

Only update `index.html`, `service-worker.js`, and cache-pinned smoke assertions if shipped JS/CSS behavior changes.

## Proposed Planner Validation Fix

1. Add a small validation helper that separates:
   - `hasMeaningfulPlannerInput`: ignores auto-filled date/time and checks user-entered fields.
   - `canSaveDraft`: true when the user has at least one meaningful field.
   - `canGenerateFocusPlan`: true when required Focus Card fields are present.
2. Keep incomplete drafts allowed, but block completely empty draft saves with visible inline feedback.
3. Require Generate Focus Plan to have at minimum:
   - instrument
   - session
   - bias
   - valid positive current price, or an explicit manual-price-needed acknowledgement if current price is intentionally absent
   - at least one complete DOL row with level, draw, and timeframe
4. Treat partial DOL/sweep rows as validation errors for Generate Focus Plan, not as silent incomplete data.
5. Keep manual price entry as the fallback path and do not require auto-detect.
6. Preserve existing saved-card normalization and legacy migration behavior.

## Proposed Price Auto-Detect Fix

1. Normalize instrument input before lookup:
   - trim whitespace
   - uppercase common symbols
   - reject blank or obviously non-symbol strings before fetch
2. Show distinct status states:
   - ready
   - fetching
   - detected with provider/source and timestamp
   - unavailable with manual-entry instruction
   - unsupported symbol with manual-entry instruction
3. Keep current hosted API fallback order:
   - same-origin Vercel API when on Vercel
   - configured hosted API
   - local helper at `127.0.0.1:8765`
4. Do not overwrite a manually edited current price after the user changes it unless they click Auto-detect again.
5. Add defensive handling for stale, malformed, zero, negative, or non-numeric API responses.
6. Make the helper failure copy specific enough for action without exposing raw provider errors.

## Acceptance Criteria

- Save Draft does not create a card when the Planner is effectively empty.
- Save Draft still works for partial but meaningful planning notes.
- Generate Focus Plan blocks missing required fields with visible inline validation.
- Existing complete Planner-to-Focus flow still works.
- Manual price entry works without any network/API access.
- Auto-detect succeeds for a supported symbol such as `MNQ` when the hosted API is available.
- Auto-detect fails gracefully for unsupported or unavailable symbols and leaves manual entry usable.
- Saved-card storage key remains `ict_cards_v078`.
- Export schema remains `ict_dol_sweep_export_v7`.

## Test Plan

- Run `node tests/smoke.js`.
- Add or update Playwright tests for:
  - empty Planner Save Draft is blocked
  - empty Planner Generate Focus Plan is blocked
  - partial meaningful draft can still save
  - complete Planner creates a Focus Card
  - mocked successful price auto-detect populates current price
  - mocked failed price auto-detect shows graceful fallback and preserves manual entry
- Manually verify live or local static app:
  - supported symbol `MNQ`
  - unsupported symbol
  - manual price after failed lookup
  - reload persistence after valid Focus Card save

## Risks

- Over-tight validation could block legitimate rough drafts.
- Validation copy could imply trading advice if written carelessly.
- Price auto-detect tests can become flaky if they depend on live yfinance instead of mocks.
- Cache/version updates are required for shipped JS/CSS behavior changes.

## Rollback Plan

- Revert the validation helper and UI feedback changes in `assets/app.js` / `assets/styles.css`.
- Restore previous cache-busted asset references and service-worker cache name if versioned.
- Keep tests that document the intended behavior, but mark any new stricter assertions for revision if product requirements change.
