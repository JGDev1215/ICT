# Task Brief

## Original User Task

this web app must ready for deployment for single user trader to rely on this app.

## Objective

Prove or improve deployment readiness for a single-user trader relying on the static web app, while preserving local-first storage, manual price fallback, optional Supabase backup, GitHub Pages support, and Vercel price API support.

## Repo Findings

- Path confirmed: `/Users/soonjeongguan/Desktop/FRAMEWORK`.
- GitHub remote confirmed: `https://github.com/JGDev1215/ICT.git`.
- Starting git status was clean and up to date with `origin/main`.
- Latest local commit: `1735654 feat: ship v0.8.6 planner and layout updates`.
- Vercel and GitHub Pages currently serve `ICT DOL Sweep Tracker v0.8.6` with `0.8.6-release-20260709` assets.
- GitHub Actions for the v0.8.6 push are green for Static smoke test, Browser E2E, and GitHub Pages deploy.
- Production Vercel price endpoint returns HTTP 200 for `MNQ` and HTTP 400 for unsupported symbols.
- Live Supabase REST API is reachable; anon insert attempts into `focus_cards` and `user_settings` are denied by RLS.
- Production Profile signed-out Account & Backup smoke passes: local draft save works without login and Clear this device data clears local cards only after a cloud-backup warning.
- Credentialed production Account & Backup QA passes with the real `admin` account: backup upload, reload, second-browser restore, final-save sync, clear-device local-only behavior, database verification, and QA row cleanup.
- Deployed admin password was rotated away from the weak/default value and verified through Supabase Auth plus production Account & Backup smoke.
- Supabase security advisor reports leaked-password protection is disabled.

## Assumptions

- "Ready for deployment" means beta/single-user web deployment readiness, not public commercial release.
- Physical real-device QA is out of scope per current repo documentation; browser mobile-site QA is acceptable.
- Supabase remains optional backup/sync only; localStorage and JSON export/import remain the immediate reliability path.

## Out of Scope

- Runtime feature changes without a newly discovered blocker.
- New storage keys, schema changes, or Supabase migrations.
- Public-release accessibility certification.
- Real-device iOS/Android or PWA install testing.
- Credentialed Supabase login/sync testing without the real admin password or an authenticated production browser session.

## Success Criteria

- [x] Required repository safety checks pass.
- [x] Current CI/deploy status for v0.8.6 is verified.
- [x] Production Vercel and GitHub Pages serve the current v0.8.6 shell/assets.
- [x] Production Vercel browser flow can create, reload, final-save, and view a saved Focus Card using browser-local storage.
- [x] Production price API passes supported and unsupported-symbol checks.
- [x] Local automated smoke/unit/API/E2E checks pass.
- [x] Credential-independent Supabase RLS and signed-out optional-backup behavior are verified.
- [x] Credentialed Supabase Account & Backup QA is completed and recorded.
- [x] Deployed admin password is rotated to a strong private value and stored only in ignored `.env.local`.
- [ ] Supabase leaked-password protection is enabled before public release if the project plan supports it.
