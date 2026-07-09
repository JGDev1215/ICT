# Senior Decision

## Decision

APPROVED TO STAGE AND COMMIT SELECTIVE SCOPE

## Reasoning

The highest-risk audit issues in the static app code were addressed with focused changes:

- first-login sync stall fixed
- first-sync local upload now requires user choice
- stale sessions revalidated
- sync status made clearer
- cache/version/tests/docs updated

The changes preserve local-first storage, manual price fallback, export/import paths, and the existing saved-card key.

## Required Before Release Claim

- Deploy to Vercel.
- Repeat live account-to-Focus-Card Supabase audit.
- Confirm first-sync upload/skip behavior against a real empty Supabase account.

## Commit Safety

Safe to commit only after selectively staging the intended Supabase fix, docs, tests, cache/version updates, and workflow evidence.

Do not commit with `git add .` because the worktree includes pre-existing unrelated files.
