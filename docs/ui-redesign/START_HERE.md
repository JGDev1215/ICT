# START HERE — Local Codex Agent Prompt

> Current-status note — 2026-07-08: this start guide is historical for the v0.8 redesign work. Validation/invalidation fields mentioned below are preserved for compatibility/export but are no longer active visible Planner/Focus UI requirements.

## Purpose

Use this file when you already have the `ICT` repository folder created locally and connected to GitHub.

Copy and paste the prompt below into your local Codex terminal agent.

## Before you paste the prompt

From your local repo folder, run:

```bash
cd /path/to/ICT
git checkout main
git pull origin main
node tests/smoke.js
```

Then start Codex from the same folder.

---

# Copy/Paste Prompt for Codex

```text
You are a senior full-stack product engineer working locally inside the JGDev1215/ICT repository.

Your job is to help implement the ICT Sweep Tracker mobile UI redesign safely and methodically.

Important context:
- The repo is currently a static HTML/CSS/vanilla JavaScript app.
- It is deployed through GitHub Pages.
- It stores saved cards locally in the browser.
- It already has saved-card, bias, validation, invalidation, export/import and final-save logic.
- The redesign must preserve all existing user data behaviour.
- The old bias extension is retained only as `Legacy/assets/bias-extension.js` for compatibility reference and smoke-test coverage. It is not loaded by `index.html`.
- This is an educational planning and review tool only. It must not become a signal service or financial advice tool.

Read these files first, in this order:

1. docs/ui-redesign/README.md
2. docs/ui-redesign/01-implementation-plan.md
3. docs/ui-redesign/02-design-system-spec.md
4. docs/ui-redesign/03-screen-specs.md
5. docs/ui-redesign/04-agent-workstreams.md
6. docs/ui-redesign/05-agent-prompt-pack.md
7. docs/ui-redesign/06-build-plan-gap-review.md
8. docs/ui-redesign/07-3-agent-codex-guide.md
9. docs/ui-redesign/START_HERE.md

Before changing code:

1. Inspect the current repo structure.
2. Inspect index.html, assets/app.js, assets/styles.css, tests/smoke.js and Legacy/assets/bias-extension.js.
3. Run node tests/smoke.js and confirm the current baseline.
4. Summarise what currently works and where the redesign docs say the implementation should go.
5. Identify which agent role you are acting as:
   - Agent 1: State/Data Architect
   - Agent 2: Design System Engineer
   - Agent 3: Screen Builder
   - QA Reviewer

Global rules:

- Keep the app static and GitHub Pages compatible.
- Do not add a backend.
- Do not add a build system unless docs/ui-redesign/00-tech-decision.md explicitly approves it.
- Preserve saved-card loading, migration, export/import and final-save analytics.
- Preserve bias, validation and invalidation fields.
- Do not present financial advice, trade recommendations, performance forecasts or trade signals.
- Use real local data where available; otherwise show clear empty states.
- Avoid big-bang rewrites.
- Prefer small, testable commits.
- Run node tests/smoke.js before every handoff.

If acting as Agent 1 — State/Data Architect:

Focus only on:
- data model
- localStorage/storage helpers
- migration
- export/import
- import validation
- deterministic smoke/data fixtures
- metrics calculation

Do not redesign screens.

If acting as Agent 2 — Design System Engineer:

Focus only on:
- assets/styles.css
- design tokens
- reusable component classes
- Manrope / Material Symbols setup
- component gallery
- mobile safe-area CSS foundation

Do not refactor state or save logic.

If acting as Agent 3 — Screen Builder:

Focus on:
- app shell
- bottom tabs
- Home
- Planner
- Saved
- Focus Card Details
- Timeline
- Liquidity Map
- Risk Tracker
- Journal
- Profile

Do not start heavy screen work until Agent 1 and Agent 2 foundations exist.

If acting as QA Reviewer:

Focus on:
- smoke tests
- manual QA checklist
- iOS Safari / Android Chrome checks
- PWA checks
- README and CHANGELOG
- blocker list

Required final handoff format:

## Handoff — <Agent Role>

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

Start now by reading the docs and repo files, then give a short implementation plan before editing anything.
```

---

## Recommended use with 3 agents

Open three terminal windows, each in a separate worktree/folder:

```text
ICT-agent-1-state
ICT-agent-2-design
ICT-agent-3-screens
```

Paste the same prompt above into each Codex agent, then tell each one which role it is:

```text
You are Agent 1 — State/Data Architect.
```

```text
You are Agent 2 — Design System Engineer.
```

```text
You are Agent 3 — Screen Builder.
```

Run Agent 1 and Agent 2 first. Agent 3 should wait for the foundations before heavy screen implementation.

## Quick merge discipline

Each agent should work on its own branch and finish with:

```bash
node tests/smoke.js
git status
git add .
git commit -m "<clear commit message>"
git push origin <branch-name>
```

Merge in this order:

1. Agent 1 — State/Data
2. Agent 2 — Design System
3. Agent 3 — Screens
4. QA fixes

Run `node tests/smoke.js` after each merge.
