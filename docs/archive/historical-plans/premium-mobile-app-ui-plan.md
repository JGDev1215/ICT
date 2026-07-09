# Premium Mobile App UI Roadmap for ICT DOL Sweep Tracker

> Status: Historical
> Last reviewed: 2026-07-09
> Source of truth: No


> Current-status note — 2026-07-08: this roadmap is historical. References to visible validation/invalidation UI are superseded by the current v0.8 workflow, which preserves those fields only for compatibility and export.

## Purpose

This plan adapts the supplied premium travel-app framework into the existing **ICT DOL Sweep Tracker** product.

The goal is **not** to turn the app into a travel product. The goal is to reuse the same design principles:

- premium iPhone-style mobile UX
- immersive hero cards
- clean editorial layout
- large visual cards
- pill filters and chips
- soft rounded corners
- floating action areas
- beautiful saved-item grids
- simple, emotionally engaging flow

and apply them to the current ICT trading-planner workflow.

---

## Current App Structure

Current repo structure:

```text
ICT/
├── index.html
├── manifest.webmanifest
├── assets/
│   ├── app.js
│   ├── bias-extension.js
│   └── styles.css
├── tests/
│   └── smoke.js
├── .github/
│   └── workflows/
│       ├── pages.yml
│       └── smoke.yml
├── CHANGELOG.md
├── docs/archive/historical-plans/issue-fix-plan.md
└── README.md
```

Current technical shape:

- Static HTML/CSS/JavaScript app
- No build step
- No runtime dependencies
- Main entrypoint: `index.html`
- Main render/router logic: `assets/app.js`
- Bias overlay logic: `assets/bias-extension.js`
- Design system and responsive layout: `assets/styles.css`
- Local storage only: `localStorage` and `sessionStorage`
- Smoke test: `tests/smoke.js`

---

## Product Direction

Build the app like a real App Store trading-planner product:

- premium, focused, aspirational
- mobile-first
- less terminal-like, more editorial and product-led
- still fast and practical for real trading workflow
- not cluttered
- not over-inputted
- no analysis paralysis
- each screen must help the user make a clean decision

Design inspiration should come from premium travel apps, luxury finance apps, and Apple-level clean interface design.

---

## Core Design System

### Visual Style

Use a light-first premium interface while retaining optional dark accents for trading context.

Recommended palette:

```css
:root {
  --bg: #FAFAF8;
  --surface: #FFFFFF;
  --surface-soft: #F4F6F8;
  --text: #1F1F1F;
  --muted: #8A8A8A;
  --primary: #3A86FF;
  --primary-soft: rgba(58, 134, 255, 0.10);
  --teal: #2BBFA3;
  --emerald: #18A058;
  --orange: #FF9F43;
  --danger: #FF4757;
  --border: rgba(31, 31, 31, 0.08);
  --shadow: 0 18px 48px rgba(31, 31, 31, 0.10);
  --radius-lg: 24px;
  --radius-md: 18px;
  --radius-sm: 14px;
}
```

### Components

Create reusable UI classes inside `assets/styles.css`:

- `.app-shell`
- `.mobile-frame`
- `.hero-card`
- `.image-card`
- `.glass-card`
- `.section-header`
- `.chip-row`
- `.chip`
- `.premium-card`
- `.stat-card`
- `.timeline`
- `.timeline-item`
- `.floating-cta`
- `.bottom-tabbar`
- `.save-button`
- `.empty-state`

Use soft shadows, 16–24px radius, large spacing, and smooth card hierarchy.

---

## Screen Mapping

The supplied travel-app framework maps to this ICT app as follows:

| Travel Framework Screen | ICT App Equivalent | Purpose |
|---|---|---|
| Home / Explore | Market Focus Home | Start analysis, view saved cards, see high-level performance, choose instrument/session |
| AI Trip Planner | AI Trade Plan Builder | Structured prompt-style planner for bias, DOL, sweep, invalidation, validation |
| Trip Details | Focus Card Details | Review one trading idea with bias, DOL stack, sweep stack, FVG, validation/invalidation |
| Itinerary | Execution Timeline | Day/session plan broken into pre-market, sweep, confirmation, entry, management, review |
| Explore Places | Liquidity Map / Setup Library | Browse liquidity concepts, DOL types, sweep references, FVG references |
| Budget Tracker | Risk Tracker | Risk per trade, daily loss, planned exposure, hit rate, outcome stats |
| Travel Memories | Trade Journal / Review Memories | Screenshots, notes, emotional state, lessons, outcomes |
| Saved Trips | Saved Focus Cards | Saved draft/final cards grouped by instrument/session/status |
| Profile | Trader Profile / Settings | Trading stats, preferences, storage/export settings, app info |

---

## Screen Specification

## 1. Market Focus Home

Equivalent to the travel app **Home / Explore Screen**.

Include:

- large search-style input: `What are you planning today?`
- AI prompt input: `Describe the trade idea...`
- horizontal category chips:
  - London
  - Pre-NY
  - NY AM
  - NY PM
  - Reversal
  - Continuation
  - Sweep
  - FVG
- featured hero card:
  - instrument
  - current session
  - bias status
  - last saved card outcome
- personalised recommendations:
  - `Continue latest MNQ plan`
  - `Review incomplete draft`
  - `Final-save pending outcome`
- trending/session cards:
  - MNQ
  - NQ
  - ES
  - EURUSD
  - GBPUSD
- large market cards with:
  - instrument
  - session
  - bias
  - confidence
  - expected hit time
  - save/load button

Implementation:

- Replace current basic home card with premium dashboard layout.
- Use existing `cards` data and `metrics()` output.
- Keep actions:
  - Start new analysis
  - Saved cards
  - Liquidity notes

---

## 2. AI Trade Plan Builder

Equivalent to the travel app **AI Trip Planner Screen**.

Include:

- chat-style prompt interface
- structured plan form
- instrument selector
- session selector
- bias selector
- validation of bias
- invalidation of bias
- DOL stack
- sweep stack
- FVG timeframe chips
- large CTA: `Generate Focus Plan`
- generated preview cards:
  - Bias thesis
  - Liquidity map
  - Invalidation line
  - Confirmation checklist
  - Save draft action

Important limitation:

- The current app has no backend or AI API.
- Therefore, implement this first as a structured local generator using the existing form data.
- Do not imply live AI unless an API is later added.

Suggested wording:

```text
Generate Focus Plan
```

not:

```text
AI will trade for you
```

---

## 3. Focus Card Details

Equivalent to the travel app **Trip Details Screen**.

Include:

- immersive top hero card instead of destination image carousel:
  - instrument
  - session
  - bullish/bearish visual gradient
  - saved/final status
- bias overview
- validation summary
- invalidation summary
- DOL stack
- potential sweep stack
- FVG summary
- risk estimate panel
- interactive chart placeholder/map preview:
  - static placeholder first
  - future TradingView/embed later
- trade highlights:
  - strongest DOL
  - nearest sweep
  - best time window
- action buttons:
  - Save changes
  - Final save
  - Copy plan
  - Share/export

---

## 4. Execution Timeline

Equivalent to the travel app **Itinerary Screen**.

Include a beautiful timeline layout:

- Pre-session preparation
- Bias thesis
- Liquidity draw
- Potential sweep
- Confirmation
- FVG check
- Entry model
- Invalidation
- Outcome review

Use morning/afternoon/evening equivalent for trading sessions:

- Before session
- During session
- After confirmation
- After trade

Activity cards become trading action cards:

- `Wait for sweep`
- `Check displacement`
- `Confirm FVG`
- `Avoid trade if invalidation triggers`
- `Final review`

Add floating CTA:

```text
+ Add note
```

---

## 5. Liquidity Map / Setup Library

Equivalent to the travel app **Explore Places Screen**.

Include:

- search liquidity concepts
- categories:
  - DOL
  - Sweep
  - FVG
  - Bias
  - Validation
  - Invalidation
  - Killzone
  - Session Levels
- filter chips:
  - PDH
  - PDL
  - PWH
  - PWL
  - Asia High
  - Asia Low
  - London High
  - London Low
  - REH
  - REL
- large educational cards:
  - concept name
  - use case
  - bullish/bearish context
  - add-to-plan action

Keep this lightweight. This must help the user choose from existing ICT concepts without adding unnecessary inputs.

---

## 6. Risk Tracker

Equivalent to the travel app **Budget Tracker Screen**.

Include:

- trading spending/risk summary
- planned risk card
- daily loss capacity
- final hit-rate card
- sample size
- breakeven count
- needs-final-save count
- progress bars:
  - daily risk used
  - weekly plan count
  - final-saved completion
- categories:
  - bias quality
  - DOL quality
  - sweep quality
  - FVG confirmation
  - plan followed

Important:

- Do not make it a P&L promise screen.
- Keep it as planning and review analytics.

---

## 7. Trade Journal / Review Memories

Equivalent to the travel app **Travel Memories Screen**.

Include:

- gallery-style grid for saved focus cards
- trade journal entries
- timeline of reviews
- large chart screenshot placeholder
- location tags become session tags:
  - London
  - NY AM
  - Pre-NY
  - Other
- share/export journal CTA

Future enhancement:

- Allow screenshots to be attached locally.
- Current app has no backend, so attachments would need local-only handling or exported JSON support.

---

## 8. Saved Focus Cards

Equivalent to the travel app **Saved Trips Screen**.

Include:

- grid/list hybrid of saved cards
- collections:
  - Drafts
  - Ready to Review
  - Final Saved
  - Hits
  - Misses
  - Breakeven
  - Favorites
- warm empty state:

```text
No focus cards yet. Build one clean plan before the session starts.
```

Each saved card should show:

- instrument
- session
- bias
- DOL count
- sweep count
- FVG status
- outcome
- final-save status

---

## 9. Trader Profile / Settings

Equivalent to the travel app **Profile Screen**.

Include:

- circular avatar / initials
- stats:
  - instruments tracked
  - final-saved cards
  - final hit rate
  - plan-followed count
- tabs:
  - Plans
  - Saved
  - Journal
- settings rows:
  - default instrument
  - default session
  - default risk limit
  - export data
  - import data
  - clear local data
  - help / disclaimer
- red destructive action:
  - clear all local saved cards

---

## Data Model Extensions

Current fields should remain backward compatible.

Add optional future fields only after UI structure is stable:

```js
{
  favorite: false,
  riskAmount: '',
  dailyRiskLimit: '',
  journalTags: [],
  screenshotRefs: [],
  planQualityScore: '',
  setupType: '',
  timelineNotes: []
}
```

Rules:

- Do not break `ict_cards_v078`.
- Do not remove old migration support.
- Do not rename existing storage keys without a migration.
- Any new export schema should become `ict_dol_sweep_export_v8`.

---

## Implementation Sequence for Agents

### Agent 1 — Design System CSS

Task:

- Refactor `assets/styles.css` into a premium mobile design system.
- Add light-first tokens.
- Preserve existing classes so current app does not break.
- Add new reusable card/chip/timeline/tabbar classes.

Acceptance criteria:

- Existing screens still render.
- Existing buttons, inputs, cards and bottom nav still work.
- New premium classes are available for later screen work.
- `node tests/smoke.js` passes.

---

### Agent 2 — Home Dashboard Redesign

Task:

- Upgrade the current `home()` output in `assets/app.js`.
- Add hero card, chips, recommendation cards and saved-card metrics.
- Keep Start new analysis, Saved cards and Liquidity notes actions.

Acceptance criteria:

- Home screen feels like a modern mobile app dashboard.
- No existing navigation breaks.
- Saved-card metrics still work.
- Empty state remains friendly.

---

### Agent 3 — Planner UX Redesign

Task:

- Upgrade the planner screens visually.
- Keep the existing 4-step workflow unless there is a clear reason to split later.
- Make Step 1 feel like a premium planning screen.
- Keep bias panel support from `bias-extension.js`.
- Improve DOL and sweep rows into polished cards.

Acceptance criteria:

- Instrument, bias, validation, invalidation, DOL, sweep and FVG remain supported.
- Existing local save still works.
- Draft saving still works.
- Numeric price inputs still clean/validate correctly.

---

### Agent 4 — Saved Cards and Review Screen

Task:

- Redesign saved-card list into collection-style card groups.
- Redesign review page into Focus Card Details.
- Add premium status pills and stronger hierarchy.
- Preserve Save changes, Final save, Load to planner, Copy and Delete.

Acceptance criteria:

- Final-save analytics still calculate correctly.
- Bias metadata still appears.
- Outcome selection still works.
- Existing saved cards remain readable.

---

### Agent 5 — Timeline / Risk / Journal Modules

Task:

- Add new lightweight local-only views:
  - Execution Timeline
  - Risk Tracker
  - Journal / Review Memories
- These can initially be derived from existing saved cards.
- Do not overbuild.

Acceptance criteria:

- New routes are accessible from home/saved screens.
- No backend required.
- No trading advice or P&L promise language.
- Export/import remains stable.

---

### Agent 6 — Smoke Test and Documentation

Task:

- Update `tests/smoke.js` for new version references and core screen labels.
- Update README and CHANGELOG after implementation.
- Confirm GitHub Pages remains static-compatible.

Acceptance criteria:

- `node tests/smoke.js` passes.
- README accurately reflects the new structure.
- CHANGELOG includes the mobile UI redesign.

---

## UX Rules

1. The user should always know what screen they are on.
2. Every screen needs a clear Back/Home route.
3. No dead ends.
4. No hidden save behaviour.
5. Draft is allowed, but final-save must be explicit.
6. Do not increase inputs without a clear decision-making purpose.
7. Bias, validation and invalidation must remain central.
8. DOL and sweep stacks must remain easy to scan.
9. Risk tracker must be framed as planning/review, not financial advice.
10. Keep the educational disclaimer visible but not visually dominant.

---

## Suggested Version Target

Use:

```text
v0.8.0 — Premium Mobile UI Foundation
```

Suggested changelog heading:

```text
## v0.8.0 — Premium Mobile UI Foundation

### Added
- Added premium mobile-first design system.
- Added dashboard-style home screen.
- Added collection-style saved-card UX.
- Added focus-card detail layout.
- Added foundation for timeline, risk and journal views.

### Changed
- Updated visual language from terminal-style dark tracker to premium app-style workflow.
- Improved spacing, card hierarchy, chips and mobile navigation.

### Notes
- App remains static and local-storage based.
- No backend or live AI integration has been added.
```

---

## Final Product Feel

The finished app should feel like:

> A premium mobile trading-planning companion for ICT-style liquidity mapping, not a spreadsheet, not a terminal, and not a generic form wizard.

It should help the user do one thing well:

> Build one clean bias-led liquidity plan, save it, review it, and learn from the outcome.
