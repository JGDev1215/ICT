# Implementation Plan

## Goal

Bring current documentation and QA evidence into alignment with the implemented v0.8.11 app, then verify that the documented outstanding items are either completed or accurately classified as external public-release gates.

## Repo Findings

- `README.md`, `CHANGELOG.md`, tests, and current app files document v0.8.11 as implemented.
- `docs/plans/supabase-focus-card-storage-plan.md` still described Profile backup login as username/password, which conflicts with the current 4-digit PIN UI.
- `docs/qa/docs-implementation-checklist-2026-07-08.md` still had two unchecked public-release follow-ups.
- `docs/qa/production-web-mobile-qa-2026-07-09.md` records that Supabase leaked-password protection remains disabled and must be enabled from the Supabase Dashboard before public release if supported.
- `README.md` still used "Focus Card Details" in some headings and Saved Card copy even though v0.8.11 changed the active trader-facing flow to Plan Review.

## Files Likely Affected

- `README.md`
- `docs/plans/supabase-focus-card-storage-plan.md`
- `docs/qa/docs-implementation-checklist-2026-07-08.md`
- `docs/qa/production-web-mobile-qa-2026-07-09.md`
- `agent-workflow/*`

## Proposed Changes

- Update current docs to use the v0.8.11 Account & Backup PIN language.
- Update current README headings/copy from "Focus Card Details" to "Plan Review" where describing the active workflow.
- Add a v0.8.11 completion audit note to production QA evidence.
- Mark the accessibility/browser follow-up complete if current automated browser accessibility evidence covers it, while noting that manual assistive-technology testing remains an external public-release activity if required.
- Keep Supabase leaked-password protection as an explicit external blocker unless a supported tool can enable it.

## Step-by-Step Plan

1. Patch stale README and Supabase plan language.
2. Add/update QA evidence for v0.8.11 documented task completion.
3. Check available Supabase tooling for whether leaked-password protection can be changed from this environment.
4. Update the checklist based on verified evidence.
5. Run `npm test`, `npm run test:e2e -- --reporter=dot`, and `git diff --check`.
6. Complete workflow review and final approval files.

## Acceptance Criteria

- Current docs do not tell users to use the removed Profile username/password UI.
- Current docs consistently describe Planner / Plan Review as the active Focus Card workflow.
- Public-release release gates are not falsely closed.
- The final review clearly states whether the work is safe to commit.

## Test Plan

- `npm test`
- `npm run test:e2e -- --reporter=dot`
- `git diff --check`

## Risks

- Supabase leaked-password protection may be dashboard-only from this environment.
- Manual assistive-technology testing cannot be fully proven by repository tests.
- Production deployment state may lag the repository and should not be overclaimed without live checks.

## Rollback Plan

Revert only this task's documentation/workflow edits if they introduce incorrect release status or app behavior claims.
