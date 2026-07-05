# Issue Fix Plan

This document captures the main fixes and improvements to make the ICT Framework easier to use, safer to maintain, and ready for deployment.

## Implementation Status

- **In progress** — P0 fixes are being implemented first in `index.html`.
- **Current pass** — Step 0 readiness clarity, incomplete-slip status, numeric validation, saved-slip capacity visibility, and import/export backup support.
- **Next pass** — deployment workflow, automated tests, file split, versioning, and PWA support.

## Priority Guide

- **P0** — must fix before wider use
- **P1** — important usability or reliability improvement
- **P2** — quality, maintainability, or future enhancement

## P0 — Core Workflow and Readiness

### 1. Clarify Step 0 completion logic

**Status:** In progress

**Problem**  
Step 0 captures market context, but the final readiness state mainly depends on the HTF draw, opposing sweep, entry model/MSS, and optional timing. This can make the market-context step appear important but not actually block readiness.

**Fix**

- Decide whether Step 0 is mandatory or purely contextual.
- If mandatory, require all phase rows or at least the traded timeframe plus one higher timeframe.
- If optional, rename it clearly as "Context" rather than a required setup step.
- Remove unused or confusing validation logic.

**Acceptance criteria**

- User can clearly see whether market context is required.
- Readiness state matches the visible workflow.
- No unused phase-completion logic remains.

### 2. Prevent incomplete or accidental saved slips

**Status:** In progress

**Problem**  
The app can save a slip before the setup is fully ready. This is useful for notes, but it risks saving incomplete records without warning.

**Fix**

- Add a warning when saving an incomplete slip.
- Add a saved status such as `draft` or `complete`.
- Consider disabling "Save slip" until minimum required fields are present.

**Acceptance criteria**

- Incomplete slips are clearly labelled.
- Complete slips can be filtered or identified later.
- User is not surprised by saved partial records.

### 3. Improve input validation for trade fields

**Status:** In progress

**Problem**  
Some price-level fields are sanitised, but other numeric fields such as risk, profit, and MSS level rely mainly on input pattern hints. This can lead to inconsistent R-multiple calculations.

**Fix**

- Apply consistent numeric sanitisation to all numeric fields.
- Support both decimal points and commas consistently.
- Show a validation message when risk/profit cannot calculate planned R.
- Permit explicit `N/A` only where it makes sense.

**Acceptance criteria**

- Planned R calculation handles valid numbers reliably.
- Invalid numeric input is corrected or clearly flagged.
- Risk/profit/MSS level behaviour is consistent with price-level fields.

## P1 — Usability and Data Management

### 4. Add import support for exported slips

**Status:** In progress

**Problem**  
Saved slips can be exported as text, but there is no import or restore flow.

**Fix**

- Add JSON export alongside plain-text export.
- Add JSON import with schema validation.
- Keep backward compatibility with `ict_slips_v1` records.

**Acceptance criteria**

- User can export a backup file.
- User can import the backup into another browser/device.
- Invalid imports are rejected safely with a clear message.

### 5. Add empty-state and storage-limit handling

**Status:** In progress

**Problem**  
The app stores up to 50 slips in localStorage. Storage failure is handled, but the user has limited visibility into storage limits or older slip removal.

**Fix**

- Show slip count, for example `12 / 50`.
- Warn when the list is near capacity.
- Explain that the oldest slips are removed when the limit is exceeded.

**Acceptance criteria**

- User can see saved-slip capacity.
- User understands what happens after 50 saved slips.

### 6. Improve mobile workflow clarity

**Status:** Planned

**Problem**  
The app is designed for mobile, but long forms can still feel dense on small screens.

**Fix**

- Add collapsible sections for completed steps.
- Keep the setup status visible without covering form controls.
- Add clearer "next action" prompts after each completed step.

**Acceptance criteria**

- On mobile, the user can move through the flow without excessive scrolling.
- The next required action is obvious.

## P1 — Deployment and Quality

### 7. Add GitHub Pages deployment configuration

**Status:** Planned

**Problem**  
The app is static and suitable for GitHub Pages, but there is no deployment documentation or workflow yet.

**Fix**

- Enable GitHub Pages from `main` branch root, or add a simple Pages workflow.
- Document the live URL once deployed.
- Add a deployment checklist.

**Acceptance criteria**

- A live app URL exists.
- README includes the production URL.
- Deployment steps are repeatable.

### 8. Add automated smoke tests

**Status:** Planned

**Problem**  
There are no automated tests. A small JavaScript change could break planner state, saving, copying, or tab navigation.

**Fix**

- Add Playwright or a lightweight browser-based test setup.
- Test the main user flow:
  - page loads
  - tabs switch
  - DOL selection derives bias
  - opposing sweep validates direction
  - model selection updates model card
  - save/load slip works
  - export button works

**Acceptance criteria**

- Tests can run locally with one command.
- Main planner flow has automated coverage.
- Future edits can be checked before commit.

## P2 — Maintainability

### 9. Split the single HTML file into smaller files

**Status:** Planned

**Problem**  
The app currently keeps HTML, CSS, and JavaScript in one file. This is simple for deployment but harder to maintain as the app grows.

**Fix**

Suggested structure:

```text
ICT/
├── index.html
├── assets/
│   ├── styles.css
│   └── app.js
├── data/
│   └── models.json
├── README.md
└── ISSUE_FIX_PLAN.md
```

**Acceptance criteria**

- CSS is moved to `assets/styles.css`.
- JavaScript is moved to `assets/app.js`.
- Entry-model reference data is isolated from UI logic.
- App still runs as a static site.

### 10. Move model-card data into structured data

**Status:** Planned

**Problem**  
Entry-model definitions are embedded directly inside the JavaScript. This makes updates harder and increases the chance of editing mistakes.

**Fix**

- Move model-card data into a JSON object or `data/models.json`.
- Add required fields: trigger, invalidation, target logic, source, prerequisite.
- Display source gaps consistently.

**Acceptance criteria**

- Model definitions can be edited without touching workflow logic.
- Missing source information is clearly marked.

### 11. Add versioning

**Status:** Planned

**Problem**  
The app has no visible version number or changelog.

**Fix**

- Add a visible app version in the footer.
- Add `CHANGELOG.md`.
- Update version when workflow or storage schema changes.

**Acceptance criteria**

- User can identify the running version.
- Changes are tracked clearly.

## P2 — PWA and Offline Use

### 12. Add proper PWA support

**Status:** Planned

**Problem**  
The app includes some mobile/PWA-style meta tags, but no full manifest or service worker.

**Fix**

- Add `manifest.webmanifest`.
- Add icons.
- Add optional service worker for offline cache.
- Confirm installability in Chrome/Edge/Safari where supported.

**Acceptance criteria**

- Browser recognises the app as installable where supported.
- App loads offline after first visit if service worker is enabled.

## Suggested Fix Order

1. Clarify Step 0 readiness logic.
2. Add incomplete-slip warning/status.
3. Improve numeric validation.
4. Add GitHub Pages deployment.
5. Add smoke tests.
6. Add import/export backup support.
7. Split CSS/JS into separate files.
8. Add versioning and changelog.
9. Add full PWA support.

## Definition of Done

A fix is complete when:

- the behaviour is clear to the user
- the app still works as a static site
- saved-slip data remains backward compatible
- the README is updated where needed
- the main planner flow is manually tested or covered by automated smoke tests
