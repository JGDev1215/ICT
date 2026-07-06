# Issue Fix Plan

This document captures the main fixes and improvements for the ICT DOL Sweep Tracker.

## Implementation Status

- **Completed in v0.8.0** — restored the documented home page, saved-card access, active app source, saved-card review flow, final-save workflow, local analytics, export/import, and storage migration.
- **Current app source of truth** — `index.html` loads `assets/app.js`.
- **Next pass** — GitHub Pages deployment, automated browser smoke tests, optional backend, and optional PWA support.

## Completed Fixes

### 1. Align the active app file

**Status:** Completed in v0.8.0

**Fix completed**

- `index.html` now loads `assets/app.js`.
- The old versioned app file is no longer used.
- Version references have been aligned to `v0.8.0`.

### 2. Restore the main page

**Status:** Completed in v0.8.0

The main page now includes:

- Start new analysis
- Saved cards
- Liquidity notes

Saved Cards can be opened without creating a new analysis first.

### 3. Page-by-page wizard interface

**Status:** Completed

The planner renders one screen at a time:

1. Main page
2. Instrument
3. Draw on Liquidity
4. Potential Sweep Liquidity
5. Review Focus Card
6. Saved Cards
7. Saved Card Review
8. Liquidity Notes

Back and Next are navigation controls only. Draft cards can still be saved.

### 4. Clarify readiness logic

**Status:** Completed in v0.8.0

Readiness now depends on:

- instrument selected
- at least one complete DOL row
- no partially-started DOL rows
- at least one complete sweep row
- no partially-started sweep rows

A DOL or sweep row is complete when timeframe, level, and liquidity draw are filled.

### 5. Directional sweep warning

**Status:** Completed in v0.8.0

Directional liquidity options are classified as:

- buy-side
- sell-side
- neutral

The app warns if the sweep appears to be on the same side as the DOL. Neutral draws remain non-blocking.

### 6. Prevent incomplete or accidental saved slips

**Status:** Completed

Saved records are marked as either:

- `draft`
- `complete`

Drafts can still be saved, but they are clearly labelled.

### 7. Improve numeric validation

**Status:** Completed in v0.8.0

Price-level fields now share consistent sanitisation:

- comma converted to decimal point
- invalid characters removed
- duplicate decimal points removed
- `N/A` accepted

### 8. Production-grade saved-card persistence

**Status:** Completed in v0.8.0

Saved cards now use stable IDs and helper functions for:

- load
- normalise
- save
- update
- delete
- migrate older keys

The current storage key is:

```text
ict_dol_sweep_cards_v2
```

Older keys migrated locally:

```text
ict_cards_v077
ict_cards_v076
ict_dol_sweep_cards_v1
ict_slips_v1
```

### 9. Saved card review flow

**Status:** Completed in v0.8.0

Each saved card review page includes:

- DOL and sweep summary
- checklist markers
- outcome selector
- verification notes
- Load to planner
- Copy
- Save changes
- Final save
- Delete

### 10. Save changes and Final save workflow

**Status:** Completed in v0.8.0

- **Save changes** stores edits locally and removes final-saved status.
- **Final save** requires an outcome other than Open.
- Final-saved cards are included in the local analytics sample where applicable.
- Editing a final-saved card and pressing Save changes returns it to a non-final state.

### 11. Final hit-rate analytics data

**Status:** Completed in v0.8.0

The Saved Cards page shows:

- Final hit rate
- Final Hit/Miss sample size
- Final Breakeven count
- Needs final save count

Hit rate uses only final-saved Hit/Miss outcomes. Breakeven is tracked separately.

### 12. Export and import support

**Status:** Completed in v0.8.0

The app supports:

- plain-text export
- JSON export
- JSON import
- data verification / normalisation

The JSON export schema is:

```text
ict_dol_sweep_export_v5
```

### 13. Runtime dependency cleanup

**Status:** Completed in v0.8.0

The app now uses system fonts and does not load external Google Fonts at runtime.

### 14. Changelog and formal versioning

**Status:** Completed in v0.8.0

- Added `CHANGELOG.md`.
- Version number is visible in the page title and footer.
- Cache-busting query strings are versioned.

### 15. Multi-agent process record

**Status:** Completed in v0.8.0

Added `MULTI_AGENT_FIX_PROCESS.md` explaining:

- the analysis process
- the agent split
- the fix order
- verification checks
- remaining work

## Remaining Work

### 16. Add GitHub Pages deployment configuration

**Status:** Planned

**Fix**

- Enable GitHub Pages from `main` branch root, or add a Pages workflow.
- Add the live URL to the README once available.

### 17. Add automated smoke tests

**Status:** Planned

**Fix**

Add a lightweight browser test suite covering:

- page load
- main page saved-card navigation
- Back/Next wizard navigation
- draw selection
- sweep validation
- save/load card
- Save changes button
- Final save button
- outcome update
- final hit-rate calculation
- JSON export/import

### 18. Optional backend collection

**Status:** Planned

The app currently stores data locally only. A future backend could collect:

- anonymised or account-linked saved cards
- final-saved hit/miss outcomes
- instrument-level hit rate
- draw type hit rate
- sweep type hit rate

Any backend should include clear privacy controls before collecting user trading-review data.

### 19. Optional PWA support

**Status:** Planned

**Fix**

- Add `manifest.webmanifest`.
- Add icons.
- Add optional service worker for offline cache.

## Definition of Done

A fix is done when:

- the UI matches the README,
- saved cards survive refresh,
- review edits target the correct card ID,
- final-save analytics only count final-saved outcomes,
- export/import works locally,
- old storage keys migrate safely,
- the app remains deployable as a static GitHub Pages site.
