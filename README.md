# ICT DOL Sweep Tracker

A lightweight browser-based ICT planning tool focused on one job:

1. Choose one instrument.
2. Define the higher-timeframe draw on liquidity.
3. Confirm the lower-timeframe sweep.
4. Save the card for review, notes, marker checks, outcome tracking, and verification.

> Educational tool only. This project does not provide financial advice, investment advice, or trade recommendations.

## Current Status

- App type: static HTML/CSS/JavaScript
- Build step: none
- Runtime dependencies: none
- Data storage: browser `localStorage`
- Main file: `index.html`
- Current app version: `v0.3.0`

## Main Features

### Focus Planner

The planner intentionally avoids extra execution complexity. The output card only shows:

- instrument
- higher-timeframe draw on liquidity
- lower-timeframe sweep
- focus status

The app validates whether a directional draw has an opposing lower-timeframe sweep.

### Saved Cards

Saved cards can be reviewed without leaving the Saved Cards tab. Each card includes:

- HTF draw summary
- LTF sweep summary
- checklist markers:
  - Draw respected
  - LTF sweep confirmed
  - Plan followed
  - Analysis verified
- verification notes with autosave
- outcome: Open, Hit, Miss, or Breakeven
- load, copy, and delete actions
- visible local save state, such as Saved locally or Save failed

### Production Save Behaviour

Saved-card edits use stable card IDs rather than list position. This protects the wrong card from being updated after deletion, import, or re-render.

Notes autosave while typing and also save on blur/change. Outcome, checklist markers, verification status, and delete actions all write through the same ID-based persistence layer.

### Verified Hit-Rate Data

The Saved Cards page shows a local accuracy summary:

- Verified hit rate
- Verified Hit/Miss sample size
- Verified Breakeven count
- Needs verify count

Hit rate uses only cards marked **Analysis verified** with a Hit or Miss outcome. Breakeven is tracked separately.

### Data Verification and Backup

The Saved Cards tab includes:

- Verify data
- Export text
- Export JSON
- Import JSON

The JSON export schema is:

```text
ict_dol_sweep_export_v3
```

This gives a future backend a clean data payload for collecting verified hit-rate statistics. No hosted backend is currently included.

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
├── README.md
└── ISSUE_FIX_PLAN.md
```

## Data and Privacy

The app stores saved cards in the browser using `localStorage` under:

```text
ict_dol_sweep_cards_v2
```

It can also migrate older saved slips from:

```text
ict_slips_v1
```

Data is not sent to a backend server. Clearing browser storage may remove saved cards, so users should use JSON export for backup.

## Known Limitations

- No hosted backend yet.
- No automated test suite yet.
- JSON export/import is local-browser based.
- Saved cards are browser-local only and are not synced across devices.
- The whole app currently lives in one HTML file, which makes future maintenance harder.

See `ISSUE_FIX_PLAN.md` for planned fixes and future enhancements.
