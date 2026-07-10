# Approved Plan

## Goal

Implement v0.8.11 exactly as a focused local-first static-app release.

## Approved Scope

- Device-local app passcode gate with default `5880`.
- Profile passcode change controls.
- Per-card Focus Card price mode: live auto-update or manual override.
- Planner/Plan Review wording cleanup with stable routes.
- Version/cache/docs/tests update.

## Non-Scope

- Git commit or push.
- Supabase schema changes.
- Backend app authentication.
- Full workflow redesign.

## Execution Rules

- Preserve saved-card compatibility.
- Keep export schema unchanged unless unavoidable.
- Do not expose or sync app passcode.
- Do not mutate final-saved cards.
- Run required tests before handoff.
