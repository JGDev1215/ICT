# Developer Notes

> Status: Current
> Last reviewed: 2026-07-09
> Source of truth: No

## Purpose

This folder is for durable contributor and maintainer notes that are not runtime source, release evidence, or task-local `agent-workflow/` evidence.

Start with the root project docs before editing:

- `AGENTS.md`
- `README.md`
- `CHANGELOG.md`
- `docs/README.md`
- `tests/smoke.js`

## Current Guidance

- The app is a static no-build HTML/CSS/JavaScript app.
- Keep `index.html`, `assets/config.js`, `assets/styles.css`, `assets/app.js`, and `service-worker.js` as the current runtime entrypoints unless a separate approved refactor plan changes that.
- Preserve browser localStorage as the immediate source of truth.
- Keep Supabase optional.
- Keep manual price entry available even when auto-detect or `/api/price` fails.
- Use the version/cache bump process for shipped JS/CSS behavior changes.
- Add tests before extracting logic from `assets/app.js`.
- Keep `/api/price` tests network-free by mocking provider responses.

## Related Docs

- Safe refactor prompt: `docs/plans/FINAL_SAFE_REFACTOR_IMPLEMENTATION_PROMPT_2026-07-09.md`
- Refactor baseline: `docs/qa/refactor-baseline-2026-07-09.md`
- API boundary tests: `docs/qa/api-price-boundary-tests-2026-07-09.md`
- Legacy folder policy: `Legacy/README.md`
