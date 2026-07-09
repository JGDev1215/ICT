# Implementation Plan

## Goal

Replace the technical Supabase Profile panel with a clean single-user Account & Backup UI.

## Repo Findings

- `supabasePanelHtml()` owns the visible panel.
- Existing `supabaseLogin(email, password)` can remain as the internal backing login.
- Existing first-sync gate and queue logic can remain, with copy rewritten.
- Supabase project id is `cdcqklvvswzipmmvpzaj`.

## Files Likely Affected

- `assets/app.js`
- `assets/config.js`
- `index.html`
- `service-worker.js`
- `tests/smoke.js`
- `README.md`
- `CHANGELOG.md`
- `agent-workflow/*`

## Proposed Changes

1. Add admin username/email constants and config helper.
2. Rename visible sync status to backup status.
3. Replace logged-out panel with username/password `Sign in`.
4. Validate username is `admin`; call `supabaseLogin(adminSupabaseEmail(), password)`.
5. Remove rendered signup/retry controls and obsolete signup handler assertions.
6. Keep `supabaseSignup()` internally harmless but unused.
7. Rewrite first-sync copy/buttons.
8. Add Supabase Auth user `admin@ict.local` with password `admin`.
9. Bump to `v0.8.2`.
10. Update smoke/docs/changelog and verify.

## Step-by-Step Plan

1. Patch `assets/config.js` to include `adminSupabaseEmail`.
2. Patch `assets/app.js` constants/helpers and panel rendering.
3. Patch Profile login event handler.
4. Patch first-sync notices/button labels.
5. Patch version/cache strings.
6. Patch smoke tests.
7. Patch README/CHANGELOG.
8. Ensure Supabase admin user exists.
9. Run smoke and static/local UI checks.
10. Update workflow reports.

## Acceptance Criteria

- Profile UI is clean and user-facing.
- Supabase implementation details are hidden from normal UI.
- Existing sync internals still work.
- Admin Supabase account is present.
- Tests pass.

## Test Plan

- `node tests/smoke.js`
- Local static server check for Profile HTML/source.
- Supabase SQL verification for `admin@ict.local`.

## Risks

- Static admin credentials are not secure; document this clearly.
- Supabase Auth still expects an email behind the scenes.
- Login cannot be fully proven locally without a deployed browser/manual test, but database user and source behavior can be verified.

## Rollback Plan

Revert `assets/app.js`, `assets/config.js`, version/cache/docs/test changes. Supabase admin user can remain harmless or be deleted if requested.
