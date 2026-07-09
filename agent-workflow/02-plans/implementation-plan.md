# Implementation Plan

## Goal

Validate the live Account & Backup Focus Card persistence path and document the next product fix plan for Planner validation and price auto-detect reliability.

## Repo Findings

- Repo path and remote are correct; initial worktree is clean.
- The current app version is v0.8.2 and the deployment/API documentation points to Vercel-hosted assets and `/api/price`.
- Browser storage remains local-first; Supabase is optional backup/sync.
- The Profile login is visible username `admin` with a password field, mapped to `admin@ict.local`.
- Planner currently allows incomplete drafts, while recent daily notes say empty accidental cards still need product attention.
- Price auto-detect already supports hosted and local helper URLs, timeout handling, manual fallback, and user-facing failure copy.

## Files Likely Affected

- `agent-workflow/00-inbox/current-task.md`
- `agent-workflow/01-intake/task-brief.md`
- `agent-workflow/02-plans/implementation-plan.md`
- `agent-workflow/03-senior-review/plan-review.md`
- `agent-workflow/03-senior-review/approved-plan.md`
- `agent-workflow/04-execution/execution-report.md`
- `agent-workflow/05-code-review/review-report.md`
- `agent-workflow/06-fix-rounds/senior-decision.md`
- `agent-workflow/07-final-review/final-approval.md`
- `agent-workflow/08-completed/workflow-summary.md`
- `docs/plans/planner-validation-price-autodetect-plan-2026-07-09.md`

## Proposed Changes

- Update required workflow evidence files for this task.
- Run a live browser E2E against the deployed app.
- Run `node tests/smoke.js`.
- Create a durable implementation plan for the next product fix.
- Do not change app runtime files.

## Step-by-Step Plan

1. Complete the required repository safety check and document findings.
2. Read the relevant agent/prompt/docs/source files before execution.
3. Create this implementation plan.
4. Perform senior plan review and create `approved-plan.md`.
5. Use browser automation to open the live deployment.
6. In the live app, attempt admin login from Profile with username `admin` and password `admin`.
7. If login succeeds, create a unique QA Focus Card through Planner using deterministic values.
8. Open Focus Card Details, edit fields/notes/price evidence, press Save changes, then choose a final outcome and press Final save.
9. Use Profile "Back up now" if available, then reload the page and confirm the card persists in Saved/Focus Card Details.
10. Check price auto-detect behavior with a supported symbol and record whether it succeeds or fails gracefully.
11. Run `node tests/smoke.js`.
12. Write `docs/plans/planner-validation-price-autodetect-plan-2026-07-09.md` with scoped fixes, acceptance criteria, tests, risks, and rollback plan.
13. Complete execution, review, senior decision, final approval, and workflow summary files.

## Acceptance Criteria

- Live QA result is recorded with exact pass/fail/blocker details.
- Persistence is confirmed after reload, or the reason it cannot be confirmed is explicit.
- The next product fix plan is actionable, scoped, and respects local-first/manual-price fallback guardrails.
- Smoke test result is recorded truthfully.
- No runtime files are changed.

## Test Plan

- Manual/live browser E2E on the deployed app.
- Static smoke check: `node tests/smoke.js`.
- Optional static server check only if live browser behavior needs local comparison.

## Risks

- Admin password may differ from the documented convenience value and block Supabase login.
- Live deployment may serve stale cached assets compared with local `main`.
- Creating a live test card may leave test data in the admin backup account unless cleanup is performed.
- Network/CORS/API availability can affect price auto-detect results.

## Rollback Plan

- Revert only documentation/workflow files changed in this task if needed.
- If a test card is created and cleanup is available, delete it from the live app after recording persistence evidence.
- Do not touch runtime files, storage keys, or Supabase schema in this task.
