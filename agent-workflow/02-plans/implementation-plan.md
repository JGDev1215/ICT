# Implementation Plan

## Goal

Apply the requested default PIN and remove the obsolete ASD plan file.

## Repo Findings

- `docs/plans/ASD.md` is already deleted in the working tree.
- Account & Backup PIN login is already implemented in `assets/app.js`.
- The PIN placeholder still says `1234`, which could conflict with the requested default.
- Supabase Auth password rotation can be done by updating the existing `auth.users.encrypted_password` hash and revoking refresh/session rows.

## Files Likely Affected

- `assets/app.js`
- `index.html`
- `service-worker.js`
- `tests/smoke.js`
- `README.md`
- `CHANGELOG.md`
- `CLAUDE.md`
- `docs/qa/production-web-mobile-qa-2026-07-09.md`
- `docs/plans/ASD.md`
- `agent-workflow/*`
- `.env.local` ignored local-only credential file

## Proposed Changes

- Rotate the Supabase `admin@ict.local` password to the requested default PIN.
- Store the requested PIN in ignored `.env.local`.
- Revoke existing Supabase admin sessions/tokens where exposed.
- Change the visible PIN input placeholder from a fake example code to neutral copy.
- Bump app/cache to `v0.8.8` because `assets/app.js` changes.
- Update docs/tests that pin current version/cache.
- Leave `docs/plans/ASD.md` deleted.

## Step-by-Step Plan

1. Create/update workflow intake, plan, and senior review files.
2. Edit `assets/app.js` to remove the misleading PIN example placeholder.
3. Run version/cache bump to `v0.8.8`.
4. Update changelog and QA evidence without printing the PIN.
5. Rotate Supabase Auth password to the requested PIN and revoke sessions.
6. Verify previous credential rejection and requested PIN acceptance.
7. Run `npm test` and `git diff --check`.
8. Update execution/review/final workflow files.

## Acceptance Criteria

- Supabase login succeeds with the requested default PIN.
- Supabase login fails with the previous PIN.
- The committed frontend does not print the PIN.
- `docs/plans/ASD.md` is removed.
- Version/cache strings are consistent.
- Required checks pass.

## Test Plan

- Supabase Auth old/new credential verification.
- `npm test`
- `git diff --check`

## Risks

- A 4-digit PIN is weak by normal password standards; keep private/single-user only.
- The deployed site will use the new neutral placeholder only after v0.8.8 deployment.

## Rollback Plan

Rotate Supabase back to a strong private password, restore the previous app version/cache commit, and restore `docs/plans/ASD.md` if needed.
