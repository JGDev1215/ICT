# Implementation Plan

## Goal

Record a current deployment-readiness audit for v0.8.6, close the remaining admin-password hardening item, and update project QA/workflow documentation so the repo accurately states what is proven.

## Repo Findings

- The worktree is clean and already contains the v0.8.6 runtime changes.
- Current production hosts serve v0.8.6.
- GitHub Actions for the v0.8.6 push are successful.
- Automated local tests pass.
- Production browser smoke passes for shell, responsive navigation, Focus Card create/reload/final-save, and saved-list visibility.
- Credential-independent Supabase checks can verify REST reachability, anon RLS denial for writes, and signed-out Profile optional-backup behavior.
- Supabase Account & Backup live sync is now verified with the real `admin` account.
- Supabase security advisor reports leaked-password protection is disabled, and the current admin password was weak/default before this hardening pass.
- `.env.local` is ignored and untracked, so it can hold the rotated admin password locally without committing it.

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
- `docs/qa/production-web-mobile-qa-2026-07-09.md`
- `docs/qa/docs-implementation-checklist-2026-07-08.md`

## Proposed Changes

- Update workflow files for the current readiness audit.
- Update production QA evidence from stale v0.8.5 shell evidence to current v0.8.6 deployment evidence.
- Update the remaining QA checklist to distinguish proven single-user deployment readiness from credential-dependent Supabase sync and public-release accessibility follow-up.
- Add credential-independent Supabase evidence and credentialed Account & Backup QA evidence.
- Rotate the admin password and verify the old default no longer signs in.
- Record leaked-password protection as a Supabase advisor follow-up if connector capabilities do not expose Auth config updates.

## Step-by-Step Plan

1. Run required safety checks and inspect current docs/tests.
2. Verify live deployment shell/assets on Vercel and GitHub Pages.
3. Verify GitHub Actions state for the latest v0.8.6 commit.
4. Run local test gates.
5. Run production browser smoke against deployed v0.8.6 without server writes.
6. Run Supabase credential-independent checks: REST reachability, anon insert denial, and signed-out Profile optional-backup browser smoke.
7. Run credentialed production Account & Backup QA with the real admin account.
8. Verify the QA row directly in Supabase and clean it up.
9. Generate a strong random admin password, store it only in `.env.local`, update the Supabase Auth password hash, and verify old/new sign-in behavior.
10. Run a focused production Account & Backup smoke with the rotated password.
11. Update workflow and QA docs with command evidence and remaining limitations.
12. Run static validation checks after docs edits.

## Acceptance Criteria

- Documentation reflects v0.8.6 live deployment rather than v0.8.5.
- No runtime files are changed.
- Supabase sync gate is verified and recorded with credentialed production evidence.
- Credential-independent Supabase RLS and optional-backup behavior are documented separately from credentialed sync.
- Credentialed Account & Backup QA is recorded as PASS.
- The admin password is rotated and the old default password no longer authenticates.
- Final decision accurately distinguishes verified deployment readiness from non-blocking public-release follow-ups.

## Test Plan

- `npm test`
- `npm run test:e2e -- --reporter=dot`
- Production shell `curl` checks for Vercel and GitHub Pages.
- Production price endpoint `curl` checks for supported and unsupported symbols.
- One-off Playwright production browser smoke for responsive shell and local Focus Card flow.
- Supabase REST anon insert denial checks for `focus_cards` and `user_settings`.
- Production Profile signed-out optional-backup smoke.
- Production credentialed admin Account & Backup browser smoke.
- Direct Supabase SQL verification and cleanup for the QA card row.
- Password rotation verification: old password rejected, rotated password accepted.
- `git diff --check`

## Risks

- Supabase leaked-password protection may remain disabled if Auth project config cannot be changed through the available connector; document this as a public-release follow-up.
- Automated browser QA does not replace real-device or assistive-technology certification for public release.
- Production browser smoke uses localStorage in an isolated browser context and does not prove user-specific existing browser data.

## Rollback Plan

Revert the documentation-only changes to the workflow and QA markdown files. No runtime rollback is required.
