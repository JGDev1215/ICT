# Approved Plan

## Goal

Complete the current documentation and QA cleanup needed to align documented outstanding work with the implemented v0.8.11 app.

## Approved Scope

- Fix current docs that still describe superseded UI labels or Account & Backup username/password behavior.
- Add current QA evidence for v0.8.11 completion status.
- Classify public-release gates accurately using available evidence and Supabase tooling.
- Do not edit archived docs unless they are listed as current source-of-truth.
- Do not implement the future safe-refactor prompt.

## Execution Steps

1. Patch README active workflow wording from Focus Card Details to Plan Review where appropriate.
2. Patch Supabase Focus Card Storage plan to describe PIN-based Account & Backup access.
3. Add a v0.8.11 audit section to production QA evidence.
4. Update the remaining QA checklist without overstating external-only gates.
5. Check whether Supabase tooling can enable leaked-password protection; if not, record it as the remaining external blocker.
6. Run `npm test`, `npm run test:e2e -- --reporter=dot`, and `git diff --check`.
7. Write execution, review, senior decision, final approval, and workflow summary.

## Acceptance Criteria

- Current documentation matches the current app behavior.
- Remaining outstanding work is limited to clearly stated external public-release action, if any.
- Automated checks pass or failures are reported honestly.
