# Implementation Plan

## Goal

Implement the v0.8.4 review feedback remediation patch with focused runtime, documentation, and test changes.

## Repo Findings

- `docs/plans/review-fix-report-2026-07-09.md` confirms H1/M1/M2/M3/L1/L2/L3/L4/SW1 as the scoped remediation items.
- Existing tests expose app internals through `window.ICTSweepState`, allowing targeted smoke tests.
- Playwright already covers Planner and release QA flows and can add clear-device/notice/live-region tests.

## Files Likely Affected

- `assets/app.js`
- `api/price.py`
- `index.html`
- `service-worker.js`
- `README.md`
- `CHANGELOG.md`
- `CLAUDE.md`
- `tests/smoke.js`
- `tests/e2e/planner.spec.js`
- `agent-workflow/*`

## Proposed Changes

- Add notice severity and persistent live-region helpers.
- Convert touched notices to `setNotice`.
- Add local-only clear-device helper and UI copy.
- Add import reader error handling and schema warnings.
- Guard local price fallback by origin.
- Add comment for `api/price.py` static serving.
- Bump to v0.8.4 and update docs/tests.

## Step-by-Step Plan

1. Update workflow evidence and approved plan.
2. Inspect current functions around notices, clear data, import, price helpers, version/cache, and tests.
3. Patch `assets/app.js` in small sections.
4. Patch `api/price.py` comment.
5. Run version bump tooling for v0.8.4 if safe, then adjust docs/tests.
6. Add smoke and Playwright coverage.
7. Run required checks.
8. Review diff for unrelated changes and update final workflow evidence.

## Acceptance Criteria

- Clear-device behavior cannot silently queue cloud deletes and does not leave stale sync metadata.
- Error notices no longer render as success.
- A persistent live region is present and updated after re-renders.
- Manual price fallback remains available.
- Storage/export compatibility is preserved.
- v0.8.4 cache and docs are consistent.

## Test Plan

- `node tests/smoke.js`
- `npx playwright test tests/e2e/planner.spec.js`
- `npx playwright test`
- `python3 -m py_compile api/price.py`

## Risks

- Shared notice rendering touches many flows.
- Local clear while Supabase auth events are active may re-render unexpectedly.
- Price helper URL tests require simulating different origins in the smoke harness.

## Rollback Plan

Revert this task's changes only. Existing workflow/report changes from before this task must not be reverted unless explicitly requested.
