# 03 — Screen Specifications

> Current-status note — 2026-07-08: visible validation/invalidation textarea and card requirements in this spec are superseded by the v0.8 session-bias workflow. Compatibility fields remain in stored cards and exports; the active UI emphasizes Bias Determination For Session, DOL, sweep, FVG, market context, route evidence, and risk review.

## Purpose

This file maps each screen from the uploaded UI canvas to production behaviour in the ICT Sweep Tracker app.

The design contains nine mobile screens:

1. Market Focus Home
2. AI Trade Plan Builder
3. Focus Card Details
4. Saved Focus Cards
5. Execution Timeline
6. Liquidity Map / Setup Library
7. Risk Tracker
8. Trade Journal
9. Trader Profile / Settings

## Shared navigation model

Primary bottom tabs:

| Tab | Route | Notes |
| --- | --- | --- |
| Home | `home` | Dashboard and latest active plan. |
| Planner | `planner` | Plan builder. |
| Saved | `saved` | Saved cards and filters. |
| Journal | `journal` | Journal entries and screenshots. |
| Profile | `profile` | Settings and data tools. |

Secondary routes:

| Screen | Route | Entry point |
| --- | --- | --- |
| Focus Card Details | `focus/:id` | Saved card row, active plan card. |
| Execution Timeline | `timeline/:id` | Focus card details. |
| Liquidity Map | `liquidity-map` | Home, Planner, Profile/Library. |
| Risk Tracker | `risk` | Home review section, Profile. |

## 1. Market Focus Home

### Goal

Give the user a daily operating view: current session, current/last plan, review metrics and fast entry into the planner.

### Data sources

- Current date/time.
- Saved cards from localStorage.
- Latest draft card.
- Latest final-saved card if no draft exists.
- Analytics from final-saved cards.
- Optional watchlist defaults from settings.

### Required UI

- Greeting header.
- Search/prompt-style input: `What are you planning today?`
- Plan assistant card.
- Session chips.
- Today’s focus hero card.
- Review metrics grid.
- Watchlist preview.
- Bottom nav.

### Behaviour

- `Start/Continue plan` opens the latest draft or starts a new planner draft.
- `Saved cards` opens Saved route.
- Session chips filter visible focus/watchlist context only; they should not destroy draft data.
- Metrics must use real final-save data.

### Empty states

- If no cards exist, hero CTA says `Build first plan`.
- Metrics show `—` or `0` without fake hit rate.

## 2. AI Trade Plan Builder

### Goal

Turn the existing planner into a premium guided form. The assistant card structures the form, but it must remain deterministic and educational.

### Required fields

- Date.
- Instrument.
- Session.
- Bias: Bullish/Bearish.
- Validation of bias.
- Invalidation of bias.
- Up to three DOL records:
  - price level
  - draw rationale
  - confidence
  - expected hit time
- Up to three sweep records:
  - price level
  - sweep liquidity
  - confidence
  - expected hit time
- FVG formed checkbox.
- FVG timeframe.
- Optional confidence summary.

### Required UI

- Chat assistant bubble.
- Instrument/session field row.
- Bias segmented control.
- Validation and invalidation textareas.
- DOL stack compact list and add/edit controls.
- Sweep stack compact list and add/edit controls.
- FVG timeframe and confidence controls.
- Generated preview section.
- Sticky Save Draft / Generate Focus Plan CTA.

### Behaviour

- The generated preview updates from current fields.
- Save Draft saves an incomplete card as draft.
- Generate Focus Plan creates/updates the focus card and opens details.
- Price fields keep numeric/N/A sanitisation.
- No external AI call in this phase.

## 3. Focus Card Details

### Goal

Display one saved card as a polished review object and allow final-save workflow.

### Required UI

- Dark/blue hero with instrument, session, date, bias and final status.
- Chart/liquidity map placeholder.
- Bias overview paragraph.
- Validation card.
- Invalidation card.
- DOL stack rows.
- Sweep stack cards.
- FVG and risk estimate blocks.
- Trade highlights.
- Actions:
  - Save changes
  - Final save
  - Copy
  - Share
  - Delete

### Behaviour

- Save changes stores edits and makes the card non-final if applicable.
- Final save requires outcome other than Open.
- Copy exports human-readable card text.
- Share can use Web Share API where supported; otherwise copy text.
- Delete asks for confirmation.

### Review markers

- Bias validated.
- Bias invalidated.
- DOL respected.
- LTF sweep confirmed.
- FVG formed after sweep.
- Plan followed.

## 4. Saved Focus Cards

### Goal

Let the user browse, search, filter and open saved cards.

### Required UI

- Page title.
- Search field.
- Filter chips:
  - Final Saved
  - Drafts
  - Hits
  - Misses
  - Favorites
- Saved-card rows/cards.
- FAB for new plan.
- Empty-state callout.

### Card row data

- Instrument.
- Session.
- Date.
- Bias badge.
- DOL count.
- Sweep count.
- FVG state.
- Final/draft state.
- Outcome.
- Favorite icon.

### Behaviour

- Search filters by instrument, session, bias, DOL labels, sweep labels and notes.
- Filter chips can combine only if implemented deliberately; otherwise single active filter is acceptable for v1.
- Click opens Focus Card Details.
- FAB opens Planner.

## 5. Execution Timeline

### Goal

Guide the user through pre-session, during-session and post-trade review steps.

### Data model

Timeline can be derived from card fields initially. Optional persisted timeline state can be added later.

### Required groups

- Before session:
  - Pre-session prep.
  - Bias thesis.
- During session:
  - Liquidity draw.
  - Potential sweep.
  - Confirmation / FVG check.
- After trade:
  - Outcome review.

### Behaviour

- Completed steps reflect existing saved markers where possible.
- Live now can be manual or based on selected session in v1.
- Add note opens a note input for the card.

## 6. Liquidity Map / Setup Library

### Goal

Provide a mini library of liquidity concepts that can be added to a draft plan.

### Required concept categories

- DOL.
- Sweep.
- FVG.
- Bias.
- Killzone.

### Initial concepts

- Previous Day High.
- Previous Day Low.
- Previous Week High.
- Previous Week Low.
- Asia High/Low.
- London High/Low.
- Relative Equal Highs/Lows.
- Liquidity Sweep.
- Fair Value Gap.

### Behaviour

- Search concept text.
- Filter by category.
- Add to plan writes to current planner draft.
- If no draft exists, create draft state and route to Planner.

## 7. Risk Tracker

### Goal

Show planning-risk and review-quality statistics without pretending to forecast performance.

### Required UI

- Planned risk hero panel.
- Final hit-rate stat cards.
- Completion and plan-followed progress bars.
- Review quality rows:
  - Bias quality.
  - DOL quality.
  - Sweep quality.
  - FVG confirmation.
  - Plan followed.

### Data sources

- Final-saved cards.
- Markers.
- Outcome.
- Optional risk fields from card.

### Behaviour

- If data is missing, show neutral empty state.
- Do not invent risk forecasts.
- Planned risk settings should be editable later through Profile.

## 8. Trade Journal

### Goal

Capture lessons, behavioural notes and chart references for reviewed trades.

### Required UI

- Page title and reviewed count.
- Export button.
- Screenshot gallery placeholder.
- Recent entries list.
- Tags.

### Data model additions

```js
journal: {
  screenshotRefs: [],
  tags: [],
  lesson: '',
  behaviourNote: ''
}
```

### Behaviour

- Journal entries attach to saved cards.
- Export can reuse JSON export initially.
- Screenshot upload is optional future work.

## 9. Trader Profile / Settings

### Goal

Consolidate user preferences and local data tools.

### Required UI

- Profile header.
- Stats summary.
- Recent plan preview.
- Settings list.
- Export data.
- Import data.
- Clear all local data.

### Settings

- Default instrument.
- Default session.
- Risk preferences.
- Notifications placeholder.

### Behaviour

- Export/import should call existing data tools.
- Clear all local data must require confirmation.
- Default instrument/session should prefill new planner drafts.

## Cross-screen acceptance criteria

- App loads on mobile width without horizontal scroll.
- Bottom nav never blocks the final CTA.
- Saved cards remain readable after migration.
- Copy/export include bias, validation and invalidation.
- Final-save analytics remain accurate.
- Every screen has an empty state.
- Every route has a back/home path.
