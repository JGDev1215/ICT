# Current Task

User task:

You are working in the local repo:

`/Users/soonjeongguan/Desktop/FRAMEWORK`

Project remote:

`https://github.com/JGDev1215/ICT.git`

Before doing anything, read:

1. AGENTS.md
2. docs/README.md
3. README.md
4. CHANGELOG.md
5. docs/plans/planner-validation-price-autodetect-plan-2026-07-09.md
6. docs/daily-reports/2026-07-09-final-codex-report.md

Follow AGENTS.md exactly. Run the required safety check first:

```bash
pwd
git remote -v
git status
find . -maxdepth 3 -type f | sed 's#^\./##' | sort | head -200
```

Stop if the path is not `/Users/soonjeongguan/Desktop/FRAMEWORK` or the remote is not `https://github.com/JGDev1215/ICT.git`.

Current project state:
- Static no-build app: HTML, CSS, plain JavaScript.
- Main runtime files: index.html, assets/app.js, assets/styles.css, assets/config.js, service-worker.js.
- Optional backend-like file: api/price.py for Vercel yfinance price lookup.
- Browser localStorage remains the immediate source of truth.
- Supabase is optional Focus Card backup/sync, not a replacement for local-first behavior.
- Manual price entry must always work even if auto-detect fails.
- Current saved-card key: ict_cards_v078.
- Export schema: ict_dol_sweep_export_v7.
- Latest pushed commit at handoff: 22836b9 docs: add final Codex daily report.

Most recent verified live QA:
- Live app: https://ictict-lake.vercel.app
- Admin login passed.
- Focus Card create, save changes, final save, sync, reload persistence passed.
- Price auto-detect for MNQ passed.
- Smoke test passed.
- Live QA cards E2EQA448171 and PWQA104766 remain in the admin backup account.

Recommended next task:
Implement the scoped product fix in:

`docs/plans/planner-validation-price-autodetect-plan-2026-07-09.md`

Primary goals:
1. Prevent accidental empty or near-empty Focus Cards.
2. Keep partial meaningful drafts allowed.
3. Add clear Planner validation for Generate Focus Plan.
4. Improve price auto-detect reliability and user-facing status/fallback behavior.
5. Preserve local-first behavior, manual price fallback, storage keys, migrations, export/import compatibility, and Supabase optional sync.

Required checks after runtime changes:
- node tests/smoke.js
- Add/update Playwright tests where appropriate.
- If JS/CSS behavior changes, update cache-busted references in index.html, CACHE_NAME and STATIC_ASSETS in service-worker.js, and tests/smoke.js assertions.
- Update README/CHANGELOG when relevant.

Do not commit or push unless explicitly instructed.
