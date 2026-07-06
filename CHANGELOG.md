# Changelog

## v0.8.0 — 2026-07-06

### Fixed

- Made `assets/app.js` the active app source.
- Updated `index.html` to load `assets/app.js` with a versioned cache-busting query string.
- Restored the documented home page with:
  - Start new analysis
  - Saved cards
  - Liquidity notes
- Added direct access to Saved Cards without first saving a new card.
- Added stable saved-card IDs.
- Added local storage helpers for load, save, update, delete, and migration.
- Migrated older local storage keys into `ict_dol_sweep_cards_v2`.
- Added draft and complete status logic.
- Added timeframe fields to DOL and sweep rows.
- Added directional sweep warning.
- Added saved-card review pages.
- Added verification markers.
- Added outcome persistence.
- Added Save changes and Final save behaviour.
- Added final hit-rate analytics using final-saved Hit/Miss outcomes only.
- Added Breakeven and Needs final save metrics.
- Added text export.
- Added JSON export using schema `ict_dol_sweep_export_v5`.
- Added JSON import.
- Added card copy, load-to-planner, and delete actions.
- Removed the runtime dependency on Google Fonts.
- Updated README and issue plan to match the current implementation.
- Added `MULTI_AGENT_FIX_PROCESS.md`.

### Removed

- Removed the unused versioned JavaScript file from the active workflow.

## v0.7.7 and earlier

Earlier versions established the static app, planner flow, saved-card concept, and local browser storage.
