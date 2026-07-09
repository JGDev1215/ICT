# Task Brief

## Original User Task

Feedback - This is a single user app. User can log into the app by typing a 4 digit pin code.

## Objective

Make the visible single-user Account & Backup login use one 4-digit PIN field instead of username plus password.

## Repo Findings

- Safety checks passed in `/Users/soonjeongguan/Desktop/FRAMEWORK`.
- Remote is `https://github.com/JGDev1215/ICT.git`.
- Existing uncommitted change: `docs/plans/ASD.md` is deleted; treat as user work and do not restore or depend on it.
- Current Profile Account & Backup UI renders `adminUsername` and `adminPassword`.
- Login handler requires username `admin` and sends `adminPassword` to Supabase Auth for `admin@ict.local`.
- Supabase backup is optional; localStorage remains the immediate source of truth.
- JS/CSS behavior changes require version/cache bump and smoke assertion updates.

## Assumptions

- The requested 4-digit PIN is for the existing Profile Account & Backup login, not a new full-app lock screen.
- The PIN will be the Supabase Auth password for the existing single-user backing account.
- Because this is a static app, the PIN is a convenience login for one user, not high-security multi-user authentication.

## Out of Scope

- New server-side PIN exchange endpoint.
- App-wide route lock before using local cards.
- Supabase schema changes or storage key changes.
- Removing JSON export/import or local-first behavior.
- Touching the unrelated deleted `docs/plans/ASD.md`.

## Success Criteria

- [x] Account & Backup shows one 4-digit PIN field and no username field.
- [x] Login validates exactly four digits before calling Supabase.
- [x] Login still maps to the backing Supabase admin email.
- [x] Supabase admin password is rotated to the 4-digit PIN and verified.
- [x] Version/cache/docs/tests are updated for v0.8.7.
- [x] Required checks pass.
