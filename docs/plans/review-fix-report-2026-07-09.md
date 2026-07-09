# Review Fix Report — 2026-07-09

> Status: Current
> Last reviewed: 2026-07-09
> Source of truth: No (remediation plan; verify against current code before implementing)

Remediation plan for the findings raised in the fresh systematic review of the ICT DOL Sweep Tracker (v0.8.3). This is a **report only** — no code was changed. Each item lists root cause, the recommended fix, files/lines, regression risks, tests to add, and effort. A full architecture / refactoring review follows the findings.

Repository: `JGDev1215/ICT` · App version: `v0.8.3` · Storage key: `ict_cards_v078` · Export schema: `ict_dol_sweep_export_v7`.

## Summary

| ID | Sev | Title | Effort | Fix type |
|----|-----|-------|--------|----------|
| H1 | High | "Clear all local data" leaves cloud state; cards resurrect for signed-in users | S | Code + copy + test |
| M1 | Medium | Notice banner hard-coded to success styling/role for all messages | M | Code + test |
| M2 | Medium | Live regions recreated on every re-render; screen readers don't announce | M | Code (render pipeline) |
| M3 | Medium | `CLAUDE.md` version stale (v0.8.0 vs v0.8.3) | S | Docs + process |
| L1 | Low | Import `FileReader` has no `onerror`; failed reads are silent | S | Code + test |
| L2 | Low | Local price fallback (`http://127.0.0.1:8765`) causes mixed-content errors on HTTPS | S | Code |
| L3 | Low | `api/price.py` static-serving is dead on Vercel | S (doc) | Docs |
| L4 | Low | `importCards` ignores payload `schema` (no version warning) | S | Code + test |
| SW1 | Low | SW cache-first strands clients on stale JS if `?v=` not bumped | S | Process/doc |
| PY1 | Info | `price.py` wildcard CORS when `Origin` absent | — | Acceptable |

Sequencing: **H1 first (independent).** Then the a11y/notice cluster in order **M2 → M1 → L1** (they share the notice/live-region surface). **M3 + SW1** are one process fix (always bump via `tools/bump-version.js`). L2, L4 independent. L3 is documentation only.

No critical or security-blocking issues. Secret exposure was re-checked and is clean: `index.html` carries only the Supabase **publishable/anon** key (RLS-gated); no `service_role` key in the repo; `.env.local` is gitignored.

---

## H1 (High) — "Clear all local data" leaves cloud backup; cards resurrect for signed-in users

**Root cause.** The `clearDataBtn` handler (`assets/app.js:2974-2985`) removes only `KEY`, `SETTINGS_KEY`, `DRAFT_KEY`, `ict_bias_card_meta_v1`, and `LEGACY`. It does not touch the three sync keys (`SYNC_QUEUE_KEY`, `SYNC_TOMBSTONES_KEY`, `SYNC_ACCOUNT_DECISIONS_KEY`, declared `app.js:8-10`), writes no tombstones, and issues no remote delete. The per-card path is different: `deleteCard` (`app.js:894-901`) → `queueCardDelete` (`app.js:1159-1169`) writes a tombstone and queues a remote delete, which `flushSupabaseQueue` (`app.js:1261`) executes via `deleteRemoteCard` (`app.js:1242`). Because the bulk clear skips all of that, the next `syncFromSupabase` (`app.js:1303`, also fired on `SIGNED_IN` at `app.js:1351-1353`) calls `mergeCards(cards, remoteCards)` (`app.js:1189-1201`) with an empty local set and no tombstones, so every remote card is written back via `saveCards(merged)` (`app.js:1327`). Net effect: for a signed-in user the local wipe is silently reverted, and a stale queue may re-upload data the user believed destroyed.

**Recommended fix (Option A — true device-local reset; safest).** Also remove the three sync keys, and reword the confirm/notice to state clearly that cloud backup is not deleted. Do not attempt remote deletion from this button.

```js
on('clearDataBtn', () => {
  if(confirm('Clear all local cards, settings, bias metadata, and the pending cloud-sync queue on THIS device? Cards already backed up to the cloud are not deleted and may return after sign-in.')){
    const store = storage();
    if(store){
      [KEY, SETTINGS_KEY, DRAFT_KEY, 'ict_bias_card_meta_v1',
       SYNC_QUEUE_KEY, SYNC_TOMBSTONES_KEY, SYNC_ACCOUNT_DECISIONS_KEY]
        .concat(LEGACY).forEach(k => store.removeItem(k));
    }
    cards = [];
    startDraft(null, {persist: false});
    notice = 'Local data cleared. Cloud backup is unchanged.';
    go('home', {replace: true});
  }
});
```

Clearing tombstones is deliberate: after a local wipe there are no local cards for them to protect, and keeping them would suppress legitimate future re-downloads. **Option B (true global wipe)** — write tombstones for every id, queue deletes, flush remote — is rejected as the default: it is destructive across all devices, depends on network/auth success (partial failures leave queue/tombstones inconsistent), and a "clear this device" button is a surprising place to nuke cloud data. If the product wants it, expose it behind a separate, explicitly labeled "Delete cloud backup" action.

**Files/lines.** `assets/app.js:2974-2985` (handler body + confirm/notice copy). No new constants. Add a changelog/doc note that the button is device-local.

**Regression risks.** The reworded copy is the mitigation for signed-in resurrection (cloud is intentionally preserved). An in-flight `flushSupabaseQueue` could theoretically re-persist a queue right after clearing — low risk (user-initiated, synchronous); accept, or gate on `syncState.busy`.

**Tests.** smoke: seed all seven keys, assert the clear routine removes the three sync keys; pin the new notice string. Playwright: Profile → seed cards → clear → accept → assert cards empty **and** `localStorage.getItem('ict_supabase_sync_queue_v1')` is null. Effort: **S**.

---

## M1 (Medium) — Notice banner hard-coded to success styling and polite role

**Root cause.** `renderShell` (`app.js:2230`) emits every notice as `<div class='save-state good' role='status'>`. The single `notice` string is set by ~40 handlers including failures — "Card could not be deleted." (`app.js:2898`), "Draft could not be saved." (`2426`/`2434`), "Changes could not be saved." (`2838`), `syncState.message` on login/backup failure (`2936`/`2960`), and `lastStorageError` quota failures. All render green with `role='status'` (polite), so errors look like successes and are not assertively announced. CSS `.save-state.warn` / `.save-state.bad` exist (`styles.css:758-759`) but are never applied.

**Recommended fix.** Track severity explicitly rather than string-matching. Add a `noticeLevel` (`'good'|'warn'|'bad'`, default `'good'`); failure handlers set `'bad'`, validation prompts `'warn'`. `renderShell` maps level → class and role (`bad` → `role='alert'`, else `status`). Reset `noticeLevel='good'` right where `notice=''` is cleared in `render()` (`app.js:3042`) so both always clear together.

**Files/lines.** `app.js:2230` (banner), `app.js:3042` (reset), and the failure handlers (`2426, 2434, 2622, 2779, 2838, 2898, 2912`, plus `syncState.message` branches `2936/2948/2954/2960` and login-failure). No CSS change. **Risks.** A missed reset would leave an error color stuck on the next success — guarantee reset beside `notice=''`. Reserve `role='alert'` for `bad` only. Coordinate with M2. **Tests.** smoke: unit the severity→class/role map. Playwright: trigger a delete/import failure, assert `class='...bad'` / `role='alert'`. Effort: **M**.

---

## M2 (Medium, a11y) — Live regions recreated on every re-render

**Root cause.** `render()` replaces the whole subtree (`app.innerHTML = renderShell(content)`, `app.js:3041`). The notice region (`role='status'`, `app.js:2230`) and the price-status region (`role='status'`, id `priceStatusMessage`, `app.js:456-457`) are brand-new nodes every render. Screen readers announce changes to *existing* live regions; a region inserted already-populated (or replaced wholesale) is frequently not announced by JAWS/NVDA/VoiceOver.

**Recommended fix.** Create the live region **once**, outside the re-rendered content, and update only its text node. Practically: add a persistent `<div id='globalStatus' role='status' aria-live='polite'>` (and optionally a separate `role='alert' aria-live='assertive'` node) to the app shell that `render()` does not overwrite; render `content` into an inner mount (e.g. `#appContent`); add an `announce(text, level)` helper that sets `globalStatus.textContent` and toggles class/role per M1. Apply the same in-place update to `priceStatusMessage` instead of re-emitting it in `priceStatusHtml`. Minimum-viable variant: keep current markup but create the persistent region once at init (`if(!doc.getElementById('globalStatus'))`) and stop emitting the inline copy. The invariant: the live-region element must survive across `render()` calls.

**Files/lines.** `app.js:3041` (mount point), `app.js:2230` (stop inline notice), `app.js:456-457` + callers (price status), add `announce()`; possibly `index.html` (persistent node) and `styles.css` (positioning). **Risks.** Restructuring the mount risks `bind()` (re-queries after render, `app.js:3043`) and `renderShell` FAB/tab/skip-link placement — keep `renderShell` structure, move only the live region out. Avoid double announcements by removing the inline copy. Coordinate with M1 for severity class/role. **Tests.** Playwright: assert one persistent live-region node across a route change and that its `textContent` updates without element replacement. Effort: **M**. Implement M2 → M1 → L1 together.

---

## M3 (Medium, docs) — `CLAUDE.md` version stale

**Root cause.** `CLAUDE.md:15` says `Current app version: v0.8.0` while code is `v0.8.3` (`app.js:4`, `service-worker.js:1`, cache-bust `?v=0.8.3-...` at `service-worker.js:9-11`). Storage keys in CLAUDE.md still match, so only the version line is wrong. `AGENTS.md` / `docs/README.md` declare root docs a source of truth, so this misleads agents. Notably `tools/bump-version.js:61-63` **already** rewrites CLAUDE.md's version line via regex — so v0.8.1→0.8.3 were bumped by hand without running the tool.

**Recommended fix.** Change `CLAUDE.md:15` to `v0.8.3`. Root-cause prevention: make `node tools/bump-version.js vX.Y.Z <label> YYYYMMDD` the required path for version/cache bumps (it already updates `app.js`, `index.html`, `service-worker.js`, `README.md`, and `CLAUDE.md`). No change to `bump-version.js` needed. **Risks.** None (docs-only). **Check.** Grep `Current app version` returns `v0.8.3` in both `CLAUDE.md` and `README.md`. Effort: **S**.

---

## L1 (Low) — Import `FileReader` has no `onerror`

**Root cause.** The import handler (`app.js:2748-2761`) sets only `reader.onload`; a failed read (permissions, `NotReadableError`) fires nothing and the user gets no feedback.

**Recommended fix.** Add before `readAsText`:

```js
reader.onerror = () => { notice = 'Could not read the selected file. Try again or choose another file.'; render(); };
```

Set `noticeLevel='bad'` once M1 lands. Optionally reset `e.target.value=''` after handling so re-selecting the same file re-triggers `onchange`. **Files/lines.** `app.js:2748-2761`. **Risks.** None material. **Tests.** Pin the error-notice string in smoke; optionally a Playwright test stubbing `FileReader` to fire `onerror`. Effort: **S**.

---

## L2 (Low) — Local price fallback causes mixed-content errors on HTTPS

**Root cause.** `priceHelperUrls()` (`app.js:481-487`) always appends the local helper `http://127.0.0.1:8765/price` (`LOCAL_PRICE_API_BASE`, `app.js:27`, from `config.js:6`). On an HTTPS origin the secondary fetch is blocked as mixed content, logging a console error before rejecting. Manual entry is unaffected (it never routes through `fetchPrice`).

**Recommended fix.** Only add the local fallback on a local origin:

```js
const urls = [priceHelperUrl(normal)];
const host = (root.location && root.location.hostname) || '';
if(host === 'localhost' || host === '127.0.0.1' || host === ''){
  const local = localPriceHelperUrl(normal);
  if(!urls.includes(local)) urls.push(local);
}
return urls;
```

**Files/lines.** `app.js:481-487`. **Risks.** Local dev on `localhost`/`127.0.0.1` still reaches `:8765`; `file://` (empty host) preserved. Note `tests/smoke.js:728` asserts the planner *copy* contains `127.0.0.1:8765` — that is static UI text, not the URL list, so the guard doesn't break it (confirm during implementation). Effort: **S**.

---

## L3 (Low) — `api/price.py` static serving is dead on Vercel

**Root cause.** `vercel.json:5-6` builds static output to `_site/` and Vercel serves those directly; `api/price.py` is only routed for `/api/price`. `send_static`/`STATIC_FILES` (`api/price.py:43-51,148-168`) and the `do_GET` fallthrough are never reached in production. They **are** used for local single-process testing, and `tests/smoke.js:178-180` asserts `STATIC_FILES` and `def send_static` exist — so this is not unused overall, only inert on Vercel.

**Recommended fix (document, do not remove).** Add a comment above `STATIC_FILES` noting it is local-testing-only and inert on Vercel (static served from `_site`), and one line in CLAUDE.md Deployment Notes. Removal is not recommended: it would break smoke `178/180` and local single-process serving and would require an alternate local-serve path. Effort: **S** (doc).

---

## L4 (Low) — `importCards` ignores payload `schema`

**Root cause.** `importCards` (`app.js:971-987`) → `extractPayload` (`app.js:770-776`) accepts any array or `{cards|data:[...]}` and never inspects `payload.schema`, though `exportCards` (`app.js:960-969`) writes `schema: SCHEMA`. No version-mismatch signal is surfaced.

**Recommended fix (soft, non-blocking).** Detect a mismatched `schema` and return an optional `warning`; never reject (keeps legacy/raw-array imports working):

```js
const parsed = typeof payload === 'string' ? parse(payload, null) : payload;
let schemaWarning = '';
if(parsed && !Array.isArray(parsed) && parsed.schema && parsed.schema !== SCHEMA){
  schemaWarning = 'Imported file uses schema "' + parsed.schema + '"; expected "' + SCHEMA + '". Cards normalized best-effort.';
}
// ...unchanged imported/cards/error, plus: warning: schemaWarning || undefined
```

**Files/lines.** `app.js:971-987` (+ surface `warning` in the import UI handler). **Risks.** Must stay additive — do not change `imported`/`error` semantics. Existing smoke import cases (`smoke.js:637/649/653/664/678`) lack a mismatched `schema` and are unaffected. **Tests.** Add a smoke case importing `schema:'ict_dol_sweep_export_v6'` + valid cards → `imported > 0` and `warning` present. Effort: **S**.

---

## SW1 (Low, new) — Cache-first strands clients on stale JS if `?v=` not bumped

`service-worker.js:41-46` is cache-first for non-navigation GETs; assets are invalidated only by the `?v=` query (`service-worker.js:9-11`). If shipped JS/CSS is edited without bumping the cache-bust query (the same failure mode as M3), users stay on old code indefinitely. This is process-dependent, not a code defect. **Fix:** reinforce M3 — always bump via `tools/bump-version.js`; add a CLAUDE.md note that editing shipped JS/CSS without a cache-bust bump strands SW clients. Effort: **S**.

## PY1 (Info) — `price.py` wildcard CORS when `Origin` absent

`api/price.py:60-61` returns `Access-Control-Allow-Origin: *` when there is no `Origin` header. For a read-only, no-credentials, no-secret price endpoint this is acceptable; add a one-line comment if the allow-list is meant to be strict. Error handling is otherwise sound (400 missing/unsupported, 500 dependency, 502 provider, 30s cache). No defect.

## Non-findings confirmed acceptable

Supabase RLS policies are correct (own-row `using`/`with check` on all verbs). No `service_role` key in the repo; publishable key is browser-safe; `.env.local` gitignored. Supabase session-failure and first-sync paths are non-fatal and keep localStorage authoritative (`app.js:1265-1270,1294-1296,1306-1308,1321,1386-1394`); no data-loss path found. Touch targets ≥44px. Price parsing rejects zero/negative/malformed. Advice-boundary wording intact ("Not financial advice"; no trade signals). XSS escaping via `esc()`.

---

# Architecture & Refactoring Review

Full architecture review of `assets/app.js` (single ~3066-line IIFE) with a refactor roadmap that stays inside the hard constraints from `AGENTS.md`/`CLAUDE.md`: static no-build (no bundler/framework), localStorage as source of truth, Supabase optional, preserved storage keys/migrations, and a smoke test that pins many contract strings and the `window.ICTSweepState` export. Note the standing decision in `docs/release/release-decision-log-2026-07-08.md` that **`app.js` modularization is deferred** as high-regression-risk.

## Current structure (one IIFE, lines 1–3066)

Eight interleaved zones: constants/domain vocabulary (`1–118`); normalization & value utilities incl. NY-time formatters and the price-string sanitizer (`120–398`); price helper — distance math, status strings, API-base resolution, fetch stack (`400–522`); card model & `normaliseCard` (`524–768`); storage & CRUD with legacy migration (`770–928`); settings, export/import (dedupe by `updatedAt`), and the whole Supabase sync subsystem (`929–1500`); planner validation, draft autosave, hash routing (`1502–1713`); and finally module state, the `api` export (`root.ICTSweepState`), string-template render helpers, per-route render functions, the DOM-to-state reader `sync`, `savePlanner`, the ~495-line `bind` event-wiring function, and bootstrap (`1715–3066`).

## Architectural problems

**Single giant IIFE, no internal boundaries.** Everything shares one lexical scope; the pure data layer (safe to change) is not separated from the DOM/render layer (regression-prone). The `api` object (`app.js:1748-1820`) is the only explicit seam and exists for tests, not internal structure.

**Global mutable state threaded implicitly.** ~28 module-level `let` bindings, including render-critical `route`, `f` (live planner fields), `marketContextDraft`, `cards`, `notice`, `priceFetchState`, `syncState` (`app.js:1715-1746`), with a second cluster (`savedFilter`, `savedSearch`, `plannerCardId`, …) at `2116-2120`. Functions like `plannerValidationHtml` (`1575`) and `persistPlannerDraft` (`1586`) read global `f` directly, so behavior depends on hidden state. `f` is reassigned wholesale in ~6 places, making data flow hard to trace.

**Full `innerHTML` re-render on nearly every action.** `render()` (`app.js:3024-3044`) rebuilds the whole screen string, assigns `app.innerHTML`, then calls `bind()` to re-attach every handler. Almost every action — favorite, filter, bias toggle (`2627-2633`) — calls `render()`, discarding DOM/listeners/focus/scroll. Only three partial-update escape hatches exist (`updatePlannerOutputs` `2635-2647`, the countdown/clock `tick`, a few inline `.value`/`.disabled` tweaks). This is the root of the M2 live-region defect.

**HTML by string concatenation with manual escaping.** All markup is template literals with hand-placed `esc()` (e.g. `focusCard` at `2285` is a single ~1,900-char literal). Correctness depends on the author remembering `esc()` everywhere; `raw()` and `priceMapHtml` deliberately inject pre-built HTML, so the contract is inconsistent — a latent XSS/correctness surface and hard to diff.

**Render ↔ event-wiring coupled only by stringly-typed IDs.** Templates emit IDs (`autoPriceBtn`, `ctx_${key}_phase`, …); `bind()` (`2492-2986`) re-queries them. A renamed ID silently breaks its handler unless a smoke `includes()` happens to pin it. `sync()` (`2364-2393`) is a hidden two-way binding called defensively inside `go()` and many handlers, so state mutates as a side effect of navigation.

**Testability limited to the `api` seam.** `tests/smoke.js` loads `app.js` three ways — raw-string `includes()`/regex contract pins, `vm.Script` parse check, and `runInContext` against a fabricated DOM/localStorage exercising only `context.ICTSweepState.*`. The mock `querySelectorAll` returns `[]`, so `bind()` no-ops under test; event wiring has no unit coverage and relies entirely on Playwright.

## Refactor roadmap (within no-build constraints)

**ES-module viability:** technically possible on all hosts (they serve over HTTP), but costly against contracts — every new module must be added to `STATIC_ASSETS` with matching `?v=`; `index.html` load-order assumptions (`config.js` before `app.js`; the Supabase CDN global) would need re-verification under deferred/async module loading; and the `root.ICTSweepState` global would need explicit `window` assignment. **Recommendation: do not move to ES modules.** If splitting later, make each file its own small IIFE writing to a shared `window.ICT` namespace, preserving the exact export mechanism smoke depends on.

Ordered lowest-risk first. **Steps 1–3 are in-file only (no new files, no contract changes) and do NOT conflict with the deferred-modularization decision.**

**Step 1 — Extract a notice/live-region helper (very low risk).** Replace scattered `notice='...'; render();` and the surprising reset inside `render()` with `setNotice(msg, level)` / `announce()`. This directly enables M1/M2 and centralizes the one piece of transient UI state. Keep `renderShell` output identical so smoke/E2E selectors are unchanged.

**Step 2 — Group globals into named namespaces (low risk).** Collect mutable globals into `plannerState`, `priceState`, `uiState`, and the existing `syncState`, one cluster at a time with smoke after each. Keep the exact `api` getters (they can read from the new objects), so no exported-name changes.

**Step 3 — Consolidate template/escaping behind a helper (low–medium risk).** Introduce an auto-escaping `h()`-style helper and migrate one render function at a time (start smallest, e.g. `journal`/`componentGallery`). Medium only because template output is contract-pinned — migrated templates must emit byte-identical strings for every smoke-pinned literal; verify string-by-string before merge.

**Step 4 — Split the Supabase subsystem into `assets/sync.js` (medium risk; conflicts with deferral).** The sync layer (`929–1500`) is the most self-contained and the best first *file* split; its failure mode is non-destructive (localStorage stays authoritative) and it has smoke + offline-E2E coverage. Requires updating `STATIC_ASSETS`, `index.html` script order + smoke assertions, and keeping every `ICTSweepState` sync export pointing at the moved code.

**Step 5 — Split the pure data/model layer into `assets/model.js` (medium risk; conflicts with deferral).** Move side-effect-free normalizers/math (`120–768`, excluding `storage()`-touching fns) — the most unit-testable code — and re-export through the smoke harness/`api`.

**Step 6 — Split render + `bind` into `assets/views.js` (high risk; conflicts with deferral).** Largest and riskiest due to ID coupling; defer until Steps 1–3 reduce coupling and Step 3 makes output verifiable.

## Testability improvements (no build step)

Widen the `api` export deliberately as the unit-test surface — add pure functions (`comp`, `cardStatus`, `mergeCard`, `dolLabel`, `marketContextText`, price-status builders) so smoke asserts behavior directly instead of via string-includes. Make render helpers pure `(state) -> htmlString` by passing state as arguments (several already accept optional args, e.g. `plannerValidationState(fields, ctx, cardId)`), so they can be asserted against fixtures with no DOM. Extend the smoke fake-DOM to register elements by id and return them, letting a test render a route, run `bind()`, invoke an assigned `.onclick`, and assert resulting state — covering the render↔bind ID contract that only Playwright touches today. Keep `includes()` as a coarse net for genuinely string-pinned contracts (cache URLs, version text, SW asset list).

## Relationship to the "modularization deferred" decision

`docs/release/release-decision-log-2026-07-08.md` defers `app.js` modularization ("high regression risk … a separate refactor with no feature changes"). **Steps 4–6 are exactly that deferred work** — do not proceed without explicit product go-ahead. **Steps 1–3 and all testability work do not conflict**: they are in-file, no new files, no feature changes, and they *reduce* the coupling that caused the deferral. Risk-managed path to revisit: land Steps 1–3 behind green smoke + Playwright; add the DOM-level unit layer so the render↔bind contract has coverage *before* any split; then scope the first file split to Supabase only (Step 4), gated on byte-identical smoke-pinned output plus clean `node tests/smoke.js` and `npm run test:e2e`; treat Step 6 as a separate later decision.

---

## Implementation coupling checklist (for whoever executes fixes)

Smoke guards to respect: `smoke.js:80` (localPriceApiBase in config), `:91` (importCards exists), `:178/:180` (`STATIC_FILES` + `send_static` — blocks L3 removal), `:628/637/649/653/664/678` (export/import round-trip — L4 must stay additive), `:728` (planner shows `127.0.0.1:8765` note — L2 guard must not touch that UI text). Any JS/CSS behavior change must bump the `?v=` cache-bust in `index.html`, `CACHE_NAME`/`STATIC_ASSETS` in `service-worker.js`, matching smoke assertions, and version notes — preferably via `node tools/bump-version.js`. Run `node tests/smoke.js` and `npm run test:e2e` before handoff.
