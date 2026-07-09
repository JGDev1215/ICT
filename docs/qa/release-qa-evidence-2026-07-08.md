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
- Skipped item: Playwright WebKit offline reload. This remains covered by physical Safari/PWA manual QA because Playwright WebKit can fail with an internal reload error while offline.

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

- Physical iOS/Android device safe-area and install behavior was not tested.

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

## Remaining Physical-Device Gates

These still require real devices or a manual browser session:

- Physical iOS Safari safe-area, Add to Home Screen, and offline/PWA behavior.
- Physical Android Chrome install prompt, file picker/import, and offline/PWA behavior.
- Full screen-reader audit for public release readiness.

## Beta Recommendation

Beta testing is acceptable with the current evidence, provided the remaining physical-device gates stay tracked as release follow-up work.
