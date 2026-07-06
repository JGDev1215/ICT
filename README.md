# ICT DOL Sweep Tracker

A lightweight browser-based ICT planning tool focused on one workflow:

1. Choose one instrument.
2. Define up to three higher-timeframe draws on liquidity.
3. Map up to three potential lower-timeframe sweeps.
4. Optionally record FVG formation after the sweep.
5. Review the focus card.
6. Save, verify, and final-save the analysis.

> Educational planning tool only. This project does not provide financial advice, investment advice, trade advice, or trade recommendations.

## Current Status

- App type: static HTML/CSS/JavaScript
- Build step: none
- Runtime dependencies: none
- Data storage: browser `localStorage`
- Current app version: `v0.8.0`
- Main entrypoint: `index.html`
- Stylesheet: `assets/styles.css`
- App logic: `assets/app.js`

## Main Page

The main page gives the user three clear actions:

- **Start new analysis**
- **Saved cards**
- **Liquidity notes**

This allows the user to go directly to saved cards without going through the planner.

## Page-by-Page Planner

The planner is a wizard interface. Only one input group is shown at a time.

Back and Next are navigation controls only. They do not block the user from moving through the pages. Missing inputs are shown as Draft on the review card, and the user can still save the card as a draft.

### Step 1 — Instrument

Inputs:

- Date
- Instrument
- Session, optional

Current instrument options:

- MNQ
- NQ
- MES
- ES
- MYM
- YM
- MGC
- GC
- CL
- EURUSD
- GBPUSD
- BTCUSD

### Step 2 — Draw on Liquidity

Inputs for each DOL row:

- Timeframe
- Liquidity price level
- Draw rationale / liquidity draw
- Confidence, optional
- Expected hit time, optional

A row is treated as complete when timeframe, level, and liquidity draw are filled.

### Step 3 — Potential Sweep Liquidity

Inputs for each sweep row:

- Timeframe
- Liquidity price level
- Potential sweep liquidity
- Confidence, optional
- Expected hit time, optional
- FVG formed after sweep, optional checkbox
- FVG timeframe, optional

The app warns if directional sweep liquidity appears to be on the same side as the draw on liquidity. The warning does not block saving.

### Step 4 — Review Focus Card

The review card shows:

- Date
- Instrument
- Session
- DOL stack
- Potential sweep stack
- Direction check
- FVG confirmation
- Focus status

Incomplete cards can be saved as Draft. Complete cards are marked Complete.

## Saved Cards

Saved cards are accessible from the main page. Each saved card opens into its own review page.

Each review page includes:

- Card summary
- Verification markers:
  - Draw respected
  - LTF sweep confirmed
  - Sweep led to intended DOL
  - FVG formed after sweep
  - Plan followed
- Outcome:
  - Open
  - Hit
  - Miss
  - Breakeven
- Verification notes
- Load to planner
- Copy
- Save changes
- Final save
- Delete

## Save Changes vs Final Save

Saved-card edits are staged first.

Use **Save changes** to store card edits locally without including the card in the final hit-rate sample.

Use **Final save** after selecting an outcome other than Open to mark the analysis as final. Only final-saved Hit/Miss cards enter the hit-rate calculation.

If a final-saved card is edited again and **Save changes** is used, the card returns to a non-final state until **Final save** is pressed again.

## Final Hit-Rate Data

The Saved Cards page shows a local accuracy summary:

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

The JSON export schema is:

```text
ict_dol_sweep_export_v5
```

No hosted backend is currently included.

## Data and Privacy

The app stores saved cards in the browser using `localStorage` under:

```text
ict_dol_sweep_cards_v2
```

The app migrates older saved cards from:

```text
ict_cards_v077
ict_cards_v076
ict_dol_sweep_cards_v1
ict_slips_v1
```

Data is not sent to a backend server. Clearing browser storage may remove saved cards, so users should use JSON export for backup.

## How to Run Locally

No installation is required.

```bash
git clone https://github.com/JGDev1215/ICT.git
cd ICT
```

Open `index.html` in a browser, or serve it locally:

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
├── assets/
│   ├── app.js
│   └── styles.css
├── CHANGELOG.md
├── ISSUE_FIX_PLAN.md
├── MULTI_AGENT_FIX_PROCESS.md
└── README.md
```

## Known Limitations

- Saved cards are browser-local only and are not synced across devices.
- No hosted backend yet.
- No automated browser test suite yet.
- No import/export sync beyond local browser backup.

See `ISSUE_FIX_PLAN.md` for planned fixes and future enhancements.
