# Docs Implementation Checklist - 2026-07-08

## Scope

This checklist audits every Markdown file under `docs/` against the current GitHub `main` state.

- Repository: `JGDev1215/ICT`
- Audited commit: `bc875e9`
- Source folder: `docs/`
- App files checked: `index.html`, `assets/app.js`, `assets/styles.css`, `service-worker.js`, `api/price.py`, `README.md`, `CHANGELOG.md`, `tests/smoke.js`, `.github/workflows/*`
- Verification observed during audit: `node tests/smoke.js` passed and `python3 -m py_compile api/price.py` passed.
- Implementation update: checklist fixes were applied on 2026-07-08 and are covered by expanded smoke tests where local verification is possible.

## Status Legend

- `DONE`: Document instructions are materially implemented.
- `PARTIAL`: Core work exists, but one or more checklist items remain open.
- `SUPERSEDED`: Document targets an older product shape and should be treated as historical unless revived.
- `PROCESS`: Prompt/process guide; not directly verifiable as app functionality.

## Summary

| Status | Count |
|---|---:|
| DONE | 2 |
| PARTIAL | 15 |
| SUPERSEDED | 2 |
| PROCESS | 2 |
| Total docs audited | 21 |

## Highest Priority Open Items

- [x] Resolve Planner completion logic versus current README/UI wording. Sweep completion now requires price level, liquidity/draw, and timeframe; confidence and hit time are optional context.
- [x] Decide whether Bias Validation and Bias Invalidation are intentionally retired or should return. They are retired from the visible v0.8 workflow and preserved only for compatibility/export.
- [x] Add a component gallery/internal design-system preview, or explicitly defer it and update the UI redesign docs.
- [x] Add visible draft autosave state such as "Autosaved locally" and a clear discard-draft action.
- [x] Add an in-app local-data backup reminder that points users to Export JSON.
- [ ] Record manual iOS Safari, Android Chrome, PWA install, and offline QA results.
- [x] Add a linked manifest with install icons or document that icon polish is deferred.
- [x] Update `CLAUDE.md` current app version from `v0.7.9` to `v0.8.0`.
- [x] Decide whether to keep `api/price.py` as API plus static file server or refactor Vercel static hosting/API separation as backlog. Decision: keep the static-file fallback for the Vercel Python entrypoint and treat deeper separation as backlog.
- [ ] Decide whether `assets/app.js` modularization, config extraction, version-bump script, and Playwright E2E are active roadmap or deferred.
- [ ] Review/close or split GitHub Issues `#4` to `#7` and stale PR `#3`. This cannot be proven from local files alone.

## Checklist By Document

### `docs/fix-lists/2026-07-07-am-session.md` - PARTIAL

- [x] App version/storage/schema alignment is materially implemented in `assets/app.js:4`.
- [x] Bias is part of the core normalized card fields in `assets/app.js:222`.
- [x] Legacy bias extension is not loaded by `index.html`; smoke test checks this in `tests/smoke.js:37`.
- [x] Saved, Focus Card, and mobile app routes exist in `assets/app.js:1454`.
- [x] Smoke tests cover real storage/export/import/route behavior beyond static syntax checks.
- [x] GitHub Pages now deploys `_site` only through `.github/workflows/pages.yml`.
- [x] Completion status does not require bias thesis; `comp()` now requires instrument plus complete DOL/sweep records only.
- [ ] Copy/text export includes bias but not legacy validation/invalidation text.
- [x] Component gallery exists and is reachable from Profile.
- [ ] PWA icons are added; manual mobile/PWA QA remains open.
- [ ] Accessibility still needs manual keyboard/focus validation beyond static checks.

### `docs/fix-lists/8-7 To fix.md` - PARTIAL

- [x] Comma-thousands price parsing is fixed in `assets/app.js:197`.
- [x] Price parsing edge cases are covered in `tests/smoke.js`.
- [x] Import/export round-trip, duplicate import, older duplicate import, and invalid import no-op are covered in `tests/smoke.js`.
- [x] Service worker asset fallback was fixed in `service-worker.js:27`; failed CSS/JS requests no longer receive `index.html`.
- [x] Planner draft autosave exists using `ict_planner_draft_v1`.
- [x] Global floating new-plan action exists in `assets/app.js:1473`.
- [x] Native share plus clipboard fallback exists in `assets/app.js:1997`.
- [x] Completion logic is aligned with README/current product copy. Sweep confidence and hit time are optional details.
- [x] Component gallery route exists.
- [x] Clear discard-draft UI exists.
- [x] In-app backup reminder exists in Profile beside the data tools.
- [ ] PR `#3` and Issues `#4`, `#6`, `#7` closure cannot be confirmed from local files.

### `docs/focus-card-dol-risk-implementation-report.md` - DONE

- [x] Focus Card creation/update timestamps exist in the normalized card model.
- [x] Price snapshot and price history exist.
- [x] Active DOL selector and DOL distance/status panel exist.
- [x] Route evidence log exists.
- [x] Potential R:R calculator exists and blocks invalid states.
- [x] Focus Card save behavior requires Save Changes or Final Save.
- [x] Smoke tests cover price map, active DOL, route evidence, and R:R.
- [x] Hosted price API domain/CORS note is materially wired through `assets/app.js` and `api/price.py`.

### `docs/plans/2026-07-08-six-agent-audit-remediation-plan.md` - PARTIAL

- [x] CR1 price sanitization is materially implemented.
- [x] CR4 planner draft autosave/restore is implemented.
- [x] CR5 hash route state and browser navigation are implemented.
- [x] CR7 profile/theme save protection is implemented.
- [x] CR8 risk defaults propagate into new focus cards.
- [x] CR9 planner defaults are applied when starting an empty draft.
- [x] CR10 localStorage quota failures now surface instead of reporting false success.
- [x] CR11 smoke tests were expanded.
- [x] CR13 duplicate/nested main landmark issue is resolved; `index.html` uses `div#app` and rendered app has one `main`.
- [x] CR16 hosted price API defaults and CORS were cleaned up for the current Vercel domain.
- [x] CR17 FVG toggle/timeframe dependency is implemented in Planner and Focus Card.
- [ ] CR2 numeric bounds are partial. Zero can still be entered, with percent/distance falling back to `N/A` rather than a visible validation warning.
- [x] CR3 incomplete Focus Plan generation is allowed as a draft; README documents that missing required inputs stay Draft.
- [ ] CR14 sticky action keyboard reachability is not fully addressed with a skip link or shortcut.
- [x] CR18 visible autosave state is implemented.
- [ ] Manual browser/mobile/PWA release gates are not recorded.

### `docs/plans/claude-improvement-plan.md` - PARTIAL

- [x] Smoke test no longer fails on a missing helper and passes locally.
- [x] GitHub Pages artifact is filtered to `_site`.
- [x] Root planning docs were moved under `docs/plans/`.
- [x] `AGENTS.md` and `CLAUDE.md` now exist.
- [x] Service worker navigation fallback is now network-first with offline `index.html` fallback.
- [x] `CLAUDE.md` current app version is `v0.8.0`.
- [ ] `assets/app.js` remains a large monolithic IIFE.
- [ ] Price API defaults remain hardcoded in `assets/app.js`.
- [x] Vercel still keeps static serving code in `api/price.py` by decision, with icons and core static files explicitly listed.
- [ ] No version-bump script exists.
- [ ] No Playwright E2E test exists.
- [ ] No `LICENSE` decision/file exists.

### `docs/plans/ict-framework-handover.md` - SUPERSEDED

- [x] Historical context is preserved.
- [x] Legacy `ict_slips_v1` remains in migration support.
- [ ] Current app no longer targets the old single-file `ict-framework.html` architecture.
- [ ] Current app includes risk/R:R features, which conflict with the old handover's "risk out of scope" note.
- [ ] Source-citation UI and monitoring cadence chips are not implemented in the current app.

Action: keep as historical handover unless `ict-framework.html` is revived.

### `docs/plans/issue-fix-plan.md` - PARTIAL

- [x] v0.7.8 storage, migration, final-save analytics, export/import, smoke, and deployment support are implemented.
- [x] v0.7.9 bias fields are preserved in normalized cards/export compatibility.
- [x] Static-site compatibility is preserved.
- [x] Optional backend collection remains unimplemented, as planned.
- [x] Visible Bias Validation and Bias Invalidation UI was intentionally removed in v0.8.0 and documented as compatibility-only data.
- [x] PWA service worker exists, the manifest is linked, and manifest icons are present.
- [ ] Deeper browser automation remains optional/open.

### `docs/plans/premium-mobile-app-ui-plan.md` - PARTIAL

- [x] Premium mobile-first layout is implemented in `assets/styles.css`.
- [x] Home, Planner, Saved, Focus Card, Timeline, Liquidity Map, Risk, Journal, and Profile routes exist.
- [x] Bottom navigation, global new-plan action, cards, chips, sticky CTA, settings, favorites, final-save analytics, export/import, and journal/risk fields exist.
- [x] Planner remains deterministic/local-only and does not call external AI.
- [x] No backend/auth/build system was added.
- [x] Component gallery exists.
- [x] Validation/invalidation are documented as compatibility-only data rather than central visible workflow.
- [ ] Screenshot support remains metadata-only.
- [ ] Manual real-device/PWA QA remains open.
- [ ] Export schema is still `ict_dol_sweep_export_v7`; the plan's possible future `v8` schema was not needed.

### `docs/plans/saved-setups-tab-update-plan.md` - SUPERSEDED

- [x] Saved setups, journal notes, load/delete/export behavior exist in the newer route model.
- [x] Legacy `ict_slips_v1` is migrated into the current storage model.
- [ ] Exact in-page `Planner/Saved` ARIA tablist was not implemented.
- [ ] `setView()`, `updateSavedCount()`, `normalizeSlip()`, and the specified Markdown export shape were not implemented.
- [ ] Current app uses `ict_cards_v078`, not `ict_slips_v1`, as the primary key.

Action: keep as historical if the current route-based Saved page is accepted.

### `docs/ui-redesign/00-tech-decision.md` - DONE

- [x] App remains vanilla/static with no frontend build step.
- [x] App remains browser-local and export/import portable.
- [x] Legacy bias extension is retained only as compatibility/reference and is not loaded.
- [x] Vercel Python price API exists as optional helper.
- [x] Smoke tests remain the deterministic contract gate.

### `docs/ui-redesign/01-implementation-plan.md` - PARTIAL

- [x] Static GitHub Pages-compatible app remains.
- [x] Main screens/routes are implemented.
- [x] Normalized card shape supports market context, favorites, journal, risk, route evidence, price snapshots, and settings.
- [x] Deterministic local "AI Trade Plan Builder" copy is implemented without real AI.
- [ ] Suggested module split was not implemented; one-file `assets/app.js` remains.
- [ ] Visible validation/invalidation textareas/cards were superseded by current v0.8.0 flow.
- [ ] Manual mobile/PWA QA remains outstanding.

### `docs/ui-redesign/02-design-system-spec.md` - PARTIAL

- [x] Light-first CSS tokens, Manrope font, Material Symbols, cards, buttons, chips, badges, form controls, bottom tab bar, sticky CTA, and FAB exist.
- [x] Safe-area CSS hooks exist for FAB/bottom navigation/sticky areas.
- [x] Dark theme exists and is selectable from Profile.
- [x] Component gallery/preview harness exists.
- [ ] Manual accessibility pass is not recorded.

### `docs/ui-redesign/03-screen-specs.md` - PARTIAL

- [x] Home screen exists.
- [x] AI Trade Plan Builder exists.
- [x] Focus Card Details exists.
- [x] Saved Focus Cards exists.
- [x] Execution Timeline exists.
- [x] Liquidity Map/Setup Library exists.
- [x] Risk Tracker exists.
- [x] Trade Journal exists.
- [x] Trader Profile/Settings exists.
- [x] Export/import and clear-local-data tools exist.
- [ ] Home session chips render but do not appear to filter content.
- [ ] Validation/invalidation UI from the early spec is not present.
- [ ] Screenshot gallery remains placeholder/metadata-only.
- [ ] Cross-screen manual acceptance criteria are not fully recorded.

### `docs/ui-redesign/04-agent-workstreams.md` - PARTIAL

- [x] State/data helpers and public test API exist.
- [x] Design system and mobile shell exist.
- [x] App shell and bottom navigation exist.
- [x] Planner, Saved, Focus Card, Timeline, Liquidity Map, Risk, Journal, and Profile exist.
- [x] QA smoke test covers routes and major data flows.
- [x] Component gallery workstream is implemented.
- [ ] Real-device/mobile/PWA QA workstream remains incomplete.
- [ ] Early validation/invalidation workstream content was superseded by current UI.

### `docs/ui-redesign/05-agent-prompt-pack.md` - PARTIAL

- [x] Most intended agent outcomes are reflected in code: local state, import/export, routing, final-save analytics, copy/share, PWA shell, and mobile screens.
- [x] App remains static/local-first and does not add backend/build dependencies.
- [ ] Prompt-specific manual QA checklist file named `06-manual-qa-checklist.md` does not exist; current checklist is `08-qa-release-checklist.md`.
- [x] Component gallery is implemented.
- [ ] Full reviewer prompt outcomes are not recorded in a completed release report.

### `docs/ui-redesign/06-build-plan-gap-review.md` - PARTIAL

- [x] Explicit stack decision exists.
- [x] Data fixtures/import validation were strengthened.
- [x] PWA/service worker exists.
- [x] Safe-area CSS exists.
- [x] Global floating plus action exists.
- [x] Silent planner draft autosave exists.
- [x] Text share/copy fallback exists.
- [x] Import validation prevents invalid imports from wiping existing cards.
- [x] Component preview/gallery requirement is implemented.
- [ ] Beta feedback loop is not implemented.
- [x] Visible autosave/unsaved status is implemented.
- [ ] Share-as-image remains deferred.
- [ ] Screenshot handling remains placeholder/metadata-only.
- [ ] Manual PWA install/offline QA remains open.

### `docs/ui-redesign/07-3-agent-codex-guide.md` - PROCESS

- [x] This document is a worktree/agent execution guide, not a direct app requirement.
- [x] Current code reflects many intended outcomes from the three-agent guide.
- [ ] Branch/worktree history cannot be proven from current app files.
- [x] Component gallery listed in the guide is implemented.

### `docs/ui-redesign/08-qa-release-checklist.md` - PARTIAL

- [x] Automated smoke gate passes.
- [x] Smoke covers app syntax, storage/schema references, normalized saved card shape, migration, export/import, final-save analytics, route rendering, manifest, service worker, and price API assumptions.
- [x] Product safety copy avoids financial advice/trade signal wording.
- [ ] Manual iOS Safari QA is not recorded.
- [ ] Manual Android Chrome QA is not recorded.
- [ ] PWA install/offline QA is not recorded.
- [ ] Release checklist is not marked pass/fail in the file.

### `docs/ui-redesign/09-4-agent-manager-execution-pack.md` - PARTIAL

- [x] Static/local-first/no-framework constraints are met.
- [x] Legacy bias extension is not loaded.
- [x] Issue `#5` tech-decision style work appears implemented.
- [x] Issue `#6` data fixtures/import validation appears largely implemented.
- [x] Issue `#7` PWA/safe-area work is partially implemented.
- [x] Component gallery portion of Issue `#7` is implemented locally.
- [ ] Final release checklist remains unchecked.
- [ ] Issue `#4` to `#7` and PR `#3` closure cannot be verified locally.

### `docs/ui-redesign/README.md` - PARTIAL

- [x] Documentation map exists and remains useful.
- [x] Implementation principle is materially reflected in current app: static, local-first, mobile-focused, no backend, no trade signals.
- [x] Most definition-of-done items are implemented.
- [ ] Manual release QA is still open.
- [x] Component gallery exists and validation/invalidation remain compatibility data, not visible primary UI.

### `docs/ui-redesign/START_HERE.md` - PROCESS

- [x] This is a local Codex prompt/process file, not a direct feature specification.
- [x] Current app follows its global constraints: static, local-first, no backend storage, no active legacy extension, smoke test passes.
- [ ] Process steps such as multi-agent branch usage and handoff format are not verifiable from app files.
- [ ] It still references PWA checks that require manual verification.

## Final Gate View

The implementation is suitable for continued beta testing, but the docs folder should not be marked fully complete. The app has implemented the core v0.8 mobile product, persistence, price-map, Focus Card, export/import, PWA shell, linked manifest/icons, component gallery, visible autosave state, backup reminder, and smoke-test baseline. The remaining gaps are concentrated in manual mobile/PWA release evidence, accessibility/browser automation evidence, GitHub issue/PR housekeeping, and deferred engineering roadmap decisions such as modularization and Playwright E2E.
