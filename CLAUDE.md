# CLAUDE.md

Contributor guidance for the ICT DOL Sweep Tracker.

## Project Shape

- Static, no-build browser app. The main files are `index.html`, `assets/config.js`, `assets/app.js`, `assets/styles.css`, `manifest.webmanifest`, and `service-worker.js`.
- No frontend package manager or bundler is required for normal runtime changes. `package.json` exists only for developer QA tooling such as Playwright.
- Browser data is local-only. Do not add backend persistence, auth, analytics beacons, or remote sync without an explicit product decision.
- `api/price.py` is the optional Vercel Python Function for yfinance price lookup. Manual price entry must remain usable when it is unavailable.
- Runtime price-helper defaults live in `assets/config.js`; keep manual price entry as the fallback.

## Runtime Contracts

- Current app version: `v0.8.10`.
- Current card storage key: `ict_cards_v078`.
- Bias metadata key: `ict_bias_card_meta_v1`.
- JSON export schema: `ict_dol_sweep_export_v7`.
- Legacy card keys currently migrated: `ict_cards_v077`, `ict_cards_v076`, `ict_dol_sweep_cards_v2`, and `ict_slips_v1`.
- Saved cards are normalized in `assets/app.js`; preserve compatibility fields even when UI copy no longer emphasizes them.
- Price snapshots and history are part of the saved-card shape. Save/edit/final-save paths should keep timestamps, price source, and price history coherent.

## Development Rules

- Keep the app usable from a static file server and GitHub Pages. Do not require a build step.
- Treat `tests/smoke.js` as the contract test for storage, migration, route rendering, export/import, cache references, and price API assumptions.
- Treat `tests/e2e/*.spec.js` as browser-flow coverage for route persistence, Planner, keyboard skip-link behavior, responsive/mobile regressions, ARIA state checks, and Chromium offline service-worker behavior.
- Update smoke coverage when changing storage keys, card shape, cache-busted asset URLs, service worker assets, export schema, routes, or price API behavior.
- Keep manual current-price entry as the fallback path. yfinance data may be delayed or unavailable.
- Preserve the educational-tool framing. Do not add predictive trade signals or financial advice wording.

## Version and Cache Checklist

When changing shipped JS/CSS behavior:

1. Update visible version references in `index.html` and docs/changelog as needed.
2. Prefer `node tools/bump-version.js vX.Y.Z release YYYYMMDD` for cache/version updates.
3. Change cache-busting query strings for `assets/config.js`, `assets/app.js`, and `assets/styles.css` in `index.html` if not using the helper.
4. Update `CACHE_NAME` and `STATIC_ASSETS` in `service-worker.js`.
5. Update matching expectations in `tests/smoke.js`.
6. Run smoke and relevant browser E2E tests before handoff.

Editing shipped JS/CSS without a matching cache-bust bump can strand service-worker clients on stale assets.

When changing stored data:

1. Keep old keys readable through migration.
2. Bump the export schema only for incompatible or meaningful schema changes.
3. Document the key/schema change in README or changelog.
4. Add smoke coverage for migration and export/import round trip.

## Local Checks

Run the app locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Run the smoke test:

```bash
node tests/smoke.js
```

Run browser E2E tests:

```bash
npm install
npm run test:e2e
```

Optional Vercel price API dependencies:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
```

## Deployment Notes

- GitHub Pages serves the static app only. It cannot run `api/price.py`.
- Vercel serves the optional price API at `/api/price?symbol=MNQ` and includes static files through `vercel.json`.
- `api/price.py` has a CORS allow-list and a short in-memory cache. Update both deliberately if deployment domains change.
- Its static-file serving branch is retained for local single-function testing; production Vercel static assets are served separately.
- If the Vercel production URL changes, update `assets/config.js` or set `window.ICT_PRICE_API_BASE` before `assets/app.js` loads for a one-off override.
