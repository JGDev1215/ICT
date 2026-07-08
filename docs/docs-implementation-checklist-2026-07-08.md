# Remaining Docs Implementation Checklist - 2026-07-08

## Purpose

This file tracks only items still open after the 2026-07-08 implementation and decision pass.

- Repository: `JGDev1215/ICT`
- Decision log: `docs/release-decision-log-2026-07-08.md`
- Current automated evidence: `npm test` and `npm run test:e2e` pass locally.

## External Release QA Still Required

Agent-assisted browser QA is recorded in `docs/release-qa-evidence-2026-07-08.md`. The remaining items require real devices or manual browser verification and cannot be completed from code alone.

- [ ] Record physical iOS Safari safe-area, Add to Home Screen, and offline/PWA QA results.
- [ ] Record physical Android Chrome install, file-picker/import, and offline/PWA QA results.
- [ ] Record full screen-reader audit if moving from beta to public release.
- [ ] Update `docs/ui-redesign/08-qa-release-checklist.md` with the physical device pass/fail evidence above.

## GitHub Housekeeping Still Required

- [ ] Keep GitHub Issue `#7` open until physical iOS/Android/PWA/offline release evidence is recorded.

## Completed By Agent-Assisted QA

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

See `docs/release-decision-log-2026-07-08.md` for benefit/cost reasoning.
