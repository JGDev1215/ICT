# Implementation Plan

## Goal

Fix the highest-risk Supabase account/sync defects found in the audit while keeping the app static, local-first, and backward compatible with saved cards.

## Repo Findings

- `assets/app.js` owns Supabase state, queueing, profile UI, login/signup/logout, and sync.
- `syncFromSupabase()` currently refuses to run while `syncState.busy` is true.
- `supabaseLogin()` sets busy before calling `syncFromSupabase()`, causing the first sync to short-circuit.
- `flushSupabaseQueue()` uploads all queued local cards when a user is signed in.
- Profile UI currently only shows `Pending local changes`, which does not prove server persistence.

## Files Likely Affected

- `assets/app.js`
- `index.html`
- `service-worker.js`
- `tests/smoke.js`
- `README.md`
- `CHANGELOG.md`
- `agent-workflow/*`

## Proposed Changes

1. Add a user-specific first-sync decision store in localStorage.
2. Allow `syncFromSupabase({force: true})` so login/signup can run despite the earlier busy status.
3. Revalidate startup sessions with `auth.getUser()` and force local logout state if Supabase rejects the user.
4. When a signed-in user has local cards and remote server has no cards, pause first upload until the user chooses:
   - `Upload local cards`
   - `Keep local only`
5. Block automatic queue flush while first-sync upload is paused.
6. Improve Profile sync panel:
   - show server-confirmed card count
   - show sync decision state
   - show clearer signup rate-limit guidance
7. Add event handlers for upload/skip first sync.
8. Update cache-busted asset version strings and smoke assertions.
9. Update README/CHANGELOG with the sync fix note.

## Step-by-Step Plan

1. Edit `assets/app.js` helpers and `syncState`.
2. Add first-sync decision helpers.
3. Patch `syncFromSupabase`, `flushSupabaseQueue`, `initSupabase`, login/signup flows.
4. Patch Profile Supabase panel HTML and event handlers.
5. Update version/cache strings in `index.html` and `service-worker.js`.
6. Update `tests/smoke.js` string assertions.
7. Update docs.
8. Run `node tests/smoke.js`.
9. Optionally run a local static server/browser check if needed.
10. Record execution/review/final workflow reports.

## Acceptance Criteria

- Login-triggered sync no longer exits solely because the prior login action set busy.
- First sync to an empty remote account requires explicit local-card upload approval.
- User can skip uploading existing local cards and keep them browser-local.
- Startup session is checked with Supabase `getUser()`.
- UI exposes server card count and first-sync decision.
- Smoke test passes.

## Test Plan

- Run `node tests/smoke.js`.
- Inspect deployed/static strings in source.
- Use targeted JS/static checks where useful.
- If time permits, run local server and verify Profile controls exist.

## Risks

- Sync logic is shared across local saves, imports, deletes, login, logout, and startup.
- Blocking queue flush too broadly could prevent normal post-login card saves.
- First-sync consent must not destroy local cards.

## Rollback Plan

Revert changes in `assets/app.js`, version strings, smoke assertions, and docs. Browser-local card storage key remains unchanged.
