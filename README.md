# ICT DOL Sweep Tracker

A lightweight browser-based ICT planning tool focused on one job:

1. Choose one instrument.
2. Define the higher-timeframe draw on liquidity.
3. Confirm the lower-timeframe sweep.
4. Save the card for review, marker checks, outcome tracking, and final verification.

> Educational tool only. This project does not provide financial advice, investment advice, or trade recommendations.

## Current Status

- App type: static HTML/CSS/JavaScript
- Build step: none
- Runtime dependencies: none
- Data storage: browser `localStorage`
- Main file: `index.html`
- Current app version: `v0.4.0`

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
- verification notes
- outcome: Open, Hit, Miss, or Breakeven
- load, copy, save changes, final save, and delete actions
- visible save state, such as Saved locally, Unsaved changes, or Save failed

### Save Changes vs Final Save

Saved-card edits are staged first.

Use **Save changes** to store card edits locally without including the card in the verified hit-rate sample.

Use **Final save** after selecting an outcome to mark the analysis as final. Only final-saved Hit/Miss cards enter the hit-rate calculation.

If a final-saved card is edited again and **Save changes** is used, the card returns to a non-final state until **Final save** is pressed again.

### Production Save Behaviour

Saved-card edits use stable card IDs rather than list position. This protects the wrong card from being updated after deletion, import, or re-render.

Load and copy actions fetch the latest saved card by ID before use. Save failures are shown to the user.

### Final Hit-Rate Data

The Saved Cards page shows a local accuracy summary:

- Final hit rate
- Final Hit/Miss sample size
- Final Breakeven count
- Needs final save count

Hit rate uses only cards that have been final-saved with a Hit or Miss outcome. Breakeven is tracked separately.

### Data Verification and Backup

The Saved Cards tab includes:

- Verify data
- Export text
- Export JSON
- Import JSON

The JSON export schema is:

```text
ict_dol_sweep_export_v4
```

This gives a future backend a clean data payload for collecting final-saved hit-rate statistics. No hosted backend is currently included.

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
