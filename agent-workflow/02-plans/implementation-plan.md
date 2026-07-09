# Implementation Plan

## Goal

Make repository documentation routing explicit for future agents and LLMs.

## Repo Findings

- Current docs are organized under `docs/database`, `docs/implementation-reports`, `docs/plans`, `docs/qa`, and `docs/release`.
- Historical docs are archived under `docs/archive`.
- `AGENTS.md` is the right durable place for agent save-location rules.
- `docs/README.md` is the right human/LLM entry point for documentation navigation.

## Files Likely Affected

- `AGENTS.md`
- `docs/README.md`
- `agent-workflow/*`
- `docs/.DS_Store`
- empty `docs/archive/old-agent-prompts/`

## Proposed Changes

- Add `Documentation Routing Rules` to `AGENTS.md`.
- Add `Before Creating A Doc` and `Where To Save New Docs` sections to `docs/README.md`.
- Remove `docs/.DS_Store`.
- Remove empty `docs/archive/old-agent-prompts/`.
- Update workflow reports for this task.

## Step-by-Step Plan

1. Confirm repo path, remote, and dirty state.
2. Remove docs folder noise.
3. Patch `AGENTS.md` with documentation routing rules.
4. Patch `docs/README.md` with a save-location table.
5. Update required `agent-workflow/` files.
6. Run the requested `find`, `rg`, and smoke checks.

## Acceptance Criteria

- Agents can determine where to save current plans, reports, QA, release, database, and archived docs.
- `docs/README.md` clearly distinguishes durable docs from `agent-workflow/`.
- No docs `.DS_Store` remains.
- Runtime smoke test passes.

## Test Plan

```bash
find docs -maxdepth 4 -type f | sort
rg -n "Documentation Routing Rules|Where To Save New Docs|docs/archive|docs/plans|docs/qa|docs/release|docs/database" AGENTS.md docs/README.md README.md
node tests/smoke.js
```

## Risks

- `AGENTS.md` was already dirty before this task; patch only the requested routing section.
- Archived docs are numerous; avoid moving them again.

## Rollback Plan

Revert the `AGENTS.md` and `docs/README.md` documentation-routing additions and restore only the removed local noise if explicitly needed.
