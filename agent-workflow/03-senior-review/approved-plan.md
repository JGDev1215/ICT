# Approved Plan

## Approved Scope

Implement documentation routing guidance and remove docs folder noise.

## Required Changes

- Add `Documentation Routing Rules` to `AGENTS.md`.
- Add `Before Creating A Doc` and `Where To Save New Docs` to `docs/README.md`.
- Remove `docs/.DS_Store`.
- Remove empty `docs/archive/old-agent-prompts/`.
- Update workflow reports for this task.

## Guardrails

- Do not change app runtime files.
- Do not move archived documents again.
- Do not touch unrelated untracked prompt/report files outside `docs/`.
- Do not commit or push unless separately requested.

## Required Checks

- `find docs -maxdepth 4 -type f | sort`
- Routing `rg` scan requested by the user.
- `node tests/smoke.js`
