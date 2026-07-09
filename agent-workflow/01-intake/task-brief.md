# Task Brief

## Original User Task

Run the requested git status/diff/add/commit/push commands, then perform live production price-provider QA because automated price tests use mocked provider responses.

## Objective

Verify the live production app and hosted price endpoint after deployment, focusing on real provider behavior for supported and unsupported symbols and preserving manual price fallback.

## Repo Findings

- Safety check passed in `/Users/soonjeongguan/Desktop/FRAMEWORK`.
- Git remote is `https://github.com/JGDev1215/ICT.git`.
- Commit `18c3149 fix: validate planner saves and price auto-detect` was pushed to `main`.
- Worktree was clean before starting this live-QA workflow.
- Live app URL from handoff: `https://ictict-lake.vercel.app`.
- Price endpoint should be available at `https://ictict-lake.vercel.app/api/price?symbol=MNQ`.

## Assumptions

- Live QA should use the production Vercel URL, not localhost.
- It is acceptable to use direct HTTP checks plus Playwright browser automation against the live URL.
- If the live site has not deployed `v0.8.3` yet, wait briefly and poll before judging the runtime behavior.

## Out of Scope

- No code changes unless a blocking defect is found and separately planned.
- No creation of live QA Focus Cards unless needed for price-provider verification.
- No commit or push for workflow-only QA evidence unless explicitly requested.

## Success Criteria

- [ ] Live app serves `v0.8.3` assets.
- [ ] Live `/api/price?symbol=MNQ` returns JSON with a positive numeric price.
- [ ] Live `/api/price?symbol=NOTREAL` fails gracefully with unsupported-symbol JSON/status.
- [ ] Live Planner Auto-detect for `MNQ` populates Current price and shows detected status.
- [ ] Live Planner unsupported symbol leaves manual price usable and shows fallback status.
- [ ] Results are recorded in workflow evidence.
