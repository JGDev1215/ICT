# ICT DOL Sweep Tracker

A lightweight browser-based ICT planning tool focused on one job:

1. Choose one instrument.
2. Define the higher-timeframe draw on liquidity.
3. Confirm the lower-timeframe sweep.
4. Review the focus card.
5. Save, verify, and final-save the analysis.

> Educational tool only. This project does not provide financial advice, investment advice, or trade recommendations.

## Current Status

- App type: static HTML/CSS/JavaScript
- Build step: none
- Runtime dependencies: none
- Data storage: browser `localStorage`
- Current app version: `v0.5.1`
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

### Step 2 — HTF Draw on Liquidity

Inputs:

- HTF timeframe
- Draw on liquidity
- Draw level
- Draw note

The bias read updates from the selected draw.

### Step 3 — LTF Sweep

Inputs:

- LTF sweep timeframe
- Liquidity swept
- Sweep level
- Sweep time, optional
- Sweep note

The app warns if the sweep is not opposite the directional HTF draw, but this warning does not block the user from continuing.

### Step 4 — Review Focus Card

The final review card shows only:

- Instrument
- HTF draw
- LTF sweep
- Focus status

The user can go Back or Save card. Incomplete cards are saved as Draft.

## Saved Cards

Saved cards are accessible from the main page. Each saved card opens into its own review page.

Each review page includes:

- Card summary
- Verification markers:
  - Draw respected
  - LTF sweep confirmed
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

Use **Final save** after selecting an outcome to mark the analysis as final. Only final-saved Hit/Miss cards enter the hit-rate calculation.

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
├── assets/
│   ├── app.js
│   └── styles.css
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

See `ISSUE_FIX_PLAN.md` for planned fixes and future enhancements.
