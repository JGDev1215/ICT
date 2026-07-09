# Implementation Plan

## Goal

Complete the first two safe remediation phases for the broad app-fix goal:

1. Correct current documentation and release-plan contradictions that are already proven.
2. Fix the concrete runtime defects found by the runtime audit agent without broad refactoring.
3. Carry out safe refactor foundation items that do not move runtime files.

## Repo Findings

- `docs/README.md` says root docs, tests, and current code are source of truth; archived docs are context only.
- Current QA/release docs still require physical iOS/Android or real-device/PWA evidence.
- The user clarified the app only runs on the web or mobile site, so real-device testing is not necessary.
- `README.md` Known Limitations is stale about saved-card sync and real-device QA.
- Recent v0.8.4 work already implemented review findings for local clear, notices/live regions, import warnings, and price fallback.
- Full `assets/app.js` modularization remains deferred and should not be done in this patch.
- Runtime audit found focused defects in Planner completion status, draft restore of manual-price acknowledgement, price-map source labeling, import/export settings portability, localhost unsupported-symbol fallback, and README backend/runtime wording.
- The safe refactor prompt calls for `Legacy/README.md`, `tests/unit/`, `test:smoke`, `test:unit`, `test:e2e`, and `npm test` running smoke plus unit tests before any extraction.
- Test/QA audit identified missing browser UI coverage for JSON import/file-picker behavior.
- Phase 6 of the safe refactor prompt calls for `/api/price` boundary tests covering missing symbol, unsupported symbol, provider unavailable, and successful mocked response shape without live yfinance calls.

## Files Likely Affected

- `README.md`
- `CHANGELOG.md`
- `index.html`
- `service-worker.js`
- `assets/app.js`
- `assets/styles.css`
- `tests/smoke.js`
- `tests/e2e/planner.spec.js`
- `tests/unit/run-tests.js`
- `tests/api/test_price.py`
- `package.json`
- `Legacy/README.md`
- `docs/qa/docs-implementation-checklist-2026-07-08.md`
- `docs/qa/release-qa-evidence-2026-07-08.md`
- `docs/release/release-decision-log-2026-07-08.md`
- `docs/daily-reports/2026-07-09-session-report-2.md`
- `agent-workflow/00-inbox/current-task.md`
- `agent-workflow/01-intake/task-brief.md`
- `agent-workflow/02-plans/implementation-plan.md`
- `agent-workflow/03-senior-review/plan-review.md`
- `agent-workflow/03-senior-review/approved-plan.md`
- `agent-workflow/04-execution/execution-report.md`
- `agent-workflow/05-code-review/review-report.md`
- `agent-workflow/06-fix-rounds/senior-decision.md`
- `agent-workflow/06-fix-rounds/fix-report.md`
- `agent-workflow/07-final-review/final-approval.md`
- `agent-workflow/08-completed/workflow-summary.md`

## Proposed Changes

- Replace physical/real-device QA gates in current docs with production web and mobile-site browser QA.
- Preserve a clear requirement for responsive browser checks, offline/service-worker browser checks, import/export browser checks, and accessibility follow-up where practical.
- Update README Known Limitations to accurately describe optional Supabase Account & Backup sync.
- Preserve historical context in archived docs and avoid editing `docs/archive/`.
- Do not change runtime code in this phase unless agent audits reveal a critical defect requiring a new approved plan.
- Fix runtime audit findings:
  - align `comp()`/card status with Generate Focus Plan requirements;
  - persist and restore manual-price-needed acknowledgement;
  - label Price Map source as manual vs hosted/local yfinance;
  - import settings from JSON exports best-effort;
  - allow local fallback after hosted unsupported-symbol responses when local fallback is available.
- Bump app/cache/docs to v0.8.5 for JS behavior changes.
- Add Playwright coverage for JSON import through the actual hidden file input.
- Add a Node unit-test runner around current exported app helpers without extracting runtime code.
- Update package scripts for `test:smoke`, `test:unit`, and `npm test` as required by the safe refactor prompt.
- Add `Legacy/README.md` documenting the historical-only legacy folder policy.
- Add Python API boundary coverage for `api/price.py` without changing the price handler or calling live yfinance.
- Add `test:api` to `package.json` and include it in `npm test`.

## Step-by-Step Plan

1. Spawn independent audit agents for documentation/plans, runtime code, and test/QA coverage.
2. Locally inspect current docs and searches for conflicting real-device/PWA language.
3. Create and approve this Phase 1 plan before editing non-workflow docs.
4. Patch current docs to align QA scope with web/mobile-site operation.
5. Patch README Known Limitations to match optional Supabase sync and browser QA scope.
6. Integrate audit-agent runtime findings into a scoped runtime patch.
7. Run the version/cache bump process for v0.8.5 after JS behavior changes.
8. Add/update smoke and Playwright coverage for the runtime fixes.
9. Add import UI/file-picker Playwright coverage.
10. Add `tests/unit/run-tests.js` and update package scripts.
11. Add `Legacy/README.md` and keep current runtime references unchanged.
12. Add API boundary tests for `/api/price` missing symbol, unsupported symbol, provider dependency unavailable, provider data unavailable, and mocked success response.
13. Run required checks.
14. Update execution, review, senior decision, final approval, and summary workflow files.

## Acceptance Criteria

- Current docs no longer require physical device QA.
- Current docs still require production web/mobile-site browser QA after deployment.
- README no longer says saved cards cannot sync across devices without qualifying optional Supabase sync.
- Existing uncommitted daily-report clarification is preserved.
- Runtime fixes are limited to the approved audit findings.
- Storage/export compatibility remains backward compatible.
- `npm test` includes smoke and unit tests.
- `/api/price` boundary tests run without live market data.
- Legacy folder policy is documented and current runtime still does not load `Legacy/`.

## Test Plan

- `rg -n "physical|real-device|real devices|iOS Safari|Android Chrome|PWA install|Add to Home Screen" README.md docs/qa docs/release docs/daily-reports`
- `git diff --check`
- `git status --short`
- `node tests/smoke.js`
- `npm test`
- `python3 tests/api/test_price.py`
- `npx playwright test tests/e2e/planner.spec.js`
- `npx playwright test`

## Risks

- Removing physical-device gates could accidentally remove useful mobile-site QA. Mitigation: replace with production browser/mobile viewport QA rather than deleting the QA requirement.
- Broad objective could encourage unrelated refactors. Mitigation: keep this phase documentation-only and use audit results for later scoped plans.
- Runtime completion semantics could change saved-card Draft/Complete labels. Mitigation: align with the existing Generate Focus Plan validation rules and add tests.
- Adding manual-price acknowledgement into normalized fields is a backward-compatible additive field; imports of older cards should still normalize safely.

## Rollback Plan

- Revert this phase's documentation edits only.
- Preserve prior committed app runtime state and do not revert unrelated uncommitted user work.
