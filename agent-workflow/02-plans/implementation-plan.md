# Implementation Plan

## Goal

Complete project closeout documentation and publish the current worktree to GitHub.

## Repo Findings

- The current dirty worktree contains the intended Planner simplification, final-card lock, Watchlist removal, docs, tests, QA, and workflow evidence.
- Daily reports belong in `docs/daily-reports/`.
- Commit and push are explicitly requested.

## Files Likely Affected

- `docs/daily-reports/2026-07-09-session-report-3.md`
- `agent-workflow/*`
- Existing dirty files already present in the worktree

## Proposed Changes

- Add an end-of-day historical report.
- Update workflow evidence for this closeout task.
- Run checks.
- Stage all changes.
- Commit with a message covering the shipped planner/final-lock updates.
- Push `main` to `origin`.

## Step-by-Step Plan

1. Run required safety checks.
2. Read docs routing and daily-report guidance.
3. Create the end-of-day report.
4. Run `npm test`, `npm run test:e2e -- --reporter=dot`, and `git diff --check`.
5. Complete workflow review/final approval files.
6. Run `git status` and `git diff`.
7. `git add .`
8. Commit all changes.
9. Push the current branch.

## Acceptance Criteria

- Report is present and factual.
- Checks pass.
- Commit exists locally.
- Push succeeds.

## Test Plan

- `npm test`
- `npm run test:e2e -- --reporter=dot`
- `git diff --check`

## Risks

- Playwright may take time but should reuse existing local static server configuration.
- Push may fail if remote rejects or network/auth is unavailable.

## Rollback Plan

If checks fail, fix before commit. If push fails after commit, report the local commit hash and push failure.
