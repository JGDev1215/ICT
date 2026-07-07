# Changelog

## Unreleased — 2026-07-07

### Added

- Completed the mobile-first UI redesign with Home, Planner, Saved, Focus Card Details, Timeline, Liquidity Map, Risk Tracker, Journal, and Profile screens.
- Added bottom tab navigation, a global new-plan action on eligible screens, mobile sticky planner CTAs, search/filter controls, favorite support, journal fields, and risk fields.
- Added local settings for default instrument, default session, watchlist, and default planned-risk values.
- Added Market Context to saved cards with Monthly, Weekly, Daily, 4H, 1H, and 15m phase, note, and potential-next-phase fields.
- Added planner time and manual/static current-price capture, plus DOL distance feedback in generated previews and Focus Card Details.
- Added optional local yfinance price-helper support for planner price auto-detect while keeping GitHub Pages manual-only.
- Added Timeframe Used and Taken status to DOL and Sweep stack records, with DOL timeframe required for complete records.
- Added the Price Map ladder visual with a CURRENT PRICE divider, DOL/Sweep rows, signed distance labels, empty/loading/error states, and yfinance/manual price source display.
- Expanded smoke coverage for the normalized saved-card shape, route rendering, export/import round trip, import deduplication, invalid import no-op behavior, and final-save analytics boundaries.

### Changed

- Reworked the planner into a deterministic AI-style Trade Plan Builder while keeping the app static, local-only, and educational.
- Reworked saved-card review into a Focus Card Details screen while preserving Save changes, Final save, Copy, Share, Delete, export/import, and final hit-rate behavior.
- Changed bias copy to “Bias Determination For Session” and added the before-10:30am NY warning that full-day prediction is not supported by this tool.
- Removed Validation of Bias and Invalidation of Bias from the planner and Focus Card Details workflow while preserving legacy data in normalized cards and JSON exports.
- Simplified visible DOL records to Price Level and Draw Rationale while preserving confidence and hit-time compatibility fields in normalized cards and exports.
- Updated DOL/Sweep review displays to show timeframe and taken/not-taken data points.
- Changed the Market Context Phase Map so timeframe inputs are added from a dropdown instead of forcing every timeframe row into the planner.
- Moved DOL Taken confirmation out of the planner and into Focus Card Details review.
- Moved the Planner Price Map into a standalone visible ladder card instead of hiding it inside the generated text preview.
- Updated README documentation for the completed mobile UI redesign and remaining QA gaps.

### Notes

- No backend, build system, authentication, or trade-signal service was added.
- Screenshot support remains metadata-only for v1.
- Real-device iOS/Android and PWA/offline behavior still need manual verification beyond the static smoke test.

## v0.7.9 — 2026-07-06

### Added

- Added a Bias thesis panel to the planner with Bullish/Bearish selection.
- Added Validation of bias and Invalidation of bias inputs.
- Added saved-card display support for bias.
- Added Bias validated and Bias invalidated markers on the saved-card review page.
- Added enriched JSON export schema ict_dol_sweep_export_v7.
- Added assets/bias-extension.js and updated the smoke test to cover it.

### Notes

- Bias support is browser-local and educational only.
- The bias extension preserves the existing ict_cards_v078 storage key and stores bias metadata under ict_bias_card_meta_v1.

## v0.7.8 — 2026-07-06

### Fixed

- Restored the main page with Start new analysis, Saved cards, and Liquidity notes actions.
- Restored direct saved-card review pages with verification markers, notes, outcome, copy, load, delete, Save changes, and Final save actions.
- Fixed saved-card final-save analytics so only final-saved Hit/Miss outcomes count in the hit-rate sample.
- Fixed price-level input handling so decimal values and N/A work consistently.
- Added local migration from older storage keys into ict_cards_v078.
- Updated the app entrypoint to assets/app.js with a cache-busting query string.

### Added

- JSON export/import using schema ict_dol_sweep_export_v6.
- Text export for simple backups.
- manifest.webmanifest.
- GitHub Pages workflow.
- Static smoke test and smoke-test workflow.
- .nojekyll for static Pages deployment.

### Documentation

- Updated the live version references to v0.7.8.
- Documented the fixed app workflow, storage key, and deployment support.
