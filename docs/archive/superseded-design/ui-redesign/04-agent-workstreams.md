# 04 — Agent Workstreams

> Status: Superseded
> Last reviewed: 2026-07-09
> Source of truth: No


> Current-status note — 2026-07-08: this workstream pack is historical. Any items requiring visible validation/invalidation inputs or cards are superseded by the current v0.8 workflow, which preserves those fields only for compatibility and export.

## How to use this file

Assign one workstream per agent. Agents should not edit files outside their ownership unless they explicitly coordinate through a PR or handoff note.

Preferred sequence:

1. State/Data Agent
2. Design System Agent
3. App Shell Agent
4. Planner Agent
5. Saved/Focus Card Agent
6. Secondary Screens Agent
7. QA Agent

Parallel work is possible after Workstreams 1 and 2 are complete.

## Shared rules for every agent

- Keep the app static and GitHub Pages compatible.
- Do not add npm/build dependencies unless approved.
- Preserve localStorage data and migration.
- Preserve export/import.
- Preserve final-save analytics.
- Use semantic HTML where possible.
- Keep all UI educational-only; do not imply trade recommendations.
- Add or update smoke tests for any route/state behaviour changed.
- Update docs if behaviour changes.

## Workstream 1 — State/Data Agent

### Mission

Stabilise the data layer so UI agents can build screens safely.

### Owned files

- `assets/state.js` or state section inside `assets/app.js`
- `assets/data.js` or constants section inside `assets/app.js`
- `tests/smoke.js`
- relevant README/CHANGELOG updates

### Tasks

1. Define a single normalised saved-card shape.
2. Add fields for:
   - favorite
   - journal
   - risk
   - settings/defaults where needed
3. Preserve current fields:
   - instrument
   - session
   - bias
   - biasValidation
   - biasInvalidation
   - DOL stack
   - sweep stack
   - FVG
   - markers
   - outcome
   - finalSaved
4. Preserve migration from older storage keys.
5. Ensure export/import includes all new fields.
6. Add helper functions:
   - `getCards()`
   - `saveCards(cards)`
   - `normaliseCard(card)`
   - `getMetrics(cards)`
   - `createBlankDraft()`
   - `updateCard(id, patch)`
   - `deleteCard(id)`
   - `toggleFavorite(id)`
   - `exportCards()`
   - `importCards(payload)`

### Acceptance criteria

- Existing saved cards still load.
- Cards without new fields do not break rendering.
- Final hit rate still only uses final-saved Hit/Miss outcomes.
- Export/import round trip preserves new and old fields.
- Smoke test passes.

## Workstream 2 — Design System Agent

### Mission

Implement the new visual foundation without changing app logic.

### Owned files

- `assets/styles.css`
- optional `assets/icons.css`
- optional design token section in README

### Tasks

1. Replace old dark visual tokens with the new light mobile tokens.
2. Add reusable classes:
   - app shell
   - bottom nav
   - cards
   - hero cards
   - chips
   - badges
   - form fields
   - sticky CTA
   - FAB
   - metric grid
   - timeline nodes
3. Add Material Symbols support.
4. Add Manrope font support.
5. Ensure desktop wrapper looks clean.
6. Ensure mobile width has no horizontal scroll.

### Acceptance criteria

- Existing app remains usable after CSS change.
- All buttons/inputs retain visible focus states.
- Mobile tap targets are at least 44px high.
- No inline canvas styles copied into production.
- Smoke test passes.

## Workstream 3 — App Shell and Navigation Agent

### Mission

Create the mobile app shell and route system.

### Owned files

- `assets/app.js` or router section
- optional `assets/ui.js`
- optional `assets/screens/home.js`
- `tests/smoke.js`

### Tasks

1. Introduce primary routes:
   - home
   - planner
   - saved
   - journal
   - profile
2. Introduce secondary routes:
   - focus-card detail
   - timeline
   - liquidity-map
   - risk
3. Add bottom tab bar.
4. Add route helpers:
   - `go(route, params)`
   - `renderShell(content, activeTab)`
   - `renderTabBar(activeTab)`
5. Ensure Back/Home navigation is always available.
6. Keep old planner and saved flows reachable during transition.

### Acceptance criteria

- User can navigate Home → Planner → Saved → Focus Card → Home.
- Bottom nav active state is correct.
- No route leaves the user trapped.
- Smoke test covers core navigation.

## Workstream 4 — Planner Agent

### Mission

Rebuild the planner as the AI Trade Plan Builder screen.

### Owned files

- `assets/screens/planner.js` or planner render section in `assets/app.js`
- planner-related styles if needed
- planner tests

### Tasks

1. Build chat-style assistant header.
2. Build instrument/session fields.
3. Build Bullish/Bearish segmented control.
4. Build validation/invalidation inputs.
5. Build DOL stack controls.
6. Build sweep stack controls.
7. Build FVG controls.
8. Build generated preview from live form values.
9. Add sticky Save Draft / Generate Focus Plan CTA.
10. Ensure generated plan saves a valid card and opens Focus Card Details.

### Acceptance criteria

- Can create a complete card.
- Can save an incomplete draft.
- Bias, validation and invalidation persist.
- Numeric price fields sanitise correctly.
- Generated preview changes when form values change.
- Smoke test covers save draft and create focus card.

## Workstream 5 — Saved and Focus Card Agent

### Mission

Build the Saved list and Focus Card Details screens.

### Owned files

- `assets/screens/saved.js` or saved render section
- `assets/screens/focus-card.js` or review render section
- saved/focus tests

### Tasks

1. Build Saved page header, search and filter chips.
2. Build saved-card rows with bias, counts, FVG and outcome badges.
3. Add favorite toggle.
4. Build Focus Card Details hero.
5. Build validation/invalidation cards.
6. Build DOL and sweep sections.
7. Preserve Save changes, Final save, Copy, Share and Delete.
8. Add timeline route link if needed.

### Acceptance criteria

- Search filters cards.
- Draft/final/hit/miss/favorite filters work.
- Focus card shows all saved data.
- Save changes and Final save preserve analytics behaviour.
- Copy output includes bias, validation and invalidation.
- Smoke test covers open card, final save and delete.

## Workstream 6 — Secondary Screens Agent

### Mission

Build Timeline, Liquidity Map, Risk Tracker, Journal and Profile screens.

### Owned files

- `assets/screens/timeline.js`
- `assets/screens/liquidity-map.js`
- `assets/screens/risk.js`
- `assets/screens/journal.js`
- `assets/screens/profile.js`
- relevant tests

### Tasks

1. Timeline:
   - render pre-session, during-session and after-trade groups
   - derive status from markers/card fields
   - add note action
2. Liquidity Map:
   - searchable concept cards
   - category chips
   - add concept to current draft
3. Risk Tracker:
   - planned-risk hero
   - final-save metrics
   - review quality bars
4. Journal:
   - journal entries from saved-card notes/lessons
   - tags
   - export action
5. Profile:
   - settings list
   - default instrument/session
   - export/import
   - clear local data confirmation

### Acceptance criteria

- Every route renders without data.
- Every route uses real local data where available.
- Add-to-plan from Liquidity Map updates planner draft.
- Profile export/import reuses state helpers.
- Smoke test covers route rendering.

## Workstream 7 — QA and Documentation Agent

### Mission

Protect behaviour and release quality.

### Owned files

- `tests/smoke.js`
- README
- CHANGELOG
- docs
- optional manual QA checklist

### Tasks

1. Expand smoke tests for:
   - app load
   - route navigation
   - planner save
   - saved-card list
   - final save
   - export/import
   - key screen strings
2. Add a manual QA checklist.
3. Update README with new UI routes.
4. Update CHANGELOG.
5. Verify no broken file paths.
6. Verify GitHub Pages compatibility.

### Acceptance criteria

- Smoke test passes.
- README reflects the redesigned app.
- CHANGELOG has a release entry.
- Manual QA checklist exists.
- No new dependency without approval.

## Agent conflict prevention

| File | Primary owner | Notes |
| --- | --- | --- |
| `assets/styles.css` | Design System Agent | Other agents may request classes, not edit directly. |
| `assets/app.js` | State/Shell agents first | Later agents should work in screen modules if created. |
| `tests/smoke.js` | QA Agent | Other agents may add test cases through PR. |
| `README.md` | QA Agent | Update only after implementation. |
| `docs/archive/superseded-design/ui-redesign/*` | QA/Senior lead | Agents can append handoff notes. |

## Handoff format

Each agent must finish with:

```md
## Handoff — <Agent Name>

### Completed
- ...

### Files changed
- ...

### Tests run
- ...

### Known gaps
- ...

### Next agent notes
- ...
```
