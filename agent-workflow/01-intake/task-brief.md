# Task Brief

## Original User Task

Implement the v0.8.11 Single-User Access, Price Mode, and Planner Navigation Plan.

## Objective

Ship a focused v0.8.11 static-app release that adds device-local passcode access, editable passcode settings, per-card live/manual price mode, and clearer Planner/Plan Review wording while preserving local-first storage and completed Planner validation behavior.

## Repo Findings

- Current path is `/Users/soonjeongguan/Desktop/FRAMEWORK`.
- GitHub remote is `https://github.com/JGDev1215/ICT.git`.
- Existing uncommitted changes before implementation were limited to prior `agent-workflow/` markdown updates.
- App is a static no-build HTML/CSS/JavaScript product.
- Current version/cache strings are v0.8.10 final-lock.
- Existing Profile has an Account & Backup 4-digit PIN for Supabase backup only.
- Existing Focus Card price snapshot updates on Save changes / Final save and has manual override only.
- Planner validation plan is marked Historical and completed; do not reactivate it.

## Assumptions

- App passcode is a local convenience gate, not cryptographic security.
- Default app passcode is `5880`.
- App passcode stays local-only and is excluded from export/import and Supabase settings sync payloads.
- Price mode is per editable Focus Card.
- Stored price data changes only when the user saves.
- Planner/Focus Plan merge is a low-risk wording/navigation cleanup, not a route rewrite.

## Out of Scope

- Backend authentication.
- Supabase schema changes.
- Storage key or export schema changes unless strictly needed.
- Full route redesign.
- Commit or push.

## Success Criteria

- [ ] App starts locked and accepts passcode `5880`.
- [ ] Wrong passcode does not reveal app routes.
- [ ] Profile allows local passcode change with current passcode and confirmation.
- [ ] Passcode is excluded from export/import and remote settings payloads.
- [ ] Editable Focus Cards support Live auto-update or Manual override price mode.
- [ ] Final-saved cards remain locked.
- [ ] Planner and Plan Review copy are clearer and consistent.
- [ ] v0.8.11 cache/version/docs/tests are updated.
