# Release QA Evidence - 2026-07-08

> Status: Current
> Last reviewed: 2026-07-09
> Source of truth: No


## Scope

Agent-assisted beta release QA for the ICT DOL Sweep Tracker.

## Local Verification

Commands run from `/Users/soonjeongguan/Desktop/ICT`:

```bash
npm test
npm run test:e2e
```

Results:

- `npm test`: PASS, `Smoke test passed.`
- `npm run test:e2e`: PASS, 23 passed, 1 skipped.
- Browser matrix: desktop Chromium, mobile Chrome / Pixel 7, mobile Safari / WebKit iPhone 13.
- Skipped item: Playwright WebKit offline reload. This remains outside automated coverage because Playwright WebKit can fail with an internal reload error while offline; production web/mobile-site browser QA should record the supported offline behavior where practical.

## Agent Results

### Agent A - Mobile / PWA QA

Status: PASS for browser-emulated mobile/PWA evidence.

- `390px` mobile viewport: PASS.
- `430px` mobile viewport: PASS.
- Bottom nav and Planner sticky CTA do not overlap.
- `Save Draft` and `Generate Focus Plan` are tappable in mobile emulation.
- Main routes are reachable.
- Manifest and icons return HTTP 200.
- Service-worker registration exists.
- Offline app-shell reload works in Chromium/mobile Chrome.

Limitation:

- Production web/mobile-site browser behavior still needs post-deployment QA. Physical-device testing is not required for this app.

### Agent B - Accessibility / Keyboard QA

Status: PASS after remediation.

Finding fixed:

- Saved and Liquidity Map filter chips exposed selected state only visually. Added `aria-pressed` and test coverage.

Evidence:

- Planner skip link reaches sticky actions.
- Visible focus styles exist.
- Primary nav has `aria-label='Primary'`.
- Active primary tab uses `aria-current='page'`.
- Filter chips now expose `aria-pressed`.

Limitation:

- Full screen-reader audit remains outside current automated coverage.

### Agent C - Cross-Screen Acceptance QA

Status: PASS.

Screens checked:

- Home
- Planner
- Saved
- Focus Card
- Timeline
- Liquidity Map
- Risk
- Journal
- Profile
- Component Gallery

Result:

- All requested screens rendered in desktop and mobile browser checks.
- No console/page errors were reported in the extra route sweep.

## Automated Coverage Added

Added `tests/e2e/release-qa.spec.js`.

It covers:

- 390px and 430px mobile viewport layout.
- Bottom nav and Planner sticky CTA visibility.
- Input focus on mobile layout.
- All primary and secondary screen rendering with a seeded Focus Card.
- Saved and Liquidity Map filter chip `aria-pressed` state.
- Service-worker offline app-shell reload in Chromium/mobile Chrome.

Updated `playwright.config.js` to include:

- `chromium-desktop`
- `mobile-chrome`
- `mobile-safari`

## Remaining Web And Mobile-Site QA

These still require production browser evidence beyond this local automated pass:

- Deployed v0.8.5 web QA for version/assets, admin login, Focus Card create/save/final-save/sync/reload, and clear-device behavior.
- Mobile-site browser QA at supported responsive viewport widths for navigation, sticky actions, import/export usability, touch targets, and offline shell reload where supported by the browser test context.
- Assistive-technology/browser accessibility follow-up for public release readiness.

## Production Price Provider QA

Recorded separately in `docs/qa/live-price-provider-qa-2026-07-09.md`.

Result: PASS for production endpoint behavior with one supported symbol and one unsupported symbol. The live app shell still reported v0.8.4 during that endpoint check, so v0.8.5 deployment UI QA remains open.

## Beta Recommendation

Beta testing is acceptable with the current evidence, provided the remaining production web/mobile-site QA items stay tracked as release follow-up work.
