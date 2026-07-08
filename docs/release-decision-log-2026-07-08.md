# Release Decision Log - 2026-07-08

## Scope

Decision pass for `docs/docs-implementation-checklist-2026-07-08.md`.

## Implemented

| Item | Decision | Benefit | Cost / Risk | Evidence |
|---|---|---|---|---|
| Text export legacy bias fields | Implemented | Preserves useful historical notes in copied/exported text without reintroducing old UI clutter. | Low. Compatibility fields already exist. | `assets/app.js`, `tests/smoke.js` |
| Home session chips | Implemented as filters | Makes Home metrics and focus card session-specific instead of decorative. | Low. State is local UI-only. | `assets/app.js`, `tests/smoke.js`, Playwright |
| Beta feedback loop | Implemented as GitHub Issues link | Gives beta testers a direct reporting path without adding backend forms or analytics. | Low. External GitHub dependency only. | Profile route, `tests/smoke.js` |
| LICENSE | Implemented as MIT | Clear reuse terms before wider beta/public sharing. | Low. Standard permissive license. | `LICENSE`, `tests/smoke.js` |
| Zero/non-positive price validation | Implemented | Prevents misleading price-map math and makes invalid zero levels visible. | Low. Preserves existing manual entry flow. | `priceValidationMessages`, `tests/smoke.js` |
| Sticky CTA keyboard reachability | Implemented with skip link | Keyboard users can jump to Planner actions. | Medium. Required router guard so in-page anchors do not conflict with hash routes. | `assets/app.js`, Playwright |
| Runtime price API config | Implemented in `assets/config.js` | Deployment-specific price defaults can change without editing the main app bundle. | Low. Legacy `window.ICT_PRICE_API_BASE` still works. | `assets/config.js`, `index.html`, `vercel.json`, smoke |
| Version-bump script | Implemented | Reduces release mistakes across visible version, cache keys, service worker, and docs. | Low. Narrow script with smoke coverage. | `tools/bump-version.js`, smoke |
| Browser E2E tests | Implemented with Playwright | Covers real browser persistence, route, keyboard, and responsive flows beyond static smoke. | Medium. Adds dev-only dependency and CI browser install time. | `package.json`, `playwright.config.js`, `tests/e2e/planner.spec.js`, `.github/workflows/e2e.yml` |
| Prompt-pack manual QA reference | Implemented compatibility pointer | Old docs stop pointing to a missing file. | Low. No runtime impact. | `docs/ui-redesign/06-manual-qa-checklist.md` |

## Deferred Or Rejected

| Item | Decision | Reason |
|---|---|---|
| Real screenshot/image handling | Deferred | Benefit is moderate, but cost is high because it needs storage limits, previews, import/export behavior, privacy wording, and mobile file handling. Metadata-only remains safer for beta. |
| Share-as-image | Deferred | Requires a render/export design and likely canvas or DOM-to-image dependency. Text/share already works; image export can be designed after beta feedback. |
| Export schema v8 | Rejected for this pass | No incompatible saved-data change was introduced. Keeping `ict_dol_sweep_export_v7` avoids unnecessary migration and import risk. |
| `assets/app.js` modularization | Deferred | The IIFE is large, but splitting it now has high regression risk. Added Playwright coverage first; modularization should be a separate refactor with no feature changes. |
| Deep browser automation beyond current E2E | Deferred | Current E2E covers the highest-risk flows. Price API network fallback and destructive local-data flows need isolated profiles/mocks and can be added later. |
| Legacy `ict-framework.html` source-citation UI | Retired | The current product is the v0.8 route-based app. Source-citation UI belongs only to the legacy file unless revived by explicit product decision. |
| Legacy monitoring-cadence chips | Retired | Not part of the current app workflow and no current user-facing requirement justifies reintroducing them. |
| Legacy in-page Planner/Saved tablist plan | Superseded | Current app uses route-based screens and bottom navigation; implementing `setView()`/`updateSavedCount()` would add obsolete architecture. |
| Branch/worktree handoff evidence retention | Retired as release evidence | README, CHANGELOG, tests, and release checklist are sufficient current evidence. Historical multi-agent guides are retained only as context. |

## External Release Gates Still Pending

These cannot be completed from the codebase alone:

- Manual iOS Safari real-device QA.
- Manual Android Chrome real-device QA.
- PWA install verification.
- Offline/service-worker verification in real browsers.
- Full accessibility audit beyond automated smoke and keyboard skip-link coverage.

Until those are recorded, the recommendation is beta testing only, not public release.
