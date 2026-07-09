# Approved Plan

## Decision

Approved.

## Execution Scope

Run live production QA only. Do not edit runtime app code.

## Steps Approved For Execution

1. Poll live production HTML/assets for `v0.8.3`.
2. Test live supported endpoint: `/api/price?symbol=MNQ`.
3. Test live unsupported endpoint: `/api/price?symbol=NOTREAL`.
4. Test live Planner Auto-detect for supported `MNQ`.
5. Test live Planner fallback/manual entry behavior for unsupported symbol.
6. Record results in workflow reports.

## Acceptance Criteria

- Live app version is confirmed or deployment lag documented.
- Supported live provider lookup returns positive numeric price.
- Unsupported live lookup fails gracefully.
- Planner Auto-detect and fallback behavior work against production.
