# 09 - Four-Agent Manager Execution Pack

Date: 2026-07-08
Repo: `JGDev1215/ICT`
Base branch: `main`

## Purpose

Use one Manager Agent and four Codex agents to finish the outstanding ICT app work safely.

The app must remain:

- static HTML/CSS/vanilla JavaScript
- local-first with browser storage
- compatible with GitHub Pages
- educational and review-focused only

Do not add a framework, database, authentication, or trade-signal behaviour.

## Current Baseline

Current active files:

- `index.html`
- `assets/app.js`
- `assets/styles.css`
- `manifest.webmanifest`
- `service-worker.js`
- `api/price.py`
- `tests/smoke.js`

Legacy reference only:

- `Legacy/assets/bias-extension.js`

The legacy bias extension must not be loaded by `index.html`.

## Outstanding Work

Open work to verify and finish:

- Issue #4: build-plan gap review incorporated.
- Issue #5: tech decision record accurate.
- Issue #6: data fixtures and import validation.
- Issue #7: PWA, safe-area and component gallery.
- PR #3: divergent and stale. Do not merge as-is.

Some of this has already been completed on `main`. Agents must inspect current code before editing.

## Manager Agent

Branch:

`manager/finalise-ui-redesign-20260708`

Role:

Coordinate the four agents, review handoffs, prevent overlap, and merge in order.

Read first:

- `README.md`
- `CHANGELOG.md`
- `docs/ui-redesign/00-tech-decision.md`
- `docs/ui-redesign/06-build-plan-gap-review.md`
- `docs/ui-redesign/08-qa-release-checklist.md`
- `docs/ui-redesign/09-4-agent-manager-execution-pack.md`
- `tests/smoke.js`

Merge order:

1. Agent 1 - State and import validation.
2. Agent 2 - Design system and component gallery.
3. Agent 3 - PWA and offline polish.
4. Agent 4 - QA, docs and issue closure.

Manager gate after each merge:

- Run `node tests/smoke.js`.
- Review changed files.
- Confirm no active `assets/bias-extension.js` script has returned.
- Confirm saved-card migration/export/import still works.
- Confirm docs match real behaviour.

## Agent 1 - State, Fixtures and Import Validation

Branch:

`agent1/state-fixtures-import-validation-20260708`

Allowed files:

- `assets/app.js`
- `tests/smoke.js`
- `README.md`
- `CHANGELOG.md`
- `docs/ui-redesign/08-qa-release-checklist.md`

Tasks:

- Verify Issue #6 against current code.
- Strengthen fixtures for create, draft save, final save, export, clear test data, re-import, duplicate import, older duplicate import and invalid payloads.
- Confirm imported cards are normalised and deduplicated by id.
- Confirm invalid imports never wipe existing cards.
- Preserve `bias`, `biasValidation` and `biasInvalidation`.
- Do not redesign screens.

Done when:

- `node tests/smoke.js` passes.
- Export/import round trip preserves current and legacy fields.
- README/checklist match actual import behaviour.

## Agent 2 - Design System, Safe Area and Component Gallery

Branch:

`agent2/design-system-gallery-safe-area-20260708`

Allowed files:

- `assets/styles.css`
- `assets/app.js`
- `tests/smoke.js`
- `README.md`
- `CHANGELOG.md`
- `docs/ui-redesign/08-qa-release-checklist.md`

Tasks:

- Verify Issue #7 design requirements against current code.
- Add a component gallery route or internal developer screen.
- Gallery should preview buttons, chips, badges, cards, inputs, progress bars, timeline nodes, empty states and price map states.
- Strengthen safe-area CSS for iOS Safari, Android Chrome, sticky CTAs and PWA launch.
- Do not refactor state/data helpers.

Done when:

- Component gallery can be reached from the app.
- Smoke test checks gallery route and safe-area hooks.
- `node tests/smoke.js` passes.

## Agent 3 - PWA, Offline and Install Polish

Branch:

`agent3/pwa-offline-install-polish-20260708`

Allowed files:

- `index.html`
- `manifest.webmanifest`
- `service-worker.js`
- `favicon.svg`
- `assets/styles.css`
- `tests/smoke.js`
- `README.md`
- `CHANGELOG.md`
- `docs/ui-redesign/08-qa-release-checklist.md`

Tasks:

- Verify manifest completeness.
- Confirm service worker caches static shell assets.
- Confirm service worker bypasses `/api/` requests.
- Confirm navigation fallback is safe.
- Confirm obsolete bias extension is not cached.
- Improve offline/API-unavailable copy if required.
- Update PWA/install QA checklist.

Done when:

- PWA files are coherent and referenced correctly.
- Smoke test covers key manifest and service-worker rules.
- `node tests/smoke.js` passes.

## Agent 4 - QA, Documentation and Issue Closure

Branch:

`agent4/qa-docs-issue-closure-20260708`

Allowed files:

- `README.md`
- `CHANGELOG.md`
- `docs/ui-redesign/08-qa-release-checklist.md`
- `docs/ui-redesign/README.md`
- `tests/smoke.js`
- Small code fixes only if a test fails.

Tasks:

- Run final repo inspection after Agents 1-3 merge.
- Run `node tests/smoke.js`.
- Dry-run Home, Planner, Saved, Focus Card Details, Final save, Export JSON, Import JSON, Price Map, Profile and Component Gallery.
- Update QA checklist with pass/fail status.
- Recommend closing, updating or deferring Issues #4-#7.
- Recommend closing PR #3 if superseded.

Done when:

- Smoke test passes.
- Docs match real app behaviour.
- Issue/PR recommendations are clear.

## Standard Agent Handoff

Each agent must finish with:

```markdown
## Handoff - <Agent Role>

### Completed
- ...

### Files changed
- ...

### Tests run
- `node tests/smoke.js`

### Risks / gaps
- ...

### Next agent notes
- ...
```

## Startup Prompt For Each Agent

```text
You are working locally inside the JGDev1215/ICT repository.

Run first:

git checkout main
git pull origin main
node tests/smoke.js

Then read:

- README.md
- CHANGELOG.md
- docs/ui-redesign/00-tech-decision.md
- docs/ui-redesign/06-build-plan-gap-review.md
- docs/ui-redesign/08-qa-release-checklist.md
- docs/ui-redesign/09-4-agent-manager-execution-pack.md
- tests/smoke.js

Rules:

- Work only inside your assigned scope and branch.
- Keep the app static and local-first.
- Preserve saved-card migration, export/import, bias fields, final-save analytics, price map and optional price API fallback.
- Do not reintroduce active loading of the legacy bias extension.
- Do not add React, Vite, a backend database, auth, or a build step.
- Keep the app educational and review-focused only.
- Make small commits.
- Run `node tests/smoke.js` before handoff.

Now follow your assigned role instructions from `docs/ui-redesign/09-4-agent-manager-execution-pack.md`.
```

## Final Release Checklist

- [ ] Smoke test passes on final `main`.
- [ ] Browser dry run passes.
- [ ] Mobile safe-area reviewed.
- [ ] PWA install/offline reviewed.
- [ ] Import/export verified.
- [ ] Price map verified.
- [ ] README updated.
- [ ] CHANGELOG updated.
- [ ] Issues #4-#7 reviewed.
- [ ] PR #3 closed or marked stale.
