# Live Price Provider QA - 2026-07-09

> Status: Current
> Last reviewed: 2026-07-09
> Source of truth: No

## Scope

Production endpoint verification for the hosted price provider at:

`https://ictict-lake.vercel.app/api/price`

This check verifies live provider behavior directly against production. It does not prove that the uncommitted local v0.8.5 app has been deployed, because the production app shell still reports v0.8.4 at the time of this QA pass.

## Environment

- Local repo path: `/Users/soonjeongguan/Desktop/FRAMEWORK`
- Production app: `https://ictict-lake.vercel.app`
- Production shell observed: `ICT DOL Sweep Tracker v0.8.4`
- Check time: 2026-07-09 17:08 UTC

## Commands

```bash
curl -sS -D /tmp/ict-prod-price-mnq.headers \
  'https://ictict-lake.vercel.app/api/price?symbol=MNQ' \
  -o /tmp/ict-prod-price-mnq.json

curl -sS -D /tmp/ict-prod-price-unsupported.headers \
  'https://ictict-lake.vercel.app/api/price?symbol=NOTAREALICTSYMBOL' \
  -o /tmp/ict-prod-price-unsupported.json

curl -sS 'https://ictict-lake.vercel.app/' \
  | rg -n "ICT DOL Sweep Tracker|v0\\.|assets/app|assets/styles|service-worker"
```

## Results

### Supported Symbol

- Symbol: `MNQ`
- HTTP status: `200`
- Response fields observed:
  - `symbol`: `MNQ`
  - `yfSymbol`: `MNQ=F`
  - `price`: numeric live value
  - `source`: `yfinance`
  - `cached`: `false`
  - `timestamp`: production UTC timestamp

Result: PASS.

### Unsupported Symbol

- Symbol: `NOTAREALICTSYMBOL`
- HTTP status: `400`
- Response fields observed:
  - `error`: `unsupported symbol`
  - `symbol`: `NOTAREALICTSYMBOL`
  - `supported`: list includes supported aliases such as `MNQ`, `ES`, `NQ`, `GC`, `CL`, `BTC`, and `ETH`

Result: PASS.

## Decision

Live production price-provider endpoint behavior passed for one supported symbol and one unsupported symbol.

## Remaining Work

- Re-run production web QA after v0.8.5 is deployed because the live app shell still reports v0.8.4.
- Re-run end-to-end price auto-detect through the production UI after v0.8.5 deployment if the app bundle or endpoint routing changes.
