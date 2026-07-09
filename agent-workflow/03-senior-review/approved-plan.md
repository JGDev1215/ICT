# Approved Plan

## Goal

Update the current workflow and QA documentation with v0.8.6 deployment-readiness evidence, and close the remaining admin-password hardening item without changing runtime code.

## Approved Scope

- Record current safety checks, CI state, production host state, production price API checks, local test results, and production browser smoke results.
- Record Supabase credential-independent evidence: REST reachability, anon insert denial by RLS, and signed-out Profile optional-backup behavior.
- Record credentialed production Account & Backup evidence with the real admin account.
- Rotate the deployed `admin@ict.local` Supabase Auth password away from the weak/default value.
- Store the rotated admin password only in ignored local secret storage (`.env.local`) and do not commit it.
- Update `docs/qa/production-web-mobile-qa-2026-07-09.md` from v0.8.5 shell evidence to v0.8.6 production evidence.
- Update `docs/qa/docs-implementation-checklist-2026-07-08.md` so remaining gates are accurate.
- Record leaked-password protection as an advisory item if it cannot be changed through the available connector.

## Constraints

- No runtime/app behavior changes.
- No service-worker, version, storage, or API changes.
- Claims that Supabase sync passed must be backed by the real credentialed QA evidence.
- No changes to Supabase schema or app data except the intended admin password rotation.
- Do not print or commit the rotated password.
- No commit or push in this pass unless the user explicitly asks.

## Verification

- `npm test`
- `npm run test:e2e -- --reporter=dot`
- Production shell and API `curl` checks
- Production browser smoke
- Supabase anon/RLS checks
- Production Profile signed-out optional-backup smoke
- Production credentialed admin Account & Backup smoke
- Direct Supabase SQL verification and QA row cleanup
- Admin password rotation verification: old password fails, rotated password succeeds, production Account & Backup still works.
- `git diff --check`
