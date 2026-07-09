# Task Brief

## Original User Task

Make the folder structure easier for LLMs to understand and update `AGENTS.md` so agents go to the correct docs folder and save files in the correct docs folder.

## Objective

Improve documentation governance without changing app runtime behavior.

## Repo Findings

- `docs/README.md` already identifies current docs and archive sections.
- `docs/archive/README.md` already warns that archived docs are historical only.
- `AGENTS.md` has workflow rules but did not yet include explicit documentation routing.
- `docs/.DS_Store` exists and should be removed.
- `docs/archive/old-agent-prompts/` exists as an empty folder and should be removed.
- `.gitignore` already ignores `.DS_Store`.

## Assumptions

- Updating `AGENTS.md` is in scope because the user explicitly requested it.
- Existing untracked prompt/report files outside `docs/` are unrelated and must remain untouched.
- This is a docs-governance task only.

## Out of Scope

- Runtime app behavior.
- Supabase schema changes.
- Moving archived documents again.
- Committing or pushing.

## Success Criteria

- [ ] `AGENTS.md` explains where agents should read and save documentation.
- [ ] `docs/README.md` includes a compact save-location guide.
- [ ] `docs/.DS_Store` is gone.
- [ ] Empty `docs/archive/old-agent-prompts/` is gone.
- [ ] `node tests/smoke.js` passes.
