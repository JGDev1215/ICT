# Remaining Docs Implementation Checklist - 2026-07-08

## Purpose

This file tracks only items still open after the 2026-07-08 implementation and decision pass.

- Repository: `JGDev1215/ICT`
- Decision log: `docs/release-decision-log-2026-07-08.md`
- Current automated evidence: `npm test` and `npm run test:e2e` pass locally.

## External Release QA Still Required

These require real devices or manual browser verification and cannot be completed from code alone.

- [ ] Record manual iOS Safari QA results.
- [ ] Record manual Android Chrome QA results.
- [ ] Record PWA install QA results.
- [ ] Record offline/service-worker QA results.
- [ ] Record accessibility/ARIA QA beyond smoke tests and the current Playwright keyboard skip-link check.
- [ ] Record cross-screen manual acceptance results for Home, Planner, Saved, Focus Card, Timeline, Liquidity Map, Risk, Journal, Profile, and Component Gallery.
- [ ] Update `docs/ui-redesign/08-qa-release-checklist.md` with the manual pass/fail evidence above.

## GitHub Housekeeping Still Required

- [ ] Keep GitHub Issue `#7` open or update it until manual iOS/Android/PWA/offline release evidence is recorded.

## Closed By This Pass

Implemented:

- Text export now includes legacy `biasValidation` and `biasInvalidation` lines.
- Home session chips filter the visible focus card and metrics.
- Beta feedback link added to Profile.
- MIT `LICENSE` added.
- Visible zero/non-positive price validation added.
- Planner sticky actions have a keyboard skip link.
- Price API defaults moved to `assets/config.js`.
- Version-bump helper added.
- Playwright browser E2E tests and workflow added.
- Missing `06-manual-qa-checklist.md` compatibility pointer added.

Rejected or deferred with reasons:

- Screenshot/image handling.
- Share-as-image.
- Export schema `ict_dol_sweep_export_v8`.
- `assets/app.js` modularization.
- Deeper destructive/network browser automation.
- Legacy `ict-framework.html` source-citation and monitoring-cadence UI.
- Legacy in-page Planner/Saved tablist plan.
- Branch/worktree handoff evidence as active release evidence.

See `docs/release-decision-log-2026-07-08.md` for benefit/cost reasoning.
