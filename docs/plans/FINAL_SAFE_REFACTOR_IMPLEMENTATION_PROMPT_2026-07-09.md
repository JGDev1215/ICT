# FINAL PROMPT FOR CODEX: Safe Refactor Implementation Plan

Copy and paste this entire prompt into Codex / Agent Mode inside the local `JGDev1215/ICT` repo.

---

You are working on the ICT DOL Sweep Tracker app in repository `JGDev1215/ICT`.

Your goal is to refactor the codebase structure safely, not redesign the product and not rewrite the app.

This app is currently a static HTML/CSS/JavaScript app with optional Supabase sync and an optional Vercel Python price API. The app must continue to work on GitHub Pages and must not lose existing local saved cards.

## Core objective

Improve the development structure so the app becomes easier to maintain, test and extend.

Do this by creating a safe refactor foundation, adding tests around core logic, documenting legacy files, and only then gradually extracting logic from the large `assets/app.js` file.

Do not do a big-bang refactor.

Do not convert the app to React, Next.js, Vite, TypeScript, Tailwind, Svelte, Vue, or any other framework.

Do not change the UI design unless the change is strictly necessary to preserve behaviour after refactoring.

## Current critical runtime files

Treat these files as production runtime files:

- `index.html`
- `assets/config.js`
- `assets/styles.css`
- `assets/app.js`
- `service-worker.js`
- `manifest.webmanifest`
- `favicon.svg`
- `icon-192.svg`
- `icon-512.svg`
- `api/price.py`
- `vercel.json`
- `requirements.txt`
- `.github/workflows/pages.yml`

Treat these as quality-control files:

- `package.json`
- `package-lock.json`
- `tests/smoke.js`
- `tests/e2e/*`
- `playwright.config.js`
- `.github/workflows/smoke.yml`
- `.github/workflows/e2e.yml`
- `tools/bump-version.js`

Treat these as developer/context files:

- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `CHANGELOG.md`
- `docs/**`
- `knowledge/**`
- `Legacy/**`

## Non-negotiable safety rules

1. Do not break the live app.
2. Do not change storage keys unless a tested backward-compatible migration is included.
3. Do not remove current legacy migrations in `assets/app.js`.
4. Do not remove local-first behaviour.
5. Do not require Supabase login for the app to work.
6. Do not remove manual price entry.
7. Do not require the price API to be available for the planner to work.
8. Do not remove GitHub Pages support.
9. Do not remove Vercel price API support.
10. Do not remove or expose secret/service-role keys.
11. Do not remove existing tests.
12. Do not move runtime files unless every reference is updated in the same commit.
13. Do not move `assets/config.js`, `assets/styles.css`, or `assets/app.js` in the first refactor pass.
14. Do not change the service worker cache behaviour without testing stale-cache risk.
15. Do not combine unrelated changes into one commit.

## Problem summary

The repo currently works, but development is becoming risky because:

- `assets/app.js` is a large monolithic file containing constants, state, routing, rendering, storage, price logic, Supabase sync, import/export and utilities.
- `assets/styles.css` is a large file containing tokens, base layout, components, page styles and compatibility styles.
- `Legacy/` is not clearly documented as historical-only.
- `docs/` contains mixed planning, release, QA and implementation documents.
- `knowledge/` contains useful ICT reference material but is not clearly explained.
- `api/price.py` mixes price API logic with static file serving behaviour.
- There are smoke/E2E tests, but not enough unit tests around pure business logic.
- `index.html`, `service-worker.js`, `tools/bump-version.js`, `tests/smoke.js`, and `.github/workflows/pages.yml` are tightly coupled to the current flat file paths.

## Required implementation method

Work in small phases.

After each phase:

1. Run the relevant tests.
2. Record what changed.
3. Confirm the app still opens.
4. Commit only if tests pass.

Do not move on to deeper code extraction until baseline tests and unit-test seams are in place.

---

# PHASE 0 — Baseline audit before changing anything

## Tasks

1. Read these files:
   - `README.md`
   - `AGENTS.md`
   - `CLAUDE.md`
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
   ```bash
   npm ci
   npm test
   npm run test:e2e
   ```
3. Record the baseline result in a new file:
   - `docs/qa/refactor-baseline-2026-07-09.md`
4. If a test fails before changes, document the failure and stop. Do not refactor around a broken baseline.

## Manual app check

Open the app locally and confirm:

- Home tab loads.
- Planner tab loads.
- Saved tab loads.
- Journal tab loads.
- Profile tab loads.
- A draft can be saved.
- A focus plan can be generated.
- A saved card can be opened.
- Save changes works.
- Final save works.
- Export JSON works.
- Import JSON remains available.
- Manual current price entry works.
- Auto-detect price fails gracefully if unavailable.
- Supabase login is optional.

## Acceptance criteria

- Baseline is documented.
- Tests are passing before refactor.
- No runtime files have been changed.

Suggested commit:

```bash
git add docs/qa/refactor-baseline-2026-07-09.md
git commit -m "docs: record refactor baseline"
```

---

# PHASE 1 — Documentation organisation without runtime change

This phase must not change app behaviour.

## Tasks

1. Ensure these folders exist:
   - `docs/developer/`
   - `docs/user/`
   - `docs/release/`
   - `docs/qa/`
   - `docs/plans/`
2. Do not move runtime files.
3. Do not move files if `tests/smoke.js` expects their current paths, unless the smoke test is updated in the same commit.
4. Move or copy documentation only where safe:
   - release notes / decision logs to `docs/release/`
   - QA evidence to `docs/qa/`
   - implementation plans to `docs/plans/`
   - developer instructions to `docs/developer/`
   - end-user notes to `docs/user/`
5. Add a `docs/README.md` with a documentation map.
6. Update `README.md` with a short documentation map linking to `docs/README.md`.
7. Preserve historical notes. Do not delete useful context.

## Tests

Run:

```bash
npm test
```

## Acceptance criteria

- Documentation is easier to navigate.
- Runtime files are unchanged.
- Smoke tests pass.

Suggested commit:

```bash
git add docs README.md
git commit -m "docs: organise project documentation map"
```

---

# PHASE 2 — Legacy folder policy without deleting legacy files

This phase must reduce confusion while preserving history.

## Tasks

1. Add `Legacy/README.md`.
2. State clearly:
   - Legacy files are not loaded by the current app.
   - They are retained for historical reference and migration context.
   - Current runtime is `index.html`, `assets/`, `service-worker.js`, `api/price.py`.
3. Confirm `index.html` does not load anything under `Legacy/`.
4. In `tests/smoke.js`, add comments explaining why legacy files are still inspected, if applicable.
5. Do not delete legacy files.
6. Do not rename legacy files in this phase.

## Tests

Run:

```bash
npm test
npm run test:e2e
```

## Acceptance criteria

- Legacy folder is clearly documented.
- No legacy file is loaded in current runtime.
- Tests pass.

Suggested commit:

```bash
git add Legacy/README.md tests/smoke.js
git commit -m "docs: document legacy folder policy"
```

---

# PHASE 3 — Add unit tests before extracting app logic

Do not split `assets/app.js` yet.

First add test coverage around core logic so later extraction is safe.

## Target functions / logic areas

Identify and protect these behaviours:

- price string parsing and validation
- rejection of invalid price values
- DOL distance calculation
- price map level construction
- sorting of price levels
- risk-to-reward calculation
- card normalisation
- export schema creation
- import schema validation
- legacy storage migration behaviour
- Supabase optional/offline queue behaviour where practical

## Safe implementation options

Choose the least risky option:

Option A — Preferred if low-risk:

- Extract pure logic to `assets/js/core/*.js`.
- Keep functions browser-compatible.
- Ensure `assets/app.js` still works as the entrypoint.
- If browser script loading needs adjustment, update `index.html`, `service-worker.js`, `tests/smoke.js`, and `tools/bump-version.js` in the same commit.

Option B — Safer first step:

- Add a temporary Node-testable helper under `tests/helpers/` that mirrors critical pure logic.
- Use this only to lock behaviour before extraction.
- Add a TODO to replace it with imported production helpers in the next phase.

Option C — Test-only export:

- Expose selected helpers through a guarded test namespace only when safe.
- Example: `window.ICT_TEST_HELPERS`.
- Do not pollute production UI.

## Required package changes

1. Add `tests/unit/`.
2. Add a simple Node-based unit test runner if no framework is needed.
3. Add scripts to `package.json`:
   - `test:smoke`
   - `test:unit`
   - `test:e2e`
4. Make `npm test` run smoke and unit tests.
5. Keep E2E separate because it is heavier.

Example target:

```json
{
  "scripts": {
    "test": "npm run test:smoke && npm run test:unit",
    "test:smoke": "node tests/smoke.js",
    "test:unit": "node tests/unit/run-tests.js",
    "test:e2e": "playwright test",
    "version:bump": "node tools/bump-version.js"
  }
}
```

## Tests

Run:

```bash
npm test
npm run test:e2e
```

## Acceptance criteria

- Unit tests exist.
- `npm test` includes smoke and unit tests.
- E2E still passes.
- No runtime behaviour changes.
- No storage key changes.

Suggested commit:

```bash
git add package.json package-lock.json tests assets/app.js
git commit -m "test: add unit coverage for core planner logic"
```

---

# PHASE 4 — CSS structure cleanup only

Do not redesign the app.

Do not split CSS files yet unless absolutely necessary.

## Tasks

1. Keep `assets/styles.css` as the only runtime stylesheet.
2. Add clear section comments:
   - Design tokens
   - Reset and base
   - App shell
   - Typography
   - Navigation
   - Buttons and chips
   - Forms
   - Cards
   - Planner
   - Price map
   - Saved cards
   - Focus card details
   - Journal
   - Profile/settings
   - Utilities
   - Legacy compatibility
3. Reorder CSS only where safe.
4. Do not remove selectors unless verified unused.
5. Do not change visual design.
6. Do not change class names used by JavaScript.

## Tests

Run:

```bash
npm test
npm run test:e2e
```

Manual visual check:

- Mobile width around 390px.
- Desktop browser width.
- Light theme.
- Dark theme if supported.
- Bottom nav.
- Planner form.
- Saved card details.
- Price map.

## Acceptance criteria

- CSS is easier to navigate.
- UI remains unchanged or materially identical.
- Tests pass.

Suggested commit:

```bash
git add assets/styles.css
git commit -m "refactor: organise stylesheet sections"
```

---

# PHASE 5 — First safe JavaScript extraction

Only start after Phase 3 unit tests exist and pass.

Do not convert the whole app at once.

## Target final structure over time

This is the target direction, not a one-commit requirement:

```text
assets/
  config.js
  styles.css
  app.js
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

## First extraction order

Extract only pure functions first:

1. Price parsing / validation helpers.
2. DOL distance helpers.
3. Risk calculation helpers.
4. Card normalisation helpers.
5. Export/import helpers.

Do not extract UI rendering first.

Do not extract routing first.

Do not extract Supabase sync first.

## Rules for extraction

1. Move one group of functions at a time.
2. Keep function outputs exactly the same.
3. Keep storage keys exactly the same.
4. Keep route names exactly the same.
5. Keep DOM IDs and class names exactly the same.
6. Keep `assets/app.js` as the compatibility entrypoint.
7. Do not switch to ES modules unless you update all affected files in the same commit:
   - `index.html`
   - `service-worker.js`
   - `tests/smoke.js`
   - `tools/bump-version.js`
   - `.github/workflows/pages.yml`
8. If using normal browser scripts instead of modules, load extracted helper files before `assets/app.js`.
9. Update the service worker static asset list if new runtime JS files are added.
10. Update cache-busting query strings if new runtime files are added.
11. Update `tools/bump-version.js` so future version bumps update all runtime JS file references.
12. Update smoke tests to assert every runtime JS file referenced by `index.html` is also cached by `service-worker.js`.

## Tests after each extraction

Run:

```bash
npm test
npm run test:e2e
```

Manual check:

- Planner still saves.
- Price map still calculates distances.
- Saved cards still open.
- Export/import still works.

## Acceptance criteria

- One pure logic group extracted.
- Tests pass.
- Manual app behaviour unchanged.
- Service worker caches the new runtime file if applicable.
- Version bump script still works.

Suggested first extraction commit:

```bash
git add assets tests index.html service-worker.js tools/bump-version.js
git commit -m "refactor: extract price helper logic safely"
```

---

# PHASE 6 — API boundary review

Do not break `/api/price`.

## Tasks

1. Review `api/price.py`.
2. Keep `/api/price?symbol=MNQ` working.
3. Keep existing supported symbol aliases unless intentionally expanded.
4. Keep manual fallback in the app.
5. Keep CORS support for:
   - GitHub Pages origin
   - current Vercel origin
   - local development origins
6. Add tests or checks for:
   - missing symbol
   - unsupported symbol
   - provider unavailable
   - successful response shape with mocked data where practical
7. Do not call live yfinance from CI.
8. Do not remove static file serving from `api/price.py` unless Vercel static serving is tested and routes are updated safely.

## Acceptance criteria

- `/api/price` remains compatible.
- Tests do not depend on live market data.
- Manual price entry still works without the API.

Suggested commit:

```bash
git add api tests README.md
git commit -m "test: add price api boundary coverage"
```

---

# PHASE 7 — Deployment and service worker hardening

This phase is required if any runtime asset paths change.

## Tasks

1. Review `index.html` runtime references.
2. Review `service-worker.js` cached files.
3. Review `.github/workflows/pages.yml` copied files.
4. Review `tools/bump-version.js` cache-key updates.
5. Review `tests/smoke.js` assertions.
6. Ensure every runtime asset referenced by `index.html` is:
   - present in repo
   - copied into GitHub Pages artifact
   - cached or intentionally excluded by service worker
   - covered by smoke tests
7. Ensure stale service worker caches are invalidated when runtime JS/CSS changes.

## Tests

Run:

```bash
npm test
npm run test:e2e
```

## Acceptance criteria

- GitHub Pages deployment path remains correct.
- Service worker does not serve stale broken assets.
- Smoke test guards asset-path consistency.

Suggested commit:

```bash
git add index.html service-worker.js tools/bump-version.js tests/smoke.js .github/workflows/pages.yml
git commit -m "chore: harden runtime asset deployment checks"
```

---

# PHASE 8 — Final documentation update

## Tasks

Update `README.md` with:

- App overview.
- Current runtime entrypoints.
- Local development commands.
- Test commands.
- GitHub Pages deployment explanation.
- Vercel API explanation.
- Supabase optional sync explanation.
- localStorage key warning.
- Legacy folder explanation.
- Documentation map.

Update `AGENTS.md` with:

- Files to read before changes.
- No big-bang refactor rule.
- Storage compatibility rule.
- Service worker/cache-busting rule.
- Required test commands.
- Manual QA checklist.
- Commit-size expectations.

Update `CHANGELOG.md` with a short refactor entry.

## Tests

Run:

```bash
npm test
npm run test:e2e
```

## Acceptance criteria

- README and AGENTS reflect actual structure.
- Future agents can follow the repo safely.
- Tests pass.

Suggested commit:

```bash
git add README.md AGENTS.md CHANGELOG.md docs
git commit -m "docs: update contributor guidance for safe refactor"
```

---

# Final validation before finishing

Run:

```bash
npm ci
npm test
npm run test:e2e
```

Then manually verify:

1. App loads from local static server.
2. App loads after hard refresh.
3. Home tab works.
4. Planner tab works.
5. Saved tab works.
6. Journal tab works.
7. Profile tab works.
8. Draft save works.
9. Generate Focus Plan works.
10. Saved card opens.
11. Save changes works.
12. Final save works.
13. Outcome update works.
14. Export JSON works.
15. Import JSON works with current schema.
16. Existing localStorage cards remain readable.
17. Manual price entry works.
18. Auto-detect price fails gracefully if API unavailable.
19. Supabase login is optional.
20. Service worker cache does not show broken stale assets.
21. GitHub Pages workflow includes all runtime assets.
22. README accurately describes the current structure.

# Deliverables expected from Codex

At the end, provide:

1. Summary of changed files.
2. Tests run and results.
3. Manual checks completed.
4. Any risks remaining.
5. Suggested next safe refactor step.

# Stop conditions

Stop immediately and report if:

- Baseline tests fail before changes.
- Local saved data becomes unreadable.
- The app needs Supabase login to work.
- GitHub Pages deployment path breaks.
- Service worker serves missing assets.
- Any runtime asset path changes without matching updates to `index.html`, `service-worker.js`, `.github/workflows/pages.yml`, `tests/smoke.js`, and `tools/bump-version.js`.

# Final instruction

Implement this plan conservatively. The correct outcome is a safer, better-structured codebase that still behaves like the current app. Refactor only when protected by tests. Do not optimise for speed. Optimise for not breaking the live trading planner.
