# Approved Plan

## Goal

Implement a v0.8.7 Account & Backup login change so the single user signs in with a 4-digit PIN.

## Approved Scope

- Replace username/password UI with a single PIN field.
- Validate exactly four digits before Supabase login.
- Keep using `adminSupabaseEmail()` as the backing account identity.
- Rotate the backing Supabase password to a generated 4-digit PIN and store it only in ignored `.env.local`.
- Update version/cache, tests, README, CHANGELOG, QA docs, and workflow evidence.

## Constraints

- No app-wide lock screen in this pass.
- No storage key or export schema change.
- No service role key in frontend.
- Do not touch unrelated user change deleting `docs/plans/ASD.md`.
- Do not commit or push unless explicitly requested.

## Verification

- `npm test`
- Focused Playwright Profile PIN checks
- Supabase old/new credential check
- `git diff --check`
