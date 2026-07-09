# Approved Plan

## Approved Scope

Implement the single-user admin Account & Backup Profile panel and backing Supabase admin user.

## Required Changes

- `assets/app.js`: admin login helper, friendly backup panel, rewritten first-sync UI, version bump.
- `assets/config.js`: `adminSupabaseEmail` config default.
- `index.html` and `service-worker.js`: cache/version bump.
- `tests/smoke.js`: admin-login and hidden-technical-UI assertions.
- `README.md` and `CHANGELOG.md`: document v0.8.2 and static-auth limitation.
- Supabase: ensure confirmed `admin@ict.local` auth user with password `admin`.

## Guardrails

- Do not touch unrelated `AGENTS.md` change.
- Do not remove local-first storage, export/import, manual price entry, or Supabase sync internals.
- Do not commit or push unless separately requested.
