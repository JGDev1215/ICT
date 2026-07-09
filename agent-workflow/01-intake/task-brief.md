# Task Brief

## Original User Task

-fix everything that is wrong with this app, make sure all the instructions and plans in the doc folder are carried out. use multiple agents to complete this.

## Objective

Make concrete progress toward full app remediation by deriving requirements from current docs, using parallel agents for independent audits, and fixing the first confirmed issues without breaking local-first/static-app constraints.

## Repo Findings

- Safety check passed in `/Users/soonjeongguan/Desktop/FRAMEWORK`.
- Remote is `https://github.com/JGDev1215/ICT.git`.
- Existing uncommitted changes from the prior feedback task update `docs/daily-reports/2026-07-09-session-report-2.md` and `agent-workflow/` to clarify that real-device QA is not required.
- Current docs include active or current-context files under `docs/plans/`, `docs/qa/`, and `docs/release/`.
- `docs/qa/docs-implementation-checklist-2026-07-08.md`, `docs/qa/release-qa-evidence-2026-07-08.md`, `docs/release/release-decision-log-2026-07-08.md`, and `README.md` still contain physical/real-device QA language that conflicts with the latest product clarification.
- `README.md` says saved cards are browser-local only and not synced across devices, which is stale now that optional Supabase Account & Backup sync exists.
- v0.8.4 runtime/version/cache strings appear aligned by search.
- Parallel agents have been spawned to audit documentation/plans, runtime behavior, and test/QA coverage.

## Assumptions

- The broad goal is too large for one safe patch; per AGENTS.md, complete the safest confirmed phase first.
- Real-device QA should not remain a release gate because the app is intended for web/mobile-site usage only.
- Production web and mobile-site browser QA remains relevant.
- Do not commit or push unless explicitly requested.

## Out of Scope

- Big-bang modularization of `assets/app.js`.
- Framework migration or redesign.
- Runtime changes without a confirmed defect and approved plan.
- Destructive data/schema changes.
- Commit or push.

## Success Criteria

- [ ] Multiple agents are used for independent audit work.
- [ ] Current workflow files record the broad remediation task.
- [ ] Confirmed current documentation conflicts are corrected.
- [ ] Optional Supabase sync is described accurately.
- [ ] No runtime code is changed in Phase 1.
- [ ] Static checks pass.
