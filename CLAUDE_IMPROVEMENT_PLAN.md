# Claude Improvement Plan — Repository Structure Review

Date: 2026-07-07 (re-verified pass)
Scope: full-repo structure review of `JGDev1215/ICT` at v0.7.9, with a phased improvement plan.
Method: findings below were verified against the working tree and git history (smoke test executed, Pages publish scope enumerated, root-cause commit traced), not inferred from docs.

---

## 1. Current Structure Snapshot

```text
ICT/
├── index.html                  # App shell (39 lines), versioned asset URLs
├── assets/
│   ├── app.js                  # Entire app: one 1,829-line IIFE
│   └── styles.css              # 623 lines
├── service-worker.js           # Cache-first PWA worker, versioned cache name
├── manifest.webmanifest
├── api/
│   └── price.py                # Vercel Python Function: price API + static file server
├── tests/
│   └── smoke.js                # 565-line static Node smoke test (no framework)
├── knowledge/                  # 329 markdown files, 8.7 MB (ICT mentorship notes)
│   └── KnowledgeExtracted/...
├── Legacy/                     # 216 KB of retired HTML/JS versions
├── docs/
│   ├── ui-redesign/            # 12-doc design/build pack
│   ├── fix-lists/              # "7-7 AM SESSION.md" (space in filename)
│   └── focus-card-dol-risk-implementation-report.md
├── .github/workflows/
│   ├── pages.yml               # Deploys the ENTIRE repo to GitHub Pages
│   └── smoke.yml               # Runs node tests/smoke.js on push/PR
├── AGENTS.md                   # 47-byte stub (heading only, no content)
├── CHANGELOG.md
├── README.md
├── ISSUE_FIX_PLAN.md           # ┐
├── PREMIUM_MOBILE_APP_UI_PLAN.md  # ├─ planning docs living at repo root
├── saved-setups-tab-update-plan.md# │
├── ict-framework-handover.md   # ┘
├── vercel.json, .vercelignore, pyproject.toml, requirements.txt
└── .gitignore, .nojekyll, .python-version
```

### What is working well

- **Clear product focus.** One app, one workflow, documented thoroughly in `README.md` and a maintained `CHANGELOG.md`.
- **No-build philosophy is consistent.** Static HTML/CSS/JS, no runtime deps, localStorage-only data — simple to run and deploy.
- **CI exists.** A smoke test runs on every push/PR, and Pages deploys are automated.
- **Legacy is quarantined**, not deleted — old versions live under `Legacy/` instead of polluting the live app.
- **Deliberate cache-busting.** Versioned query strings on assets plus a versioned service-worker cache name.
- **CSS is token-driven and healthy.** `assets/styles.css` uses `var(--…)` design tokens in ~185 places against only ~28 raw color literals — a real design system, not scattered magic values. Not a problem area; left as-is by this plan.
- **The monolith has clean internal seams.** Despite being one file, `app.js` is organized around a single `render()` dispatcher (`app.js:1800`) that routes to per-screen functions (`home()`, `planner()`, `saved()`, `focusCard()`, `timeline()`, `liquidityMap()`, `risk()`, `journal()`, `profile()`). Those function boundaries are exactly where module extraction (Phase 3) can cut.
- **The smoke test genuinely executes the app**, not just greps it: it compiles `app.js`/`service-worker.js` with `new vm.Script(...)` and runs `app.js` in a sandboxed `vm` context (`tests/smoke.js:191`), then exercises migration, export/import round-trips, and analytics against the real code.

---

## 2. Findings (ordered by severity)

### P0 — Broken or risky today

1. **CI is red: the smoke test crashes on a file that was deleted out from under it.**
   `tests/smoke.js:15` does `read('tools/yfinance_price_server.py')` and `node tests/smoke.js` fails immediately with `ENOENT` — so `smoke.yml` fails on every push/PR.
   **Root cause (traced through git history):** `tools/yfinance_price_server.py` *was* committed (added in `06c00b6` "Prepare static app for GitHub Pages", edited in `7ec9e6b`), then **deleted in `d392def` "Clarify Vercel Python entrypoint"** — 96 lines removed. That deletion broke CI and was never noticed because the smoke workflow was presumably already failing or unmonitored.
   **The reference was never cleaned up in 5 places**, all of which now point at a nonexistent file:
   - `tests/smoke.js:15` (crashes CI)
   - `README.md:65` (local-helper run instructions) and `README.md:317` (structure tree)
   - `assets/app.js:1460` (a *user-facing* error string telling users to "start tools/yfinance_price_server.py")
   - `docs/focus-card-dol-risk-implementation-report.md:126`
   **Fix:** decide whether the local price helper is a supported feature. If yes, restore `tools/yfinance_price_server.py` (it exists in git at `bda9601:tools/yfinance_price_server.py`). If no, remove all 5 references. Either way CI must go green.

2. **GitHub Pages publishes the entire repository.**
   `pages.yml` uploads `path: .`, so every deploy publishes the 329-file `knowledge/` corpus (extracted private-mentorship content), `Legacy/`, all planning docs, and `docs/` as public web pages. `.vercelignore` protects the Vercel deploy but nothing protects Pages. At minimum, filter the Pages artifact to app files only (`index.html`, `assets/`, `manifest.webmanifest`, `service-worker.js`, `.nojekyll`). Separately, review whether the `knowledge/` material should be in a public repo at all.

### P1 — Structural debt

3. **Planning documents are scattered across the root.**
   `ISSUE_FIX_PLAN.md`, `PREMIUM_MOBILE_APP_UI_PLAN.md`, `saved-setups-tab-update-plan.md`, `ict-framework-handover.md`, and this file are all root-level, while other plans live in `docs/ui-redesign/` and `docs/fix-lists/`. Consolidate under `docs/plans/` so the root contains only app files, config, README, and CHANGELOG.

3a. **Stale fix-lists read as live TODOs — a documentation hazard.**
   `docs/fix-lists/7-7 AM SESSION.md` is a pre-redesign audit written the morning of 2026-07-07, formatted as an urgent P0/P1/P2 list ("Do not start UI screen building yet", "biggest technical risk before the UI redesign"). Cross-checking it against the current tree shows the completed v0.7.9 redesign has **already resolved ~90% of it**:

   | Fix-list item | Current state |
   |---|---|
   | P0-01 core app still `v0.7.8` / schema `v6` | Resolved — `app.js` is `v0.7.9`, `SCHEMA = ict_dol_sweep_export_v7` |
   | P0-02 bias not in core card model | Resolved — bias lives in core `blank()`/`normFields()`/`normaliseCard()` (27 refs) |
   | P0-03 `Storage.prototype.setItem` monkey-patch | Resolved — patch exists only in `Legacy/assets/bias-extension.js`, not loaded by `index.html` |
   | P0-04 review-card lookup by DOM text | Resolved — `data-ict-review-id` wired through `render()` (12 refs) |
   | P1-08 "app.js is effectively one line" | Resolved — 1,829 readably-formatted lines |
   | P1-09 core/extension duplicate responsibilities | Resolved — bias merged into core; extension retired to `Legacy/` |
   | P2-01 / P2-02 dark theme, Space Grotesk / JetBrains fonts | Resolved — Manrope loaded, token-driven light CSS |
   | P2-03 no bottom-tab app shell | Resolved — `renderTabBar()` / `renderShell()` |

   Only two threads remain open, and both **independently confirm findings below**: P1-08's "split into `state.js`/`data.js`/`ui.js`/`screens/*`" → finding **#7** (modularize `app.js`); P0-06's "smoke test only does static string/syntax checks" → finding **#9** (partially addressed since — the test now executes `app.js` in a `vm`, but ~57 raw source-greps remain).
   **Action:** when moving plan docs (item 3), mark finished fix-lists as historical — either move them to `docs/plans/archive/` or add a `> Status: superseded by v0.7.9 (YYYY-MM-DD)` banner at the top — so no future contributor or agent treats a done list as a live P0 queue.

4. **No agent/contributor guidance.** `AGENTS.md` is an empty stub and there is no `CLAUDE.md`. Any assistant (or new contributor) must rediscover the version-bump ritual, storage-key conventions, and no-build constraint from scratch every session. See §4 for proposed content.

5. **Version strings are duplicated in five places and asserted verbatim by tests.**
   A release currently requires synchronized edits to `index.html` (title, footer, two `?v=` query strings), `service-worker.js` (`CACHE_NAME` + two asset URLs), `assets/app.js` (`VERSION`), `README.md`, and `tests/smoke.js` (which asserts the exact cache-bust strings). This is the most error-prone routine in the repo. Short-term: document the checklist. Medium-term: a tiny `tools/bump-version.js` script that rewrites all locations from one source of truth.

6. **Vercel setup mixes concerns and shows churn.**
   Six of the last ten commits fight Vercel static serving, and the current solution makes `api/price.py` double as a static file server (`send_static`, `includeFiles` in `vercel.json`), while `pyproject.toml` still carries a leftover `[tool.vercel] entrypoint`. Prefer Vercel's native static hosting for the frontend and keep the Python function API-only; delete the `pyproject.toml` Vercel block once confirmed unused.

### P2 — Code architecture

7. **`assets/app.js` is a 1,829-line monolithic IIFE** (121 top-level functions, ~439 declarations) holding constants, storage/migration, normalization, price fetching, rendering for 9 screens, routing, and export/import. It works and is internally organized (single `render()` dispatcher, one function per screen), but every change forces whole-file reasoning and merge conflicts are guaranteed with parallel work. Because the screen functions are already clean seams, ES modules (`<script type="module">`, which run on GitHub Pages with **no build step**) map onto them almost 1:1:

   ```text
   assets/js/
   ├── main.js          # boot + router
   ├── constants.js     # instruments, draws, sessions, timeframes…
   ├── storage.js       # keys, migration, normaliseCard, export/import
   ├── price.js         # hosted/local price API + cache
   ├── pricemap.js      # priceMapLevels, dolDistance, ladder rendering
   └── views/           # home.js, planner.js, saved.js, focus-card.js, …
   ```

   Migrate one seam at a time (constants → storage → price → views), keeping the smoke test green at each step.

8. **Configuration is hardcoded in app code.** `HOSTED_PRICE_API_BASE` and `LOCAL_PRICE_API_BASE` live inside `app.js`; the README documents a `window.ICT_PRICE_API_BASE` override. Move the defaults into a small config block at the top of `index.html` (or `assets/js/config.js`) so deploy targets change without touching app logic.

### P3 — Testing and hygiene

9. **The smoke test mixes solid behavioral checks with brittle source-greps.** Of ~269 assertions, ~57 are raw `appSource.includes("…exact source text…")` (e.g. `"const KEY = 'ict_cards_v078'"`, exact `?v=` strings, literal UI copy like `"AI Trade Plan Builder"`), so legitimate refactors and copy edits break the test even when behavior is unchanged. **Keep** the genuinely valuable half — it runs `app.js` in a `vm` sandbox (`tests/smoke.js:191`) and exercises migration, export/import round-trips, and final-save analytics against the executed code — and **retire** the raw string greps in favor of asserting on behavior. Longer-term, add one Playwright happy-path test (create plan → save → reload → verify) since the repo targets mobile PWA behavior the static test cannot see.

10. **Misc hygiene.**
    - No `LICENSE` file — intentional or not, decide and record it.
    - `docs/fix-lists/7-7 AM SESSION.md` has spaces in the filename; use kebab-case (`2026-07-07-am-session.md`) and date-prefix fix-lists.
    - The service worker is cache-first for everything including `index.html`; updates depend entirely on remembering the `CACHE_NAME` bump. Consider network-first for navigation requests to reduce stale-shell risk.
    - `.python-version`/`requirements.txt` pin only `yfinance`; fine, but note in CLAUDE.md that Python exists solely for the Vercel function.

---

## 3. Phased Plan

### Phase 0 — Stop the bleeding (≤1 hour)

| # | Action | Files |
|---|--------|-------|
| 0.1 | Get CI green. Decide if the local price helper is supported: restore `tools/yfinance_price_server.py` from git (`git checkout bda9601 -- tools/yfinance_price_server.py`) **or** remove all 5 stale references | `tests/smoke.js:15`, `README.md:65,317`, `assets/app.js:1460`, `docs/focus-card-dol-risk-implementation-report.md:126` |
| 0.2 | Filter the Pages artifact to app files only (`index.html`, `assets/`, `manifest.webmanifest`, `service-worker.js`, `.nojekyll`) | `.github/workflows/pages.yml:31` |
| 0.3 | Decide whether `knowledge/` (8.7 MB, 329 files of extracted mentorship content) belongs in a public repo; if not, move it to a private repo/branch | `knowledge/` |

### Phase 1 — Repo hygiene (1–2 sessions)

| # | Action | Files |
|---|--------|-------|
| 1.1 | Move root plan docs into `docs/plans/`; leave README + CHANGELOG at root | root `*.md` |
| 1.2 | Write `CLAUDE.md` (see §4) and fill in `AGENTS.md` or point it at CLAUDE.md | new |
| 1.3 | Document the release/version-bump checklist; optionally script it | `CLAUDE.md`, `tools/` |
| 1.4 | Rename spaced filenames; add `LICENSE` decision | `docs/fix-lists/` |

### Phase 2 — Deployment cleanup (1 session)

| # | Action | Files |
|---|--------|-------|
| 2.1 | Serve static frontend natively on Vercel; make `api/price.py` API-only (delete `send_static`, `STATIC_FILES`, `includeFiles`) | `api/price.py`, `vercel.json` |
| 2.2 | Remove the stale `[tool.vercel]` block | `pyproject.toml` |
| 2.3 | Extract price API base URLs into a config block | `index.html`, `assets/app.js` |

### Phase 3 — Modularize `app.js` (incremental, several sessions)

| # | Action | Notes |
|---|--------|-------|
| 3.1 | Switch `index.html` to `<script type="module">`; extract `constants.js` | Smoke test must stay green |
| 3.2 | Extract `storage.js` (keys, migration, normaliseCard, export/import) | Highest-value seam; most-tested code |
| 3.3 | Extract `price.js` and `pricemap.js` | |
| 3.4 | Split views one screen at a time | Home → Planner → Saved → Focus Card |
| 3.5 | Soften smoke-test string assertions as modules move | `tests/smoke.js` |

### Phase 4 — Test depth (optional, after Phase 3)

- One Playwright end-to-end happy path in CI (create → save → reload → verify → export/import).
- Keep the vm-based behavioral smoke checks; retire raw source-string greps.

---

## 4. Proposed `CLAUDE.md` (agent readiness)

The single highest-leverage improvement for Claude-assisted work on this repo is a `CLAUDE.md` capturing what is currently tribal knowledge:

```markdown
# CLAUDE.md

## What this is
Static, no-build ICT trade-planning PWA (educational only, no financial advice).
All data is browser-local (localStorage). No backend except an optional
Vercel Python price function (api/price.py, yfinance).

## Commands
- Run locally:  python3 -m http.server 8000  → http://localhost:8000
- Test:         node tests/smoke.js   (must pass before every commit)

## Hard constraints
- NO build step, NO npm dependencies, NO frameworks. Plain HTML/CSS/JS.
- Never call external AI/forecasting services; the planner is deterministic.
- Never break localStorage migration: current key ict_cards_v078;
  legacy keys ict_cards_v077, ict_cards_v076, ict_dol_sweep_cards_v2, ict_slips_v1.
- Export schema id: ict_dol_sweep_export_v7 (bump deliberately, keep import
  compatibility for older schemas).

## Version bump checklist (all must change together)
1. assets/app.js         → VERSION
2. index.html            → <title>, footer, both ?v= query strings
3. service-worker.js     → CACHE_NAME + both ?v= asset URLs
4. tests/smoke.js        → version/query-string assertions
5. README.md + CHANGELOG.md

## Layout
- index.html — shell;  assets/app.js — all logic;  assets/styles.css — all styles
- api/price.py — Vercel function;  tests/smoke.js — static CI test
- Legacy/ — retired versions (never load from index.html)
- knowledge/, docs/ — reference material, not deployed app code
```

---

## 5. Suggested Execution Order

1. **0.1 + 0.2 first** — CI is currently failing and Pages is over-publishing; both are small, contained fixes.
2. **1.2 (CLAUDE.md)** next — it makes every subsequent Claude session cheaper and safer.
3. Then Phases 1→2→3 in order; Phase 3 only after the smoke test is stable, since it is the safety net for the refactor.

Each phase is independently shippable and keeps the app fully working at every step.
