# Implementation Plan

## Goal

Run live production QA for the hosted price-provider behavior after pushing the Planner validation and price auto-detect fix.

## Repo Findings

- Production URL: `https://ictict-lake.vercel.app`.
- The app should now expose `v0.8.3` once the Vercel deployment completes.
- The direct price endpoint and Planner UI both need live-provider checks.

## Files Likely Affected

- `agent-workflow/*`

## Proposed Changes

- No app code changes planned.
- Update workflow evidence only.

## Step-by-Step Plan

1. Poll the live app HTML until it serves `v0.8.3` or a timeout makes deployment delay clear.
2. Call `https://ictict-lake.vercel.app/api/price?symbol=MNQ` and verify a positive numeric price response.
3. Call `https://ictict-lake.vercel.app/api/price?symbol=NOTREAL` and verify graceful unsupported-symbol behavior.
4. Use Playwright against `https://ictict-lake.vercel.app` to verify Planner Auto-detect for `MNQ` populates current price and visible detected status.
5. Use Playwright to verify unsupported-symbol fallback preserves manual price entry.
6. Record execution, review, senior decision, final approval, and summary.

## Acceptance Criteria

- Live deployment is confirmed to be the pushed `v0.8.3` build, or deployment delay is documented.
- Supported live provider lookup succeeds for `MNQ`.
- Unsupported live provider lookup fails gracefully.
- Planner UI works with live provider for supported symbol.
- Planner UI keeps manual entry usable after unsupported lookup.

## Test Plan

- `curl -L https://ictict-lake.vercel.app`
- `curl -i https://ictict-lake.vercel.app/api/price?symbol=MNQ`
- `curl -i https://ictict-lake.vercel.app/api/price?symbol=NOTREAL`
- Playwright live browser script against `https://ictict-lake.vercel.app`

## Risks

- Vercel deployment may lag behind the pushed commit.
- yfinance/provider availability may be transient.
- Live browser service worker cache may serve old assets unless a fresh context or cache-busted reload is used.

## Rollback Plan

No code rollback is planned for QA-only work. If a production defect is found, create a separate fix plan before editing app code.
