# ICT DOL Sweep Tracker

A lightweight browser-based ICT planning tool for one focused job:

1. Choose one instrument.
2. Choose the session and enter the current/tool-entry price.
3. Define up to three draws on liquidity.
4. Confirm up to three potential lower-timeframe sweep areas.
5. Save the focus card.
6. Review, verify, final-save, export, and import saved cards.

> Educational tool only. This project does not provide financial advice, investment advice, or trade recommendations.

## Current Status

- App type: static HTML/CSS/JavaScript
- Build step: none
- Runtime dependencies: no build-time bundle; optional Supabase JS is loaded from CDN for Account & Backup
- Dev QA dependencies: Playwright, installed only through `npm install`
- Data storage: browser localStorage/sessionStorage with optional Supabase server sync for Focus Cards
- Current app version: v0.8.12
- Main entrypoint: index.html
- Runtime config: assets/config.js
- Stylesheet: assets/styles.css
- App logic: assets/app.js
- Optional hosted price API: api/price.py for Vercel Python Functions
- Legacy compatibility file: Legacy/assets/bias-extension.js is retained but no longer loaded by index.html
- Deployment support: GitHub Pages workflow included
- License: MIT

## Main Page

The redesigned main page is a mobile-first dashboard with:

- Mobile bottom navigation for Home, Planner, Saved, and Profile, with a desktop sidebar at wider widths.
- A planning prompt, session-filter chips, and plan-assistant card.
- Today's focus card from the latest draft or saved plan.
- Review metrics based on final-saved cards.

Saved cards can still be opened directly without going through the planner.

## App Access

The app is protected by a device-local 4-digit passcode gate. The default passcode is `5880` until changed from Profile. This is a convenience gate for the private single-user static app; it is separate from Account & Backup and is not exported or synced to Supabase.

## Planner Flow

The Planner is deterministic and local-only: it formats DOL and Sweep inputs for Plan Review, but the app does not call an AI service, forecast price, or generate trade signals.

The planner captures:

1. Date, time, instrument, and session.
2. Current price / price at tool entry.
3. Up to three draw-on-liquidity records using Price Level, Draw Rationale, and Timeframe Used.
4. Up to three potential sweep records using Price Level, Sweep Liquidity, and Timeframe Used, with optional Sweep Taken, confidence, and hit-time context.
5. Plan preview with DOL distance from the current price where numeric.
6. Save Draft or Review Plan.

Missing required inputs are shown as Draft, and the user can still save an incomplete draft card after adding at least one meaningful planning input. Completely empty/default-only Planner saves are blocked to prevent accidental blank Focus Cards. Sweep confidence and hit time are optional detail fields and do not decide Complete/Draft status.

Review Plan validates the minimum Focus Card inputs before opening Plan Review: instrument, session, at least one complete DOL row, and either a valid current price or explicit acknowledgement that manual price is needed. Partial DOL or Sweep rows must be completed or cleared before review.

Current price can be entered manually. The app can also call an optional hosted yfinance price API on Vercel. Manual entry remains the fallback when the hosted API is unavailable or the symbol is unsupported. Zero, negative, malformed, scientific-notation, ambiguous, stale/unusable API responses are rejected for price-map math.

Use `Auto-detect price` in the Planner after the Vercel API is deployed.

## Hosted Price API

GitHub Pages serves the static frontend and cannot run Python or yfinance server-side. The optional hosted price lookup is implemented as a Vercel Python Function at:

```text
api/price.py
```

The endpoint accepts:

```text
/api/price?symbol=MNQ
```

And returns:

```json
{
  "symbol": "MNQ",
  "yfSymbol": "MNQ=F",
  "price": 22450.25,
  "source": "yfinance",
  "cached": false,
  "timestamp": "2026-07-07T20:10:00Z"
}
```

The API includes a short in-memory cache and a CORS allow-list for the current hosted/static deployment path:

- `https://ictict-lake.vercel.app`
- `https://ict-2mrz.vercel.app`
- `https://jgdev1215.github.io`
- `localhost:8000`
- `localhost:8888`
- `127.0.0.1:8000`
- `127.0.0.1:8888`

Same-origin Vercel use does not need a cross-origin fallback. When the app is opened from the current Vercel deployment, the frontend resolves the price helper to:

```text
https://ictict-lake.vercel.app/api/price
```

For GitHub Pages or any other static host, update `assets/config.js` so auto-detect uses the current Vercel function:

```js
window.ICT_CONFIG = Object.assign({
  hostedPriceApiBase: 'https://ictict-lake.vercel.app/api/price',
  localPriceApiBase: 'http://127.0.0.1:8765/price',
  priceTimeoutMs: 8000,
  priceRefreshSeconds: 30
}, window.ICT_CONFIG || {});
```

The local `127.0.0.1:8765` helper is used only from localhost, `127.0.0.1`, file-based local testing, or an explicit local fallback override. Production HTTPS pages skip that fallback and keep manual price entry available.

For one-off embeds, the legacy override still works when it is defined before `assets/app.js` loads:

```html
<script>
window.ICT_PRICE_API_BASE = 'https://ictict-lake.vercel.app/api/price';
</script>
```

Requests without an `Origin` header receive wildcard CORS for direct/no-origin clients such as curl or local tooling; browser requests must come from an allowed origin. Manual price entry remains the fallback.

Deploy the API to Vercel:

```bash
npm i -g vercel
vercel login
vercel --prod
```

yfinance is unofficial, not affiliated with Yahoo, and intended here for educational/research use only. For trading-critical or commercial use, replace it with a licensed market-data provider.

## Supabase Focus Card Sync

Focus Cards can be synced to Supabase while keeping localStorage as the immediate offline/cache layer.

Supabase project:

```text
ICT / cdcqklvvswzipmmvpzaj
https://cdcqklvvswzipmmvpzaj.supabase.co
```

The app uses:

- `public.focus_cards` for saved Focus Cards.
- `public.user_settings` for profile/settings sync.
- Single-user 4-digit PIN sign-in from the Profile tab, backed internally by Supabase Auth.
- Row Level Security so each authenticated user can only access their own rows.
- Explicit authenticated-role grants for browser Data API access.

The frontend includes Supabase JS v2 from jsDelivr. The browser-safe Supabase publishable key is configured in `index.html` before `assets/app.js` loads:

```html
<script>
window.ICT_SUPABASE_ANON_KEY = 'sb_publishable_...';
</script>
```

Optional project URL and admin backing-email overrides:

```html
<script>
window.ICT_SUPABASE_URL = 'https://cdcqklvvswzipmmvpzaj.supabase.co';
window.ICT_ADMIN_SUPABASE_EMAIL = 'admin@ict.local';
</script>
```

Never expose the Supabase service-role key in the browser. See `docs/plans/supabase-focus-card-storage-plan.md` for the schema and validation checklist.

The visible Profile login is intentionally single-user: the user enters a 4-digit PIN, and the app maps that PIN to the backing Supabase Auth email `admin@ict.local` by default. Because this is a static frontend, the PIN is a convenience gate for a private single-user app, not production-grade access control.

Current builds present this as Account & Backup instead of exposing Supabase project details. The app still keeps cards local-first, and if the backing account has no server cards while the browser already has local Focus Cards, Profile asks whether to back up those local cards or keep them on this device.

## Price Map Ladder

The Price Map ladder is the visual price display for mapped liquidity. It uses the existing planner and saved-card fields rather than a new data model.

The ladder shows:

- Show instrument, session, last updated time, current price, and price source from manual entry or the optional yfinance helper.
- Sort mapped levels by price and place a strong CURRENT PRICE divider between levels above and below the tool-entry price.
- Render DOL and Sweep rows with kind, draw rationale, price level, timeframe used, taken/pending status, and distance in points and percent from current price.
- Style DOL levels above current price, DOL levels below current price, Sweep levels, and Taken levels distinctly.
- Include an empty state when no current price or mapped levels exist.
- Include a loading state while yfinance price is being fetched.
- Include an error state if live price is unavailable, while allowing manual price entry to remain usable.
- Integrate a compact Price Map into the Planner Plan preview and the full Price Map into Plan Review.

The module uses `.price-map`, `.price-map-current`, `.price-map-row.dol`, `.price-map-row.sweep`, `.price-map-empty`, `.price-map-loading`, and `.price-map-error` hooks.

## Plan Review

Plan Review starts with the Price Map Dashboard, then timestamp/price snapshot tools, DOL/Sweep review stacks, trade highlights, outcome, and review notes.

The Focus Card records:

- Created timestamp in New York time.
- Last edited timestamp in New York time.
- Price snapshot at creation.
- Latest saved price snapshot, with Manual override or Live auto-update mode while editable.
- Price history for created, saved-edit, and final-save events.
- DOL and Sweep records, including DOL/Sweep taken status.
- Outcome, DOL respected, LTF sweep confirmed, plan followed, and review notes.

Typing does not update a draft card. The user must press Save changes or Final save to capture edits, timestamps, price data, review markers, outcome, and notes. Live price mode updates the visible review price while the card is open, but saved price history changes only when the user saves.

After Final save, the card is locked. Locked final cards are view/copy/share/export only and cannot be edited, deleted, favorited/unfavorited, loaded back into Planner, overwritten by import, or changed by saved-card helper actions.

Price data may be delayed by 5 minutes. Users can override price manually before saving.

## Legacy Bias Data

Bias Determination, Market Context, FVG, route-evidence, active-DOL, and potential-risk data from older saved cards is preserved in local storage, JSON export, and JSON import for migration compatibility. These fields are no longer shown in the active Planner or Plan Review workflow.

## Saved Cards

The Saved tab includes search, filter chips, final-save metrics, export/import controls, and a local card list. Filters include Final Saved, Drafts, Hits, Misses, and Favorites.

Each saved card opens into a Plan Review screen with:

- Hero summary with instrument, session, date, status, and outcome.
- Price snapshot with manual/static current price and DOL distance feedback.
- DOL stack focused on Price Level, Draw Rationale, Timeframe Used, DOL Taken review status, and distance from current price, plus potential sweep stacks with timeframe and taken status.
- DOL respected marker.
- LTF sweep confirmed marker.
- Plan followed marker.
- Outcome selector: Open, Hit, Miss, Breakeven, Read
- Verification notes
- Copy
- Share
- Load to planner, Save changes, Final save, and Delete for draft/non-final cards only

Secondary screens are included for Execution Timeline, Liquidity Map / Setup Library, and Trader Profile / Settings. Legacy Risk and Journal routes redirect to Home.

## Save Changes vs Final Save

Use Save changes to store draft/non-final edits locally without including the card in the final hit-rate sample.

Use Final save after selecting an outcome to mark the analysis as final and locked. Only final-saved Hit/Miss cards enter the hit-rate calculation.

Final-saved cards cannot be altered after locking. To make a new version, create a new Planner card.

## Final Hit-Rate Data

The Saved Cards page shows:

- Final hit rate
- Final Hit/Miss sample size
- Final Breakeven count
- Needs final save count

Hit rate uses only cards that have been final-saved with a Hit or Miss outcome. Breakeven is tracked separately.

## Data Verification and Backup

The Saved Cards page includes:

- Verify data
- Export text
- Export JSON
- Import JSON

The v0.8.0 JSON export schema is:

```text
ict_dol_sweep_export_v7
```

Current saved cards are stored under:

```text
ict_cards_v078
```

Bias metadata is stored under:

```text
ict_bias_card_meta_v1
```

The app migrates older browser-local cards from:

```text
ict_cards_v077
ict_cards_v076
ict_dol_sweep_cards_v2
ict_slips_v1
```

Data is local-first in the browser. If Account & Backup is enabled and the user signs in, Focus Cards and settings can sync to Supabase; otherwise the app remains usable without backend access. Clearing browser storage may remove local saved cards, so users should use JSON export for portable backup.

The Profile page also includes a local-data backup reminder beside the Export JSON / Import JSON tools. `Clear this device data` removes cards, settings, planner drafts, local backup session state and pending sync metadata from the current browser only. It does not delete Supabase cloud backup; signing in again can restore backed-up Focus Cards.

JSON imports preserve compatibility with `ict_dol_sweep_export_v7`. Files with another schema are imported best-effort when they contain valid cards, and the app shows a warning instead of blocking the import.

The Profile page includes a Beta feedback link to:

```text
https://github.com/JGDev1215/ICT/issues/new
```

## How to Run Locally

No installation is required for normal use.

```bash
git clone https://github.com/JGDev1215/ICT.git
cd ICT
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Tests

Run the fast local test suite:

```bash
npm test
```

`npm test` runs the static smoke suite, the Node unit helper suite, and the Python price API boundary suite:

```bash
npm run test:smoke
npm run test:unit
npm run test:api
```

The smoke test checks the main files, app syntax, retained legacy bias extension syntax, storage keys, migration, normalized card shape including legacy Market Context, export/import round trip, import deduplication, final-save analytics, service-worker/cache alignment, simplified Planner/Focus routes, and legacy route redirects. The unit helper suite protects core parsing, completion, distance, legacy risk-plan preservation, normalization, export/import, and price-map helper behavior before future refactors. The API boundary suite tests `/api/price` missing-symbol, unsupported-symbol, provider-unavailable, and mocked successful response behavior without live market calls.

## Browser E2E Tests

Playwright tests cover the core browser flows on desktop Chrome, mobile Chrome, and mobile Safari/WebKit emulation:

```bash
npm install
npm run test:e2e
```

The browser tests check Planner to Focus Card persistence, reload behavior, the Planner skip link, Home session filtering, 390px/430px mobile layout, cross-screen route rendering, filter-chip ARIA state, and Chromium offline service-worker shell reload.

## Version Bump Helper

Use the version helper when changing shipped JS/CSS behavior:

```bash
node tools/bump-version.js v0.8.1 release 20260708
```

It updates the visible app version, cache-busted asset URLs, service-worker cache name, and current-version docs.

## GitHub Pages Deployment

This repository includes a GitHub Pages workflow:

```text
.github/workflows/pages.yml
```

Recommended GitHub Pages setting:

- Source: GitHub Actions

## Project Structure

```text
ICT/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── favicon.svg
├── icon-192.svg
├── icon-512.svg
├── api/
│   └── price.py
├── assets/
│   ├── config.js
│   ├── app.js
│   └── styles.css
├── Legacy/
│   ├── ict-dol-sweep-tracker-v0.6.0.html
│   ├── ict-framework.html
│   ├── ict-framework-v2.html
│   └── assets/
│       ├── app-v0.7.7.js
│       └── bias-extension.js
├── docs/
│   ├── README.md
│   ├── archive/
│   │   ├── completed-fix-lists/
│   │   ├── historical-plans/
│   │   └── superseded-design/
│   ├── database/
│   ├── daily-reports/
│   ├── developer/
│   ├── implementation-reports/
│   ├── plans/
│   ├── qa/
│   ├── release/
│   └── user/
├── tests/
│   ├── api/
│   ├── unit/
│   ├── smoke.js
│   └── e2e/
├── .github/
│   └── workflows/
│       ├── e2e.yml
│       ├── pages.yml
│       └── smoke.yml
├── package.json
├── package-lock.json
├── playwright.config.js
├── requirements.txt
├── vercel.json
├── LICENSE
├── CLAUDE.md
├── CHANGELOG.md
├── AGENTS.md
└── README.md
```

## Known Limitations

- Hosted yfinance lookup is optional; manual price entry remains the primary fallback.
- Saved cards are local-first in the current browser. Account & Backup can optionally sync Focus Cards and settings through Supabase after sign-in; JSON export remains the portable manual backup.
- Screenshot support is metadata-only for v1.
- Automated browser coverage now exists, but production web and mobile-site browser QA should still be recorded after deployment.
- A linked PWA manifest and install icons are included. Browser-based offline/service-worker behavior should be verified for the supported deployment before a public release; physical-device testing is not required for this web/mobile-site app.
