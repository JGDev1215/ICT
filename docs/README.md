# Documentation Map

> Status: Current
> Last reviewed: 2026-07-09
> Source of truth: Yes

This folder stores current project documentation plus an archive of historical plans and prompt packs. Runtime behavior is defined by the root app files, not by archived planning notes.

## Start Here

- Project overview and current usage: [`../README.md`](../README.md)
- Release history: [`../CHANGELOG.md`](../CHANGELOG.md)
- Agent rules: [`../AGENTS.md`](../AGENTS.md)
- Static contract tests: [`../tests/smoke.js`](../tests/smoke.js)
- Documentation index: this file

## Source Of Truth

Use the root README, CHANGELOG, AGENTS file, tests, and current app code before relying on older plans. Archived documents may describe previous decisions, rejected ideas, or superseded UI directions.

## Before Creating A Doc

1. Check whether the content belongs in an existing current document.
2. If it is durable project documentation, save it under the correct `docs/` folder.
3. If it is task execution evidence for the current agent run, save it under `agent-workflow/`.
4. If it is completed, superseded, or historical, save it under `docs/archive/`.

Do not create new top-level markdown files unless they are root-level project documents such as `README.md`, `CHANGELOG.md`, or `AGENTS.md`.

## Where To Save New Docs

| Content type | Save location |
| --- | --- |
| Current implementation plan | `docs/plans/` |
| Completed implementation report | `docs/implementation-reports/` |
| End-of-session daily report or historical session log | `docs/daily-reports/` |
| QA evidence, release checks, test notes | `docs/qa/` |
| Release decision or release rationale | `docs/release/` |
| Database schema, SQL, persistence setup | `docs/database/` |
| Developer notes and contributor guidance | `docs/developer/` |
| End-user notes and help content | `docs/user/` |
| Completed or superseded fix list | `docs/archive/completed-fix-lists/` |
| Historical plan, old setup guide, legacy handover | `docs/archive/historical-plans/` |
| Superseded design pack or old agent prompt pack | `docs/archive/superseded-design/` |

## Current Docs

| Document | Purpose |
| --- | --- |
| [`plans/supabase-focus-card-storage-plan.md`](plans/supabase-focus-card-storage-plan.md) | Current Supabase Focus Card backup plan and validation checklist. |
| [`plans/FINAL_SAFE_REFACTOR_IMPLEMENTATION_PROMPT_2026-07-09.md`](plans/FINAL_SAFE_REFACTOR_IMPLEMENTATION_PROMPT_2026-07-09.md) | Future safe-refactor prompt; do not execute without a separate approved no-feature refactor plan. |
| [`plans/planner-validation-price-autodetect-plan-2026-07-09.md`](plans/planner-validation-price-autodetect-plan-2026-07-09.md) | Historical v0.8.3 planner validation and price auto-detect implementation plan. |
| [`plans/review-fix-report-2026-07-09.md`](plans/review-fix-report-2026-07-09.md) | Historical v0.8.4 review remediation report and architecture notes. |
| [`daily-reports/README.md`](daily-reports/README.md) | End-of-session report format and save-location guidance. |
| [`database/supabase-focus-card-storage.sql`](database/supabase-focus-card-storage.sql) | Supabase table, RLS, index, and trigger setup artifact. |
| [`developer/README.md`](developer/README.md) | Developer notes folder policy and current no-build app guardrails. |
| [`implementation-reports/focus-card-dol-risk-implementation-report.md`](implementation-reports/focus-card-dol-risk-implementation-report.md) | Completed Focus Card DOL/risk implementation report. |
| [`qa/docs-implementation-checklist-2026-07-08.md`](qa/docs-implementation-checklist-2026-07-08.md) | Remaining production web/mobile-site QA and release housekeeping checklist. |
| [`qa/release-qa-evidence-2026-07-08.md`](qa/release-qa-evidence-2026-07-08.md) | Recorded QA evidence from the July 8 release pass. |
| [`qa/live-price-provider-qa-2026-07-09.md`](qa/live-price-provider-qa-2026-07-09.md) | Production price-provider endpoint QA for supported and unsupported symbols. |
| [`qa/refactor-baseline-2026-07-09.md`](qa/refactor-baseline-2026-07-09.md) | Safe-refactor baseline evidence before any JavaScript extraction. |
| [`qa/api-price-boundary-tests-2026-07-09.md`](qa/api-price-boundary-tests-2026-07-09.md) | Network-free `/api/price` boundary test evidence. |
| [`release/release-decision-log-2026-07-08.md`](release/release-decision-log-2026-07-08.md) | Release decisions, deferred items, and rationale. |
| [`user/README.md`](user/README.md) | User notes folder policy and current user-facing guarantees. |

## Archive

| Folder | Purpose |
| --- | --- |
| [`archive/completed-fix-lists/`](archive/completed-fix-lists/) | Completed fix lists retained for audit trail only. |
| [`archive/historical-plans/`](archive/historical-plans/) | Old implementation plans, structure reviews, and superseded setup guides. |
| [`archive/superseded-design/`](archive/superseded-design/) | Historical UI redesign pack and multi-agent prompts. |

## LLM Agent Notes

- Prefer current source files and tests over historical planning documents.
- Do not treat archived plans, prompt packs, or fix lists as current requirements.
- Treat `archive/superseded-design/` as historical context unless the user explicitly asks to revive that design work.
- Preserve browser-storage compatibility and manual price-entry fallback when using these docs to plan changes.
- Do not infer production behavior from documents marked as Historical or Superseded without checking the current app code.
