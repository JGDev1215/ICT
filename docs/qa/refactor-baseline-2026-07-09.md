# Refactor Baseline - 2026-07-09

> Status: Current
> Last reviewed: 2026-07-09
> Source of truth: No

## Scope

Baseline evidence for the safe-refactor plan in `docs/plans/FINAL_SAFE_REFACTOR_IMPLEMENTATION_PROMPT_2026-07-09.md`.

This baseline was recorded after the v0.8.5 audit-remediation worktree was prepared, but before any JavaScript extraction or runtime file moves. The current runtime remains the flat no-build app:

- `index.html`
- `assets/config.js`
- `assets/styles.css`
- `assets/app.js`
- `service-worker.js`
- `api/price.py`

## Files Reviewed

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
- `tests/unit/run-tests.js`
- `playwright.config.js`
- `.github/workflows/pages.yml`
- `.github/workflows/smoke.yml`
- `.github/workflows/e2e.yml`

## Commands Run

```bash
npm ci
npm test
npm run test:e2e -- --reporter=dot
```

## Results

- `npm ci`: PASS, 4 packages installed/audited, 0 vulnerabilities.
- `npm test`: PASS.
  - `npm run test:smoke`: PASS, `Smoke test passed.`
  - `npm run test:unit`: PASS, `Unit tests passed.`
  - `npm run test:api`: PASS, 5 API boundary tests passed without live market calls.
- `npm run test:e2e -- --reporter=dot`: PASS, 56 passed, 1 skipped.

## Browser Flow Evidence

The Playwright suite starts a local static server and checks the current browser app across desktop Chromium, mobile Chrome emulation, and mobile Safari/WebKit emulation.

Covered by the current E2E suite:

- Home, Planner, Saved, Journal, Profile, Focus Card, Timeline, Liquidity Map, Risk, and Component Gallery screens render.
- Draft save is blocked when empty and works for meaningful partial drafts.
- Generate Focus Plan validates required inputs and opens Focus Card Details for complete plans.
- Saved cards persist across reload and can be opened.
- Save/final-save related flows remain covered by seeded-card and persistence tests.
- JSON import through the file input remains available and imports valid cards/settings best-effort.
- Manual price entry remains available when price auto-detect fails.
- Mocked price auto-detect success/failure flows preserve manual fallback.
- Supabase login remains optional; localStorage remains the immediate source of truth.
- Chromium/mobile Chrome offline app-shell reload is covered; Playwright WebKit offline reload remains skipped as previously documented.

## Refactor Readiness Decision

Baseline is acceptable for safe-refactor prerequisites through Phase 3 foundation work:

- No runtime files have been moved.
- Storage key `ict_cards_v078` and export schema `ict_dol_sweep_export_v7` remain unchanged.
- `npm test` now includes smoke, unit, and API boundary coverage.
- E2E remains separate and passing.

Do not begin Phase 5 JavaScript extraction until each extraction has its own approved no-feature plan and the same test gates remain green.
