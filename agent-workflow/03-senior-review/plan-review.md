# Senior Plan Review

## Plan Quality

APPROVED WITH AMENDMENTS

The plan is focused and preserves the existing sync implementation while improving user-facing copy and controls.

## Missing Steps

- Ensure smoke tests check absence of visible `Create account` and project URL in Profile output.
- Ensure docs do not imply real security from static `admin/admin`.
- Ensure existing first-sync queue behavior remains unchanged except copy.

## Risk Areas

- Creating Auth users directly through SQL must avoid generated columns and keep identity rows valid.
- Removing rendered signup controls should not break smoke tests that check `supabaseSignup` helper existence if retained.
- Cache bump must be coordinated across `index.html`, `service-worker.js`, and `VERSION`.

## Overengineering Concerns

Do not build a full role/user system. Single-user UX is enough.

## Simpler Alternatives

Auto-login/no login was considered but rejected because the user explicitly requested username/password admin access.

## Required Amendments

- Keep Supabase terms out of normal visible Profile card, but retain technical docs in README.
- Add config override for backing Supabase email.

## Decision

APPROVED WITH AMENDMENTS
