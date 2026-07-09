# Approved Plan

## Goal

Run live QA for Account & Backup Focus Card persistence and create a durable next-fix plan for Planner validation and price auto-detect reliability.

## Approved Scope

- Workflow evidence updates.
- Live deployed-app browser QA.
- Static smoke test.
- One durable planning document under `docs/plans/`.
- No runtime app changes.

## Execution Steps

1. Open the deployed app URL documented by the current README/config.
2. Record the exact URL and test timestamp.
3. Confirm the current Account & Backup UI is visible from Profile.
4. Attempt login with visible username `admin` and the documented convenience password `admin`.
5. If login fails, stop Supabase-specific verification and record the credential blocker.
6. If login succeeds, create a unique QA Focus Card from Planner with instrument, session, current price, bias, DOL, sweep, and FVG data.
7. Save/open the Focus Card, edit review notes or price/risk details, click Save changes, choose a non-Open outcome, and click Final save.
8. Use Profile backup controls to sync, then reload and confirm the card persists in Saved/Focus Card Details.
9. Exercise price auto-detect for a supported symbol and record success or graceful failure.
10. Run `node tests/smoke.js`.
11. Create `docs/plans/planner-validation-price-autodetect-plan-2026-07-09.md` with status block, problem statement, proposed fix, files likely affected, acceptance criteria, test plan, risks, and rollback plan.
12. Complete execution, review, senior decision, final approval, and workflow summary files.

## Acceptance Criteria

- QA results include exact pass/fail/blocker evidence.
- Smoke test result is recorded.
- Product fix plan is actionable and respects local-first/manual fallback requirements.
- No runtime files are changed.

## Guardrails

- Do not expose credentials or local tokens.
- Do not commit or push.
- Do not make unrelated docs or code changes.
- Do not claim Supabase persistence unless reload and saved-card visibility are actually observed after sync.
