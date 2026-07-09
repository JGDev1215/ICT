# AGENTS.md

## Purpose

This file contains the permanent operating instructions for Codex when working in this repository.

For every future task, Codex must follow this workflow automatically.

The user should only need to provide a short task. Codex must then plan, review, execute, audit, fix if needed, and provide final approval using the workflow below.

---

## Repository Rules

Codex must work only inside:

```text
/Users/soonjeongguan/Desktop/FRAMEWORK
```

GitHub remote must be:

```text
https://github.com/JGDev1215/ICT.git
```

Before making any changes, Codex must run:

```bash
pwd
git remote -v
git status
```

Codex must confirm:

- current path is `/Users/soonjeongguan/Desktop/FRAMEWORK`
- GitHub remote includes `https://github.com/JGDev1215/ICT.git`
- existing uncommitted changes are identified
- user work will not be overwritten

If the path or remote is incorrect, Codex must stop.

---

## Hard Rules

1. Work only inside `/Users/soonjeongguan/Desktop/FRAMEWORK`.
2. Do not overwrite uncommitted user work.
3. Do not skip planning.
4. Do not edit code before creating an approved plan.
5. Do not make unrelated changes.
6. Do not redesign unrelated UI.
7. Do not add unrelated features.
8. Do not hallucinate files.
9. Inspect files before editing.
10. Keep changes small and reversible.
11. Record all decisions in markdown.
12. Do not commit or push unless explicitly instructed.
13. Do not claim tests passed unless they were actually run.
14. If no test framework exists, perform static/manual checks and state this limitation.
15. If the task is too large, split it into phases and complete the safest first phase.

---

## Documentation Routing Rules

Start documentation lookup from:

```text
docs/README.md
```

The root `README.md`, `CHANGELOG.md`, `AGENTS.md`, tests, and current app code are the source of truth for current behavior. Archived documents are context only.

When creating or updating durable project documentation, save files in the correct folder:

| Content type | Folder |
| --- | --- |
| Current implementation plans | `docs/plans/` |
| Completed implementation reports | `docs/implementation-reports/` |
| QA evidence, release checks, test notes | `docs/qa/` |
| Release decisions and release rationale | `docs/release/` |
| Database schemas, SQL, persistence setup | `docs/database/` |
| Completed or superseded fix lists | `docs/archive/completed-fix-lists/` |
| Historical plans, old setup guides, legacy handovers | `docs/archive/historical-plans/` |
| Superseded design packs and old agent prompt packs | `docs/archive/superseded-design/` |

Rules:

- Do not create new top-level markdown files unless they are root-level project docs such as `README.md`, `CHANGELOG.md`, or `AGENTS.md`.
- Do not treat `docs/archive/` as current requirements unless the user explicitly asks to revive archived work.
- Move completed or superseded plans, fix lists, and prompt packs into `docs/archive/`.
- Add or preserve a status block at the top of markdown docs when practical:

```md
> Status: Current / Historical / Superseded
> Last reviewed: YYYY-MM-DD
> Source of truth: Yes / No
```

`agent-workflow/` is task execution evidence for the current work session. `docs/` is durable project documentation for future users, maintainers, and LLM agents.

---

## Required Workflow Folder

For every task, Codex must create or maintain this folder structure:

```text
agent-workflow/
  00-inbox/
  01-intake/
  02-plans/
  03-senior-review/
  04-execution/
  05-code-review/
  06-fix-rounds/
  07-final-review/
  08-completed/
```

---

## Required Workflow Files

For every task, Codex must create or update:

```text
agent-workflow/00-inbox/current-task.md
agent-workflow/01-intake/task-brief.md
agent-workflow/02-plans/implementation-plan.md
agent-workflow/03-senior-review/plan-review.md
agent-workflow/03-senior-review/approved-plan.md
agent-workflow/04-execution/execution-report.md
agent-workflow/05-code-review/review-report.md
agent-workflow/06-fix-rounds/senior-decision.md
agent-workflow/07-final-review/final-approval.md
agent-workflow/08-completed/workflow-summary.md
```

If fixes are required, Codex must also create:

```text
agent-workflow/06-fix-rounds/fix-report.md
```

---

## Workflow Stages

### Stage 0 - Safety Check

Before planning or editing, Codex must inspect the repo.

Run:

```bash
pwd
git remote -v
git status
find . -maxdepth 3 -type f | sed 's#^\./##' | sort | head -200
```

Codex must identify:

- app structure
- main files
- current git status
- existing uncommitted changes
- whether it is safe to proceed

### Stage 1 - Capture User Task

Create:

```text
agent-workflow/00-inbox/current-task.md
```

This file must contain the user's exact task.

### Stage 2 - Intake Agent

Create:

```text
agent-workflow/01-intake/task-brief.md
```

The file must include:

```md
# Task Brief

## Original User Task

## Objective

## Repo Findings

## Assumptions

## Out of Scope

## Success Criteria
- [ ] 
- [ ] 
- [ ] 
```

Rules:

- Do not invent requirements.
- If something is unclear, make a reasonable assumption and record it.
- Ask the user only if the task cannot be completed safely without clarification.

### Stage 3 - Planning Agent

Create:

```text
agent-workflow/02-plans/implementation-plan.md
```

The file must include:

```md
# Implementation Plan

## Goal

## Repo Findings

## Files Likely Affected

## Proposed Changes

## Step-by-Step Plan

## Acceptance Criteria

## Test Plan

## Risks

## Rollback Plan
```

The plan must be specific enough for a junior execution agent to follow.

### Stage 4 - Senior Plan Review Agent

Review the implementation plan before editing code.

Create:

```text
agent-workflow/03-senior-review/plan-review.md
```

The file must include:

```md
# Senior Plan Review

## Plan Quality

## Missing Steps

## Risk Areas

## Overengineering Concerns

## Simpler Alternatives

## Required Amendments

## Decision
APPROVED / APPROVED WITH AMENDMENTS / REJECTED
```

Then create:

```text
agent-workflow/03-senior-review/approved-plan.md
```

The approved plan is the only plan that may be executed.

If the plan is rejected, revise it and review again before editing code.

### Stage 5 - Execution Agent

Only after `approved-plan.md` exists, Codex may edit code.

Execution rules:

- Follow only `approved-plan.md`.
- Keep changes focused.
- Do not add unrelated features.
- Do not redesign unrelated UI.
- Do not delete user work.
- Do not overwrite uncommitted changes.
- Do not commit or push.

After editing, create:

```text
agent-workflow/04-execution/execution-report.md
```

The file must include:

```md
# Execution Report

## Summary of Changes

## Files Changed

## Implementation Notes

## Deviations From Approved Plan

## Checks Performed

## Known Issues
```

### Stage 6 - Code Review Agent

Review the completed work as if reviewing another agent's work.

Create:

```text
agent-workflow/05-code-review/review-report.md
```

The file must include:

```md
# Code Review Report

## Review Decision
PASS / FAIL

## Score
[x]/10

## Original Task Completed?
YES / NO

## Approved Plan Followed?
YES / NO

## Unrelated Changes?
YES / NO

## What Was Done Well

## Issues Found

## Required Fixes

## Recommended Improvements

## Regression Risks

## Final Reviewer Notes
```

The review must check:

- original task completed
- approved plan followed
- no unrelated changes
- no obvious bugs
- no broken UI flow
- no broken saved data
- mobile usability preserved
- code remains simple and maintainable

### Stage 7 - Senior Decision Agent

Create:

```text
agent-workflow/06-fix-rounds/senior-decision.md
```

The file must include:

```md
# Senior Decision

## Decision
APPROVED / FIXES REQUIRED / REPLAN REQUIRED

## Reasoning

## Required Fixes

## Next Action
```

If fixes are required:

1. Apply only the required fixes.
2. Do not add new features.
3. Do not change unrelated areas.
4. Create:

```text
agent-workflow/06-fix-rounds/fix-report.md
```

The fix report must include:

```md
# Fix Report

## Fixes Applied

## Files Changed

## Checks Performed

## Remaining Issues
```

After fixes, update:

```text
agent-workflow/05-code-review/review-report.md
```

Continue until either:

- review decision is PASS, or
- a blocker is identified and reported.

### Stage 8 - Final Approval Agent

Create:

```text
agent-workflow/07-final-review/final-approval.md
```

The file must include:

```md
# Final Approval

## Final Decision
SAFE TO COMMIT / NOT SAFE TO COMMIT

## Original Task Completed?
YES / NO

## Approved Plan Followed?
YES / NO

## Acceptance Criteria Met?
YES / NO

## Review Passed?
YES / NO

## Tests / Checks Completed

## Files Changed

## Remaining Risks

## Recommended Commit Message
```

If not safe to commit, explain exactly why.

### Stage 9 - Workflow Summary

Create:

```text
agent-workflow/08-completed/workflow-summary.md
```

The file must include:

```md
# Workflow Summary

## User Task

## Local Path

## GitHub Remote

## Stages Completed
- [ ] Safety Check
- [ ] Intake
- [ ] Planning
- [ ] Senior Plan Review
- [ ] Approved Plan
- [ ] Execution
- [ ] Code Review
- [ ] Senior Decision
- [ ] Fix Round if required
- [ ] Final Approval

## Files Changed

## Workflow Files Created

## Checks Performed

## Final Decision

## Recommended Next Step
```

---

## Final Response Format

At the end of every task, Codex must respond using this format:

```md
## Completed

### Task Summary

### Files Changed

### Workflow Files Created

### Checks Performed

### Review Result
PASS / FAIL

### Final Decision
SAFE TO COMMIT / NOT SAFE TO COMMIT

### Remaining Risks

### Recommended Next Commands
```

If safe to commit, recommend:

```bash
git status
git diff
git add .
git commit -m "[recommended commit message]"
git push
```

If not safe to commit, do not recommend commit commands.

Instead, explain what must be fixed.

---

## Project Scope and Constraints

- This is a static, no-build app: HTML, CSS, and plain JavaScript are the product surface.
- Browser storage is the source of truth. Do not introduce server-side saved-card storage unless explicitly requested.
- The only backend-like code is `api/price.py`, an optional Vercel Python Function for yfinance price lookup.
- Manual price entry must always work when live price lookup fails.
- Keep changes small and compatible with existing saved cards.

## Key Files

- `index.html`: app shell, version text, cache-busted JS/CSS references, service worker registration.
- `assets/app.js`: app state, normalization, localStorage migrations, routing, planner, saved cards, export/import, price helper calls.
- `assets/styles.css`: UI styling.
- `service-worker.js`: offline/static cache list. Bump this when asset URLs change.
- `api/price.py`: Vercel price endpoint and static-file serving for Vercel.
- `tests/smoke.js`: required static contract test.
- `README.md` and `CHANGELOG.md`: user-facing documentation and release notes.

## Storage Contract

- Current saved-card key: `ict_cards_v078`.
- Bias metadata key: `ict_bias_card_meta_v1`.
- Export schema: `ict_dol_sweep_export_v7`.
- Legacy migration keys: `ict_cards_v077`, `ict_cards_v076`, `ict_dol_sweep_cards_v2`, `ict_slips_v1`.
- Preserve normalized card fields for timestamps, market context, DOL/sweep records, markers, journal, risk, price snapshot, price history, active DOL, route evidence, and final-save analytics.
- Final hit-rate metrics must count only final-saved Hit/Miss outcomes. Breakeven and Read are tracked separately.

## Required Checks

Run before handoff after app, storage, cache, route, or API changes:

```bash
node tests/smoke.js
```

Use a local static server for manual checks:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Version and Cache Bumps

When shipping JS/CSS behavior changes:

1. Update cache-busted references in `index.html`.
2. Update `CACHE_NAME` and `STATIC_ASSETS` in `service-worker.js`.
3. Update `tests/smoke.js` assertions that pin those strings.
4. Update README/CHANGELOG version notes where relevant.

When changing data shape or keys:

1. Keep migrations from old keys.
2. Update export/import handling and schema documentation.
3. Add or adjust smoke fixtures for migration, normalization, import dedupe, and analytics.

## Price API Notes

- `api/price.py` supports `/api/price?symbol=...`, maps common futures/crypto aliases to yfinance symbols, and returns JSON with `symbol`, `yfSymbol`, `price`, `source`, `cached`, and `timestamp`.
- It uses `requirements.txt` for the pinned yfinance dependency and `vercel.json` to include static assets.
- GitHub Pages cannot run the Python function; Vercel can.
- If deployment domains change, review `ALLOWED_ORIGINS`, `HOSTED_PRICE_API_BASE`, and any `window.ICT_PRICE_API_BASE` override.

## Product Guardrails

- Educational planning tool only. Do not present outputs as financial advice or trade recommendations.
- Keep the planner deterministic and local-first.
- Do not remove backup/export paths; browser storage can be cleared by the user or device.
