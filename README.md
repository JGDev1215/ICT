# ICT DOL Sweep Tracker

A lightweight browser-based ICT planning tool for one focused job:

1. Choose one instrument.
2. Define the Bias Determination For Session: Bullish or Bearish.
3. Record market context phases only for the timeframes chosen from the Phase Map dropdown.
4. Define up to three draws on liquidity.
5. Confirm up to three potential lower-timeframe sweep areas.
6. Optionally mark whether an FVG formed after the sweep.
7. Save the focus card.
8. Review, verify, final-save, export, and import saved cards.

> Educational tool only. This project does not provide financial advice, investment advice, or trade recommendations.

## Current Status

- App type: static HTML/CSS/JavaScript
- Build step: none
- Runtime dependencies: none
- Data storage: browser localStorage and sessionStorage
- Current app version: v0.8.0
- Main entrypoint: index.html
- Stylesheet: assets/styles.css
- App logic: assets/app.js
- Optional hosted price API: api/price.py for Vercel Python Functions
- Legacy compatibility file: Legacy/assets/bias-extension.js is retained but no longer loaded by index.html
- Deployment support: GitHub Pages workflow included

## Main Page

The redesigned main page is a mobile-first dashboard with:

- Bottom tab navigation for Home, Planner, Saved, Journal, and Profile.
- A planning prompt, session chips, and plan-assistant card.
- Today's focus card from the latest draft or saved plan.
- Review metrics based on final-saved cards.
- Watchlist preview from local Profile settings.

Saved cards can still be opened directly without going through the planner.

## Planner Flow

The planner is now the mobile AI Trade Plan Builder. It is deterministic and local-only: the assistant copy formats the workflow, but the app does not call an AI service, forecast price, or generate trade signals.

The planner captures:

1. Date, time, instrument, and session.
2. Current price / price at tool entry.
3. Bias Determination For Session: Bullish or Bearish.
4. Market Context phases and notes for only the timeframes the user chooses from the Phase Map dropdown.
5. Up to three draw-on-liquidity records using Price Level, Draw Rationale, and Timeframe Used.
6. Up to three potential sweep records using Price Level, Sweep Liquidity, and Timeframe Used, with optional Sweep Taken, confidence, and hit-time context.
7. FVG formation and timeframe.
8. Generated preview with DOL distance from the current price where numeric.
9. Save Draft or Generate Focus Plan.

Missing required inputs are shown as Draft, and the user can still save an incomplete draft card. Sweep confidence and hit time are optional detail fields and do not decide Complete/Draft status.

Current price can be entered manually. The app can also call an optional hosted yfinance price API on Vercel. Manual entry remains the fallback when the hosted API is unavailable.

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

For GitHub Pages or any other static host, set the API base explicitly before `assets/app.js` loads so auto-detect uses the current Vercel function:

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
- Integrate a compact Price Map into the Planner generated preview and the full Price Map into Focus Card Details.

The module uses `.price-map`, `.price-map-current`, `.price-map-row.dol`, `.price-map-row.sweep`, `.price-map-empty`, `.price-map-loading`, and `.price-map-error` hooks.

## Focus Card DOL Navigation

Focus Card Details now starts with the Price Map Dashboard, then an Active DOL panel, timestamp/price snapshot panel, potential risk-to-reward panel, and Route to DOL / PD array evidence log.

The Focus Card records:

- Created timestamp in New York time.
- Last edited timestamp in New York time.
- Price snapshot at creation.
- Latest saved price snapshot.
- Price history for created, saved-edit, and final-save events.
- Active DOL target.
- Route evidence for SIBI, BISI, CE, OB, FVG, highs, lows, and other arrays.
- Potential R:R to the selected DOL using entry/current price, target price, invalidation/stop, and direction.

Typing does not update the saved card. The user must press Save changes or Final save to capture edits, timestamps, price data, route evidence, and risk metrics.

Price data may be delayed by 5 minutes. Users can override price manually before saving.

## Bias Logic

The bias field is session-scoped. It is a planning label for the selected session, not a whole-day prediction.

- Bullish bias: seek a sell-side liquidity raid below an old low, then rejection or displacement higher toward buy-side liquidity.
- Bearish bias: seek a buy-side liquidity raid above an old high, then rejection or displacement lower toward sell-side liquidity.

Before 10:30am NY, full-day prediction is not supported by this tool.

Legacy saved `biasValidation`, `biasInvalidation`, `biasValidated`, and `biasInvalidated` data is preserved in JSON exports for migration compatibility, but those fields are no longer shown in the planner or Focus Card Details workflow.

## Saved Cards

The Saved tab includes search, filter chips, final-save metrics, export/import controls, and a local card list. Filters include Final Saved, Drafts, Hits, Misses, and Favorites.

Each saved card opens into a Focus Card Details screen with:

- Hero summary with instrument, session, date, bias, status, and outcome.
- Price snapshot with manual/static current price and DOL distance feedback.
- Market Context with selected timeframe phase, note, and potential next phase.
- DOL stack focused on Price Level, Draw Rationale, Timeframe Used, DOL Taken review status, and distance from current price, plus potential sweep stacks with timeframe and taken status.
- FVG and planned-risk fields.
- DOL respected marker.
- LTF sweep confirmed marker.
- FVG formed after sweep marker.
- Plan followed marker.
- Outcome selector: Open, Hit, Miss, Breakeven, Read
- Verification notes
- Journal lesson and behavior tags
- Load to planner
- Copy
- Share
- Save changes
- Final save
- Delete

Secondary screens are included for Execution Timeline, Liquidity Map / Setup Library, Risk Tracker, Trade Journal, and Trader Profile / Settings.

## Save Changes vs Final Save

Use Save changes to store edits locally without including the card in the final hit-rate sample.

Use Final save after selecting an outcome to mark the analysis as final. Only final-saved Hit/Miss cards enter the hit-rate calculation.

If a final-saved card is edited again and Save changes is used, the card returns to a non-final state until Final save is pressed again.

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

Data is not sent to a backend server. Clearing browser storage may remove saved cards, so users should use JSON export for backup.

The Profile page also includes a local-data backup reminder beside the Export JSON / Import JSON tools.

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

## Smoke Test

A lightweight static smoke test is included:

```bash
node tests/smoke.js
```

The test checks the main files, app syntax, bias extension syntax, storage keys, migration, normalized card shape including Market Context, export/import round trip, import deduplication, final-save analytics, and primary mobile routes.

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
│   ├── fix-lists/
│   ├── plans/
│   └── ui-redesign/
├── tests/
│   └── smoke.js
├── .github/
│   └── workflows/
│       ├── pages.yml
│       └── smoke.yml
├── requirements.txt
├── vercel.json
├── CLAUDE.md
├── CHANGELOG.md
├── AGENTS.md
└── README.md
```

## Known Limitations

- Hosted yfinance lookup is optional; manual price entry remains the primary fallback.
- Saved cards are browser-local only and are not synced across devices.
- Screenshot support is metadata-only for v1.
- The smoke test is static; it does not replace full browser automation or real-device QA.
- A linked PWA manifest and install icons are included, but iOS/Android responsive checks and PWA/offline install behavior still need manual verification before a public release.
