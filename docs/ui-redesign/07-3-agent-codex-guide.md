# 07 — 3-Agent Codex Guide

> Current-status note — 2026-07-08: this guide documents a historical multi-worktree execution approach. Branch/worktree evidence does not need to be retained as active release evidence; current implementation status is tracked in README, CHANGELOG, smoke tests, Playwright tests, and the docs implementation checklist.

## Purpose

Use this guide when running three Codex agents locally from your Mac terminal against a GitHub-connected local folder.

The goal is to complete the mobile UI redesign efficiently without wasting tokens, duplicating work, or creating avoidable merge conflicts.

## Best agent count

Use **3 active agents**.

This is the most efficient balance for this project because:

- Agent 1 protects the data model and tests.
- Agent 2 builds the visual system.
- Agent 3 builds screens once Agent 1 and Agent 2 provide stable foundations.
- More than 3 active agents will likely overlap on `assets/app.js`, `assets/styles.css`, and tests.

Use a temporary 4th reviewer only at the very end if needed.

## Required reading before every agent starts

Every agent must read:

```text
docs/ui-redesign/README.md
docs/ui-redesign/01-implementation-plan.md
docs/ui-redesign/02-design-system-spec.md
docs/ui-redesign/03-screen-specs.md
docs/ui-redesign/04-agent-workstreams.md
docs/ui-redesign/05-agent-prompt-pack.md
docs/ui-redesign/06-build-plan-gap-review.md
```

## Local folder setup

From your Mac terminal:

```bash
git clone git@github.com:JGDev1215/ICT.git
cd ICT
git pull origin main
node tests/smoke.js
```

If you already cloned the repo:

```bash
cd /path/to/ICT
git checkout main
git pull origin main
node tests/smoke.js
```

## Create three worktrees

Use separate worktrees so each Codex agent works in its own folder.

```bash
cd /path/to/ICT

git worktree add ../ICT-agent-1-state -b ui/agent-1-state
git worktree add ../ICT-agent-2-design -b ui/agent-2-design
git worktree add ../ICT-agent-3-screens -b ui/agent-3-screens
```

Open three terminals:

```bash
cd ../ICT-agent-1-state
```

```bash
cd ../ICT-agent-2-design
```

```bash
cd ../ICT-agent-3-screens
```

## Agent roles

| Agent | Role | Main responsibility | Primary files |
| --- | --- | --- | --- |
| Agent 1 | State/Data Architect | Data model, migrations, export/import, metrics, tests | `assets/app.js`, future `assets/state.js`, future `assets/data.js`, `tests/smoke.js` |
| Agent 2 | Design System Engineer | CSS tokens, mobile UI foundation, component gallery | `assets/styles.css`, `index.html`, `design-system.html` or component gallery file |
| Agent 3 | Screen Builder | App shell and screens using Agent 1 state and Agent 2 CSS | `assets/app.js`, future `assets/screens/*`, screen render functions |

## Run order

### Round 1 — foundations only

Run Agent 1 and Agent 2 first.

Do **not** let Agent 3 make heavy screen changes until Agent 1 and Agent 2 finish.

```text
Agent 1: State/Data Architect
Agent 2: Design System Engineer
```

### Round 2 — shell and core screens

After Agent 1 and Agent 2 pass smoke tests and commit, merge them into Agent 3's branch or rebase Agent 3 on latest main.

Then run:

```text
Agent 3: App Shell + Planner + Saved + Focus Card
```

### Round 3 — secondary screens and polish

Run all three again with narrower duties:

```text
Agent 1: data bugs, export/import, fixture tests
Agent 2: responsive polish, safe-area, PWA visual polish
Agent 3: Timeline, Liquidity Map, Risk, Journal, Profile
```

### Final round — QA

Reuse Agent 1 or Agent 3 as QA, or run one temporary QA agent.

```text
QA role: smoke tests, manual QA checklist, README, CHANGELOG, blockers
```

## Branch and commit workflow

Each agent must commit to its own branch.

Example for Agent 1:

```bash
cd ../ICT-agent-1-state
node tests/smoke.js
git status
git add .
git commit -m "UI redesign: state and data foundation"
git push origin ui/agent-1-state
```

Example for Agent 2:

```bash
cd ../ICT-agent-2-design
node tests/smoke.js
git status
git add .
git commit -m "UI redesign: design system foundation"
git push origin ui/agent-2-design
```

Example for Agent 3:

```bash
cd ../ICT-agent-3-screens
node tests/smoke.js
git status
git add .
git commit -m "UI redesign: app shell and screens"
git push origin ui/agent-3-screens
```

## Safe local merge order

Merge one branch at a time into main and run tests after each merge.

```bash
cd /path/to/ICT
git checkout main
git pull origin main

git merge ui/agent-1-state
node tests/smoke.js

git merge ui/agent-2-design
node tests/smoke.js

git merge ui/agent-3-screens
node tests/smoke.js

git push origin main
```

If conflicts appear, resolve them in this order:

1. Keep Agent 1's state/data helpers as source of truth.
2. Keep Agent 2's CSS class system as source of truth.
3. Adapt Agent 3's screens to use Agent 1 state and Agent 2 classes.

## Global rules for every agent

Paste this into every Codex agent before the role-specific prompt:

```text
You are working on the JGDev1215/ICT repository.

Read these files first:
- docs/ui-redesign/README.md
- docs/ui-redesign/01-implementation-plan.md
- docs/ui-redesign/02-design-system-spec.md
- docs/ui-redesign/03-screen-specs.md
- docs/ui-redesign/04-agent-workstreams.md
- docs/ui-redesign/05-agent-prompt-pack.md
- docs/ui-redesign/06-build-plan-gap-review.md
- docs/ui-redesign/07-3-agent-codex-guide.md

Rules:
- Keep the app static and GitHub Pages compatible.
- Do not add a backend.
- Do not add a build system unless the tech decision doc explicitly approves it.
- Preserve saved-card loading, migration, export/import, and final-save analytics.
- Do not present financial advice, trade signals, or performance forecasts.
- Use real local data where available; otherwise show clear empty states.
- Run `node tests/smoke.js` before handoff.
- Finish with a handoff note listing completed work, files changed, tests run, known gaps, and next-agent notes.
```

---

# Agent 1 Prompt — State/Data Architect

```text
You are Agent 1: State/Data Architect for the ICT Sweep Tracker mobile UI redesign.

Your mission is to make the data layer safe before the UI rebuild begins.

Primary goals:
1. Stabilise saved-card data shape.
2. Preserve existing localStorage migration.
3. Preserve export/import.
4. Preserve final-save analytics.
5. Add deterministic fixture tests.

Read:
- docs/ui-redesign/01-implementation-plan.md
- docs/ui-redesign/03-screen-specs.md
- docs/ui-redesign/04-agent-workstreams.md
- docs/ui-redesign/06-build-plan-gap-review.md

Tasks:
1. Inspect current `assets/app.js`, `assets/bias-extension.js`, and `tests/smoke.js`.
2. Identify all current storage keys.
3. Create or isolate state helpers if practical:
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
4. Ensure cards support these fields safely:
   - id
   - savedAt / createdAt
   - updatedAt
   - instrument
   - session
   - bias
   - biasValidation
   - biasInvalidation
   - DOL stack up to 3
   - sweep stack up to 3
   - FVG formed / timeframe
   - markers
   - outcome
   - finalSaved
   - favorite
   - journal fields
   - risk fields
5. Add import validation:
   - reject invalid payloads
   - accept current and previous schemas
   - normalise fields
   - deduplicate by id
   - never wipe existing cards unless explicitly confirmed
6. Expand `tests/smoke.js` with deterministic fixtures covering:
   - create card
   - draft save
   - final save
   - export
   - wipe test storage
   - re-import
   - final hit rate
   - sample size
   - breakeven count
   - needs-final-save count
   - plan-followed rate
   - migration from older card shape

Do not:
- Redesign screens.
- Change visual styling unless necessary for tests.
- Add backend or build tooling.

Acceptance criteria:
- Existing saved cards still load.
- Export/import round trip works.
- Final hit rate only counts final-saved Hit/Miss.
- `node tests/smoke.js` passes.

Handoff format:

## Handoff — Agent 1 State/Data

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

---

# Agent 2 Prompt — Design System Engineer

```text
You are Agent 2: Design System Engineer for the ICT Sweep Tracker mobile UI redesign.

Your mission is to implement the visual foundation from the uploaded mobile design without changing business logic.

Primary goals:
1. Build the new light mobile-first design system.
2. Add reusable CSS components.
3. Add a component preview/gallery.
4. Preserve accessibility and mobile usability.

Read:
- docs/ui-redesign/02-design-system-spec.md
- docs/ui-redesign/04-agent-workstreams.md
- docs/ui-redesign/06-build-plan-gap-review.md

Tasks:
1. Update `assets/styles.css` with tokens for:
   - Manrope typography
   - canvas / surface colours
   - primary blue
   - confirmed green
   - attention orange
   - invalidation red
   - charcoal text
   - soft borders
   - radius scale
   - shadows
   - spacing
2. Add reusable classes for:
   - app shell
   - cards
   - hero cards
   - buttons
   - icon buttons
   - FAB
   - chips
   - badges
   - inputs
   - textareas
   - segmented controls
   - metric grid
   - progress bars
   - timeline nodes
   - bottom tab bar
   - sticky CTA
   - empty states
3. Ensure `index.html` loads Manrope and Material Symbols Rounded.
4. Add a component preview/gallery file, for example:
   - `design-system.html`, or
   - `docs/ui-redesign/component-gallery.html`
5. Component gallery must show every primitive in its key states.
6. Check mobile width for no horizontal scroll.
7. Keep visible focus states and minimum 44px tap targets.

Do not:
- Refactor data logic.
- Build static fake screens.
- Remove existing functionality.
- Copy inline styles directly from the design canvas.

Acceptance criteria:
- Existing app still renders.
- Component gallery exists.
- Mobile layout has no horizontal scroll.
- `node tests/smoke.js` passes.

Handoff format:

## Handoff — Agent 2 Design System

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

---

# Agent 3 Prompt — Screen Builder

```text
You are Agent 3: Screen Builder for the ICT Sweep Tracker mobile UI redesign.

Your mission is to build the mobile app shell and screens using Agent 1's state/data layer and Agent 2's design system classes.

Primary goals:
1. Build the mobile app shell.
2. Build the primary 5-tab navigation.
3. Build the core screens first.
4. Build secondary screens after the core flow works.

Read:
- docs/ui-redesign/01-implementation-plan.md
- docs/ui-redesign/03-screen-specs.md
- docs/ui-redesign/04-agent-workstreams.md
- docs/ui-redesign/06-build-plan-gap-review.md

Important dependency:
Do not do heavy work until Agent 1 and Agent 2 have committed their foundations. If they are not done, only inspect files and prepare a plan.

Tasks — Round 2:
1. Build app shell and routes:
   - Home
   - Planner
   - Saved
   - Journal
   - Profile
   - Focus Card Details
   - Timeline
   - Liquidity Map
   - Risk
2. Add bottom tab navigation.
3. Add global floating plus action on suitable screens.
4. Build Home dashboard using real metrics.
5. Build Plan Builder:
   - assistant bubble
   - instrument/session
   - bullish/bearish segmented control
   - validation/invalidation
   - DOL stack
   - sweep stack
   - FVG
   - generated preview
   - sticky CTA
   - silent draft autosave where practical
6. Build Saved screen:
   - search
   - filter chips
   - saved cards
   - favorite toggle
7. Build Focus Card Details:
   - hero
   - bias overview
   - validation/invalidation
   - DOL/sweep sections
   - FVG/risk blocks
   - Save changes
   - Final save
   - Copy
   - Share text via Web Share API with clipboard fallback
   - Delete

Tasks — Round 3:
1. Build Timeline.
2. Build Liquidity Map / Setup Library.
3. Build Risk Tracker.
4. Build Journal.
5. Build Profile / Settings.
6. Add outcome capture ritual:
   - Hit
   - Miss
   - Breakeven
   - behaviour tags
   - notes to journal
7. Add safe-area handling checks for sticky CTA and bottom nav.

Do not:
- Break final-save analytics.
- Remove export/import.
- Add backend.
- Present financial advice or trade signals.
- Use fake analytics where real local data exists.

Acceptance criteria:
- Home → Planner → Save Draft → Focus Card → Final Save → Saved works.
- Search/filter saved cards works.
- Secondary screens render empty states safely.
- Bottom nav and sticky CTA work on mobile width.
- `node tests/smoke.js` passes.

Handoff format:

## Handoff — Agent 3 Screen Builder

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

---

# Final QA Prompt

Use this after the three agents have merged their work.

```text
You are the final QA reviewer for the ICT Sweep Tracker mobile UI redesign.

Read all docs in `docs/ui-redesign` and inspect the implemented app.

Check:
1. App loads.
2. Mobile width has no horizontal scroll.
3. Home renders real metrics or empty states.
4. Planner saves draft and complete cards.
5. Bias, validation and invalidation persist.
6. DOL and sweep stacks persist.
7. Focus Card Details shows all key card data.
8. Final save requires outcome and updates stats.
9. Saved search/filter works.
10. Export/import round trip works.
11. Timeline, Liquidity Map, Risk, Journal and Profile render safely.
12. Bottom nav and sticky CTAs are not blocked by safe areas.
13. Copy/share has fallback.
14. No text sounds like financial advice or trade signals.
15. `node tests/smoke.js` passes.

Output:
- Must-fix issues
- Should-fix issues
- Nice-to-have issues
- Release recommendation: ship / do not ship
```
