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

- [x] Record v0.8.5 production web shell QA after deployment: visible version/assets on Vercel and GitHub Pages. See `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- [x] Record automated mobile-site browser QA at supported responsive viewport widths, including bottom navigation, Planner sticky actions, import/export usability, touch targets, and offline shell reload where supported by the browser test context. See `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- [ ] Record live admin login / Supabase Account & Backup sync QA with the real admin password or authenticated browser session.
- [ ] Record assistive-technology/browser accessibility follow-up if moving from beta to public release.

## GitHub Housekeeping Still Required

- [x] GitHub Issue `#7` was closed as superseded by the web/mobile-site QA scope on 2026-07-09.

## Completed By Agent-Assisted QA

- Live production price-provider endpoint QA for one supported symbol and one unsupported symbol is recorded in `docs/qa/live-price-provider-qa-2026-07-09.md`. A later shell check confirmed v0.8.5 is deployed on Vercel and GitHub Pages; see `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- Mobile Chrome emulation at 390px and 430px.
- Mobile Safari/WebKit emulation at 390px and 430px.
- Bottom nav and Planner sticky CTA visibility/tappability.
- Cross-screen rendering for Home, Planner, Saved, Focus Card, Timeline, Liquidity Map, Risk, Profile, and Component Gallery.
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
