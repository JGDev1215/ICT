# 05 — Agent Prompt Pack

Use these prompts with local Codex/coding agents. Run one agent per workstream where possible.

## Global agent rules

Attach this rule block to every agent prompt:

```text
You are working on the JGDev1215/ICT repository.

You must follow:
- docs/ui-redesign/README.md
- docs/ui-redesign/01-implementation-plan.md
- docs/ui-redesign/02-design-system-spec.md
- docs/ui-redesign/03-screen-specs.md
- docs/ui-redesign/04-agent-workstreams.md

Do not remove existing saved-card behaviour.
Do not remove export/import.
Do not add a backend.
Do not add a build system unless specifically approved.
Do not present financial advice or trade signals.
Preserve static GitHub Pages compatibility.
Run `node tests/smoke.js` before handing off.
Finish with a handoff note listing completed work, files changed, tests run, known gaps and next-agent notes.
```

## Master coordinator prompt

```text
Act as the senior implementation coordinator for the ICT Sweep Tracker mobile UI redesign.

Your job:
1. Read docs/ui-redesign/*.
2. Inspect the current repo structure.
3. Create a safe implementation sequence for the agents.
4. Confirm whether Workstream 1 and Workstream 2 are complete before allowing other agents to proceed.
5. Prevent overlapping file edits.
6. Review each agent handoff for gaps.
7. Keep the project static, browser-local and GitHub Pages compatible.

Output:
- A task board with each workstream status: Not started / In progress / Blocked / Done.
- Any blockers.
- The next exact prompt to run.
```

## Agent 1 — State/Data prompt

```text
You are Agent 1: State/Data for the ICT Sweep Tracker UI redesign.

Read:
- docs/ui-redesign/01-implementation-plan.md
- docs/ui-redesign/03-screen-specs.md
- docs/ui-redesign/04-agent-workstreams.md

Mission:
Stabilise the local data model before visual work starts.

Tasks:
1. Inspect current assets/app.js and assets/bias-extension.js.
2. Identify current storage keys and migration behaviour.
3. Define or refactor a single normalised saved-card shape.
4. Add safe defaults for favorite, journal and risk fields.
5. Preserve instrument, session, bias, validation, invalidation, DOL, sweep, FVG, markers, outcome and finalSaved.
6. Preserve export/import behaviour.
7. Add helper functions if the structure allows it:
   - getCards
   - saveCards
   - normaliseCard
   - getMetrics
   - createBlankDraft
   - updateCard
   - deleteCard
   - toggleFavorite
   - exportCards
   - importCards
8. Update tests/smoke.js to protect data migration and analytics.

Constraints:
- Do not do visual redesign in this workstream.
- Do not remove any existing UI route.
- Do not change storage keys without migration.

Acceptance:
- Existing cards still load.
- Export/import round trip works.
- Final hit rate still only counts final-saved Hit/Miss.
- node tests/smoke.js passes.

Finish with the required handoff note.
```

## Agent 2 — Design System prompt

```text
You are Agent 2: Design System for the ICT Sweep Tracker UI redesign.

Read:
- docs/ui-redesign/02-design-system-spec.md
- docs/ui-redesign/04-agent-workstreams.md

Mission:
Implement the new light mobile-first visual system in CSS without changing business logic.

Tasks:
1. Update assets/styles.css with the new tokens.
2. Add Manrope and Material Symbols support in index.html if not already present.
3. Add reusable classes for:
   - app shell
   - card
   - hero card
   - button variants
   - chips
   - badges
   - fields
   - bottom nav
   - sticky CTA
   - FAB
   - metric grid
   - timeline
4. Keep existing app usable during transition.
5. Preserve visible focus states and 44px tap targets.

Constraints:
- Do not copy inline styles from the design canvas.
- Do not refactor state or save logic.
- Do not build static mock screens.

Acceptance:
- The old screens still render acceptably under the new CSS.
- No horizontal scroll on mobile width.
- node tests/smoke.js passes.

Finish with the required handoff note.
```

## Agent 3 — App Shell prompt

```text
You are Agent 3: App Shell and Navigation for the ICT Sweep Tracker UI redesign.

Read:
- docs/ui-redesign/01-implementation-plan.md
- docs/ui-redesign/03-screen-specs.md
- docs/ui-redesign/04-agent-workstreams.md

Mission:
Create the mobile app shell, route model and bottom tab navigation.

Tasks:
1. Add primary routes: home, planner, saved, journal, profile.
2. Add secondary route support for focus card details, timeline, liquidity map and risk.
3. Build shared shell rendering helpers.
4. Build bottom tab bar with active states.
5. Make sure every route has a back/home escape path.
6. Keep existing planner and saved behaviour reachable.
7. Add smoke tests for route navigation.

Constraints:
- Do not rewrite planner internals yet.
- Do not remove final-save/export/import.
- Keep static-site compatibility.

Acceptance:
- User can navigate Home → Planner → Saved → Focus Card → Home.
- Bottom nav active state is correct.
- node tests/smoke.js passes.

Finish with the required handoff note.
```

## Agent 4 — Planner prompt

```text
You are Agent 4: Planner Screen for the ICT Sweep Tracker UI redesign.

Read:
- docs/ui-redesign/03-screen-specs.md sections 2 and 3
- docs/ui-redesign/04-agent-workstreams.md Workstream 4

Mission:
Rebuild the planner as the AI Trade Plan Builder screen from the uploaded design, while preserving deterministic local behaviour.

Tasks:
1. Build the assistant bubble.
2. Build instrument and session fields.
3. Build Bullish/Bearish segmented control.
4. Build validation and invalidation textareas.
5. Build DOL stack input/edit UI.
6. Build sweep stack input/edit UI.
7. Build FVG and confidence controls.
8. Build generated preview from current form data.
9. Add sticky Save Draft / Generate Focus Plan CTA.
10. Save cards using the existing normalised state helpers.
11. Open Focus Card Details after generating a plan.
12. Add smoke test coverage for save draft and create focus card.

Constraints:
- Do not call external AI.
- Do not present recommendations or trade signals.
- Do not remove current DOL/sweep inputs.

Acceptance:
- Bias, validation and invalidation persist.
- DOL/sweep rows persist.
- FVG persists.
- Draft and complete cards can be created.
- node tests/smoke.js passes.

Finish with the required handoff note.
```

## Agent 5 — Saved and Focus Card prompt

```text
You are Agent 5: Saved Cards and Focus Card Details for the ICT Sweep Tracker UI redesign.

Read:
- docs/ui-redesign/03-screen-specs.md sections 3 and 4
- docs/ui-redesign/04-agent-workstreams.md Workstream 5

Mission:
Build the Saved Focus Cards screen and Focus Card Details screen.

Tasks:
1. Build Saved screen header, search and filter chips.
2. Build saved-card card rows with instrument, session, date, bias, DOL count, sweep count, FVG state, final state and outcome.
3. Add favorite toggle.
4. Build Focus Card Details hero.
5. Add chart/liquidity preview placeholder.
6. Add bias overview, validation and invalidation cards.
7. Add DOL and sweep sections.
8. Add FVG/risk blocks.
9. Preserve Save changes, Final save, Copy, Share and Delete.
10. Add smoke tests for open card, final save, copy and delete where possible.

Constraints:
- Do not alter final-save analytics rules.
- Do not remove export/import.
- Keep deleted-card confirmation.

Acceptance:
- Search and filters work.
- Focus Card Details shows all key card data.
- Save changes returns final-saved card to non-final if edited.
- Final save requires outcome other than Open.
- node tests/smoke.js passes.

Finish with the required handoff note.
```

## Agent 6 — Secondary Screens prompt

```text
You are Agent 6: Secondary Screens for the ICT Sweep Tracker UI redesign.

Read:
- docs/ui-redesign/03-screen-specs.md sections 5 to 9
- docs/ui-redesign/04-agent-workstreams.md Workstream 6

Mission:
Build Timeline, Liquidity Map, Risk Tracker, Journal and Profile screens using real local data where available.

Tasks:
1. Timeline:
   - Build pre-session, during-session and after-trade groups.
   - Derive completed/pending states from card fields and markers.
   - Add note action.
2. Liquidity Map:
   - Build search and category chips.
   - Build initial concept cards.
   - Add concept-to-plan action.
3. Risk Tracker:
   - Build planned-risk hero.
   - Build real final-save metrics.
   - Build review quality bars from available markers.
4. Journal:
   - Build screenshot placeholder grid.
   - Build recent entries from saved-card notes/journal fields.
   - Add tags.
5. Profile:
   - Build stats summary.
   - Build settings list.
   - Wire export/import and clear local data.
6. Add smoke tests for route rendering.

Constraints:
- Do not fake analytics where real data is available.
- Empty states are acceptable.
- Screenshot uploads are optional future work.
- No backend.

Acceptance:
- All secondary screens render without data.
- Local data appears when available.
- Profile export/import still works.
- node tests/smoke.js passes.

Finish with the required handoff note.
```

## Agent 7 — QA and Documentation prompt

```text
You are Agent 7: QA and Documentation for the ICT Sweep Tracker UI redesign.

Read all docs/ui-redesign files and inspect the completed code.

Mission:
Protect behaviour, finish release documentation and identify launch blockers.

Tasks:
1. Expand tests/smoke.js to cover:
   - app load
   - primary tab route navigation
   - planner draft save
   - focus card creation
   - saved-card search/filter basics
   - final-save analytics
   - export/import
   - key secondary routes render
2. Add docs/ui-redesign/06-manual-qa-checklist.md.
3. Update README.md with the redesigned screen map.
4. Update CHANGELOG.md with a release entry.
5. Check that GitHub Pages still serves the app.
6. Check there are no broken file references.
7. Check that old saved data migrates safely.

Acceptance:
- node tests/smoke.js passes.
- README and CHANGELOG are updated.
- Manual QA checklist exists.
- Blockers are clearly listed.

Finish with the required handoff note.
```

## Reviewer prompt

```text
Act as a senior reviewer for the ICT Sweep Tracker UI redesign.

Review the current diff against these documents:
- docs/ui-redesign/01-implementation-plan.md
- docs/ui-redesign/02-design-system-spec.md
- docs/ui-redesign/03-screen-specs.md
- docs/ui-redesign/04-agent-workstreams.md

Check for:
1. Broken saved-card persistence.
2. Broken final-save analytics.
3. Broken export/import.
4. Non-mobile-friendly UI.
5. Fake or misleading analytics.
6. Any text that sounds like financial advice or trade signals.
7. Missing empty states.
8. Missing Back/Home navigation.
9. Overlapping agent edits that caused regressions.
10. Test gaps.

Output:
- Must-fix issues.
- Should-fix issues.
- Nice-to-have issues.
- Release recommendation: ship / do not ship.
```

## Emergency rollback prompt

```text
The UI redesign has introduced a regression.

Act as a senior debugging agent.

Tasks:
1. Identify the smallest revert or patch to restore app load, saved cards and export/import.
2. Do not remove user data.
3. Keep GitHub Pages deployable.
4. Add a smoke test that catches the regression.
5. Explain the root cause and the minimal fix.

Output:
- Files changed.
- Root cause.
- Fix summary.
- Tests run.
```
