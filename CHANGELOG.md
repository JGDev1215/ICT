# Changelog

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
