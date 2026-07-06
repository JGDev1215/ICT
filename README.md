# ICT DOL Sweep Tracker

A lightweight browser-based ICT planning tool for one focused job:

1. Choose one instrument.
2. Define up to three draws on liquidity.
3. Confirm up to three potential lower-timeframe sweep areas.
4. Optionally mark whether an FVG formed after the sweep.
5. Save the focus card.
6. Review, verify, final-save, export, and import saved cards.

> Educational tool only. This project does not provide financial advice, investment advice, or trade recommendations.

## Current Status

- App type: static HTML/CSS/JavaScript
- Build step: none
- Runtime dependencies: none
- Data storage: browser localStorage
- Current app version: v0.7.8
- Main entrypoint: index.html
- Stylesheet: assets/styles.css
- App logic: assets/app.js
- Deployment support: GitHub Pages workflow included

## Main Page

The main page now gives the user three clear actions:

- Start new analysis
- Saved cards
- Liquidity notes

Saved cards can be opened directly without going through the planner.

## Planner Flow

The planner is a page-by-page wizard:

1. Instrument
2. Draw on liquidity stack
3. Potential sweep stack and FVG
4. Review focus card

Back and Next are navigation controls only. Missing inputs are shown as Draft, and the user can still save a draft card.

## Saved Cards

Each saved card opens into its own review page with:

- Card summary
- DOL respected marker
- LTF sweep confirmed marker
- FVG formed after sweep marker
- Plan followed marker
- Outcome selector: Open, Hit, Miss, Breakeven, Read
- Verification notes
- Load to planner
- Copy
- Save changes
- Final save
- Delete

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

The JSON export schema is:

```text
ict_dol_sweep_export_v6
```

Current saved cards are stored under:

```text
ict_cards_v078
```

The app migrates older browser-local cards from:

```text
ict_cards_v077
ict_cards_v076
ict_dol_sweep_cards_v2
ict_slips_v1
```

Data is not sent to a backend server. Clearing browser storage may remove saved cards, so users should use JSON export for backup.

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

The test checks the main files, app syntax, storage key, and version references.

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
├── assets/
│   ├── app.js
│   └── styles.css
├── tests/
│   └── smoke.js
├── .github/
│   └── workflows/
│       ├── pages.yml
│       └── smoke.yml
├── CHANGELOG.md
├── ISSUE_FIX_PLAN.md
└── README.md
```

## Known Limitations

- No hosted backend yet.
- Saved cards are browser-local only and are not synced across devices.
- The smoke test is static; it does not replace full browser automation.
