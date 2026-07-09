# 02 — Design System Spec

> Status: Superseded
> Last reviewed: 2026-07-09
> Source of truth: No


## Design direction

Premium mobile-first trading planner. The app should feel calm, clean and focused. It should not look like a trading terminal. It should guide the user through one bias-led liquidity plan.

Design language:

- Light mode first.
- Soft off-white canvas.
- White cards with subtle borders.
- Rounded corners.
- Pill-shaped actions and chips.
- Strong but controlled blue primary action colour.
- Green for validated / confirmed states.
- Orange for pending / caution.
- Red for invalidation / bearish / destructive actions.
- Charcoal text.
- Manrope typography.

## CSS tokens

Use CSS variables in `:root`.

```css
:root {
  --font-sans: 'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  --canvas: #FAFAF8;
  --surface: #FFFFFF;
  --surface-muted: #F4F6F8;
  --surface-line: #EEEEEC;

  --text: #1F1F1F;
  --text-muted: #8A8A8A;
  --text-soft: #5A5A5A;

  --primary: #3A86FF;
  --primary-deep: #2A5FD6;
  --primary-soft: #EAF2FF;

  --confirmed: #12A574;
  --confirmed-soft: #E4F6EF;

  --attention: #F0872B;
  --attention-soft: #FDF0E4;

  --danger: #E5484D;
  --danger-soft: #FCE9E9;

  --black: #0B0B0F;
  --charcoal: #1F1F1F;

  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-2xl: 28px;
  --radius-pill: 999px;

  --shadow-card: 0 8px 24px -18px rgba(20,24,40,.25);
  --shadow-hero: 0 24px 44px -20px rgba(58,134,255,.7);
  --shadow-fab: 0 16px 30px -10px rgba(58,134,255,.8);

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  --app-max-width: 430px;
  --bottom-nav-height: 90px;
}
```

## Typography

Use Manrope via Google Fonts initially:

```html
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet">
```

Recommended scale:

| Token | Size | Weight | Usage |
| --- | ---: | ---: | --- |
| Display | 40-46px | 800 | Hero instrument labels. |
| Page title | 28-30px | 800 | Home, Saved, Journal, Profile. |
| Section title | 16-19px | 800 | Card groups and screen sections. |
| Body | 14-16px | 500/600 | Explanation and notes. |
| Label | 11-13px | 700/800 | Uppercase field labels and metadata. |
| Caption | 11-13px | 600/700 | Timestamps, helper text, tags. |

## Layout system

### App shell

```html
<div class="app-shell">
  <main class="app-main"></main>
  <nav class="tab-bar"></nav>
</div>
```

Rules:

- `app-shell` max-width: `var(--app-max-width)`.
- Full width on mobile.
- Centre on desktop.
- Background: `var(--canvas)`.
- Bottom padding must account for the tab bar.

### Mobile surface

The design canvas shows a phone frame, but the live app should **not** render a black device frame. Use the inner app surface only.

Desktop preview can centre the mobile app in the browser, but production should feel native in mobile Safari/Chrome.

## Core components

### Button

Variants:

- Primary: blue background, white text.
- Secondary: muted surface background.
- Ghost: white background with border.
- Success: green background.
- Danger: red soft background with red text.
- Icon/FAB: circular blue or charcoal.

Class suggestions:

```css
.btn
.btn-primary
.btn-secondary
.btn-ghost
.btn-success
.btn-danger
.btn-icon
.fab
```

### Chips

Use chips for filters, sessions and tags.

Variants:

```css
.chip
.chip-active
.chip-primary
.chip-success
.chip-warning
.chip-danger
```

### Badges

Badges should show state:

- Bullish: green soft.
- Bearish: red soft.
- Draft: muted grey.
- Final saved: blue soft.
- Hit: green soft.
- Miss: red soft.
- Breakeven: orange soft.

### Cards

Use:

```css
.card
.card-hero
.card-soft
.card-dashed
.card-row
```

Card rules:

- Background white.
- Border `1px solid var(--surface-line)`.
- Radius 18-24px.
- Padding 16-22px.
- Subtle shadow only for elevated cards.

### Form controls

Use real accessible form elements.

Classes:

```css
.field
.field-label
.input
.textarea
.select
.segmented
.segmented-option
```

Rules:

- Minimum tap target: 44px.
- Labels above inputs.
- Avoid tiny select controls.
- Price inputs should use `inputmode="decimal"` and keep current sanitisation.

### Bottom tab bar

Tabs:

1. Home
2. Planner
3. Saved
4. Journal
5. Profile

The design includes Timeline, Liquidity Map and Risk as deeper screens. These can be accessed from Home, Focus Card, Journal/Profile or secondary actions.

### Sticky CTA

The Plan Builder should use a sticky bottom CTA:

- Left secondary icon button for save draft.
- Right primary CTA for Generate Focus Plan / Save card.

## Screen-specific visual notes

### Home

- Hero focus card uses blue gradient.
- Metrics use white stat cards.
- Watchlist card is optional initially.

### Plan Builder

- Chat assistant bubble at top.
- Form fields below.
- Generated preview cards near bottom.
- Sticky CTA.

### Focus Card Details

- Dark gradient hero.
- Bias badge in hero.
- Chart placeholder below hero.
- Validation and invalidation side-by-side on mobile where possible; stack if narrow.

### Saved

- Search field and filter chips.
- Saved cards as rounded white cards.
- FAB for new plan.

### Timeline

- Vertical line with nodes.
- Completed = green.
- Live now = blue.
- Pending = grey/orange.

### Liquidity Map

- Search, category chips and concept cards.
- Add-to-plan actions must write into planner draft state, not create a trade signal.

### Risk Tracker

- Dark hero panel for planned risk.
- Stat grid uses existing final-save analytics.
- Review quality bars are derived from available markers where possible.

### Journal

- Screenshot grid can be placeholder-only initially.
- Text notes and tags should be local data.

### Profile

- Settings screen for export/import, default instrument/session and clear local data.

## Accessibility requirements

- Every button must be a real `<button>`.
- Every input must have a label.
- Colour is not the only indicator of status.
- Use text labels for Bullish/Bearish, Hit/Miss, Final Saved/Draft.
- Maintain visible focus states.
- Maintain minimum 44px tap targets.

## Anti-patterns to avoid

- Do not copy inline styles from the canvas into production.
- Do not keep dark theme components mixed with the new light mobile system.
- Do not create static screens with fake data where real state exists.
- Do not remove export/import.
- Do not use the AI prompt card to imply trading recommendations.
