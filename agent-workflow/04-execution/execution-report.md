# Execution Report

## Summary of Changes

Updated workflow and QA documentation to record current v0.8.6 deployment-readiness evidence.
Added credential-independent Supabase safety evidence without changing runtime code or Supabase schema.
Completed credentialed production Account & Backup QA with the real admin account.
Rotated the deployed admin password away from the weak/default value and verified the rotated password through Auth plus production UI backup smoke.

## Files Changed

- `agent-workflow/00-inbox/current-task.md`
- `agent-workflow/01-intake/task-brief.md`
- `agent-workflow/02-plans/implementation-plan.md`
- `agent-workflow/03-senior-review/plan-review.md`
- `agent-workflow/03-senior-review/approved-plan.md`
- `docs/qa/production-web-mobile-qa-2026-07-09.md`
- `docs/qa/docs-implementation-checklist-2026-07-08.md`

## Implementation Notes

- No runtime files were changed.
- Production QA evidence was updated from stale v0.8.5 shell evidence to current v0.8.6 Vercel/GitHub Pages evidence.
- Supabase anon insert attempts against `focus_cards` and `user_settings` were denied by RLS.
- Production Profile signed-out Account & Backup behavior was verified with browser-local storage only.
- Production credentialed Account & Backup behavior was verified for backup upload, reload, second-browser restore, final-save sync, clear-device local-only behavior, database verification, and cleanup.
- The rotated admin password is stored only in ignored `.env.local`.
- Supabase leaked-password protection remains a dashboard/plan follow-up.

## Deviations From Approved Plan

None.

## Checks Performed

- `pwd`
- `git remote -v`
- `git status`
- `find . -maxdepth 3 -type f | sed 's#^\./##' | sort | head -200`
- `git log -1 --oneline`
- `gh run list --repo JGDev1215/ICT --limit 12`
- Production shell `curl` checks for Vercel and GitHub Pages
- Production price API `curl` checks for supported and unsupported symbols
- `.env.local` variable-name check for available credential variables
- Supabase REST anon select and insert checks
- Production Profile signed-out optional-backup smoke
- Production credentialed Account & Backup browser QA
- Supabase SQL verification and cleanup for the QA card row
- Admin password rotation
- Old-password rejection and rotated-password acceptance checks
- Focused production Account & Backup smoke with rotated password
- `npm test`
- `npm run test:e2e -- --reporter=dot`
- One-off Playwright production browser smoke

## Known Issues

Supabase security advisor reports leaked-password protection is disabled. Enable it from the Supabase Dashboard before public release if the project plan supports it.
