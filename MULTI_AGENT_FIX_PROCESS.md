# Multi-Agent Fix Process

## Purpose

This file records the process used to analyse and repair the ICT DOL Sweep Tracker after the repository review.

The review found a mismatch between the documented product and the active implementation. The main problem was not one isolated bug. It was a source-of-truth issue:

- the README described a richer workflow,
- `index.html` loaded a versioned JavaScript file,
- the documented `assets/app.js` was not the active file,
- saved-card review, final-save analytics, and export/import were documented but not active.

## First-principles breakdown

The app only needs four foundations to work correctly:

1. **One active source of truth**  
   The HTML entrypoint must load one readable JavaScript file.

2. **Reliable local data**  
   Saved cards need stable IDs, a single storage key, migration from older keys, and safe load/save helpers.

3. **A complete user workflow**  
   The interface must support home navigation, planner steps, saved cards, individual review, and final-save.

4. **Transparent verification**  
   Draft/complete status, review markers, outcome, analytics, export/import, and backup must be visible and predictable.

## Agent split used

### Agent 1 — Repository Analyst

**Task**

- Review the repository structure.
- Compare the README, issue plan, HTML, JavaScript, and CSS.
- Identify gaps between documentation and implementation.

**Findings**

- README version and active HTML version did not match.
- README said `assets/app.js` was the app logic, but `index.html` loaded `assets/app-v0.7.7.js`.
- The active app started directly in the planner, not on the documented home page.
- Saved-card review, outcome persistence, final-save, analytics, and export/import were missing from the active app.

### Agent 2 — Documentation Agent

**Task**

- Create this process file.
- Update README to match the repaired app.
- Update the issue plan with completed and remaining work.
- Add a changelog.

**Output**

- `MULTI_AGENT_FIX_PROCESS.md`
- `README.md`
- `ISSUE_FIX_PLAN.md`
- `CHANGELOG.md`

### Agent 3 — App Logic Agent

**Task**

- Replace the active app logic with a readable static JavaScript implementation.
- Keep the app dependency-free.
- Restore the documented workflow.

**Output**

- `assets/app.js`

**Fixes carried out**

- Added home page navigation.
- Added saved-card access from the home page.
- Added stable card IDs.
- Added storage helpers.
- Added migration from older storage keys.
- Added draft/complete status.
- Added DOL and sweep timeframe fields.
- Added directional sweep warning.
- Added verification markers.
- Added outcome persistence.
- Added Save changes and Final save.
- Added final hit-rate analytics.
- Added text export, JSON export, and JSON import.
- Added copy, load-to-planner, and delete actions.

### Agent 4 — UI and Accessibility Agent

**Task**

- Keep the existing visual style.
- Remove unnecessary external runtime dependency.
- Make saved card rows work as accessible buttons.
- Keep the app mobile-friendly.

**Output**

- `index.html`
- `assets/styles.css`

**Fixes carried out**

- Updated version to `v0.8.0`.
- Switched the active script to `assets/app.js`.
- Removed Google Fonts dependency and used system fonts.
- Improved saved-card row button styling.
- Preserved focus-visible styling and responsive layout.

### Agent 5 — QA Agent

**Task**

- Check that the repair is internally consistent.
- Confirm the JavaScript parses.
- Check that the file references and documentation agree.

**Checks**

- `assets/app.js` passes JavaScript syntax checking with `node --check`.
- `index.html` points to `assets/app.js`.
- README, issue plan, and changelog reference `v0.8.0`.
- The active storage key is documented as `ict_dol_sweep_cards_v2`.

## Fix order

1. Create a safe branch.
2. Save this process file.
3. Repair the active app source.
4. Update the HTML entrypoint.
5. Update styling.
6. Update README and issue plan.
7. Add changelog.
8. Remove the unused versioned JavaScript file.
9. Open a pull request for review.

## Manual smoke checklist

Before merging, open `index.html` locally or through GitHub Pages and check:

1. Home page loads.
2. Start new analysis opens Step 1.
3. Back and Next navigation works.
4. Date, instrument, and session persist while moving through steps.
5. DOL rows accept timeframe, level, draw, confidence, and expected hit time.
6. Sweep rows accept timeframe, level, draw, confidence, and expected hit time.
7. Numeric fields accept decimals, comma decimals, and `N/A`.
8. Review page shows Draft when required fields are missing.
9. Review page shows Complete when instrument, one DOL row, and one sweep row are complete.
10. Save card opens individual saved-card review.
11. Save changes stores verification markers and notes.
12. Final save requires an outcome other than Open.
13. Hit/Miss final-save records update the final hit-rate metric.
14. Breakeven final-save records are counted separately.
15. Copy places a card summary on the clipboard.
16. Load to planner restores the saved card fields.
17. Export text downloads a text backup.
18. Export JSON downloads a schema-based backup.
19. Import JSON restores valid saved cards.
20. Delete removes the selected saved card.

## Remaining work

The core local app is now repaired. The main work left is deployment and test automation:

- enable GitHub Pages or add a Pages workflow,
- add automated browser smoke tests,
- optionally add PWA support,
- optionally add a backend only after privacy controls are clear.
