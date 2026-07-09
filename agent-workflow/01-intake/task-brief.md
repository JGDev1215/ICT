# Task Brief

## Original User Task

Implement the approved v0.8.4 Review Feedback Fix Plan, considering `docs/plans/review-fix-report-2026-07-09.md`.

## Objective

Ship the focused review-remediation patch without broad refactoring: clear-device behavior, notice/live-region accessibility, import handling, production price fallback, version/cache/doc updates, and targeted tests.

## Repo Findings

- Safety check passed in `/Users/soonjeongguan/Desktop/FRAMEWORK`.
- Git remote is `https://github.com/JGDev1215/ICT.git`.
- App is a static no-build HTML/CSS/JavaScript app.
- Main runtime files are `index.html`, `assets/app.js`, `assets/styles.css`, `assets/config.js`, `service-worker.js`, and optional `api/price.py`.
- Current app version before this task is v0.8.3.
- Current saved-card key is `ict_cards_v078`.
- Export schema is `ict_dol_sweep_export_v7`.
- Existing uncommitted workflow files and untracked review report must be preserved.

## Assumptions

- Clear-device behavior is local-only and must not delete Supabase cloud backups.
- Signing out of Account & Backup on local clear is acceptable to avoid immediate silent cloud restore.
- Full `assets/app.js` modularization is out of scope.
- Static serving in `api/price.py` remains because smoke tests and local single-function use depend on it.

## Out of Scope

- New cloud-delete action.
- Supabase schema changes.
- Storage key or export schema changes.
- Broad app modularization or UI redesign.
- Commit or push.

## Success Criteria

- [ ] Clear-device flow is explicit, local-only, and removes local sync metadata.
- [ ] Notice banners support `good`, `warn`, and `bad` severity with correct roles.
- [ ] Persistent live region survives re-renders and receives notice/price announcements.
- [ ] Import FileReader errors show a bad-severity notice.
- [ ] Unknown import schema warns without blocking valid imports.
- [ ] Production HTTPS skips local `127.0.0.1` price fallback.
- [ ] v0.8.4 version/cache/docs/tests are aligned.
- [ ] Required checks pass or failures are clearly reported.
