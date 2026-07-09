# API Price Boundary Tests - 2026-07-09

> Status: Current
> Last reviewed: 2026-07-09
> Source of truth: No

## Scope

Test-only Phase 6 coverage for `api/price.py` from the safe-refactor prompt. The tests verify `/api/price` boundary behavior without calling live yfinance or requiring network access.

## Test File

`tests/api/test_price.py`

## Covered Cases

- Missing `symbol` query returns HTTP 400 with `missing symbol`.
- Unsupported symbol returns HTTP 400 with `unsupported symbol` and supported aliases.
- Missing yfinance dependency returns HTTP 500.
- Provider data unavailable returns HTTP 502 with `symbol` and `yfSymbol`.
- Mocked successful provider response returns HTTP 200 with `symbol`, `yfSymbol`, numeric `price`, `source`, `cached`, and `timestamp`.

## Commands

```bash
python3 tests/api/test_price.py
npm test
```

## Results

- `python3 tests/api/test_price.py`: PASS, 5 tests.
- `npm test`: PASS, smoke + unit + API boundary tests.

## Runtime Impact

No runtime files were changed for this API boundary coverage. `api/price.py` behavior, supported aliases, static serving fallback, CORS origins, and manual price fallback remain unchanged.
