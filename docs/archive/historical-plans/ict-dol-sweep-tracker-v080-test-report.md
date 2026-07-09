# ICT DOL Sweep Tracker v0.8.0 — App Test Report

> Status: Historical
> Last reviewed: 2026-07-09
> Source of truth: No

**Date:** 2026-07-09  
**Tester:** Claude (automated browser testing via Claude-in-Chrome)  
**URL:** https://ictict-lake.vercel.app/#planner  
**Environment:** Chrome desktop, 1280×657 viewport  
**Storage key:** `ict_cards_v078`  
**Method:** End-to-end functional testing across all five views (Home, Planner, Saved, Journal, Profile), covering form validation, data persistence, price API behaviour, R:R computation, and lifecycle state transitions.

---

## 1. App Concept Summary

A local-first, deliberately non-predictive ICT pre-session planner built as a single-page web app with hash routing and localStorage persistence. The workflow is:

1. **Planner** — Select instrument, session, bias, current price; map up to 3 DOL targets and 3 potential sweeps with rationale, timeframe, and confidence; note FVG formation.
2. **Focus Card** — Generated output that tracks distance to an active DOL, computes potential R:R from entry/target/invalidation, logs PD-array route evidence (SIBI/BISI/CE/OB/FVG respect/disrespect), and captures price snapshots over time.
3. **Saved** — Card library with filters (All / Final Saved / Drafts / Hits / Misses / Favorites), hit-rate stats, and export/import (JSON/text).
4. **Journal** — Reviewed entries with outcome, journal lesson, and behaviour tags.
5. **Profile** — Default instrument/session, watchlist, risk defaults, theme, data tools.

The app repeatedly and prominently states it "does not call external AI, forecast price or generate trade signals" — positioning itself as a structured observation formatter rather than a signal generator.

---

## 2. Test Scenarios Executed

### 2.1 Empty Form Submission

**Steps:** Opened Planner → clicked "Generate Focus Plan" with all fields empty (date auto-filled to 2026-07-09 only).

**Result:** ❌ **FAIL** — Card saved successfully with "No instrument / No session / No bias selected". A fully empty card was persisted to localStorage and appeared in Saved with status "DRAFT / OPEN". No validation gate prevented this.

**Impact:** High. Empty cards pollute hit-rate statistics and the Saved list. Users who accidentally tap Generate get junk data that must be manually deleted.

**Recommendation:** Require minimum: instrument + at least one DOL or sweep level with a numeric price. Show inline validation errors, not silent acceptance.

---

### 2.2 Populated Form — Planner to Focus Card

**Steps:** Filled form via JS injection:
- Instrument: US100 → later changed to NQ
- Session: New York AM
- Time: 09:45
- Price: 21500 (manual)
- Bias: Bearish
- DOL 1: 21380, Previous day low (PDL), 1H
- DOL 2: 21320, Sell-side liquidity below price, Daily
- DOL 3: "abc" (deliberate bad input)
- Sweep 1: 21545, Relative equal highs (REH), 5m, High confidence, NY AM hit time

Clicked "Generate Focus Plan".

**Result:** ✅ **PASS** — Card generated correctly. DOL 3 with non-numeric "abc" was silently dropped (no error shown, but no corrupt data stored). Focus card displayed with correct metadata, bias tag, and all DOL/sweep records.

**Observation:** Non-numeric price levels are silently ignored rather than flagged. A brief inline error ("invalid price level") would be clearer.

---

### 2.3 Liquidity Ladder — Distance Math

**Test data:** Current price 21500, levels at 21545 / 21380 / 21320.

| Level | Expected Distance | Expected % | Actual Distance | Actual % | Pass |
|-------|-------------------|------------|-----------------|----------|------|
| 21545 (REH sweep) | +45 pts | +0.21% | +45 pts | 0.21% | ✅ |
| 21380 (PDL DOL) | −120 pts | −0.56% | −120 pts | −0.56% | ✅ |
| 21320 (SSL DOL) | −180 pts | −0.84% | −180 pts | −0.84% | ✅ |

**Result:** ✅ **PASS** — All distance calculations exact. Ladder correctly sorted: sweep above price, DOLs below, ordered by distance from current price.

---

### 2.4 Price Auto-Detect API

**Test 1 — Unsupported symbol (US100):**

- API call: `GET /api/price?symbol=US100`
- Response: HTTP 400 `{"error": "unsupported symbol", "supported": ["BTC","BTCUSD","CL","ES","ETH","ETHUSD","EURUSD","GBPUSD","GC","M2K","MES","MGC","MNQ","MYM","NQ","RTY","YM"]}`
- Fallback: `GET http://127.0.0.1:8765/price?symbol=US100` → HTTP 503
- UI displayed: "AUTO-DETECT UNAVAILABLE. CHECK THE HOSTED PRICE API OR ENTER PRICE MANUALLY."
- Manual price preserved: ✅

**Test 2 — Supported symbol (NQ):**

- API call: `GET /api/price?symbol=NQ`
- Response: HTTP 200 `{"symbol":"NQ","yfSymbol":"NQ=F","price":29693.5,"source":"yfinance","cached":false,"timestamp":"2026-07-09T08:42:22.016915Z"}`
- Price field updated to 29693.5: ✅

**Result:** ⚠️ **PARTIAL PASS** — API works for supported futures symbols. However:

1. The supported symbol list is never shown in the UI. A user typing "US100" or "UK100" (CFD names) gets a generic error with no guidance.
2. The local fallback (`127.0.0.1:8765`) will never work for any production user — it's a developer-only path that adds confusion.
3. NQ futures price ≠ US100 cash CFD price (basis differential). No disclaimer about this.

---

### 2.5 Price Auto-Detect → Stale Level Hazard

**Steps:** Card created with US100 levels around 21000–21500. Changed instrument to NQ. Auto-detect pulled price 29693.5. Existing DOL/sweep levels (21380, 21320, 21545) now showed −27% to −28% distance.

**Result:** ❌ **FAIL** — Card saved without any warning about implausible distances. A −28% intraday DOL on an index future is nonsensical.

**Recommendation:** Add a distance-plausibility flag (e.g., >2% on sub-4H timeframes triggers a warning banner before save).

---

### 2.6 Risk-to-Reward Computation

**Test data:** Entry 29693.5, Target DOL PDL @ 21380, Invalidation 29750, Direction Short.

| Metric | Expected | Actual | Pass |
|--------|----------|--------|------|
| Risk points | 56.5 (29750 − 29693.5) | 56.5 | ✅ |
| Reward points | 8313.5 (29693.5 − 21380) | 8313.5 | ✅ |
| R:R | 147.14R (8313.5 / 56.5) | 147.14R | ✅ |

**Result:** ✅ **PASS** — Math correct.

---

### 2.7 R:R Direction Validation

**Steps:** Set direction to Long while target DOL (21380) was below entry (29693.5) and invalidation (29750) was above entry.

**Result:** ✅ **PASS** — Panel displayed "INVALID — target and invalidation must be on the correct side of entry/current price." No numbers computed for an invalid configuration.

---

### 2.8 R:R Live Recomputation

**Steps:** Set all five R:R inputs (direction, target DOL, entry, target price, invalidation) via native DOM events with change/input dispatch. Checked panel without clicking Save.

**Result:** ❌ **FAIL** — Panel remained "INCOMPLETE" with dashes for all computed fields. R:R only recomputed after clicking "Save changes".

**Impact:** Medium-high. A risk panel that shows stale numbers is dangerous in a planning context. Users may read "INCOMPLETE" and assume they missed a field, when all inputs are actually valid.

**Recommendation:** Recompute R:R on every input change event, not on save.

---

### 2.9 Final Save Gate — Outcome Required

**Steps:** Attempted "Final save" while outcome was still "Open".

**Result:** ✅ **PASS** — Displayed "CHOOSE A NON-OPEN OUTCOME BEFORE FINAL SAVE." Card remained in draft state.

---

### 2.10 Final Save — Happy Path

**Steps:** Set outcome to "Hit" → clicked "Final save".

**Result:** ✅ **PASS** — Card transitioned to "FINAL SAVED / HIT". Updated timestamp recorded. Card appeared in Saved list with correct tags (BEARISH, FINAL SAVED, HIT, 2 DOL, 1 SWEEP, NO FVG).

---

### 2.11 Persistence — Full Reload

**Steps:** After final save, executed `location.reload()` and navigated to Saved view.

**Result:** ✅ **PASS** — Card fully intact. Stats showed "100% Final hit rate / 1 Hit/Miss sample / 0 Breakeven / 0 Needs final save". All DOL/sweep details, distance calculations, and metadata survived reload.

---

### 2.12 Journal View

**Steps:** Navigated to Journal tab after final save.

**Result:** ✅ **PASS** — Entry appeared with "HIT · 2026-07-09 / NQ / No journal lesson recorded. / FINAL SAVED / Open focus card" link. Screenshot metadata placeholder present with note about v1 not storing images.

---

### 2.13 Home View — Today's Focus & Prompt Box

**Steps:** Navigated to Home. Typed "short NQ into PDL after REH sweep" into the "What are you planning today?" prompt box. Pressed Enter and clicked "Start new analysis".

**Result:** ⚠️ **PARTIAL** — Today's Focus section correctly showed the NQ card with stats. However, the planning prompt text was silently discarded — not carried to the Planner, not parsed, not stored anywhere.

**Impact:** Medium. Combined with "AI Trade Plan Builder" / "Plan Assistant" branding and a visible text input, this creates the impression of an LLM-powered feature that doesn't exist. Users will type natural language expecting pre-fill or analysis and get nothing.

**Recommendation:** Either wire the prompt (parse instrument/bias/session keywords for deterministic pre-fill) or remove the text input entirely to avoid confusion.

---

### 2.14 Profile View

**Steps:** Navigated to Profile tab.

**Result:** ✅ **PASS** — All settings rendered: default instrument/session, theme toggle (light/dark), watchlist, risk defaults (planned risk %, planned R, max loss). Data tools section with export/import, beta feedback, component gallery, and clear-all-data. Local summary showed correct counts (1 saved card, 1 final saved, NQ as recent plan).

---

### 2.15 Delete Card

**Steps:** Clicked Delete on focus card. Native `confirm()` dialog appeared.

**Result:** ⚠️ **PARTIAL** — Delete worked (card removed, localStorage confirmed 0 cards). However, the native `confirm()` dialog froze the Chrome automation renderer for ~30 seconds. In production this isn't a user-facing bug, but an in-app confirmation modal would be more consistent with the rest of the UI and safer against accidental taps on mobile.

---

### 2.16 Hash Routing

**Steps:** Manually navigated to `#saved`, `#journal`, `#profile`, `#home` via URL bar.

**Result:** ❌ **FAIL** — Hash changes via navigation buttons update the view but don't reliably sync with the URL hash. Setting `#saved` directly sometimes showed the previous view until a full reload. Browser back button behaviour is inconsistent.

**Impact:** Low-medium. Deep links and bookmark-based navigation are unreliable. Matters more if the app is shared or embedded.

---

### 2.17 Provenance Labelling

**Steps:** Entered price manually (21500). Checked ladder source label.

**Result:** ❌ **FAIL** — Ladder displayed "Source: yfinance/manual · Live" when the price was purely manual entry with no API call made.

**Recommendation:** Show "Source: Manual" when no API call succeeded. Reserve "yfinance" label for confirmed API responses. Reserve "Live" for prices fetched within the last N minutes.

---

## 3. Schema Inspection

The localStorage schema (`ict_cards_v078`) is well-structured:

```
Top-level keys per card:
  id, savedAt, createdAt, updatedAt, createdAtNy, updatedAtNy,
  fields, marketContext, activeDolId, priceSnapshot, priceHistory,
  routeEvidence, riskPlan, markers, outcome, notes, finalSaved,
  favorite, journal, risk

fields sub-keys:
  date, time, instrument, session, currentPrice, bias,
  biasValidation, biasInvalidation, fvg, fvgTf,
  dol[1-3]{Level,Draw,Tf,Taken,Confidence,HitTime},
  sweep[1-3]{Level,Draw,Tf,Taken,Confidence,HitTime}
```

No obvious schema issues. Price history and route evidence arrays support longitudinal tracking. The `v078` suffix in the storage key provides version isolation.

---

## 4. Bugs Summary — Priority Ranked

| # | Severity | Bug | Status |
|---|----------|-----|--------|
| 1 | **High** | No validation on Generate — empty cards saved and pollute stats | Open |
| 2 | **High** | Instrument names vs API mismatch — US100/UK100 unsupported, no guidance shown | Open |
| 3 | **High** | R:R panel doesn't recompute on input change, only on Save | Open |
| 4 | **Medium** | Stale DOL/sweep levels after price change — no distance-plausibility warning | Open |
| 5 | **Medium** | Home prompt box is non-functional — text silently discarded | Open |
| 6 | **Medium** | Provenance label shows "yfinance/manual · Live" for purely manual prices | Open |
| 7 | **Low-Med** | Hash routing inconsistent — deep links and back button unreliable | Open |
| 8 | **Low** | Delete uses native confirm() — should be in-app modal | Open |
| 9 | **Low** | Non-numeric DOL price silently dropped — should show inline error | Open |

---

## 5. Concept-Level Observations

**Strengths:**
- The "formats your inputs only" framing is a genuine differentiator against the noise of AI-signal apps. Honest positioning.
- Plan → focus card → review → journal loop mirrors proper trade-review discipline.
- Rich schema with price history, route evidence, and risk plan supports longitudinal analysis.
- Distance math and R:R computation are correct.
- Final-save outcome gate enforces review before closing.

**Weaknesses:**
- Stats layer undercuts the discipline framing: "100% final hit rate" from n=1 with no sample-size caveat is exactly the false confidence the tool exists to prevent. Consider showing confidence intervals or minimum-sample warnings.
- Sweep confidence and expected hit-time are captured but never analysed. This is the most valuable review data going unused — confidence calibration (were "High" sweeps actually hit more often?) is the feedback loop that makes a journal useful.
- Journal fields for planned risk %, max loss, and planned R are inputs only. No enforcement or breach flagging. Given trade data showing a per-trade loss cap near −$125 would have flipped a full year to breakeven, this is a missed opportunity for the tool to surface the exact discipline it's designed to enforce.
- The "AI Trade Plan Builder" / "Plan Assistant" branding on Home and Planner implies LLM capability that doesn't exist. For a tool built on honesty about what it doesn't do, the naming contradicts the principle.

---

## 6. Recommended Fix Priority

1. **Validation gate** on Generate (require instrument + price minimum)
2. **Symbol mapping or supported-list UI** (decide whether NQ futures price is acceptable proxy for US100 cash — it isn't, they differ by basis)
3. **Live R:R recompute** on input change events
4. **Distance-plausibility flag** for implausible DOL distances
5. **Wire or remove the Home prompt box**
6. **Fix provenance labels** and hash routing

---

*Report generated from live browser testing session, 2026-07-09 04:30–04:55 NY.*
