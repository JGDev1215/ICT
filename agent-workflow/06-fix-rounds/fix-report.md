# Fix Report

## Fix Round

Supabase account/sync audit remediation, phase 1.

## Issues Addressed

### Fixed - First Login Sync Stall

Cause: `supabaseLogin()` set sync state to busy before calling `syncFromSupabase()`, and `syncFromSupabase()` returned early when busy.

Fix: auth-driven sync now calls `syncFromSupabase({force: true})`.

### Fixed - Silent Upload of Existing Local Cards

Cause: existing queued local cards could upload into an empty newly logged-in Supabase account.

Fix: when a signed-in account has zero server cards and the browser has existing local cards, the Profile tab now pauses upload and asks the user to choose:

- `Upload local cards`
- `Keep local only`

### Fixed - Stale Session Handling

Cause: restored sessions were trusted from `getSession()` only.

Fix: startup now revalidates with `auth.getUser()` and moves invalid/deleted sessions back to login-required state.

### Improved - Sync Status Clarity

Profile now shows:

- pending local changes
- server cards confirmed
- first-sync choice
- last sync

### Improved - Signup Rate-Limit Message

Signup errors containing rate-limit text now explain that Supabase email limits may require retry or SMTP/email configuration.

## Remaining Issues

- Actual Supabase email rate limits still require Supabase project/provider configuration.
- Live deployed retest is still required after pushing/redeploying.
- Cross-device restore should be tested after deployment with a real confirmed account.

## Verification

- `node tests/smoke.js` passed.
- Local HTTP checks confirmed v0.8.1 assets and new Profile sync controls are present.
