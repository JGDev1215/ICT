# Implementation Plan

## Goal

Ship a focused v0.8.7 single-user PIN login update for Account & Backup.

## Repo Findings

- `assets/app.js` owns Account & Backup rendering and login handling.
- `README.md`, `CHANGELOG.md`, `index.html`, `service-worker.js`, `CLAUDE.md`, and `tests/smoke.js` pin current version/cache behavior.
- Current Supabase admin password was rotated to a strong password in the previous readiness pass; for a 4-digit PIN UI, the backing Supabase password must match the PIN.
- `.env.local` is ignored and untracked, so it can store the local PIN handoff without committing it.

## Files Likely Affected

- `assets/app.js`
- `index.html`
- `service-worker.js`
- `tests/smoke.js`
- `tests/e2e/planner.spec.js`
- `README.md`
- `CHANGELOG.md`
- `CLAUDE.md`
- `agent-workflow/*`
- `docs/qa/production-web-mobile-qa-2026-07-09.md`
- `docs/qa/docs-implementation-checklist-2026-07-08.md`

## Proposed Changes

- Replace visible username/password inputs with one `adminPin` input.
- Validate PIN with `/^\d{4}$/`.
- Call `supabaseLogin(adminSupabaseEmail(), pin)` after validation.
- Rotate Supabase `admin@ict.local` password to a generated 4-digit PIN and store the PIN only in ignored `.env.local`.
- Bump shipped app version/cache to v0.8.7 with `tools/bump-version.js`.
- Update README/CHANGELOG/docs/tests for the PIN login behavior.

## Step-by-Step Plan

1. Create/update workflow plan and senior review files.
2. Edit `assets/app.js` Account & Backup login UI and handler.
3. Update smoke/E2E tests for the PIN field and validation.
4. Run `node tools/bump-version.js v0.8.7 pin-login 20260709`.
5. Rotate Supabase admin password to a generated 4-digit PIN and update `.env.local`.
6. Verify old strong password fails and PIN succeeds.
7. Run local tests and focused browser QA.
8. Update QA/workflow docs with evidence and remaining security note.

## Acceptance Criteria

- Account & Backup login is PIN-only in the rendered app.
- Non-4-digit input is rejected locally.
- 4-digit PIN signs in to Supabase and backup still works.
- Existing local-first behavior is unchanged when signed out.
- v0.8.7 cache-busted assets are aligned.
- `npm test`, focused Playwright checks, and `git diff --check` pass.

## Test Plan

- `npm test`
- Focused Playwright production/local Profile PIN smoke as applicable.
- Supabase Auth old/new credential check.
- `git diff --check`

## Risks

- A 4-digit PIN is lower entropy than a full password. This is acceptable only for the stated single-user convenience flow and should not be treated as strong public multi-user security.
- The deployed static app will only show the PIN field after v0.8.7 is deployed.

## Rollback Plan

Revert the app/docs/test changes and rotate the Supabase admin password back to a strong private value stored in `.env.local`.
