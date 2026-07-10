# Remaining Web And Mobile-Site QA Checklist - 2026-07-08

> Status: Current
> Last reviewed: 2026-07-10
> Source of truth: No


## Purpose

This file tracks only items still open after the 2026-07-08 implementation and decision pass. The app is intended to run on the web or via the mobile site; physical-device testing is not required.

- Repository: `JGDev1215/ICT`
- Decision log: `docs/release/release-decision-log-2026-07-08.md`
- Current automated evidence: `npm test` and `npm run test:e2e` pass locally.

## External Release QA Still Required

Agent-assisted browser QA is recorded in `docs/qa/release-qa-evidence-2026-07-08.md`. Remaining checks should be recorded from the deployed web/mobile-site experience.

- [x] Record v0.8.6 production web shell QA after deployment: visible version/assets on Vercel and GitHub Pages. See `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- [x] Record automated mobile-site browser QA at supported responsive viewport widths, including bottom navigation, Planner sticky actions, import/export usability, touch targets, and offline shell reload where supported by the browser test context. See `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- [x] Record credential-independent Supabase safety checks for project reachability, anon RLS write denial, and signed-out optional-backup behavior. See `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- [x] Record live admin login / Supabase Account & Backup sync QA with the real admin password. See `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- [x] Rotate the deployed Supabase admin password away from the weak/default value and verify old-password rejection plus rotated-password production backup smoke. See `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- [x] Record assistive-technology/browser accessibility follow-up if moving from beta to public release. Browser accessibility follow-up is covered by the Playwright release QA and v0.8.12 audit checks for skip link, focus styling, primary nav state, selected filter chips, lock screen access, and mobile responsive flows. Manual screen-reader testing remains a recommended external public-release check if the release process requires assistive-technology evidence.
- [x] Enable Supabase leaked-password protection before public release if the project plan supports it. Current Supabase docs state leaked-password protection is available on Pro plan and above; the connected `DSPredictor` organization is currently on the Free plan, so this gate is not applicable until the project plan is upgraded.

## GitHub Housekeeping Still Required

- [x] GitHub Issue `#7` was closed as superseded by the web/mobile-site QA scope on 2026-07-09.

## Completed By Agent-Assisted QA

- Live production price-provider endpoint QA for one supported symbol and one unsupported symbol is recorded in `docs/qa/live-price-provider-qa-2026-07-09.md`. A later shell check confirmed v0.8.6 is deployed on Vercel and GitHub Pages; see `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- Production browser smoke on v0.8.6 covered Vercel Focus Card create, reload, final-save, and saved-list visibility; see `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- Credential-independent Supabase checks confirmed anon writes are denied by RLS and signed-out Profile behavior keeps backup optional; see `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- Credentialed Supabase QA confirmed admin sign-in, backup upload, reload, second-browser restore, final-save sync, clear-device local-only behavior, and QA row cleanup; see `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- Admin password rotation confirmed old-password rejection, rotated-password sign-in, production backup smoke, and QA row cleanup; see `docs/qa/production-web-mobile-qa-2026-07-09.md`.
- v0.8.12 audit confirmed the remaining active-flow wording gap was corrected from Focus Card Details to Plan Review and that Supabase leaked-password protection is not supported by the current Free project plan; see `docs/qa/production-web-mobile-qa-2026-07-09.md`.
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
