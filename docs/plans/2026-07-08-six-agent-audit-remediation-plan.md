# Six-Agent Audit Remediation Plan

Date: 2026-07-08  
App: ICT DOL Sweep Tracker v0.8.0  
Live URL: https://ictict-lake.vercel.app/  
Repo path: `/Users/soonjeongguan/Desktop/ICT`

## Critical Assessment

The app is suitable for guided beta testing only after the data-integrity and persistence issues are fixed. The core workflow works: all five tabs load, generated focus cards save, Focus Card sweep/FVG edits persist, metrics recompute, export/import works, live yfinance price detection works, and mobile layouts do not horizontally overflow.

The highest risk is not visual. The highest risk is silent data corruption and silent loss of user work:

- Price inputs currently rewrite user intent without warning. This can turn valid-looking trading levels into materially different levels.
- Unsaved Planner work survives normal tab switches only because state remains in memory, but it disappears on refresh or hard navigation.
- Profile theme switching can discard other unsaved profile settings.
- Risk defaults do not propagate to generated Focus Cards.
- Some accessibility issues are substantial enough to affect beta feedback quality, especially contrast and duplicate landmarks.

The current route architecture fully remounts each view by replacing `app.innerHTML`. That is acceptable for a small static SPA only if draft state is explicitly persisted and route state is recoverable. Without that, the app behaves like a native mobile tool visually but not operationally.

## Fix Order

1. Data integrity and validation fixes.
2. Draft persistence, route restore, and navigation history.
3. Profile/settings propagation fixes.
4. Storage quota and import/export hardening.
5. Accessibility and responsive refinements.
6. Network configuration cleanup.
7. Test suite update and release gate.

## Release Gates

The app should not be considered beta-ready until these gates pass:

- Entering malformed price input never silently changes meaning.
- A partially filled Planner survives refresh.
- Browser back/forward can move between app tabs.
- Profile setting changes cannot wipe unsaved settings.
- New Focus Cards inherit risk defaults.
- `node tests/smoke.js` passes against v0.8.x.
- No high-severity accessibility violations remain for contrast or landmarks.

---

## Change Request 1 - Replace Silent Price Sanitization

### 1. Issue / Problem

The current price sanitizer strips characters and silently changes value meaning.

Examples:

- `-1` becomes `1`
- `1e3` becomes `13`
- `20,123.50` becomes `20.12350`
- `1.2.3` becomes `1.23`

This creates false confidence because the UI accepts and displays a price level that the user did not intend.

### 2. Desired Behaviour

Use explicit price parsing with validation.

Recommended rule:

- Accept plain positive decimals: `20123.50`
- Accept comma thousands only in valid US format: `20,123.50 -> 20123.50`
- Reject negative numbers for market price levels unless a future product rule explicitly supports negative instruments.
- Reject scientific notation.
- Reject malformed decimals such as `1.2.3`.
- Reject ambiguous comma formats such as `20,123,50`.
- Preserve `N/A` only where the UI explicitly allows it.
- Show a field-level validation message instead of mutating silently.

### 3. Source / Basis

- Engineering basis: Prevent data corruption in `currentPrice`, DOL levels, sweep levels, risk entry/target/stop.
- UX basis: Users must know when the app cannot interpret a price.
- Trading basis: Price-level precision is core to the planner.

### 4. Affected Module

Validation / Inputs / Display

Files:

- `assets/app.js`
- `tests/smoke.js`

### 5. Priority

Critical

### 6. Example / Test Case

Input:

```text
20,123.50
```

Expected output:

```text
20123.50
```

What should not happen:

```text
20.12350
```

Input:

```text
1e3
```

Expected output:

```text
Validation error: enter a standard decimal price.
```

What should not happen:

```text
13
```

### 7. Constraints

- Do not break existing saved cards; normalize legacy bad values only through explicit verify/import handling.
- Do not use broad string stripping as validation.
- Do not block `N/A` in fields where the product allows `N/A`.

### 8. Acceptance Check

- Manual browser tests confirm each example above.
- Unit/smoke tests cover comma thousands, invalid comma format, negative, scientific notation, multiple decimals, zero, huge values, tiny decimals, and `N/A`.
- Generated Preview and Price Map show either validated values or validation errors, never silently mutated values.

---

## Change Request 2 - Add Numeric Bounds and Precision Rules

### 1. Issue / Problem

The app accepts zero, extreme numbers, and tiny decimals without warning. This can produce misleading Price Map output such as `Live` with percent `N/A` or rounded display of tiny values as `0`.

### 2. Desired Behaviour

Define explicit numeric bounds.

Recommended initial bounds:

- Reject zero for `currentPrice`.
- Allow zero only if a field is not used as an active price denominator and the UI explains it.
- Cap display precision to a defined maximum.
- Warn or reject values that exceed a product-defined maximum, for example more than 12 integer digits or more than 8 decimal places.

### 3. Source / Basis

- Engineering basis: Prevent invalid math and misleading render output.
- UX basis: User should see why a level is unusable.

### 4. Affected Module

Validation / Price Map / Risk calculation

Files:

- `assets/app.js`
- `tests/smoke.js`

### 5. Priority

Important

### 6. Example / Test Case

Input:

```text
currentPrice = 0
dol1Level = 100
```

Expected output:

```text
Validation warning: current price must be greater than zero for distance and percent calculations.
```

What should not happen:

```text
Price Map shows Live with percent N/A and no explanation.
```

### 7. Constraints

- Do not overfit bounds to one market only; futures, crypto, FX, and commodities have different scales.
- Make limits configurable in constants.

### 8. Acceptance Check

- Zero current price no longer produces unexplained Price Map percent output.
- Extreme values trigger validation copy.
- Smoke tests cover zero, very large, and high-precision decimals.

---

## Change Request 3 - Block or Explicitly Gate Incomplete Focus Plan Generation

### 1. Issue / Problem

The app allows `Generate Focus Plan` when Planner records are incomplete. It labels status as `Draft`, but still creates a Focus Card. This is not necessarily wrong, but it is currently ambiguous.

### 2. Desired Behaviour

Choose one product rule and implement it consistently:

Option A, recommended for beta:

- `Generate Focus Plan` requires at least one complete DOL record and one complete sweep record.
- `Save Draft` remains available for partial work.

Option B:

- Allow generation but show a clear confirmation: "This creates an incomplete Draft Focus Card."

### 3. Source / Basis

- UX basis: Users expect "Generate Focus Plan" to mean plan is ready enough to review.
- Engineering basis: Reduces incomplete saved cards that look actionable.

### 4. Affected Module

Validation / Planner / Change control

Files:

- `assets/app.js`
- `tests/smoke.js`

### 5. Priority

Important

### 6. Example / Test Case

Input:

```text
instrument = MNQ
dol1Level = 29500
sweep1Level = 29350
```

Expected output:

```text
Generate Focus Plan blocked with missing-field messages.
Save Draft still works.
```

What should not happen:

```text
Focus Card opens with incomplete DOL/sweep records and no clear warning.
```

### 7. Constraints

- Do not remove Save Draft.
- Do not require all three DOL or sweep records; only validate records that are used.

### 8. Acceptance Check

- Incomplete record cannot be generated without an explicit product-approved warning path.
- Complete one-DOL plus one-sweep plan still generates.

---

## Change Request 4 - Persist In-Progress Planner Draft Across Refresh

### 1. Issue / Problem

Partial Planner state survives tab switches but disappears on refresh, close/reopen, or hard navigation. This is caused by route and form state being held in memory only.

### 2. Desired Behaviour

Autosave in-progress Planner state to a separate draft key.

Recommended key:

```text
ict_planner_draft_v1
```

Store:

- `fields`
- `marketContextDraft`
- `marketContextOpenTimeframes`
- `plannerCardId`
- `lastPriceSource`
- `updatedAt`

Restore on app boot if no explicit saved card is being opened.

### 3. Source / Basis

- UX basis: Mobile users expect accidental refresh/navigation not to wipe work.
- Engineering basis: Current unmount/remount architecture requires explicit persistence.

### 4. Affected Module

State / Persistence / Planner

Files:

- `assets/app.js`
- `tests/smoke.js`

### 5. Priority

Critical

### 6. Example / Test Case

Input:

```text
Open Planner, enter MNQ, currentPrice 20123.50, refresh.
```

Expected output:

```text
App restores Planner route and fields.
```

What should not happen:

```text
App returns Home with blank Planner.
```

### 7. Constraints

- Draft autosave must not create a Saved Card until user clicks Save Draft or Generate Focus Plan.
- Autosave should not overwrite an explicitly loaded saved card without preserving `plannerCardId`.
- Provide a clear "Clear draft" or "Start new" path.

### 8. Acceptance Check

- Refresh restores Planner tab and partial values.
- Closed/reopened tab restores recent unsaved draft.
- Save Draft clears or links the autosave state correctly.

---

## Change Request 5 - Add Route State, Deep Links, and Browser History

### 1. Issue / Problem

Tabs do not update URL/history. Browser Back/Forward does not navigate between tabs. Deep links like `#planner` and `?route=planner` load Home.

### 2. Desired Behaviour

Implement hash-based routing for a static app.

Recommended routes:

```text
#home
#planner
#saved
#journal
#profile
#focus/:id
#timeline/:id
#liquidity-map
#risk
```

On route changes:

- Push route to history.
- On boot, read route from hash.
- On `popstate` or `hashchange`, restore route.

### 3. Source / Basis

- UX basis: Users expect Back/Forward and shareable links.
- Engineering basis: Static Vercel output can support hash routing without server rewrites.

### 4. Affected Module

Navigation / State / Display

Files:

- `assets/app.js`
- `tests/smoke.js`

### 5. Priority

Important

### 6. Example / Test Case

Input:

```text
Open https://ictict-lake.vercel.app/#planner
```

Expected output:

```text
Planner tab loads and is active.
```

What should not happen:

```text
Home tab loads.
```

### 7. Constraints

- Avoid path routing unless Vercel rewrite config is added.
- Must call `sync()` before leaving Planner to avoid losing in-memory edits.

### 8. Acceptance Check

- Browser Back returns from Saved to Planner.
- Refresh preserves current tab.
- `#focus:<id>` or equivalent opens the correct saved card.

---

## Change Request 6 - Make View Remounting Safe

### 1. Issue / Problem

The SPA remounts each view by replacing `app.innerHTML`. This is acceptable, but only if all editable state is synced before remount and restored afterward.

### 2. Desired Behaviour

Treat remounting as intentional and guarded:

- All route changes from Planner call `sync()` and autosave.
- Profile changes sync before theme changes.
- Focus Card edits either persist immediately or warn before navigation.
- Add regression tests around tab switching.

### 3. Source / Basis

- Engineering basis: Prevent DOM-owned state loss on every tab switch.

### 4. Affected Module

State / Change control

Files:

- `assets/app.js`
- `tests/smoke.js`

### 5. Priority

Important

### 6. Example / Test Case

Input:

```text
Planner -> enter values -> Saved -> Planner
```

Expected output:

```text
Values remain.
```

What should not happen:

```text
Any field resets because its DOM was remounted.
```

### 7. Constraints

- Do not introduce a frontend framework unless required.
- Keep single-file JS architecture unless a separate refactor is planned.

### 8. Acceptance Check

- Tab-switch persistence tests pass for Planner, Profile, and Focus Card review fields.

---

## Change Request 7 - Fix Profile Theme Save Data Loss

### 1. Issue / Problem

Changing Theme immediately calls `saveSettings({theme})` and re-renders Profile. If the user filled other profile fields first, those unsaved values are discarded.

### 2. Desired Behaviour

Changing theme should not wipe other unsaved settings.

Recommended implementation:

- On theme change, read all current Profile fields into a draft settings object.
- Apply theme immediately from that draft.
- Save the full settings object, or apply theme visually without persistence until Save settings is clicked.

Preferred for simplicity:

- Save all current Profile fields when theme changes.

### 3. Source / Basis

- UX basis: A visual preference toggle must not clear form data.
- Engineering basis: Re-rendering Profile must preserve form values.

### 4. Affected Module

Settings / Persistence / Display

Files:

- `assets/app.js`
- `tests/smoke.js`

### 5. Priority

Critical

### 6. Example / Test Case

Input:

```text
Fill defaultInstrument=NQ, watchlist=MNQ, ES, GC, then change Theme to Dark.
```

Expected output:

```text
Profile re-renders with all entered values still present.
```

What should not happen:

```text
Only theme saves and other fields reset.
```

### 7. Constraints

- Keep immediate visual theme switching.
- Do not require user to re-enter fields.

### 8. Acceptance Check

- Theme change preserves and saves all Profile field values.
- Reload keeps theme and profile defaults.

---

## Change Request 8 - Propagate Risk Defaults Into New Focus Cards

### 1. Issue / Problem

Profile risk defaults show in Risk summary, but generated Focus Cards have blank `Planned risk %`, `Planned R`, and `Max loss`.

### 2. Desired Behaviour

New draft cards should initialize `risk` from `getSettings().riskDefaults`.

When a saved card already has risk values, keep card-specific values.

### 3. Source / Basis

- UX basis: Defaults should reduce repeated manual entry.
- Trading journal basis: Risk review depends on consistent risk fields.

### 4. Affected Module

Settings / Focus Card / Risk

Files:

- `assets/app.js`
- `tests/smoke.js`

### 5. Priority

Critical

### 6. Example / Test Case

Input:

```text
Profile defaults: risk %=0.5, planned R=2R, max loss=150
Generate new Focus Card.
```

Expected output:

```text
Focus Card review fields are prefilled with 0.5, 2R, 150.
```

What should not happen:

```text
Focus Card risk fields are blank.
```

### 7. Constraints

- User-entered card-level values must override defaults.
- Importing historical cards must not overwrite existing card risk values.

### 8. Acceptance Check

- New cards inherit risk defaults.
- Existing cards keep their own risk values after normalization/import.

---

## Change Request 9 - Make Planner Tab Respect Defaults When Empty

### 1. Issue / Problem

Saved default instrument/session apply when starting from Home/FAB, but clicking the bottom Planner tab can show blank values.

### 2. Desired Behaviour

When the current Planner draft is empty and the user opens Planner, initialize from defaults.

When the current Planner draft has user input, do not overwrite it.

### 3. Source / Basis

- UX basis: "Default instrument/session" should behave consistently.
- Engineering basis: Avoid silent overwrite of active drafts.

### 4. Affected Module

Settings / Planner / Navigation

Files:

- `assets/app.js`
- `tests/smoke.js`

### 5. Priority

Important

### 6. Example / Test Case

Input:

```text
Save defaultInstrument=NQ, defaultSession=New York AM. Open Planner from bottom nav.
```

Expected output:

```text
Instrument=NQ and Session=New York AM.
```

What should not happen:

```text
Blank fields in a fresh Planner.
```

### 7. Constraints

- Do not overwrite unsaved Planner values.
- Do not start a new draft when user is editing an existing saved card unless requested.

### 8. Acceptance Check

- Bottom Planner tab, Home start button, and FAB all initialize defaults consistently for empty drafts.

---

## Change Request 10 - Handle localStorage Quota Failures Safely

### 1. Issue / Problem

If `localStorage.setItem` throws `QuotaExceededError`, the exception is uncaught. In-memory `cards` may update before durable storage succeeds, creating divergence.

### 2. Desired Behaviour

Make persistence transactional:

- Serialize first.
- Attempt `setItem`.
- Only update in-memory `cards` after persistence succeeds.
- On quota failure, keep previous state and show a user-facing warning with export/cleanup guidance.

### 3. Source / Basis

- Engineering basis: Prevent memory/storage divergence.
- UX basis: User needs recovery path before data is lost.

### 4. Affected Module

Persistence / Change control

Files:

- `assets/app.js`
- `tests/smoke.js`

### 5. Priority

Important

### 6. Example / Test Case

Input:

```text
Import enough large cards to exceed browser quota.
```

Expected output:

```text
Import is rejected safely. Existing saved cards remain intact. User sees export/cleanup guidance.
```

What should not happen:

```text
UI shows imported cards that disappear after reload.
```

### 7. Constraints

- Do not clear user data automatically.
- Do not swallow unknown storage errors silently.

### 8. Acceptance Check

- Simulated `QuotaExceededError` test passes.
- Import/save displays actionable warning and preserves previous durable state.

---

## Change Request 11 - Update Smoke Tests and Make Them Version-Aware

### 1. Issue / Problem

`tests/smoke.js` still expects v0.7.9 while the app is v0.8.0. The release gate fails before validating persistence and workflow contracts.

### 2. Desired Behaviour

Update tests to v0.8.x and avoid brittle exact-version assertions where possible.

Recommended:

- Parse version from `assets/app.js`.
- Confirm `index.html` references the same cache key.
- Add tests for all Critical/Important fixes in this plan.

### 3. Source / Basis

- Engineering basis: Tests should protect release quality.

### 4. Affected Module

Tests / Change control

Files:

- `tests/smoke.js`
- `index.html`
- `service-worker.js`

### 5. Priority

Important

### 6. Example / Test Case

Input:

```bash
node tests/smoke.js
```

Expected output:

```text
All smoke tests pass.
```

What should not happen:

```text
Error: index version missing
```

### 7. Constraints

- Tests should fail if app and cache versions diverge.
- Tests should not require network access unless marked as network tests.

### 8. Acceptance Check

- `node tests/smoke.js` passes locally.
- CI or manual release checklist includes the smoke command.

---

## Change Request 12 - Fix Accessibility Contrast

### 1. Issue / Problem

Several color pairs fail WCAG contrast, including primary blue on white, white on primary blue, and muted text on pale blue.

### 2. Desired Behaviour

Adjust tokens so normal text and button text meet WCAG AA contrast:

- Normal text: at least 4.5:1
- Large text / icons: at least 3:1
- Focus states remain visible in light and dark mode

### 3. Source / Basis

- Accessibility basis: WCAG AA contrast.
- UX basis: Better readability for beta testers.

### 4. Affected Module

Display / Accessibility

Files:

- `assets/styles.css`

### 5. Priority

Critical for accessibility readiness; Important for functional beta if beta group is limited.

### 6. Example / Test Case

Input:

```text
Home page primary button in light mode.
```

Expected output:

```text
Button text contrast passes WCAG AA.
```

What should not happen:

```text
White text on #3A86FF fails at about 3.48:1.
```

### 7. Constraints

- Preserve visual identity where possible.
- Test both light and dark themes.

### 8. Acceptance Check

- Axe or equivalent contrast pass on Home, Planner, Saved, Profile, Focus Card.
- Manual visual check at 320px, 390px, 768px, and desktop.

---

## Change Request 13 - Remove Duplicate / Nested Main Landmarks

### 1. Issue / Problem

`index.html` has `<main id="app">`, and the SPA renders another `<main class="app-main">` inside it. This creates duplicate/nested main landmarks.

### 2. Desired Behaviour

Use only one `main` landmark.

Recommended:

- Change `index.html` wrapper from `<main id="app">` to `<div id="app">`.
- Keep rendered `<main class="app-main">`.

### 3. Source / Basis

- Accessibility basis: One primary `main` landmark per page.

### 4. Affected Module

Accessibility / HTML shell

Files:

- `index.html`
- `assets/app.js`

### 5. Priority

Important

### 6. Example / Test Case

Input:

```text
Run axe landmarks check.
```

Expected output:

```text
No nested or duplicate main landmark violation.
```

What should not happen:

```text
main inside main.
```

### 7. Constraints

- Do not break app mount lookup by `id="app"`.

### 8. Acceptance Check

- App still mounts.
- Axe no longer reports duplicate/nested main.

---

## Change Request 14 - Improve Keyboard Reachability of Sticky Actions

### 1. Issue / Problem

Planner sticky actions and bottom navigation are visually fixed but late in DOM/tab order. Keyboard users must tab through a long form before reaching key actions.

### 2. Desired Behaviour

Provide faster keyboard access.

Recommended options:

- Add a visible-on-focus skip link: "Skip to planner actions".
- Move sticky action markup earlier in DOM while preserving visual position.
- Add keyboard shortcuts only if documented accessibly.

### 3. Source / Basis

- Accessibility basis: Keyboard users should reach persistent actions efficiently.

### 4. Affected Module

Accessibility / Navigation / Planner

Files:

- `index.html`
- `assets/app.js`
- `assets/styles.css`

### 5. Priority

Important

### 6. Example / Test Case

Input:

```text
Open Planner, press Tab from top.
```

Expected output:

```text
User can reach Save Draft / Generate Focus Plan quickly through skip link or logical order.
```

What should not happen:

```text
Dozens of tabs required before reaching visible sticky actions.
```

### 7. Constraints

- Do not reduce touch usability.
- Keep bottom nav visually fixed on mobile.

### 8. Acceptance Check

- Keyboard-only pass confirms quick access to sticky actions and nav.
- Focus styles remain visible.

---

## Change Request 15 - Increase Chip / Filter Touch Targets

### 1. Issue / Problem

Some chips and filters render around 36px high, below the common 44px mobile target recommendation.

### 2. Desired Behaviour

Set chips and filter buttons to at least 44px min-height on touch layouts.

### 3. Source / Basis

- Mobile UX basis: Easier touch selection.

### 4. Affected Module

Display / Responsive UI

Files:

- `assets/styles.css`

### 5. Priority

Optional for limited beta; Important for broader mobile beta.

### 6. Example / Test Case

Input:

```text
Home session chips at 390px.
```

Expected output:

```text
Each chip min-height >= 44px.
```

What should not happen:

```text
36px chips on mobile.
```

### 7. Constraints

- Avoid vertical crowding; wrapping is acceptable.

### 8. Acceptance Check

- Mobile visual check at 320px and 390px passes.

---

## Change Request 16 - Clean Up Hosted Price API Defaults and CORS

### 1. Issue / Problem

The app has a stale default hosted API URL for non-Vercel/static hosting, and the Python API CORS allow-list does not include the current live domain.

### 2. Desired Behaviour

Update defaults:

- `HOSTED_PRICE_API_BASE` should point to `https://ictict-lake.vercel.app/api/price`, or be configured through `window.ICT_PRICE_API_BASE`.
- CORS allow-list should include `https://ictict-lake.vercel.app`.
- If the API is public, document that wildcard CORS is intentional.

### 3. Source / Basis

- Engineering basis: Avoid stale endpoint behaviour on GitHub Pages/local static deployment.
- Security basis: CORS policy should match intent.

### 4. Affected Module

Network / Deployment

Files:

- `assets/app.js`
- `api/price.py`
- `README.md`

### 5. Priority

Optional for current same-origin Vercel deployment; Important if GitHub Pages remains supported.

### 6. Example / Test Case

Input:

```text
Serve static app from GitHub Pages without custom ICT_PRICE_API_BASE.
```

Expected output:

```text
Auto-detect targets the current working API.
```

What should not happen:

```text
Auto-detect targets old ict-2mrz.vercel.app endpoint.
```

### 7. Constraints

- Same-origin Vercel `/api/price` must continue to work.
- Manual price entry must remain available.

### 8. Acceptance Check

- Network inspection shows expected price endpoint only.
- Unsupported symbol and missing symbol errors remain graceful.

---

## Change Request 17 - Clarify FVG Toggle / Timeframe Dependency

### 1. Issue / Problem

FVG timeframe can be selected while FVG is unchecked. Generated Preview says `FVG: Not confirmed`, hiding the selected timeframe.

### 2. Desired Behaviour

Use one consistent rule:

- Disable and clear FVG timeframe while FVG is unchecked, or
- Show staged timeframe as "FVG timeframe staged, not confirmed".

Recommended:

- Disable `fvgTf` unless `fvg` is checked.
- Clear `fvgTf` when `fvg` is unchecked.

### 3. Source / Basis

- UX basis: Prevent contradictory state.

### 4. Affected Module

Planner / Focus Card / Validation

Files:

- `assets/app.js`
- `tests/smoke.js`

### 5. Priority

Optional

### 6. Example / Test Case

Input:

```text
Unchecked FVG, choose 5m timeframe.
```

Expected output:

```text
Cannot choose timeframe until FVG is checked.
```

What should not happen:

```text
Hidden timeframe state persists while preview says Not confirmed.
```

### 7. Constraints

- Focus Card still needs to allow FVG to be toggled after creation.

### 8. Acceptance Check

- Planner and Focus Card FVG controls behave consistently.

---

## Change Request 18 - Add Explicit Unsaved-Changes Warnings

### 1. Issue / Problem

Users can leave Planner or Profile with unsaved work. Some state is kept in memory, but users are not told what is saved versus only drafted.

### 2. Desired Behaviour

Add visible draft state:

- "Autosaved locally" when autosave succeeds.
- "Unsaved changes" when storage fails or autosave is pending.
- Warn before destructive actions that would clear current draft.

### 3. Source / Basis

- UX basis: Prevent false sense of saved work.

### 4. Affected Module

Planner / Profile / Persistence / Change control

Files:

- `assets/app.js`
- `assets/styles.css`

### 5. Priority

Important

### 6. Example / Test Case

Input:

```text
Enter Planner fields without Save Draft.
```

Expected output:

```text
Visible status shows draft autosaved locally, or unsaved if autosave fails.
```

What should not happen:

```text
User cannot tell whether work survives refresh.
```

### 7. Constraints

- Do not spam alerts on normal tab switches.

### 8. Acceptance Check

- Draft status updates after Planner changes.
- Refresh recovery message appears after restoring an autosaved draft.

---

## Implementation Phases

### Phase 1 - Beta Blockers

Implement:

- CR1 price parser/validation
- CR2 numeric bounds
- CR4 Planner autosave/restore
- CR7 Profile theme save fix
- CR8 risk default propagation
- CR11 smoke test update

Exit criteria:

- No silent price mutation.
- Refresh restores Planner draft.
- Profile settings no longer disappear on theme change.
- New Focus Cards inherit risk defaults.
- `node tests/smoke.js` passes.

### Phase 2 - Navigation and Reliability

Implement:

- CR5 route hash/history
- CR6 remount safety
- CR9 Planner default consistency
- CR10 quota-safe persistence
- CR18 unsaved-change indicators

Exit criteria:

- Back/Forward works for tabs.
- Deep links work.
- Quota failure is handled without data divergence.
- Planner defaults behave consistently.

### Phase 3 - Accessibility and UX Hardening

Implement:

- CR12 contrast
- CR13 landmark cleanup
- CR14 keyboard reachability
- CR15 touch target sizing
- CR17 FVG control dependency

Exit criteria:

- Axe pass for contrast and landmarks.
- Keyboard-only pass for Planner and Focus Card.
- Mobile 320px and 390px remain overflow-free.

### Phase 4 - Network and Documentation Cleanup

Implement:

- CR16 price API default/CORS cleanup
- README deployment notes update
- QA checklist update

Exit criteria:

- Vercel same-origin price detection works.
- GitHub Pages/static deployment behaviour is documented.
- No stale endpoint references remain.

## Final Regression Checklist

- `node --check assets/app.js`
- `python3 -m json.tool vercel.json`
- `python3 -m py_compile api/price.py`
- `node tests/smoke.js`
- Browser smoke:
  - Home, Planner, Saved, Journal, Profile load.
  - Planner partial draft survives tab switch and refresh.
  - Save Draft appears in Saved.
  - Generate Focus Plan opens Focus Card.
  - Sweep taken and FVG after-creation edits persist.
  - Profile theme change preserves all fields.
  - Risk defaults appear on new Focus Card.
  - Auto-detect price works; manual price works if API fails.
  - Export/import JSON round-trip.
  - Clear local data clears only app keys.
  - Mobile 320px and 390px no horizontal overflow.
  - Axe/accessibility pass for contrast and landmarks.

