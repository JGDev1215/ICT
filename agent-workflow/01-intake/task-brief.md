# Task Brief

## Original User Task

Implement the scoped product fix in `docs/plans/planner-validation-price-autodetect-plan-2026-07-09.md` after reading AGENTS.md, docs/README.md, README.md, CHANGELOG.md, that plan, and the 2026-07-09 final daily report. Preserve local-first behavior, manual price fallback, storage keys, migrations, export/import compatibility, and optional Supabase sync. Do not commit or push.

## Objective

Prevent accidental empty or near-empty Focus Cards, keep meaningful partial drafts savable, add clear Generate Focus Plan validation, and improve price auto-detect reliability/status/fallback behavior.

## Repo Findings

- Safety check passed in `/Users/soonjeongguan/Desktop/FRAMEWORK`.
- Git remote is `https://github.com/JGDev1215/ICT.git`.
- Worktree was clean before workflow updates.
- App is static HTML/CSS/plain JavaScript with no build step.
- Planner save behavior is centralized in `assets/app.js` through `savePlanner(openDetails)`.
- Draft detection currently uses `plannerHasInput`, which can treat default/prefilled values as meaningful.
- Focus completion status currently uses `comp(fields)`.
- Price lookup uses `fetchPrice(symbol)`, hosted API resolution, and local helper fallback.
- Existing E2E coverage is in `tests/e2e/planner.spec.js`.

## Assumptions

- "Near-empty" means only default date/time, default profile instrument/session, or no meaningful user-entered planning data.
- Save Draft should allow one meaningful user field, market context note, or an existing loaded planner card.
- Generate Focus Plan should require instrument, session, bias, valid current price or an explicit manual-price-needed acknowledgement, and at least one complete DOL row.
- A checkbox acknowledgement for missing current price is acceptable because the source plan explicitly allows an explicit manual-price-needed acknowledgement.

## Out of Scope

- No saved-card storage key change.
- No export schema change.
- No Supabase schema or sync behavior change.
- No redesign of the planner or saved-card UI.
- No live provider dependency in automated tests.
- No commit or push.

## Success Criteria

- [ ] Empty/default-only Planner Save Draft is blocked with visible feedback.
- [ ] Meaningful partial drafts still save.
- [ ] Generate Focus Plan blocks missing required fields and partial DOL/sweep rows with visible validation.
- [ ] Manual current price remains usable without network/API access.
- [ ] Price auto-detect handles normalized symbols, malformed responses, unsupported symbols, and provider failures with clear fallback copy.
- [ ] Storage key remains `ict_cards_v078` and export schema remains `ict_dol_sweep_export_v7`.
- [ ] Required smoke and relevant Playwright tests pass.
