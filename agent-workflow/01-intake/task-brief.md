# Task Brief

## Original User Task

Continue.

## Objective

Implement a focused fix round for the account/server-sync issues found in the deployed-site audit.

## Repo Findings

- App is a static HTML/CSS/plain JavaScript app.
- Supabase sync lives in `assets/app.js`.
- Deployed asset version strings are pinned in `index.html`, `service-worker.js`, and `tests/smoke.js`.
- `node tests/smoke.js` currently passes.
- First-login sync stalls because `supabaseLogin()` sets `syncState.busy = true` before calling `syncFromSupabase()`, and `syncFromSupabase()` exits when busy.
- Existing local cards are queued and can upload into a newly logged-in account without user confirmation.
- Existing worktree has uncommitted files unrelated to this specific fix round; do not overwrite them.

## Assumptions

- "Continue" means continue from the prior audit into the required fix round.
- The safest first phase is to fix sync behavior and user consent without redesigning unrelated UI.
- Public Supabase email rate limits cannot be fully fixed in static app code; the app can only make the message clearer.

## Out of Scope

- Changing Supabase project email provider/SMTP settings.
- Replacing Supabase with another backend.
- Redesigning the full Profile page.
- Clearing existing user browser storage.
- Committing or pushing changes.

## Success Criteria

- [ ] First login can run server sync without requiring page reload.
- [ ] Existing local cards are not silently uploaded to a newly logged-in empty server account.
- [ ] User can explicitly upload local cards or keep them local.
- [ ] Startup revalidates Supabase users and signs out invalid/deleted sessions.
- [ ] Sync status distinguishes pending local queue from server-confirmed sync.
- [ ] Cache/version strings and smoke assertions are updated.
- [ ] `node tests/smoke.js` passes.
