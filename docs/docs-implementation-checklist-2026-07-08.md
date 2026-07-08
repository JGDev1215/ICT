# Remaining Docs Implementation Checklist - 2026-07-08

## Purpose

This file now tracks only items from the docs audit that are not implemented, not verified, or still need a product decision. Completed implementation notes were removed.

- Repository: `JGDev1215/ICT`
- Current implementation baseline: `ccd0da8`
- Source scope reviewed: `docs/**/*.md`
- App files considered: `index.html`, `assets/app.js`, `assets/styles.css`, `service-worker.js`, `api/price.py`, `README.md`, `CHANGELOG.md`, `tests/smoke.js`, `.github/workflows/*`

## Instructions

- Keep only open work in this file.
- When an item is implemented and verified, remove it from this checklist rather than marking it complete here.
- When an item is intentionally rejected or superseded, update the relevant source doc so it no longer reads as an active requirement, then remove it from this checklist.
- Treat manual/browser/mobile QA items as open until evidence is recorded in the relevant QA or release document.

## Release QA And Evidence

- [ ] Record manual iOS Safari QA results.
- [ ] Record manual Android Chrome QA results.
- [ ] Record PWA install QA results.
- [ ] Record offline/service-worker QA results.
- [ ] Mark the release checklist pass/fail in `docs/ui-redesign/08-qa-release-checklist.md`.
- [ ] Record keyboard-only navigation and focus-order QA.
- [ ] Record accessibility/ARIA QA beyond the current static smoke checks.
- [ ] Record cross-screen manual acceptance results for Home, Planner, Saved, Focus Card, Timeline, Liquidity Map, Risk, Journal, Profile, and Component Gallery.
- [ ] Record full reviewer/manager prompt outcomes in a completed release report.

## Product Decisions Needed

- [ ] Decide whether copy/text export should include legacy `biasValidation` and `biasInvalidation` text, or confirm those fields remain JSON compatibility data only.
- [ ] Decide whether Home session chips should filter content or remain non-filtering display chips.
- [ ] Decide whether screenshot support should remain metadata-only or become real screenshot/image handling.
- [ ] Decide whether Share-as-image should be implemented or remain deferred.
- [ ] Decide whether a beta feedback loop should be added, and if so define whether it is local-only, form-based, GitHub Issues-based, or out of scope.
- [ ] Decide whether the possible future `ict_dol_sweep_export_v8` schema is needed or whether `ict_dol_sweep_export_v7` remains the active schema.
- [ ] Decide whether a `LICENSE` file is required before wider beta/public release.

## Engineering Backlog

- [ ] Add visible numeric-bound validation for invalid price inputs such as zero where the current UI falls back to `N/A`.
- [ ] Improve sticky action keyboard reachability with a skip link, shortcut, or equivalent keyboard-accessible pattern.
- [ ] Decide and implement an `assets/app.js` modularization plan if the one-file IIFE is no longer acceptable.
- [ ] Extract hardcoded price API defaults from `assets/app.js` if runtime configuration should be centralized.
- [ ] Add a version-bump script if manual version/cache updates remain error-prone.
- [ ] Add Playwright or equivalent browser E2E tests if static smoke coverage is no longer sufficient.
- [ ] Run and record deeper browser automation for navigation, persistence, price API fallback, and responsive flows.

## Documentation Cleanup

- [ ] Update old `ict-framework.html` handover docs if the legacy single-file app is revived; otherwise label them clearly as historical/superseded.
- [ ] Resolve old handover conflicts where risk/R:R was marked out of scope but is now part of the app.
- [ ] Decide whether source-citation UI and monitoring-cadence chips from the old handover should be revived or formally retired.
- [ ] Resolve old Saved Setups tab requirements if still active: exact in-page `Planner/Saved` ARIA tablist, `setView()`, `updateSavedCount()`, `normalizeSlip()`, and the specified Markdown export shape.
- [ ] Resolve documentation drift around the current primary storage key `ict_cards_v078` versus old `ict_slips_v1` wording.
- [ ] Update early UI docs that still describe visible validation/invalidation textareas/cards as active requirements, or clearly mark those sections as superseded by the v0.8 workflow.
- [ ] Reconcile the prompt-pack reference to `06-manual-qa-checklist.md`; either create that file or update the docs to point to `08-qa-release-checklist.md`.
- [ ] Document whether branch/worktree history and multi-agent handoff evidence must be retained for this project.

## GitHub Housekeeping

- [ ] Review GitHub Issues `#4` to `#7`.
- [ ] Close, split, or update GitHub Issues `#4` to `#7` based on the current implementation state.
- [ ] Review stale PR `#3`.
- [ ] Close, update, or supersede stale PR `#3`.
