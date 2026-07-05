# Issue Fix Plan

This document captures the main fixes and improvements for the ICT DOL Sweep Tracker.

## Implementation Status

- **Completed in v0.2.0** — the app was simplified around one instrument, higher-timeframe draw on liquidity, and lower-timeframe sweep.
- **Completed in v0.2.0** — saved slips became saved cards with checklist markers, notes, outcomes, and local hit-rate analytics.
- **Completed in v0.3.0** — saved-card persistence now uses stable IDs, autosaved notes, visible save status, verified-analysis markers, and verified hit-rate tracking.
- **Next pass** — GitHub Pages deployment, automated smoke tests, file split, changelog, and optional backend/PWA work.

## Completed Fixes

### 1. Simplify the core workflow

**Status:** Completed

The previous workflow included market phases, timing, MSS, and entry models. The user-facing planner has now been simplified to:

1. Instrument
2. HTF draw on liquidity
3. LTF liquidity sweep
4. Focus output card

**Acceptance criteria met**

- User focuses on one instrument only.
- Output card only shows instrument, HTF draw, LTF sweep, and focus status.
- Optional notes stay secondary and do not complicate the output.

### 2. Clarify readiness logic

**Status:** Completed

Readiness now depends on:

- instrument selected
- HTF draw timeframe, pool, and level completed
- LTF sweep timeframe, pool, and level completed
- directional draw has an opposing-side sweep where applicable

**Acceptance criteria met**

- Readiness state matches the visible workflow.
- Market-context complexity has been removed from the main planner.
- The app clearly marks Draft vs Complete.

### 3. Prevent incomplete or accidental saved slips

**Status:** Completed

Saved records are now marked as either:

- `draft`
- `complete`

Drafts can still be saved, but they are clearly labelled.

**Acceptance criteria met**

- Incomplete cards are labelled Draft.
- Complete cards are labelled Complete.
- Save hint explains what is missing.

### 4. Improve numeric validation

**Status:** Completed

Price-level fields now share consistent numeric sanitisation:

- comma converted to decimal point
- invalid characters removed
- duplicate decimal points removed
- `N/A` still accepted where typed directly

**Acceptance criteria met**

- Draw level and sweep level behave consistently.
- Invalid numeric characters are cleaned before save.

### 5. Saved card review flow

**Status:** Completed

Saved cards now allow review without leaving the Saved Cards tab.

Each saved card includes:

- HTF draw summary
- LTF sweep summary
- checklist markers:
  - Draw respected
  - LTF sweep confirmed
  - Plan followed
  - Analysis verified
- verification notes field
- outcome selector
- Load, Copy, Delete actions

**Acceptance criteria met**

- User can review the saved card directly.
- Marker tick-state is saved per card.
- Notes are saved per card.
- Existing older saved-slip data can be migrated locally.

### 6. Production-grade saved-card persistence

**Status:** Completed in v0.3.0

Saved-card edits now use stable card IDs instead of array index position.

**Fixes completed**

- Added ID-based helpers for get, update, and delete.
- Checklist, outcome, notes, load, copy, and delete now target `card.id`.
- Load and copy fetch the latest card before use.
- Save failures show visible feedback.
- Notes autosave while typing and save again on blur/change.
- Card status, draw side, sweep side, and alignment are recalculated during normalisation.

**Acceptance criteria met**

- Deleting or importing cards does not cause later edits to update the wrong card.
- Notes persist more reliably.
- User can see when local save succeeds or fails.
- Imported or migrated cards are rechecked before display.

### 7. Verified hit-rate analytics data

**Status:** Completed locally in v0.3.0

The Saved Cards tab now shows:

- Verified hit rate
- Verified Hit/Miss sample size
- Verified Breakeven count
- Needs verify count

Hit rate uses only cards marked **Analysis verified** with Hit or Miss outcome. Breakeven is tracked separately.

**Acceptance criteria met**

- User can see verified prediction hit rate.
- Open records are excluded from hit-rate calculation.
- Unverified closed records do not enter the hit-rate sample.
- Breakeven is separate.
- JSON export creates a backend-ready payload.

### 8. Export and import support

**Status:** Completed locally

The app now supports:

- plain-text export
- JSON export
- JSON import
- data verification/normalisation

The JSON export schema is:

```text
ict_dol_sweep_export_v3
```

**Acceptance criteria met**

- User can export saved cards.
- User can import valid exported cards.
- Export includes analytics and verified card data for future backend collection.

## Remaining Work

### 9. Add GitHub Pages deployment configuration

**Status:** Planned

**Fix**

- Enable GitHub Pages from `main` branch root, or add a Pages workflow.
- Add the live URL to the README once available.

### 10. Add automated smoke tests

**Status:** Planned

**Fix**

Add a lightweight browser test suite covering:

- page load
- tab switching
- draw selection
- sweep validation
- save/load card
- notes autosave
- marker verification
- outcome update
- verified hit-rate calculation
- JSON export/import

### 11. Split the single HTML file into smaller files

**Status:** Planned

Suggested structure:

```text
ICT/
├── index.html
├── assets/
│   ├── styles.css
│   └── app.js
├── README.md
└── ISSUE_FIX_PLAN.md
```

### 12. Add changelog and formal versioning

**Status:** Planned

**Fix**

- Add `CHANGELOG.md`.
- Keep visible version number in footer.
- Update version when storage schema or workflow changes.

### 13. Optional backend collection

**Status:** Planned

The app currently stores data locally only. A future backend could collect:

- anonymised or account-linked saved cards
- verified hit/miss outcomes
- instrument-level hit rate
- draw type hit rate
- sweep type hit rate

Any backend should include clear privacy controls before collecting user trading-review data.

### 14. Optional PWA support

**Status:** Planned

**Fix**

- Add `manifest.webmanifest`.
- Add icons.
- Add optional service worker for offline cache.

## Definition of Done

A fix is complete when:

- the behaviour is clear to the user
- the app remains static-site compatible
- saved-card data remains backward compatible where possible
- README is updated where needed
- the main planner flow is manually tested or covered by automated smoke tests
