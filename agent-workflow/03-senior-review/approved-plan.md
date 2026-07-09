# Approved Plan

## Scope

Implement the first fix round for Supabase account and server-sync audit issues.

## Approved Changes

1. Fix login/signup first-sync stall by allowing forced sync after auth actions.
2. Revalidate restored Supabase sessions with `auth.getUser()`.
3. Add user-specific first-sync consent before uploading existing browser-local cards to an empty server account.
4. Add `Upload local cards` and `Keep local only` profile actions.
5. Add clearer sync status fields for pending queue, server card count, and first-sync decision.
6. Improve signup rate-limit messaging.
7. Update cache-busted version strings in `index.html`, `service-worker.js`, and `tests/smoke.js`.
8. Update README/CHANGELOG notes.
9. Run `node tests/smoke.js`.

## Guardrails

- Do not change saved-card storage key.
- Do not remove export/import/manual price fallback.
- Do not redesign unrelated screens.
- Do not commit or push.
- Preserve existing uncommitted user work.
