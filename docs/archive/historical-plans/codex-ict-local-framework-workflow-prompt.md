# CODEX LOCAL ICT WORKFLOW PROMPT

> Status: Historical
> Last reviewed: 2026-07-09
> Source of truth: No

## Purpose

Use this prompt with Codex inside the local ICT project folder.

This workflow is designed to make sure all planning, execution, review files, and code changes are created only inside:

```text
/Users/soonjeongguan/Desktop/FRAMEWORK/
```

and that the GitHub remote points to:

```text
https://github.com/JGDev1215/ICT.git
```

---

# Critical Local Path Rule

Codex must work only within this folder:

```text
/Users/soonjeongguan/Desktop/FRAMEWORK/
```

Codex must not create, edit, move, or delete files outside this folder.

Before doing any work, Codex must confirm:

```bash
pwd
git remote -v
git status
```

Expected `pwd`:

```text
/Users/soonjeongguan/Desktop/FRAMEWORK
```

Expected GitHub remote:

```text
https://github.com/JGDev1215/ICT.git
```

If either is incorrect, Codex must stop and tell the user exactly what command to run.

---

# If Repo Is Not Yet Cloned

If `/Users/soonjeongguan/Desktop/FRAMEWORK/` does not contain the ICT repo, Codex should instruct the user to run:

```bash
cd /Users/soonjeongguan/Desktop
git clone https://github.com/JGDev1215/ICT.git FRAMEWORK
cd /Users/soonjeongguan/Desktop/FRAMEWORK
codex
```

Do not proceed until the repo path and remote are correct.

---

# Task To Execute

Replace this section with the task for the current run:

```text
[PASTE TASK HERE]
```

Example:

```text
Analyse the ICT app and fix inconsistent navigation. Some screens have Back buttons and some do not. Standardise navigation across the app without changing unrelated UI or breaking existing saved data.
```

---

# Required Local Workflow

Codex must complete the following stages in order.

Do not skip stages.

Do not make code changes until the approved plan exists.

---

## Stage 0 — Safety Check

Run:

```bash
cd /Users/soonjeongguan/Desktop/FRAMEWORK
pwd
git remote -v
git status
ls
find . -maxdepth 3 -type f | sed 's#^\./##' | sort | head -200
```

Codex must confirm:

- Current folder is `/Users/soonjeongguan/Desktop/FRAMEWORK`
- Git remote includes `https://github.com/JGDev1215/ICT.git`
- Existing uncommitted changes are identified
- Existing user work will not be overwritten

If there are existing uncommitted changes, Codex must preserve them and avoid destructive edits.

---

## Stage 1 — Create Agent Workflow Folder

Create this inside the repo:

```text
/Users/soonjeongguan/Desktop/FRAMEWORK/agent-workflow/
```

Folder structure:

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

Create:

```text
agent-workflow/README.md
```

The README must explain that this folder stores the local planning, execution, review, and approval trail.

---

## Stage 2 — Intake Agent

Create:

```text
agent-workflow/01-intake/task-brief.md
```

It must include:

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
- If the task is broad, split into phases.
- If something is unclear, make a reasonable assumption and record it.

---

## Stage 3 — Planning Agent

Create:

```text
agent-workflow/02-plans/implementation-plan.md
```

It must include:

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

The plan must be specific, practical, and safe for a junior execution agent.

Avoid:

- broad rewrites
- unrelated redesigns
- changing unrelated files
- breaking local storage or saved data unless explicitly required
- overengineering

---

## Stage 4 — Senior Plan Review Agent

Create:

```text
agent-workflow/03-senior-review/plan-review.md
```

It must include:

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

The approved plan is the only plan the execution stage may follow.

---

## Stage 5 — Junior Execution Agent

Codex may now edit the app, but only according to:

```text
agent-workflow/03-senior-review/approved-plan.md
```

Execution rules:

- Keep changes focused.
- Do not add unrelated features.
- Do not redesign unrelated UI.
- Do not delete user work.
- Prefer simple and maintainable fixes.
- Do not commit or push unless the user explicitly asks.

After editing, create:

```text
agent-workflow/04-execution/execution-report.md
```

It must include:

```md
# Execution Report

## Summary of Changes

## Files Changed

## Implementation Notes

## Deviations From Approved Plan
None / Details

## Checks Performed

## Known Issues
None / Details
```

---

## Stage 6 — Code Review Agent

Codex must review the work as if it is a separate reviewer.

Create:

```text
agent-workflow/05-code-review/review-report.md
```

It must include:

```md
# Code Review Report

## Review Decision
PASS / FAIL

## Score
[x]/10

## What Was Done Well

## Issues Found

## Required Fixes

## Recommended Improvements

## Regression Risks

## Final Reviewer Notes
```

Review must check:

- Original task completed
- Approved plan followed
- No unrelated changes
- No obvious bugs
- No broken navigation or UI flow
- No broken saved data
- Mobile usability preserved
- Code remains simple and maintainable

---

## Stage 7 — Senior Decision and Fix Round

Create:

```text
agent-workflow/06-fix-rounds/senior-decision.md
```

It must include:

```md
# Senior Decision

## Decision
APPROVED / FIXES REQUIRED / REPLAN REQUIRED

## Reasoning

## Required Fixes
```

If fixes are required:

1. Apply only the required fixes.
2. Do not add new features.
3. Do not change unrelated areas.
4. Create:

```text
agent-workflow/06-fix-rounds/fix-report.md
```

Use:

```md
# Fix Report

## Fixes Applied

## Files Changed

## Checks Performed

## Remaining Issues
```

Then update:

```text
agent-workflow/05-code-review/review-report.md
```

Only proceed once the review decision is PASS, unless a blocker remains.

---

## Stage 8 — Final Approval Agent

Create:

```text
agent-workflow/07-final-review/final-approval.md
```

It must include:

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

## Tests / Checks Completed

## Files Changed

## Remaining Risks

## Recommended Commit Message
```

If not safe to commit, Codex must explain exactly why.

---

# Required Final Response

At the end, Codex must respond with:

```md
## Completed

### Local Path Confirmed
/Users/soonjeongguan/Desktop/FRAMEWORK

### GitHub Remote Confirmed
https://github.com/JGDev1215/ICT.git

### Summary

### Files Changed

### Workflow Files Created

### Checks Performed

### Final Decision
SAFE TO COMMIT / NOT SAFE TO COMMIT

### Recommended Next Commands
```

If safe to commit, recommend only:

```bash
cd /Users/soonjeongguan/Desktop/FRAMEWORK
git status
git diff
git add .
git commit -m "[recommended commit message]"
git push
```

Do not run `git commit` or `git push` unless the user explicitly asks.

---

# Hard Rules

1. Work only inside `/Users/soonjeongguan/Desktop/FRAMEWORK/`.
2. Confirm `pwd` before making changes.
3. Confirm GitHub remote before making changes.
4. Do not overwrite uncommitted user work.
5. Do not skip planning.
6. Do not code before creating `approved-plan.md`.
7. Do not introduce unrelated redesigns.
8. Do not add unrelated features.
9. Do not hallucinate files.
10. Inspect files before editing.
11. Keep changes small and reversible.
12. Record decisions in markdown.
13. Do not commit or push unless explicitly told.
14. If no test framework exists, perform static/manual checks and state the limitation.
15. If the task is too large, split into phases and complete Phase 1 safely.

---

# Start Now

Begin by running:

```bash
cd /Users/soonjeongguan/Desktop/FRAMEWORK
pwd
git remote -v
git status
```

Then proceed through all stages in order.
