# Codex Prompt: Safe App Structure Refactor Plan

Copy and paste this whole prompt into Codex / Agent Mode.

---

You are working in the GitHub repository `JGDev1215/ICT`.

Act as a senior programmer. Your job is to improve the app structure, folder structure and development structure without breaking the existing ICT DOL Sweep Tracker app.

The current app is a static HTML/CSS/JavaScript app. It currently depends on these important runtime files:

- `index.html`
- `assets/config.js`
- `assets/styles.css`
- `assets/app.js`
- `service-worker.js`
- `manifest.webmanifest`
- `api/price.py`
- `tests/smoke.js`
- `tests/e2e/*`
- `.github/workflows/*`

Do not perform a big-bang rewrite. Do not convert the app to React, Next.js, Vite, TypeScript, Tailwind, or any other framework unless specifically instructed in a future task. This repo is currently designed to work as a simple static app deployed to GitHub Pages, with an optional Vercel Python API for price data.

Your task is to safely prepare and implement a cleaner structure while preserving the current behaviour, saved data compatibility, GitHub Pages deployment, service worker caching, Supabase sync, price helper logic, smoke tests and Playwright tests.

## Non-negotiable rules

1. Do not break the existing app.
2. Do not delete or rename runtime files without updating every reference and test.
3. Do not change storage keys unless a backward-compatible migration is included and tested.
4. Do not remove legacy migration support for existing saved cards.
5. Do not remove Supabase support.
6. Do not expose private keys or service-role secrets.
7. Keep the app local-first.
8. Keep manual price entry working even if live price lookup fails.
9. Keep GitHub Pages deployment working.
10. Keep Vercel price API compatibility working.
11. Run the full test suite after each material change.
12. Commit only when the app passes tests.

## Existing issues to fix

The current structure works but is becoming harder to maintain because:

1. `assets/app.js` is too large and mixes state, rendering, routing, storage, Supabase sync, price helpers and utility functions.
2. `assets/styles.css` is large and mixes design tokens, layout, components, page styles and legacy compatibility styles.
3. `Legacy/` is mixed into the main repository tree and the smoke test still reads legacy files, even though the current app should not load them.
4. `docs/` mixes release notes, plans, fix lists, UI redesigns and implementation reports without a clear documentation taxonomy.
5. `knowledge/` contains domain reference material but the name is vague for future developers.
6. `api/price.py` currently includes API behaviour and static file serving behaviour, which mixes concerns.
7. Tests exist, but there are limited unit tests for pure functions such as price-map calculation, risk calculation, data normalisation and export/import validation.
8. GitHub Actions exist, but the deployment workflow is tightly coupled to the current flat asset paths.
9. `index.html`, `service-worker.js`, smoke tests and version-bump tooling all depend on exact file names and cache keys, so careless movement of files will break the app.

## Implementation strategy

Use a phased approach. Each phase must be small, reversible and testable.

Do not start by moving the whole app. First create a safety baseline, then organise documentation and tests, then modularise code in small pieces.

## Phase 0 — Baseline and safety check

1. Read these files first:
   - `README.md`
   - `CLAUDE.md`
   - `AGENTS.md`
   - `index.html`
   - `assets/config.js`
   - `assets/app.js`
   - `assets/styles.css`
   - `service-worker.js`
   - `api/price.py`
   - `package.json`
   - `tests/smoke.js`
   - `playwright.config.js`
   - `.github/workflows/pages.yml`
   - `.github/workflows/smoke.yml`
   - `.github/workflows/e2e.yml`
2. Run:
   - `npm ci`
   - `npm test`
   - `npm run test:e2e`
3. Record the current passing/failing state before changing files.
4. If tests fail before your changes, do not proceed with structure changes until the failure is understood and documented.
5. Confirm current app behaviour manually in a browser:
   - Home loads.
   - Planner loads.
   - Saved tab loads.
   - Journal loads.
   - Profile loads.
   - A draft can be saved.
   - A focus card can be opened.
   - Final save still works.
   - Export JSON still works.
   - Manual current price still works.
   - App does not require Supabase login to function locally.

## Phase 1 — Documentation structure cleanup only

This phase should not change runtime behaviour.

1. Create a clearer documentation taxonomy:
   - `docs/developer/`
   - `docs/user/`
   - `docs/release/`
   - `docs/plans/`
   - `docs/qa/`
2. Move or copy documentation files into the correct subfolder only where safe.
3. Do not move this file unless references are updated.
4. Update `README.md` with a short `Documentation map` section.
5. Preserve existing historical docs. Do not delete them.
6. If moving docs would create broken references, either update the references or leave the file where it is and add a TODO note.
7. Run `npm test` after documentation movement because the smoke test reads some documentation files.

Acceptance criteria for Phase 1:

- App runtime files unchanged.
- Documentation is easier to navigate.
- `npm test` passes.
- README points developers to the correct docs folders.

## Phase 2 — Legacy folder policy

This phase should reduce confusion without breaking compatibility.

1. Review `Legacy/` and identify which files are still needed only for historical reference.
2. Do not delete legacy files in this task.
3. Rename nothing in `Legacy/` unless tests and references are updated.
4. Add a `Legacy/README.md` explaining:
   - These files are not loaded by the current app.
   - They exist for historical reference and migration context.
   - Current runtime files live in `index.html`, `assets/`, `service-worker.js` and `api/`.
5. Update `tests/smoke.js` comments around legacy file checks so future agents understand why legacy files are read.
6. Confirm `index.html` still does not load `Legacy/assets/bias-extension.js`.
7. Run `npm test`.

Acceptance criteria for Phase 2:

- No legacy runtime file is loaded by the current app.
- Legacy files are documented.
- Tests still pass.

## Phase 3 — Add unit-test seam before refactoring app logic

Do not split `assets/app.js` yet. First extract or expose pure functions safely.

1. Identify pure logic inside `assets/app.js`, especially:
   - price parsing and validation
   - DOL distance calculation
   - price map level creation
   - risk-to-reward calculation
   - card normalisation
   - export schema validation
   - import validation
2. Add a testable seam without changing runtime behaviour.
3. Preferred safe options:
   - Extract pure logic into a new file under `assets/js/core/` only if it can be loaded without breaking current script order; or
   - Duplicate pure logic into a Node-testable helper under `tests/helpers/` only as a temporary safety net before full extraction; or
   - Expose selected pure helpers under a guarded test-only namespace such as `window.ICT_TEST_HELPERS` if running in a browser test environment.
4. Add unit tests under `tests/unit/`.
5. Add a new npm script:
   - `test:unit`
6. Update `npm test` so it runs smoke tests and unit tests.
7. Keep `npm run test:e2e` separate.

Acceptance criteria for Phase 3:

- Unit tests exist for critical pure logic.
- Existing smoke and E2E tests still pass.
- No visible app behaviour changes.
- No storage key changes.

## Phase 4 — CSS structure cleanup with compatibility preserved

Do not change the UI design in this phase. Only reorganise for maintainability.

1. Keep `assets/styles.css` as the runtime stylesheet for now.
2. Add clear section comments inside `assets/styles.css`:
   - Design tokens
   - Reset and base
   - App shell
   - Navigation
   - Forms
   - Cards
   - Planner
   - Price map
   - Saved cards
   - Focus card details
   - Profile and settings
   - Utilities
   - Legacy compatibility
3. Remove duplicate or dead selectors only if verified unused.
4. Do not move to multiple CSS files unless the service worker, `index.html`, smoke tests and version bump script are all updated together.
5. Run visual checks on mobile width and desktop width.
6. Run `npm test` and `npm run test:e2e`.

Acceptance criteria for Phase 4:

- CSS is easier to navigate.
- UI remains visually consistent.
- No stylesheet reference breaks.
- Tests pass.

## Phase 5 — Safe JavaScript modularisation plan

Only begin this phase after Phase 3 unit tests are in place.

Target structure over time:

```text
assets/
  config.js
  styles.css
  app.js                 # compatibility entrypoint until fully migrated
  js/
    core/
      constants.js
      storage.js
      cards.js
      price.js
      risk.js
      export-import.js
    services/
      price-api.js
      supabase-sync.js
    ui/
      router.js
      layout.js
      planner-view.js
      saved-view.js
      focus-card-view.js
      profile-view.js
      price-map-view.js
    main.js
```

Implementation rules:

1. Do not convert everything at once.
2. Extract one logical area at a time.
3. Start with pure helpers that are covered by unit tests:
   - price helpers
   - distance helpers
   - risk helpers
   - card normalisation helpers
4. Keep `assets/app.js` as the compatibility entrypoint until the full module path is stable.
5. If using ES modules, update `index.html`, `service-worker.js`, `tests/smoke.js`, `tools/bump-version.js` and `.github/workflows/pages.yml` in the same commit.
6. Do not break cache-busting query strings.
7. Do not remove the existing version constant until the version-bump script has a new stable target.
8. Do not alter route names unless every route and test is updated.
9. Do not alter localStorage keys unless migration tests exist.
10. Run all tests after each extracted module.

Acceptance criteria for Phase 5:

- App still loads from GitHub Pages.
- `index.html` still loads configuration before app logic.
- Service worker caches every runtime file that the app needs.
- `npm test` passes.
- `npm run test:e2e` passes.
- Manual app checks pass.

## Phase 6 — API separation review

Do not remove existing Vercel behaviour unless a safe replacement is tested.

1. Review `api/price.py`.
2. Keep `/api/price?symbol=MNQ` working.
3. Confirm CORS rules still allow:
   - GitHub Pages origin
   - current Vercel origin
   - local development origins
4. Consider whether static file serving inside `api/price.py` is still necessary.
5. If removing static file serving, confirm Vercel still serves the static app correctly through its own routing.
6. Add a simple Python or Node test that verifies unsupported symbols, missing symbols and successful response shape can be handled or mocked.
7. Do not make live yfinance calls in CI unless explicitly needed. Prefer mockable tests.

Acceptance criteria for Phase 6:

- Price API still works for supported symbols.
- Unsupported symbols return a clear error.
- Manual price input still works even if API fails.
- No secrets are exposed.

## Phase 7 — GitHub Actions and deployment hardening

1. Review `.github/workflows/pages.yml`.
2. Ensure the Pages artifact includes all required runtime files.
3. If assets are moved into nested folders, update the workflow copy commands.
4. Keep `.nojekyll` in the Pages artifact.
5. Review `.github/workflows/smoke.yml` and `.github/workflows/e2e.yml`.
6. Ensure CI runs:
   - smoke tests
   - unit tests
   - E2E tests
7. Do not deploy a changed file structure until CI is green.

Acceptance criteria for Phase 7:

- GitHub Pages deployment still works.
- Workflow paths match runtime file locations.
- No missing assets in deployed app.

## Phase 8 — README and contributor instructions

Update `README.md` and `AGENTS.md` after the safe structure is in place.

README should include:

- Current app entrypoints.
- Local development commands.
- Test commands.
- Deployment explanation.
- Data storage keys and migration warning.
- Supabase note.
- Price API note.
- Documentation map.

AGENTS.md should include:

- Required files to read before changes.
- Rules for not breaking storage compatibility.
- Rules for updating service worker cache keys.
- Rules for running tests.
- Rule to avoid big-bang refactors.

Acceptance criteria for Phase 8:

- New developers can understand the app quickly.
- Codex/agent workflow has clear instructions.
- Documentation reflects the actual structure.

## Final validation checklist

Before committing final changes, run:

```bash
npm ci
npm test
npm run test:e2e
```

Then manually validate:

1. App loads.
2. Home tab loads.
3. Planner tab loads.
4. Saved tab loads.
5. Journal tab loads.
6. Profile tab loads.
7. Planner allows draft save.
8. Planner allows focus plan generation.
9. Saved card opens.
10. Save changes works.
11. Final save works.
12. Export JSON works.
13. Import JSON works with existing schema.
14. Manual current price works.
15. Auto-detect price fails gracefully if unavailable.
16. App works while logged out of Supabase.
17. App does not lose existing localStorage data.
18. Service worker does not serve stale broken assets.
19. GitHub Pages workflow includes every required static asset.
20. README reflects the actual final structure.

## Commit guidance

Use small commits. Suggested commit order:

1. `docs: organise structure refactor guidance`
2. `docs: document legacy folder policy`
3. `test: add unit coverage for core app helpers`
4. `refactor: organise stylesheet sections without visual change`
5. `refactor: extract price and risk helpers safely`
6. `chore: update docs and agent instructions`

Do not combine all changes into one large commit.

## Important warnings

- The app relies on exact asset paths in `index.html`, `service-worker.js`, smoke tests and the version-bump tool.
- Moving `assets/app.js`, `assets/styles.css` or `assets/config.js` without updating all references will break the app.
- Service worker cache bugs can make the live app look broken even after code is fixed. Always bump cache keys if runtime assets change.
- Existing saved cards rely on current and legacy storage keys. Do not remove migrations.
- Supabase should remain optional; local-first behaviour must remain intact.
- Any structural change must be backed by tests before deeper refactoring.

## Expected final result

The repo should remain a working static app, but with clearer development structure, better documentation, safer legacy handling, stronger tests, and a pathway to gradually split the monolithic JavaScript and CSS without breaking the live app.
