# Approved Plan

## Approved Scope

Create the daily report, run checks, commit, and push documentation changes.

## Guardrails

- Documentation-only.
- Do not change runtime app code.
- Push only after commit succeeds.

## Required Checks

- `node tests/smoke.js`
- Confirm daily report path exists.
- `git status --short`
