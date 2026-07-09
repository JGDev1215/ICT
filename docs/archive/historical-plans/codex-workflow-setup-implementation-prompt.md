# Codex Workflow Setup Implementation Prompt

> Status: Historical
> Last reviewed: 2026-07-09
> Source of truth: No

## Mission

Set up this repository so Codex automatically follows a structured local agent workflow for every future task.

The user’s goal is:

- Codex runs locally inside the ICT app repository.
- Codex uses `AGENTS.md` as the permanent operating instruction.
- The user should not need to paste the full workflow every time.
- For future work, the user should only need to provide a short task.
- Codex must plan, review, execute, audit, fix if needed, and provide final approval.
- Codex must communicate through markdown files inside the repo.
- Codex must not modify app code as part of this setup task.

---

## Repository Location

The local repo must be:

```text
/Users/soonjeongguan/Desktop/FRAMEWORK
```

The GitHub remote must be:

```text
https://github.com/JGDev1215/ICT.git
```

---

## Step 1 — Verify Location and Remote

Run:

```bash
cd /Users/soonjeongguan/Desktop/FRAMEWORK
pwd
git remote -v
git status
```

Required checks:

1. `pwd` must return:

```text
/Users/soonjeongguan/Desktop/FRAMEWORK
```

2. `git remote -v` must include:

```text
https://github.com/JGDev1215/ICT.git
```

3. Check whether there are existing uncommitted changes.

Rules:

- If the path is wrong, stop.
- If the GitHub remote is wrong, stop.
- If there are uncommitted changes, do not overwrite them.
- Do not edit app code for this setup task.

---

## Step 2 — Create `AGENTS.md`

Create or replace this file at the repo root:

```text
AGENTS.md
```

`AGENTS.md` must contain the following instruction:

```md
# AGENTS.md

## Purpose

This file contains the permanent operating instructions for Codex when working in this repository.

For every future task, Codex must follow this workflow automatically.

The user should only need to provide a short task. Codex must then plan, review, execute, audit, fix if needed, and provide final approval using the workflow below.

---

## Repository Rules

Codex must work only inside:

/Users/soonjeongguan/Desktop/FRAMEWORK

GitHub remote must be:

https://github.com/JGDev1215/ICT.git

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

### Stage 0 — Safety Check

Before planning or editing, Codex must inspect the repo.

Run:

```bash
pwd
git remote -v
git status
find . -maxdepth 3 -type f | sed 's#^./##' | sort | head -200
```

Codex must identify:

- app structure
- main files
- current git status
- existing uncommitted changes
- whether it is safe to proceed

---

### Stage 1 — Capture User Task

Create:

```text
agent-workflow/00-inbox/current-task.md
```

This file must contain the user’s exact task.

---

### Stage 2 — Intake Agent

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

---

### Stage 3 — Planning Agent

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

---

### Stage 4 — Senior Plan Review Agent

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

---

### Stage 5 — Execution Agent

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

---

### Stage 6 — Code Review Agent

Review the completed work as if reviewing another agent’s work.

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

---

### Stage 7 — Senior Decision Agent

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

---

### Stage 8 — Final Approval Agent

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

---

### Stage 9 — Workflow Summary

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

## Step 3 — Create `START_CODEX.md`

Create this file at the repo root:

```text
START_CODEX.md
```

Its content must be:

```md
# Start Codex Task

AGENTS.md contains the permanent workflow for this repo.

Codex must follow AGENTS.md exactly.

Task:
```

---

## Step 4 — Create Workflow Folder Structure

Create these folders:

```text
agent-workflow/00-inbox
agent-workflow/01-intake
agent-workflow/02-plans
agent-workflow/03-senior-review
agent-workflow/04-execution
agent-workflow/05-code-review
agent-workflow/06-fix-rounds
agent-workflow/07-final-review
agent-workflow/08-completed
```

---

## Step 5 — Create Workflow README

Create:

```text
agent-workflow/README.md
```

Its content must explain:

```md
# Agent Workflow

This folder stores Codex workflow records for each task.

It is the audit trail for:

- task intake
- planning
- senior plan review
- approved plan
- execution report
- code review
- fix rounds
- final approval
- workflow summary

Codex must create/update these files for every future task according to AGENTS.md.
```

---

## Step 6 — Create Setup Report

Create:

```text
agent-workflow/08-completed/codex-workflow-setup-report.md
```

The setup report must include:

```md
# Codex Workflow Setup Report

## Local Path Checked

## GitHub Remote Checked

## Files Created

## Folders Created

## App Code Modified?
NO

## Existing Uncommitted Changes

## Final Status
SAFE TO COMMIT / NOT SAFE TO COMMIT
```

---

## Step 7 — Final Checks

Run:

```bash
git status
find agent-workflow -maxdepth 3 -type f | sort
```

Confirm:

- `AGENTS.md` exists
- `START_CODEX.md` exists
- `agent-workflow/README.md` exists
- `agent-workflow/08-completed/codex-workflow-setup-report.md` exists
- no app code was intentionally modified

---

## Step 8 — Final Response

Return a short final response with:

```md
## Setup Complete

### Files Created

### Folders Created

### App Code Modified?
NO

### Safe To Commit?
YES / NO

### Recommended Commit Command
```

Do not commit or push unless the user explicitly asks.
