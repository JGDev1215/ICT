# Saved Setups Tab Update Plan

## Summary

Add an in-page `Planner / Saved` tab system to `ict-framework.html`. The app should remain a single standalone HTML file using the existing `localStorage` key, `ict_slips_v1`.

The new `Saved` tab should become a lightweight `Saved Setups / Trade Journal` view, not a separate page and not a duplicated copy of the planner.

## V1 Scope

- Add two tabs near the top of the app:
  - `Planner`
  - `Saved`
- Use accessible tab markup:
  - `role="tablist"`
  - `role="tab"`
  - `role="tabpanel"`
  - inactive panel hidden with `hidden`
- Keep the active setup workflow in `Planner`.
- Move the saved slips journal into `Saved`.
- Keep the current setup summary and `Save slip` / `Copy` controls in `Planner`.
- Rename the saved area to `Saved Setups / Trade Journal`.
- Add `setView(view)` to switch between tabs.
- Add `updateSavedCount()` so the Saved tab can show the number of saved setups.
- When a saved slip is loaded, restore the setup and switch back to `Planner`.

## Saved Setup Card Content

Each saved setup card should show:

- Date, time, and instrument
- Direction from bias
- Entry model
- Phase snapshot
- Draw on liquidity
- Sweep details
- Macro timing
- MSS note
- Entry note
- Risk, profit, and calculated R
- Outcome
- Validation ticks:
  - Bias confirmed
  - Draw confirmed
  - Sweep confirmed
  - Macro checked
  - MSS confirmed
  - Entry confirmed
- Model card details:
  - Trigger
  - Invalidation
  - Target logic
  - Source
- Liquidity context:
  - Draw pool type
  - Sweep pool type
  - Tier/context note where known
- Lightweight journal notes:
  - Final R
  - Target reached
  - Invalidation reason
  - Management mistake
  - Chart note

## Data Model

Keep the existing storage key:

```js
ict_slips_v1
```

Keep the existing top-level saved slip shape:

```js
{
  fields: {},
  ticks: {},
  savedAt: "",
  outcome: "",
  bias: null,
  phases: []
}
```

Add only one optional object:

```js
journal: {
  finalR: "",
  targetReached: "",
  invalidationReason: "",
  managementMistake: "",
  chartNote: ""
}
```

Compatibility rule:

- `normalizeSlip()` must accept old records with no `journal` object.
- Old records should load safely with blank journal defaults.
- Do not rename:
  - `fields`
  - `ticks`
  - `bias`
  - `phases`
  - `outcome`
  - `savedAt`
  - `ict_slips_v1`

## Implementation Steps

1. Add tab CSS for the tab bar, active tab state, and tab panels.
2. Add tab markup below the intro text.
3. Wrap the existing planner workflow in `plannerPanel`.
4. Move the existing saved slips card into `savedPanel`.
5. Add tab references in the current IIFE:
   - `plannerTab`
   - `savedTab`
   - `plannerPanel`
   - `savedPanel`
6. Add `setView(view)`.
7. Add `updateSavedCount()`.
8. Extend `normalizeSlip()` with `journal` defaults.
9. Extend `collect()` so new slips include an empty `journal`.
10. Extend `renderJournal()` into expanded saved setup cards.
11. Add journal input fields per saved card.
12. Persist journal field edits by loading slips, updating the selected record, and calling `storeSlips()`.
13. Update `LOAD` to call `restore()` and then `setView('planner')`.
14. Expand `slipText()` into Markdown-style export sections.
15. Update `Export all` to include the expanded saved setup and journal data.

## Markdown Export Shape

Export each saved setup in this structure:

```md
## YYYY-MM-DD - INSTRUMENT - MODEL

### Setup
- Time:
- Direction:
- Phase:
- Draw:
- Sweep:
- Macro:
- MSS:
- Entry:

### Model
- Trigger:
- Invalidation:
- Target:
- Source:

### Liquidity Context
- Draw pool:
- Sweep pool:
- Notes:

### Risk
- Risk:
- Profit:
- Planned R:
- Final R:

### Validation
- Bias:
- Draw:
- Sweep:
- Macro:
- MSS:
- Entry:

### Outcome
- Result:
- Target reached:
- Invalidation reason:
- Management mistake:
- Chart note:
```

## Defer

Do not include these in v1:

- Filtering
- Search
- Sorting
- Tags
- Analytics
- Charts
- Screenshot upload
- Import
- Separate HTML route/page
- Editing every planner field directly inside the Saved tab
- Full trade-management matrix unless every displayed rule is explicitly supported

Do not infer missing ICT rules. Use `[NO CANONICAL SOURCE FOUND]` where the reference lacks canonical coverage.

## Acceptance Checks

- Old `ict_slips_v1` records load without errors.
- Old records display blank journal fields.
- Saving a new setup increments the Saved tab count.
- Loading a saved setup restores:
  - planner fields
  - ticks
  - bias
  - phases
  - model card
- Loading a saved setup switches back to `Planner`.
- Outcome changes persist after refresh.
- Journal fields persist after refresh.
- Export includes setup, model guidance, validation, risk/R, outcome, and notes.
- Delete removes only the selected slip.
- Empty storage shows a clean empty state.
- Keyboard tab navigation works.
- `aria-selected`, `tabindex`, and `hidden` states update correctly.
- Mobile layout does not overflow with expanded saved cards.

