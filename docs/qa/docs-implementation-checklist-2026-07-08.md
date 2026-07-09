# Remaining Web And Mobile-Site QA Checklist - 2026-07-08

> Status: Current
> Last reviewed: 2026-07-09
> Source of truth: No


## Purpose

This file tracks only items still open after the 2026-07-08 implementation and decision pass. The app is intended to run on the web or via the mobile site; physical-device testing is not required.

- Repository: `JGDev1215/ICT`
- Decision log: `docs/release/release-decision-log-2026-07-08.md`
- Current automated evidence: `npm test` and `npm run test:e2e` pass locally.

## External Release QA Still Required

Agent-assisted browser QA is recorded in `docs/qa/release-qa-evidence-2026-07-08.md`. Remaining checks should be recorded from the deployed web/mobile-site experience.

- [ ] Record v0.8.5 production web QA after deployment: visible version/assets, admin login, Focus Card create/save/final-save/sync/reload, and clear-device behavior.
- [ ] Record mobile-site browser QA at supported responsive viewport widths, including bottom navigation, Planner sticky actions, import/export usability, touch targets, and offline shell reload where supported by the browser test context.
- [ ] Record assistive-technology/browser accessibility follow-up if moving from beta to public release.

## GitHub Housekeeping Still Required

- [ ] If GitHub Issue `#7` is still open, repurpose it from physical-device evidence to production web/mobile-site QA evidence, or close it if superseded.

## Completed By Agent-Assisted QA

- Live production price-provider endpoint QA for one supported symbol and one unsupported symbol is recorded in `docs/qa/live-price-provider-qa-2026-07-09.md`. The live app shell still reported v0.8.4 during that endpoint check, so v0.8.5 deployment UI QA remains open.
- Mobile Chrome emulation at 390px and 430px.
- Mobile Safari/WebKit emulation at 390px and 430px.
- Bottom nav and Planner sticky CTA visibility/tappability.
- Cross-screen rendering for Home, Planner, Saved, Focus Card, Timeline, Liquidity Map, Risk, Journal, Profile, and Component Gallery.
- Chromium/mobile Chrome offline service-worker shell reload.
- Accessibility/ARIA spot check for skip link, focus styling, primary nav state, and filter chip selected state.

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

See `docs/release/release-decision-log-2026-07-08.md` for benefit/cost reasoning.
