# 00 - Technical Decision

## Decision

Use the existing static HTML, CSS and vanilla JavaScript architecture for the v1 mobile UI redesign.

## Rationale

- The app is already deployable through GitHub Pages.
- Existing user data lives in browser localStorage and must remain portable.
- The current scope can be completed without a backend, package manager or build step.
- Avoiding a framework migration reduces data-loss and deployment risk during the redesign.

## Approved Stack

- `index.html`
- `assets/styles.css`
- `assets/app.js`
- `assets/bias-extension.js`
- Browser localStorage
- Optional service worker for offline static caching
- `tests/smoke.js` for deterministic smoke and data fixture checks

## Not Approved For v1

- Backend services
- Authentication
- Database storage
- React, Preact, Vite or other build tooling
- Trade-signal, forecasting or financial-advice features

## Revisit Criteria

Consider a framework migration only after the local-first data model, redesigned screens, export/import flow and QA baseline are stable.
