# Production Web And Mobile-Site QA - 2026-07-09

> Status: Current
> Last reviewed: 2026-07-09
> Source of truth: No

## Scope

Release-risk evidence for deployed v0.8.5 shell visibility plus local v0.8.6 automated web/mobile-site coverage.

## Production Shell Checks

Commands:

```bash
curl -sS https://ictict-lake.vercel.app/ | rg -n "ICT DOL Sweep Tracker|assets/(app|styles|config)\\.js|assets/styles\\.css|service-worker"
curl -sS https://jgdev1215.github.io/ICT/ | rg -n "ICT DOL Sweep Tracker|assets/(app|styles|config)\\.js|assets/styles\\.css|service-worker"
```

Results:

- Vercel `https://ictict-lake.vercel.app/`: PASS, title/footer reported `ICT DOL Sweep Tracker v0.8.5`; config, CSS, and app asset keys were `0.8.5-audit-fixes-20260709`.
- GitHub Pages `https://jgdev1215.github.io/ICT/`: PASS, title/footer reported `ICT DOL Sweep Tracker v0.8.5`; config, CSS, and app asset keys were `0.8.5-audit-fixes-20260709`.

## Production Price Endpoint

Command:

```bash
curl -sS -D /tmp/ict-prod-price-v086.headers \
  'https://ictict-lake.vercel.app/api/price?symbol=MNQ' \
  -o /tmp/ict-prod-price-v086.json
```

Result: PASS. HTTP 200 returned JSON with `symbol: MNQ`, `yfSymbol: MNQ=F`, numeric `price`, `source: yfinance`, `cached: false`, and a UTC timestamp.

## Local Automated Web/Mobile-Site QA

Commands:

```bash
npm test
npm run test:e2e
```

Results:

- `npm test`: PASS. Smoke, unit, and API boundary tests passed.
- `npm run test:e2e`: PASS. 65 passed, 1 skipped. The skipped case is the existing Playwright WebKit offline reload limitation.

Coverage recorded by local automation:

- Mobile widths 390px and 430px keep bottom navigation and Planner sticky actions usable.
- Desktop width uses left sidebar navigation and labeled New analysis action.
- Home, Planner, Saved, Focus Card, Timeline, Liquidity Map, Risk, Profile, and Component Gallery routes render.
- Legacy `journal` route redirects to Home and no Journal nav item renders.
- Focus Card create/save/reload flows remain covered.
- Clear-device behavior remains local-only and clears local sync metadata.
- JSON import/export UI remains available.
- Manual price fallback remains available when auto-detect fails.
- Price Map DOL taken and DOL Stack DOL taken controls mirror one saved state.
- Potential R:R derives invalidation/stop from current/entry, selected DOL, direction, and ratio.
- Chromium offline service-worker shell reload remains covered; WebKit offline reload remains skipped as previously documented.

## Credential-Dependent QA

Live admin login and Supabase Account & Backup sync/reload were not performed because the admin password or an already-authenticated production browser session was not available in this run. This is a credential limitation, not a product failure.

## GitHub Issue

GitHub Issue `#7` was closed on 2026-07-09 as superseded by the current production web/mobile-site QA scope. Physical-device/PWA install gates are no longer required by the current repo docs.
