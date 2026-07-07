# Focus Card DOL Navigation and Risk Implementation Report

## Purpose

This implementation turns the Focus Card into a DOL navigation dashboard. The card now records when it was created and edited, captures price snapshots, shows where price is relative to the active Draw on Liquidity, logs route evidence such as SIBI/BISI/CE respect or disrespect, and calculates potential risk-to-reward to the selected DOL.

## Implemented Scope

- Added immutable creation timestamp and saved-edit timestamp in New York time.
- Added price snapshot and price history records for creation, saved edits, and final saves.
- Added 5-minute delayed-price disclaimer near price data.
- Added manual current-price override on the Focus Card.
- Moved the Price Map Dashboard to the top of the Focus Card Details view.
- Added Active DOL selector and distance/status panel.
- Added Route to DOL / PD array evidence log for SIBI, BISI, CE, OB, FVG, highs, lows and other arrays.
- Added potential R:R calculator using direction, entry/current price, selected DOL target and invalidation/stop level.
- Added hard gates so invalid R:R states are blocked and explained.
- Added schema migration defaults for older saved cards.
- Added smoke-test coverage for timestamps, price snapshots, route evidence, active DOL and R:R.

## Data Model Additions

Each normalized card now supports:

```js
createdAt
createdAtNy
updatedAt
updatedAtNy
activeDolId
priceSnapshot
priceHistory
routeEvidence
riskPlan
```

`priceSnapshot` stores the latest saved price context:

```js
{
  price,
  symbol,
  source,
  capturedAt,
  capturedAtNy,
  delayDisclaimer
}
```

`routeEvidence` stores manual observations:

```js
{
  id,
  arrayType,
  timeframe,
  level,
  behavior,
  notes,
  createdAt,
  createdAtNy
}
```

`riskPlan` stores calculated planning metrics:

```js
{
  direction,
  entryPrice,
  targetDolId,
  targetPrice,
  invalidationPrice,
  riskPoints,
  rewardPoints,
  rr,
  status,
  message
}
```

## R:R Rules

Long:

```text
risk = entry - invalidation
reward = target - entry
rr = reward / risk
```

Short:

```text
risk = invalidation - entry
reward = entry - target
rr = reward / risk
```

The calculator returns unavailable or invalid unless all of these are true:

- Direction is Long or Short.
- Entry/current price is numeric.
- Target price is numeric.
- Invalidation price is numeric.
- Risk is greater than zero.
- Reward is greater than zero.

Allowed output wording remains educational: "Potential R:R to selected DOL." The app does not emit buy/sell recommendations.

## Save Behavior

Typing into the Focus Card does not update stored data. The user must press:

- `Save changes`, or
- `Final save`

Only then are `updatedAt`, `updatedAtNy`, `priceSnapshot`, `priceHistory`, route evidence, active DOL and risk plan persisted.

## Validation

Validated with:

```bash
node tests/smoke.js
python3 -m py_compile api/price.py tools/yfinance_price_server.py
```

The smoke test now covers:

- Legacy card migration into new timestamp/price fields.
- NY timestamp generation.
- Price snapshot and price history defaults.
- Active DOL defaulting.
- Route evidence normalization.
- Long, short and invalid R:R calculations.
- Focus Card rendering order with Price Map before Market Context.
- Manual price override field.
- Route evidence inputs.
- Risk invalidation input.

## Remaining Operational Step

The hosted yfinance API still requires the correct Vercel production domain to be wired into `HOSTED_PRICE_API_BASE` if the GitHub Pages frontend is used. Same-origin `/api/price` works when the app is opened directly from a Vercel deployment.
