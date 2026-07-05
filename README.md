# ICT Framework

A lightweight browser-based ICT setup planner for building a trade thesis around:

1. Higher-timeframe draw on liquidity
2. Opposing liquidity sweep
3. Optional timing context
4. Entry model and MSS confirmation
5. Setup summary, saved slips, and exportable journal notes

The current app is a single static HTML file: `index.html`.

> Educational tool only. This project does not provide financial advice, investment advice, or trade recommendations.

## Current Status

- App type: static HTML/CSS/JavaScript
- Build step: none
- Runtime dependencies: none
- Data storage: browser `localStorage`
- Main file: `index.html`
- Default branch: `main`

## Main Features

### Planner

The planner guides the user through a structured setup workflow:

- **Step 0 — Market Context**  
  Labels the current condition across key timeframes: Monthly, Weekly, Daily, 4H, 1H, and 15m.

- **Step 1 — HTF Draw on Liquidity**  
  Records up to three higher-timeframe liquidity objectives and derives a directional bias from the selected draw stack.

- **Step 2 — Sweep**  
  Records the lower-timeframe sweep of liquidity opposite to the higher-timeframe draw.

- **Step 3 — Timing**  
  Optional section for killzone, macro-window, or session timing context.

- **Step 4 — Market Confluence and Entry Model**  
  Records MSS context, selected entry model, entry note, risk amount, and profit amount.

### Saved Setups

Saved slips are stored locally in the browser and can be:

- loaded back into the planner
- marked as open, win, loss, or breakeven
- deleted
- exported as plain text

### Market Phases

The app includes a market-phase education tab covering:

- Consolidation
- Expansion
- Retracement
- Reversal

## How to Run Locally

No installation is required.

1. Clone the repository:

   ```bash
   git clone https://github.com/JGDev1215/ICT.git
   cd ICT
   ```

2. Open `index.html` in a browser.

You can also serve it locally:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Suggested Deployment

Because this is a static app, it can be deployed using GitHub Pages.

Recommended GitHub Pages settings:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/root`

## Project Structure

```text
ICT/
├── index.html
├── README.md
└── ISSUE_FIX_PLAN.md
```

## Data and Privacy

The app stores saved slips in the browser using `localStorage` under the key:

```text
ict_slips_v1
```

Data is not sent to a backend server. Clearing browser storage may remove saved slips.

## Known Limitations

- No automated test suite yet.
- No import feature for exported slips.
- No full PWA manifest or service worker yet.
- The whole app currently lives in one HTML file, which makes future maintenance harder.
- Saved slips are browser-local only and are not synced across devices.

See `ISSUE_FIX_PLAN.md` for the planned fixes and priorities.

## Development Notes

Recommended next steps:

1. Add a small automated smoke-test suite.
2. Split JavaScript and CSS into separate files.
3. Add GitHub Pages deployment notes or workflow.
4. Improve validation and save-state handling.
5. Add import/export backup support for saved slips.
