# 00 - Technical Decision

## Decision

Use the existing static HTML, CSS and vanilla JavaScript architecture for the v1 mobile UI redesign.

## Rationale

- The app is already deployable through GitHub Pages.
- Existing user data lives in browser localStorage and must remain portable.
- The current scope can be completed without a backend, package manager or build step.
- Avoiding a framework migration reduces data-loss and deployment risk during the redesign.
- The core v0.7.9 data model now lives in `assets/app.js`, so future agents should not reintroduce extension-based state patches.

## Approved Stack

- `index.html`
- `assets/styles.css`
- `assets/app.js`
- `manifest.webmanifest`
- `service-worker.js`
- Browser localStorage
- Optional hosted price endpoint through `api/price.py` on Vercel
- `tests/smoke.js` for deterministic smoke and data fixture checks
- `Legacy/assets/bias-extension.js` retained only for compatibility reference and smoke-test coverage; it is not loaded by `index.html`

## Not Approved For v1

- Backend database storage
- Authentication
- React, Preact, Vite or other build tooling
- Extension-based monkey patches to browser storage
- Trade-signal, forecasting or financial-advice features

## Trade-offs

- Staying static keeps deployment and data portability simple, but larger screens must be kept modular within `assets/app.js`.
- Avoiding a framework reduces migration risk, but agents must maintain clear helper boundaries and smoke-test coverage.
- Using browser storage protects the local-first model, but users still need export/import backups for portability.

## Rollback / Migration Implications

- Static files can be rolled back by reverting the relevant commit on `main`.
- Saved-card compatibility must be maintained through `normaliseCard`, `LEGACY` key migration and export/import schema handling.
- A future framework migration should only happen after the local-first data model, redesigned screens, export/import flow and QA baseline are stable.
