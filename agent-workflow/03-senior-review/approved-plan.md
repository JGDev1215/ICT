# Approved Plan

## Decision

Approved with amendments.

## Execution Scope

Implement only the scoped Planner validation and price auto-detect reliability fix from `docs/plans/planner-validation-price-autodetect-plan-2026-07-09.md`.

## Required Implementation Steps

1. Add small validation helpers in `assets/app.js` using existing normalizers and row naming conventions.
2. Block Save Draft only when the planner is effectively empty/default-only.
3. Keep meaningful partial draft saves allowed.
4. Gate Generate Focus Plan on instrument, session, bias, either valid current price or a transient missing-price acknowledgement, at least one complete DOL row, and no partial DOL/sweep rows.
5. Do not require sweep rows unless partially filled.
6. Keep the missing-price acknowledgement out of saved-card fields, imports, exports, migrations, and Supabase payloads.
7. Normalize and validate price auto-detect symbols before fetch.
8. Validate API price payloads and show clear unavailable/unsupported/manual fallback messages without raw provider errors.
9. Preserve manual price edits unless the user clicks Auto-detect.
10. Add/update Playwright tests with mocked price responses.
11. Update cache-busted asset references, service-worker cache entries, smoke assertions if needed, README, and CHANGELOG.
12. Run `node tests/smoke.js` and `npx playwright test tests/e2e/planner.spec.js`.

## Acceptance Criteria

- Empty/default-only Save Draft is blocked.
- Meaningful partial Save Draft succeeds.
- Empty/incomplete Generate Focus Plan is blocked with visible validation.
- Complete Planner-to-Focus flow still works.
- Manual price entry works without network/API access.
- Mocked successful auto-detect fills current price.
- Mocked failed auto-detect leaves manual entry usable and shows fallback copy.
- `ict_cards_v078` and `ict_dol_sweep_export_v7` remain unchanged.
