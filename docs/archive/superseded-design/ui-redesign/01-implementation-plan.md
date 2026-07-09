# 01 — UI Redesign Implementation Plan

> Status: Superseded
> Last reviewed: 2026-07-09
> Source of truth: No


> Current-status note — 2026-07-08: this plan is historical where it describes visible validation/invalidation UI. v0.8 preserves `biasValidation` and `biasInvalidation` for migration, JSON export, and text export, but the active Planner and Focus Card Details screens no longer show those fields.

## Objective

Bring the uploaded premium mobile UI design into the live ICT Sweep Tracker while preserving the existing static-site architecture, browser-local data, export/import support and educational-only positioning.

The redesign should feel like a polished mobile app, but it must remain deployable as a static GitHub Pages site.

## Current project baseline

The current app is:

- Static `index.html`.
- Vanilla JavaScript app logic in `assets/app.js`.
- Additional browser-side bias extension in `assets/bias-extension.js`.
- Styling in `assets/styles.css`.
- Local data stored through `localStorage`.
- Smoke-tested through `tests/smoke.js`.

## Target product shape

The new UI introduces a mobile-first app shell with:

- Bottom tab navigation.
- Home dashboard.
- AI-style plan builder interface.
- Focus card detail screen.
- Saved cards list.
- Execution timeline.
- Liquidity concept map / setup library.
- Risk and review dashboard.
- Trade journal.
- Profile and settings.

## Non-negotiables

1. Keep static-site compatibility.
2. Do not add a backend.
3. Do not remove existing saved-card migration.
4. Do not remove export/import.
5. Do not create financial advice or trade signals.
6. Keep the data model understandable and portable.
7. Keep mobile usability first.
8. Preserve keyboard accessibility and visible focus states.

## Recommended architecture

Refactor toward this structure:

```text
ICT/
├── index.html
├── assets/
│   ├── app.js                  # bootstraps app, state, router
│   ├── state.js                # localStorage, migrations, export/import
│   ├── data.js                 # instruments, sessions, DOL/sweep options
│   ├── ui.js                   # shared component helpers
│   ├── screens/
│   │   ├── home.js
│   │   ├── planner.js
│   │   ├── focus-card.js
│   │   ├── saved.js
│   │   ├── timeline.js
│   │   ├── liquidity-map.js
│   │   ├── risk.js
│   │   ├── journal.js
│   │   └── profile.js
│   └── styles.css
├── tests/
│   └── smoke.js
└── docs/
```

If the project should remain one-file JS for now, keep the same logical boundaries as sections inside `assets/app.js`, but agents should still work against the module boundaries above.

## Data model target

Use one saved-card object shape across screens:

```js
{
  id: string,
  savedAt: ISOString,
  updatedAt: ISOString,
  fields: {
    date: string,
    instrument: string,
    session: string,
    bias: 'Bullish' | 'Bearish' | '',
    biasValidation: string,
    biasInvalidation: string,
    dol1Level: string,
    dol1Draw: string,
    dol1Confidence: string,
    dol1HitTime: string,
    sweep1Level: string,
    sweep1Draw: string,
    sweep1Confidence: string,
    sweep1HitTime: string,
    fvg: boolean,
    fvgTf: string
  },
  markers: {
    biasValidated: boolean,
    biasInvalidated: boolean,
    dolRespected: boolean,
    sweepConfirmed: boolean,
    fvgFormed: boolean,
    planFollowed: boolean
  },
  outcome: 'Open' | 'Hit' | 'Miss' | 'Breakeven' | 'Read',
  notes: string,
  finalSaved: boolean,
  favorite: boolean,
  journal: {
    screenshotRefs: string[],
    tags: string[],
    lesson: string
  },
  risk: {
    plannedRiskPct: string,
    plannedR: string,
    maxLoss: string
  }
}
```

Do not force all new fields to be mandatory. Old cards must still load and normalise safely.

## Phased delivery

### Phase 0 — Safety baseline

- Create or update smoke tests before visual changes.
- Confirm the app loads on GitHub Pages.
- Confirm existing cards are still readable.
- Freeze current storage keys and migration behaviour.

Output:

- Updated `tests/smoke.js`.
- A small data migration test fixture if practical.

### Phase 1 — Design system foundation

Build the new visual foundation first:

- Replace dark theme with light mobile-first tokens.
- Add CSS variables for colour, spacing, radius, shadow and typography.
- Add reusable classes for app shell, phone-width content, cards, pills, CTAs, fields and status badges.
- Keep a desktop wrapper so the app looks acceptable on laptop browsers.

Output:

- Updated `assets/styles.css`.
- No major logic changes.

### Phase 2 — App shell and routing

Implement:

- Top header patterns.
- Bottom tab navigation.
- Screen routing for Home, Planner, Saved, Journal/Profile placeholders.
- Safe area spacing and sticky CTAs.
- Consistent Back behaviour.

Output:

- `route` values for each tab/screen.
- Shared `renderShell()` or equivalent helper.

### Phase 3 — Home dashboard

Implement Home using live app data:

- Greeting/date/session header.
- Search-style prompt input placeholder.
- Plan assistant card.
- Session chips.
- Today's focus card from latest draft/active card.
- Review metrics from final-saved cards.
- Watchlist preview.

Output:

- Home uses real metrics where available.
- No fake hard-coded analytics except empty-state placeholders.

### Phase 4 — Plan Builder

Implement the AI Trade Plan Builder screen without requiring real AI:

- Chat-style assistant prompt card.
- Instrument and session controls.
- Bias segmented control.
- Validation and invalidation textareas.
- DOL stack inputs.
- Sweep stack inputs.
- FVG and confidence controls.
- Generated preview summary from current fields.
- Sticky Save Draft / Generate Focus Plan CTA.

Output:

- Existing planner data still saves to the same saved-card object.
- `Generate Focus Plan` should structure the current fields into a preview, not call external AI.

### Phase 5 — Focus Card Details

Implement saved-card detail screen:

- Hero header with instrument, session, date, bias and final status.
- Chart preview placeholder.
- Bias overview.
- Validation / invalidation cards.
- DOL stack.
- Potential sweep stack.
- FVG and risk estimate blocks.
- Trade highlights.
- Save changes, Final save, Copy, Share, Delete.

Output:

- This replaces the plain saved-card review layout.
- Existing final-save logic remains intact.

### Phase 6 — Saved Cards

Implement the Saved screen:

- Search input.
- Filter chips: Final Saved, Drafts, Hits, Misses, Favorites.
- Card list with bias badge, DOL count, sweep count, FVG state and outcome.
- FAB for New Plan.
- Empty state.

Output:

- Filtering and search operate on local saved cards.

### Phase 7 — Timeline, Liquidity Map, Risk, Journal, Profile

Ship these in progressive order:

1. Timeline: initially read-only checklist derived from the active plan.
2. Liquidity Map: concept library with add-to-plan actions.
3. Risk Tracker: review metrics and planned-risk fields.
4. Journal: text notes and optional screenshot metadata placeholder.
5. Profile: settings, export/import and clear local data.

Output:

- Each screen must be useful even without backend storage.
- Journal screenshots may be metadata-only initially unless browser file support is deliberately added.

### Phase 8 — QA and release

- Run smoke tests.
- Add mobile browser manual QA checklist.
- Confirm localStorage migration.
- Confirm export/import includes new fields.
- Update README and CHANGELOG.

## Technical risks and mitigation

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Big bang rewrite breaks persistence | High | Keep state layer stable and test migration first. |
| Multiple agents edit the same file | High | Assign file ownership in `04-agent-workstreams.md`. |
| New screens become static mockups only | Medium | Require every screen to read from app state or show clear empty states. |
| Visual design bloats CSS | Medium | Use tokens and component classes, not inline styles. |
| Planner loses current ICT workflow | High | Preserve instrument, bias, validation, invalidation, DOL, sweep, FVG and final-save flow. |
| Fake AI creates misleading output | Medium | Plan assistant must be deterministic and educational only until a real AI feature is intentionally added. |

## Implementation order for agents

1. State/data agent.
2. Design system agent.
3. App shell/navigation agent.
4. Planner agent.
5. Saved/focus-card agent.
6. Secondary screens agent.
7. QA/documentation agent.

No agent should start visual work that depends on missing state helpers. State and design tokens are the foundation.
