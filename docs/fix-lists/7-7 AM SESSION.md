# 7-7 AM SESSION — Current App Dry Run Fix List

## Session context

Date: 2026-07-07 AM session

Scope reviewed:

- `index.html`
- `assets/app.js`
- `assets/bias-extension.js`
- `assets/styles.css`
- `manifest.webmanifest`
- `tests/smoke.js`
- `README.md`
- `docs/ui-redesign/06-build-plan-gap-review.md`

Method:

- Static repo inspection.
- Simulated user-flow dry run from the current code path.
- No browser automation was run in this pass.

Core dry-run path checked:

1. App load.
2. Start new analysis.
3. Bias input injection.
4. DOL input.
5. Sweep input.
6. FVG input.
7. Save card.
8. Saved-card review.
9. Save changes / Final save.
10. Copy / Export JSON / Import JSON.
11. Delete card.
12. Current redesign readiness.

## Executive verdict

The current app can load and the original planner/saved-card flow exists, but the v0.7.9 bias feature is not fully integrated into the core app. It is currently layered on top through `assets/bias-extension.js` using DOM injection, sessionStorage, separate bias metadata storage and a monkey patch of `Storage.prototype.setItem`.

This is the biggest technical risk before the UI redesign agents start.

The next fix should not be visual. The next fix should be a proper state/data integration pass.

---

# P0 — Critical fixes before screen redesign

## P0-01 — Core app version and UI version are inconsistent

### Problem

`index.html` presents the app as v0.7.9, but `assets/app.js` still declares `VERSION='v0.7.8'` and `SCHEMA='ict_dol_sweep_export_v6'`.

`assets/bias-extension.js` declares v0.7.9 separately.

### Why this matters

There is no single source of truth for versioning, schema or export format. Agents may update the wrong file and create broken release states.

### Fix

- Move version/schema constants into one state/config location.
- Update the core app to v0.7.9 or the next version.
- Remove version patching from the bias extension.
- Ensure export schema and README match the actual code path.

### Owner

Agent 1 — State/Data Architect

---

## P0-02 — Bias is not part of the core card model

### Problem

The core `blank()` and `normFields()` model in `assets/app.js` does not include:

- `bias`
- `biasValidation`
- `biasInvalidation`

The README describes these as core fields, but the app stores them through a separate extension/meta layer.

### Why this matters

Core normalisation can drop bias fields unless the extension re-adds them. This makes save/load/import fragile.

### Fix

- Add bias fields directly to the core card model.
- Add bias markers directly to `markers`.
- Remove the separate `ict_bias_card_meta_v1` dependency after migration.
- Keep one normalised saved-card shape.

### Owner

Agent 1 — State/Data Architect

---

## P0-03 — Bias extension monkey-patches browser storage

### Problem

`assets/bias-extension.js` replaces `Storage.prototype.setItem` globally to intercept writes to `ict_cards_v078`.

### Why this matters

This is brittle and can create hard-to-debug storage side effects. It also hides the real data flow from future agents.

### Fix

- Remove the `Storage.prototype.setItem` monkey patch.
- Save bias through proper state helper functions.
- Route all card writes through one `saveCards()` function.

### Owner

Agent 1 — State/Data Architect

---

## P0-04 — Review-card ID lookup can update the wrong card

### Problem

`currentReviewId()` in `assets/bias-extension.js` guesses the active review card using DOM text and timestamp. If it fails, it falls back to the first card with the same instrument.

### Why this matters

Two cards with the same instrument can cause bias markers or metadata to be saved against the wrong card.

### Fix

- The app must set a reliable `data-card-id` / `data-ict-review-id` on the review route.
- Review actions must use the actual card `id`, never DOM text.
- Remove fallback-by-instrument behaviour.

### Owner

Agent 1 — State/Data Architect / Agent 3 — Screen Builder

---

## P0-05 — Bias export/import is not reliable

### Problem

The bias extension overrides the Export JSON button and creates schema `ict_dol_sweep_export_v7`, but the core app still exports `ict_dol_sweep_export_v6`.

Import is still handled by the core app. Imported v7 cards containing bias fields can lose those fields because core `normFields()` does not recognise them.

### Why this matters

A user could export cards with bias, then import them later and lose bias/validation/invalidation data.

### Fix

- Move export/import into core state layer.
- Support v6 and v7 import.
- Validate imported payloads.
- Preserve bias fields during normalisation.
- Deduplicate by `id`.
- Show import result count.

### Owner

Agent 1 — State/Data Architect

---

## P0-06 — Smoke test is only static string/syntax checking

### Problem

`tests/smoke.js` checks file strings and JS syntax, but it does not simulate real user flows.

### Why this matters

It can pass while save, import, final-save, review-card identity or bias persistence is broken.

### Fix

Expand tests to include deterministic fixtures for:

- create card
- draft save
- final save
- export
- wipe test storage
- import
- migration
- final hit rate
- sample size
- breakeven count
- needs-final-save count
- plan-followed rate

### Owner

Agent 1 — State/Data Architect / QA Reviewer

---

# P1 — Major functional bugs and workflow issues

## P1-01 — New plan can inherit previous session bias

### Problem

Bias input state is stored in `sessionStorage` under `ict_bias_current_v1`. Starting a new plan resets the core form but does not clearly reset the bias extension state.

### User impact

A new card can accidentally inherit the prior plan's bias/validation/invalidation.

### Fix

- Add a proper `createBlankDraft()` state reset.
- Clear bias draft state when starting a new plan.
- Preserve bias only when intentionally loading an existing card.

---

## P1-02 — Complete status does not require bias fields

### Problem

`comp()` only requires instrument, DOL and sweep completion. Bias, validation and invalidation are not part of the completion logic.

### User impact

A card can be marked Complete even without the new required bias thesis.

### Fix

- Completion should require:
  - instrument
  - bias
  - validation
  - invalidation
  - at least one complete DOL
  - at least one complete sweep

---

## P1-03 — Copy text does not include bias fields

### Problem

The core copy text function does not include bias, validation or invalidation.

### User impact

Copied cards are incomplete and do not match the v0.7.9 workflow.

### Fix

- Update copy text output to include:
  - bias
  - bias read
  - validation
  - invalidation
  - bias validated marker
  - bias invalidated marker

---

## P1-04 — Text export does not include bias fields

### Problem

The plain-text export follows the core card text output and misses bias fields.

### User impact

Text backups are incomplete.

### Fix

- Share one `formatCardText(card)` helper between Copy and Export Text.
- Include all v0.7.9 fields.

---

## P1-05 — Deleting a card leaves orphaned bias metadata

### Problem

Bias metadata is stored separately under `ict_bias_card_meta_v1`. Deleting a card removes the core card but does not clearly delete its bias metadata.

### User impact

Local storage accumulates orphaned metadata and may cause incorrect future enrichment if IDs collide or import behaviour changes.

### Fix

- Until the meta layer is removed, delete matching metadata when deleting a card.
- Long-term fix: remove separate meta storage and store bias on the card.

---

## P1-06 — Verify data does not verify bias metadata

### Problem

The Verify Data action normalises core cards but does not reconcile the separate bias metadata store.

### User impact

Verify data may report success while bias data is stale, missing or orphaned.

### Fix

- Verify should normalise full card data.
- Remove orphaned metadata.
- Report counts: cards checked, cards normalised, orphan metadata removed.

---

## P1-07 — Import validation is too weak

### Problem

Import accepts payloads broadly and relies on normalisation. There is no strong schema validation or user-facing import result.

### User impact

Bad imports can silently produce broken or incomplete cards.

### Fix

- Reject invalid payloads.
- Accept known schema versions.
- Normalise all cards.
- Deduplicate by ID.
- Never wipe existing cards unless confirmed.
- Show import result count.

---

## P1-08 — App code is compressed into one very long line

### Problem

`assets/app.js` is effectively a one-line application.

### User impact

Agents will waste context and are more likely to create merge conflicts or miss logic during fixes.

### Fix

- Reformat `assets/app.js` first.
- Prefer splitting into:
  - `assets/state.js`
  - `assets/data.js`
  - `assets/ui.js`
  - `assets/screens/*.js`
- If not splitting yet, at least convert to readable sections.

---

## P1-09 — Core app and extension duplicate responsibilities

### Problem

The core app owns card rendering, save, review and export. The bias extension also modifies review rendering, save behaviour and export behaviour.

### User impact

Two systems fight for the same responsibilities.

### Fix

- Merge bias responsibilities into core state/rendering.
- Delete `assets/bias-extension.js` only after migration is complete and tested.

---

# P2 — UI/product gaps against redesign plan

## P2-01 — Current UI is still dark, not the uploaded light mobile design

### Problem

`assets/styles.css` still uses the dark theme variables and Space Grotesk / JetBrains Mono visual language.

### Fix

- Implement the light Manrope design system in `02-design-system-spec.md`.
- Add component classes before rebuilding screens.

---

## P2-02 — Fonts do not match the redesign

### Problem

`index.html` loads Space Grotesk and JetBrains Mono, not Manrope and Material Symbols Rounded.

### Fix

- Load Manrope.
- Load Material Symbols Rounded.
- Keep monospace only where needed for prices/timestamps.

---

## P2-03 — No mobile app shell / bottom tab navigation yet

### Problem

The redesign requires a 5-tab shell: Home, Planner, Saved, Journal, Profile. Current app uses simple route buttons.

### Fix

- Build app shell after state and design system foundation.
- Add secondary routes for Focus Card, Timeline, Liquidity Map and Risk.

---

## P2-04 — Missing redesigned screens

### Missing screens

- Market Focus Home
- AI Trade Plan Builder
- Focus Card Details
- Saved Focus Cards
- Execution Timeline
- Liquidity Map / Setup Library
- Risk Tracker
- Trade Journal
- Trader Profile / Settings

### Fix

- Do not build these until Agent 1 and Agent 2 foundations are merged.
- Agent 3 should build in workflow order: Planner → Focus Card → Saved → Home → secondary screens.

---

## P2-05 — Saved screen has no search/filter/favorites

### Problem

Saved cards are grouped by instrument only.

### Fix

- Add search.
- Add filters: Final Saved, Drafts, Hits, Misses, Breakeven, Favorites.
- Add favorite toggle.

---

## P2-06 — No global floating plus action

### Problem

The redesign/build plan requires a global `+` action to start a new plan.

### Fix

- Add global FAB on Home, Saved, Journal, Risk and Profile.
- Hide or convert it on Planner and Focus Card Details.

---

## P2-07 — No silent draft autosave

### Problem

Draft save is still a manual explicit save flow.

### Fix

- Add draft autosave to planner draft state.
- Keep final-save deliberate.
- Show small `Draft saved` feedback only.

---

## P2-08 — Outcome capture ritual is incomplete

### Problem

Outcome exists, but the post-trade ritual is not implemented.

### Fix

Add outcome review flow:

- Hit
- Miss
- Breakeven
- Behaviour tags
- Notes
- Journal entry
- Stats update

Suggested behaviour tags:

- patient
- chased
- followed plan
- invalidated
- revenge risk
- work-call distraction
- early exit
- held to target

---

## P2-09 — PWA is incomplete

### Problem

`manifest.webmanifest` exists, but there are no icons and no service worker/offline cache.

### Fix

- Add icons.
- Add service worker after core screens stabilise.
- Add offline cache.
- Add iOS Safari and Android Chrome install QA.

---

## P2-10 — Mobile safe-area behaviour is not fully tested

### Problem

Current CSS has some `env(safe-area-inset-*)` usage, but the redesign needs full mobile-app shell safe-area testing.

### Fix

- Test iOS Safari.
- Test Android Chrome.
- Ensure bottom nav and sticky CTAs are not blocked.
- Add manual QA checklist.

---

## P2-11 — Accessibility needs a pass

### Problems to check

- Icon buttons need accessible labels.
- Interactive saved cards should announce purpose clearly.
- Search/filter controls need labels.
- Colour cannot be the only status indicator.
- Focus states must survive redesign.

### Fix

- Add ARIA labels where needed.
- Use real buttons and labels.
- Keep minimum 44px tap targets.

---

# P3 — Documentation and release gaps

## P3-01 — README says v0.7.9, but code is split between v0.7.8 and v0.7.9

### Fix

Update actual core code and docs together after state integration.

## P3-02 — Tech decision doc is still missing

### Fix

Create:

```text
docs/ui-redesign/00-tech-decision.md
```

Default recommendation: stay vanilla/static for v1.

## P3-03 — Component gallery is missing

### Fix

Create a component gallery before screen build-out.

## P3-04 — Manual QA checklist is missing

### Fix

Create:

```text
docs/ui-redesign/08-manual-qa-checklist.md
```

Include:

- iOS Safari
- Android Chrome
- desktop browser
- PWA install
- export/import
- old-card migration
- final-save analytics

---

# Recommended fix order

## Immediate next step

Do not start UI screen building yet.

Start with Agent 1.

### Agent 1 — State/Data Architect

1. Reformat or modularise `assets/app.js`.
2. Move bias fields into the core card model.
3. Remove dependency on separate bias metadata storage.
4. Replace storage monkey patch with state helper functions.
5. Fix import/export schema handling.
6. Add data fixture tests.
7. Ensure smoke test covers real behaviour.

## Then Agent 2 — Design System Engineer

1. Add light design tokens.
2. Add Manrope / Material Symbols.
3. Add reusable component classes.
4. Create component gallery.
5. Preserve existing app usability.

## Then Agent 3 — Screen Builder

1. Build app shell and bottom tabs.
2. Build Planner.
3. Build Focus Card Details.
4. Build Saved.
5. Build Home.
6. Build Timeline, Liquidity Map, Risk, Journal, Profile.

---

# Acceptance checklist before UI redesign continues

- [ ] `assets/app.js` has readable structure.
- [ ] Bias fields are part of the core card model.
- [ ] No storage monkey patch is needed.
- [ ] Review card actions use card ID, not DOM text.
- [ ] Copy/export include bias, validation and invalidation.
- [ ] Import preserves bias fields.
- [ ] Delete removes all data belonging to the card.
- [ ] Verify data validates all card fields.
- [ ] Completion status requires bias thesis.
- [ ] Smoke tests cover real save/final-save/export/import behaviour.
- [ ] README, CHANGELOG and schema versions agree.

## Final senior note

The app is not broken beyond repair. The main issue is architectural: v0.7.9 bias was added as an extension layer rather than integrated into the core state model. Fix that first and the redesign agents will have a much safer foundation to build on.
