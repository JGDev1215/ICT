# Issue Fix Plan

This document captures the main fixes and improvements for the ICT DOL Sweep Tracker.

## Implementation Status

- Completed in v0.2.0 — simplified the workflow around one instrument, draw on liquidity, and lower-timeframe sweep.
- Completed in v0.3.0 — hardened saved-card persistence with stable IDs and visible status.
- Completed in v0.4.0 — added Save changes and Final save separation.
- Completed in v0.5.0 — converted the planner into a page-by-page wizard.
- Completed in v0.7.8 — restored the home page, saved-card review page, final-save analytics, JSON backup tools, cache-safe app loading, GitHub Pages workflow, changelog, and smoke tests.
- Completed in v0.7.9 — added bias, validation, invalidation, saved-card bias display, review markers, and an updated smoke test.

## Completed in v0.7.9

### 1. Add bias thesis inputs

Status: Completed

The planner now captures:

- Bias: Bullish or Bearish
- Validation of bias
- Invalidation of bias

### 2. Display bias on review and saved cards

Status: Completed

The focus card and saved-card review page display:

- Bias
- Bias read
- Validation
- Invalidation

Saved-card rows also show the bias label where bias metadata exists.

### 3. Add bias review markers

Status: Completed

Saved-card review pages now include:

- Bias validated
- Bias invalidated

### 4. Preserve static-site compatibility

Status: Completed

The bias feature is implemented in:

```text
assets/bias-extension.js
```

The core app remains static-site compatible and can still be deployed through GitHub Pages.

### 5. Update backup schema

Status: Completed

Bias-aware JSON export uses:

```text
ict_dol_sweep_export_v7
```

Bias metadata is stored locally under:

```text
ict_bias_card_meta_v1
```

## Completed in v0.7.8

### 1. Restore main page navigation

Status: Completed

The app now opens on a clear main page with:

- Start new analysis
- Saved cards
- Liquidity notes

### 2. Restore saved-card review pages

Status: Completed

Each saved card now opens into its own review page with:

- Card summary
- Verification markers
- Outcome selector
- Verification notes
- Load to planner
- Copy
- Save changes
- Final save
- Delete

### 3. Restore final-save analytics

Status: Completed

The Saved Cards page shows:

- Final hit rate
- Final Hit/Miss sample size
- Final Breakeven count
- Needs final save count

Only final-saved Hit/Miss cards count in the hit-rate sample.

### 4. Fix persistence and migration

Status: Completed

Current saved cards are stored under:

```text
ict_cards_v078
```

Older local data is migrated from:

```text
ict_cards_v077
ict_cards_v076
ict_dol_sweep_cards_v2
ict_slips_v1
```

### 5. Improve numeric validation

Status: Completed

Price-level inputs now accept decimal values and N/A consistently. The inputs no longer rely on type=number, which previously blocked valid N/A entries.

### 6. Add export/import backup tools

Status: Completed

The Saved Cards page now includes:

- Verify data
- Export text
- Export JSON
- Import JSON

The JSON export schema is:

```text
ict_dol_sweep_export_v6
```

### 7. Add deployment and smoke-test support

Status: Completed

Added:

- .github/workflows/pages.yml
- .github/workflows/smoke.yml
- tests/smoke.js
- manifest.webmanifest
- .nojekyll
- CHANGELOG.md

## Remaining Work

### Optional backend collection

Status: Planned

The app currently stores data locally only. A future backend could collect anonymised or account-linked final-saved outcomes, instrument-level hit rate, draw type hit rate, and sweep type hit rate.

Any backend should include clear privacy controls before collecting trading-review data.

### Optional deeper browser automation

Status: Planned

A deeper browser suite could cover full click-through flows, saved-card edits, JSON import/export, and final hit-rate calculation.

### Optional PWA icons and service worker

Status: Planned

A manifest is included. Remaining optional PWA work includes icons and an optional offline service worker.

## Definition of Done

A fix is complete when:

- the behaviour is clear to the user
- the app remains static-site compatible
- saved-card data remains backward compatible where possible
- README is updated where needed
- the main planner flow is manually tested or covered by automated smoke tests
