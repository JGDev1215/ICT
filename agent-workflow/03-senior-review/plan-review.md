# Senior Plan Review

## Plan Quality

The plan targets the actual audit failures and keeps scope limited to account/sync behavior, status clarity, cache/version strings, tests, and docs.

## Missing Steps

- Ensure new localStorage decision state is user-specific and does not change the saved-card key.
- Ensure skipped local upload still allows future new cards to sync after the user is signed in.
- Ensure signup rate-limit copy is improved without pretending the static app can change Supabase project email limits.

## Risk Areas

- `flushSupabaseQueue()` is called from card save paths; blocking it incorrectly could stop all server sync.
- `syncFromSupabase()` saves merged cards locally; ensure it does not queue remote cards back to Supabase during merge.
- `onAuthStateChange` can race with explicit login/signup handlers.

## Overengineering Concerns

Avoid adding a complex migration or account workspace system in this round. Use a small per-user decision gate.

## Simpler Alternatives

Only fixing the busy-state bug would solve the reload requirement, but it would leave the silent local-card upload issue unresolved. First-sync consent is justified.

## Required Amendments

- Add smoke assertions for the new first-sync controls and `auth.getUser()`.
- Keep manual price entry and saved-card storage keys unchanged.

## Decision

APPROVED WITH AMENDMENTS
