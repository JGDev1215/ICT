# Approved Plan

## Goal

Set the single-user Account & Backup credential to the requested default PIN and remove `docs/plans/ASD.md`.

## Approved Scope

- Rotate Supabase `admin@ict.local` to the requested default PIN.
- Store the PIN only in ignored `.env.local`.
- Revoke existing admin session/token state where exposed.
- Keep public app/docs from printing the PIN.
- Remove misleading PIN placeholder text in `assets/app.js`.
- Bump version/cache to `v0.8.8`.
- Leave `docs/plans/ASD.md` deleted for the next commit.

## Constraints

- No schema changes.
- No service-role key in frontend.
- No public committed PIN.
- Do not commit or push unless explicitly instructed.

## Verification

- Supabase previous credential rejected.
- Supabase requested PIN accepted.
- `npm test`
- `git diff --check`
