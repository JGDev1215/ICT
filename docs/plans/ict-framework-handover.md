# ICT Framework Tool — Project Handover Report

> Historical/superseded note — 2026-07-08: this handover describes the legacy single-file `Legacy/ict-framework.html` workflow, not the current route-based v0.8 app in `index.html` plus `assets/app.js`. Current v0.8 intentionally includes Focus Card Details, price snapshots, route evidence, and potential R:R. The old source-citation UI and monitoring-cadence requirements are formally retired unless a new product decision revives the legacy file.

**Deliverable:** `ict-framework.html` (single self-contained file, ~860 lines, no build step, no dependencies beyond Google Fonts CDN)
**Status:** Working product, v-current as of 2026-07-05
**Owner:** Dan
**Purpose of this doc:** Enable any LLM/agent to continue work without re-deriving context.

---

## 1. Project Goal

An HTML checklist tool that walks an ICT (Inner Circle Trader) trader through one setup sequence, per trade:

> **Phase → HTF bias + draw on liquidity → opposing LTF sweep → entry model**

Origin: a verbatim ICT tweet — "Determine a HTF Bias. Locate a lower timeframe draw on liquidity. Know an opposing liquidity raid then a simply entry model." A second tweet added: draws like NWOG, PDH/PDL, Session H/L; raid during/immediately after a 10/50 macro.

**Explicitly out of scope (owner decision):** risk-management module, AI chart-reading, image upload. These were built in earlier iterations and deliberately removed as scope creep. Do not reintroduce without instruction.

---

## 2. Non-Negotiable Constraint: Source Fidelity

Every concept must trace to one of these sources, cited inline in the UI, or be flagged:

| Source | Role | Flagging rule |
|---|---|---|
| **ICT Bible** (`ict-entry-models-reference__full-production__v1_0_0.md`, project knowledge) | Primary canonical source | Cite section keys, e.g. `[ONE_SETUP_FOR_LIFE]`, `[ep06]` |
| ICT tweets (2 screenshots, user-supplied) | Framework sequence + draw examples + macro timing | Quote verbatim where used |
| **LUMI Traders** price-delivery-cycle PDF | Market phase cycle (Step 0) | Always label "external, non-Bible" |
| Liquidity Pools Tier List graphic | Historical only — removed from current build | If reintroduced: external, non-canonical |

Rules the owner enforces:
- Unsourced claims are flagged `Inference:`, never silently filled.
- Where the Bible's cross-reference matrix says `[NO CANONICAL SOURCE FOUND]`, the UI shows "No canonical source" in gold — never invent a value.
- The "10/50 macro" reading (= the :50→:10 windows) is a flagged inference; Bible macro windows are 9:50–10:10, 10:50–11:10, 2:50–3:10, 3:15–3:45 `[MANUAL_INTERVENTION...MACROS]`.
- The LUMI 4-phase cycle is NOT in the Bible as a codified sequence; the Bible only corroborates displacement=expansion and retracement=FVG-rebalance (ep06).

---

## 3. Current Feature Set (implemented, verified)

### Header
- Live NY clock (`America/New_York`, 1s tick)
- Date (defaults to today NY), Trading time select (2am London KZ / 5am Pre-NY / 7am / 9:20am), Instrument (datalist: MNQ, NQ, MES, ES, MYM, YM, MGC, GC, CL, EURUSD, GBPUSD, BTCUSD; free entry allowed)

### Step 0 — Market Phase (external source)
- Table: Daily / 4H / 1H / 15m rows; phase select per row (Consolidation red, others green)
- "Likely next" column auto-fills from `NEXT_PHASE` map (LUMI cycle, labeled external)

### Step 1 — Bias + Draw
- BULLISH/BEARISH toggle
- Per-timeframe draw table: Daily / 4H / 1H / 15m / 1m rows × (buy-side pool select + numeric price) + (sell-side pool select + numeric price)
  - BS pools: PDH, PWH, Session H, REH, Old H, NWOG, NDOG, SIBI
  - SS pools: PDL, PWL, Session L, REL, Old L, NWOG, NDOG, BISI
- Visual HTF/LTF band split between 4H and 1H rows
- Bias highlights the objective column header ("· objective" in gold): bullish→buy-side, bearish→sell-side `[ep06 external-range = objective]`
- Minimum 2 timeframes required — summary shows red "Draw (need ≥2 TFs)" until met

### Step 2 — Sweep
- Live sequence line: `Objective X · Sweep Y · MSS Z`
- Sweep TF select (4H/1H/15m/5m/1m)
- **Auto-mirrored pool dropdown**: lists exactly the opposing-side entries filled in Step 1 (with prices); falls back to generic pool list when Step 1 empty. Key mechanic — enforces "opposing raid" structurally.
- Numeric sweep price; Macro window select; MSS structured select (Confirmed 1m/5m/15m/1H, Not confirmed)

### Step 3 — Entry Model
- 8 models: Model 2022, FVG Entry Drill, Inversion FVG, OTE, Order Block, Breaker, Turtle Soup, Silver Bullet
- Selecting a model shows a card: Trigger / Invalidation / Target + Bible source key. Data lives in the `MODELS` JS object, transcribed from the Bible's cross-reference matrix. GAP entries render "No canonical source".
- Execution note; Risk amount / Profit amount (numeric) → auto R-multiple in slip

### Setup Slip (live summary)
- Tickable prediction rows: bias, draw, sweep, macro, MSS, entry (tick state persists across edits via `ticks` object)
- Copy button → plain-text export

### Journal
- "Save slip" appends to localStorage key `ict_slips_v1` (max 50, newest first)
- Each row: date · instrument · LONG/SHORT · model, outcome select (open/Win/Loss/BE, color-coded), LOAD (full restore incl. draws/phases/ticks), delete, "Export all" (clipboard, plain text)

### Gating & State
- Steps 0→3 unlock sequentially via checkboxes; state box shows `n / 4 — ready/not ready`
- Numeric-only enforcement (inputmode=decimal + JS strip) on: all draw prices, sweep price, riskAmt, profitAmt

---

## 4. Architecture Notes (for the next agent)

- **One file.** All CSS in one `<style>`, all JS in one IIFE `<script>`. No frameworks. ES5-style (var, function declarations — hoisting is relied upon in `restore`/`setBias` ordering).
- **Key JS objects:** `MODELS` (entry model cards), `NEXT_PHASE` (phase map), `BS_POOLS`/`SS_POOLS`, `ticks` (slip checkbox state), `SWEEP_FALLBACK` (original sweep dropdown HTML snapshot).
- **Key functions:** `buildPhaseRows`, `buildDrawRows`, `drawSummary` (returns `{text, count}` — count drives the ≥2-TF rule), `refreshSweepPools` (the Step1→Step2 mirror), `buildSummary` (renders slip + seq line), `collect`/`restore` (slip serialization — includes `fields`, `bias`, `phases[]`, `draws[]`, `ticks`, `outcome`, `savedAt`), `renderJournal`, `slipText`.
- **Restore ordering matters:** draws are restored *after* `setBias`, then `refreshSweepPools()` runs, then `sweepPool` value is re-applied (an option is injected if the saved value no longer exists in the list).
- **localStorage caveat:** blocked in claude.ai artifact preview (Save shows "Storage blocked"); works when the file is opened directly in a browser. Do not "fix" this by removing persistence.
- **Theme tokens:** bg `#0a0a0f`, card `#1a1a24`, inset `#12121a`, text `#e8e8ed`, sub `#9898a8`, border `#2a2a3a`, gold `#ffa502`, bull `#2ed573`, bear `#ff4757`. Fonts: Space Grotesk (UI), JetBrains Mono (data). Matches the owner's wider ICT tooling library.

### Verification harness used (rerun after any edit)
Node script checks: (1) `new Function(script)` parses; (2) every `getElementById` target exists as an HTML id; (3) label `for=` targets exist; (4) `<div>` open/close balance; (5) MODELS keys match `select#model` option values; (6) every `inputmode=decimal` field is in the numeric-strip list.

---

## 5. Owner's Working Style (follow strictly)

- Acknowledge instructions in ≤10 words, then execute. No restating protocols, no "is this robust enough" questions.
- Direct answers, minimal formatting; bullets/tables only when they materially improve clarity.
- Never invent facts/levels/features. Unknown → say so. Label inferences `Inference:` and keep minimal.
- No .md/.txt/report files unless explicitly requested.
- Owner will give iterative feedback ("Feedback:", "Add:") — apply surgically, don't rebuild.
- Owner rejects scope creep and will redirect; when redirected, return to the stated original goal.
- Owner requests self-audits ("double check your work") — run the verification harness and report findings honestly, including errors found and fixed.

---

## 6. History & Rejected Directions (do not re-propose)

1. v1: multi-panel framework + risk calculator + source/inference log → owner cut risk focus.
2. v2: AI chart-review app (upload → Claude API → verdict) → explicitly rejected as off-goal ("come back to the original goal").
3. v3 (current): focused checklist tool; iteratively extended per feedback.
4. Known interpretation issue, deliberately left flagged: tweet's "stop at least 1/3 your target" is ambiguous; conventional reading (stop ≤ ⅓ target, min 1:3 RR) was used historically — risk module now removed, but if reinstated, keep the ambiguity flagged, not resolved.

---

## 7. Open Threads / Sensible Next Steps

- **Monitoring cadence chips** (owner-specified, not yet implemented): 4H candle checks at 0–30min, +2h, +3h, close; 1H checks at :05, :20, :30, :45, :50. Owner confirmed wanting cadence guidance; UI chips were offered but not yet requested. Flag as owner-workflow (not Bible).
- Remaining layout suggestions accepted in principle but not built: runway-inefficiency mini-row (4H/1H/15m FVG-present markers between price and the HTF draw) `[ep06]`.
- Wider ecosystem this feeds: Pine Script IFVG/FVG engine (two-phase IFVG lifecycle + Scenario A/B logic still unimplemented across all audited scripts) and NQ5SetupRanker. This HTML tool is a sibling, not a dependency.

---

## 8. File Manifest

| File | Location | Notes |
|---|---|---|
| `ict-framework.html` | project outputs | The product. Single source of truth. |
| `ict-entry-models-reference__full-production__v1_0_0.md` | project knowledge | The Bible. Search it before adding any concept. |
| LUMI price-delivery PDF | user-supplied in chat | Step 0 source (external) |
| ICT tweet screenshots ×2 | user-supplied in chat | Framework sequence source |

**Prime directive for any successor agent:** precision over completeness. An explicit gap beats a plausible unsourced claim, every time.
