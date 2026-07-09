# Fix Report

## Fixes Applied

- Fixed the clear-device flow so the visible warning survives the route render and any best-effort backup sign-out completion.
- Avoided calling Supabase sign-out when there is no local Supabase session/user.

## Files Changed

- `assets/app.js`
- `tests/e2e/planner.spec.js`

## Checks Performed

- Re-ran `npx playwright test tests/e2e/planner.spec.js`.
- Re-ran full `npx playwright test`.
- Re-ran `node tests/smoke.js`.

## Remaining Issues

None from the implemented scope.
