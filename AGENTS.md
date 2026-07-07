# AGENTS.md

Agent guidance for work in this repository.

## Scope and Constraints

- This is a static, no-build app: HTML, CSS, and plain JavaScript are the product surface.
- Browser storage is the source of truth. Do not introduce server-side saved-card storage unless explicitly requested.
- The only backend-like code is `api/price.py`, an optional Vercel Python Function for yfinance price lookup.
- Manual price entry must always work when live price lookup fails.
- Keep changes small and compatible with existing saved cards.

## Key Files

- `index.html`: app shell, version text, cache-busted JS/CSS references, service worker registration.
- `assets/app.js`: app state, normalization, localStorage migrations, routing, planner, saved cards, export/import, price helper calls.
- `assets/styles.css`: UI styling.
- `service-worker.js`: offline/static cache list. Bump this when asset URLs change.
- `api/price.py`: Vercel price endpoint and static-file serving for Vercel.
- `tests/smoke.js`: required static contract test.
- `README.md` and `CHANGELOG.md`: user-facing documentation and release notes.

## Storage Contract

- Current saved-card key: `ict_cards_v078`.
- Bias metadata key: `ict_bias_card_meta_v1`.
- Export schema: `ict_dol_sweep_export_v7`.
- Legacy migration keys: `ict_cards_v077`, `ict_cards_v076`, `ict_dol_sweep_cards_v2`, `ict_slips_v1`.
- Preserve normalized card fields for timestamps, market context, DOL/sweep records, markers, journal, risk, price snapshot, price history, active DOL, route evidence, and final-save analytics.
- Final hit-rate metrics must count only final-saved Hit/Miss outcomes. Breakeven and Read are tracked separately.

## Required Checks

Run before handoff after app, storage, cache, route, or API changes:

```bash
node tests/smoke.js
```

Use a local static server for manual checks:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Version and Cache Bumps

When shipping JS/CSS behavior changes:

1. Update cache-busted references in `index.html`.
2. Update `CACHE_NAME` and `STATIC_ASSETS` in `service-worker.js`.
3. Update `tests/smoke.js` assertions that pin those strings.
4. Update README/CHANGELOG version notes where relevant.

When changing data shape or keys:

1. Keep migrations from old keys.
2. Update export/import handling and schema documentation.
3. Add or adjust smoke fixtures for migration, normalization, import dedupe, and analytics.

## Price API Notes

- `api/price.py` supports `/api/price?symbol=...`, maps common futures/crypto aliases to yfinance symbols, and returns JSON with `symbol`, `yfSymbol`, `price`, `source`, `cached`, and `timestamp`.
- It uses `requirements.txt` for the pinned yfinance dependency and `vercel.json` to include static assets.
- GitHub Pages cannot run the Python function; Vercel can.
- If deployment domains change, review `ALLOWED_ORIGINS`, `HOSTED_PRICE_API_BASE`, and any `window.ICT_PRICE_API_BASE` override.

## Product Guardrails

- Educational planning tool only. Do not present outputs as financial advice or trade recommendations.
- Keep the planner deterministic and local-first.
- Do not remove backup/export paths; browser storage can be cleared by the user or device.
