# Approved Plan

## Goal

Implement the v0.8.4 review feedback patch while preserving local-first behavior, storage/export compatibility, manual price fallback, and optional Supabase sync.

## Approved Scope

- Device-local clear-data behavior and copy.
- Notice severity and persistent live-region behavior.
- Import reader error and unknown-schema warning.
- Production HTTPS price fallback guard.
- `api/price.py` static-serving comment only.
- v0.8.4 version/cache/docs/tests.

## Execution Rules

- Do not modularize `assets/app.js`.
- Do not delete `api/price.py` static serving.
- Do not change storage key or export schema.
- Do not make Supabase schema changes.
- Preserve existing uncommitted workflow/report work.
- Do not commit or push.

## Approved Tests

- `node tests/smoke.js`
- `npx playwright test tests/e2e/planner.spec.js`
- `npx playwright test`
- `python3 -m py_compile api/price.py`
