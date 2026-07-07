# ICT ENTRY MODELS & TRADE MANAGEMENT - CANONICAL REFERENCE

**Version:** 1.0.0
**Created:** 2026-04-21
**Last Audit:** 2026-04-21
**Release Class:** Production reference (model-complete, phase-coverage-limited)
**Models Covered:** 24 complete / 24 planned
**Management Phases Covered:** 10 complete / 10 planned
**Registry Rows Classified:** 164
**Source Files Referenced:** 39
**Open Flags:** 49

## COVERAGE LIMITATIONS

- Entry-model definition coverage is complete across the 24 models in scope.
- Trade-management phase coverage is partial. Only the model/phase pairs explicitly named inside each phase are canonical; unresolved matrix cells are flagged rather than inferred.
- Cross-cutting inversion fair value gap logic is consolidated in Section 4.1 instead of being re-explained inside every model section.
- The following canonical files are intentionally deferred in this version because they would require new standalone model sections or expansions outside the current 24-model inventory: `ICT_BIBLE__RECLAIMED_ORDERBLOCK__2026-02-01.html`, `ICT_BIBLE__PROPULSION_BLOCK__2026-02-01.html`, `ICT_BIBLE__VACUUM_BLOCK__2026-02-01.html`, `ICT_BIBLE__LIMIT_ORDER_ENTRY_LONG_TERM__2026-02-01.html`.
- The following canonical files are intentionally not elevated to evidence surface in this version because the same rule space is already covered below by more specific sources: `ICT_BIBLE__HIGH_PROBABILITY_MARKET_REVERSAL__2026-02-01.html`, `ICT_BIBLE__ALGORITHMIC_TIMINGS_WITH_OPENING_RANGES__2026-02-01.html`.

## LLM GROUNDING INSTRUCTION

If you are an AI assistant consuming this document, treat it as the canonical index for ICT entry-model and trade-management rules captured here as of `v1.0.0`. If a concept or rule is not present here, verify it against the ICT Bible source files directly; later ICT teaching remains canonical even if it has not yet been integrated into this reference.

## SOURCE POLICY

- Direct quotes: exact filename + locator
- Paraphrases: marked [paraphrase] with evidence
- Synthesis: marked [SUMMARY] or [ANALYTICAL] with evidence
- `Evidence Status: Direct` = at least 3 direct quotes and quote-led rule coverage
- `Evidence Status: Mixed` = 1-2 direct quotes, or a quote/paraphrase mix where paraphrase still carries most of the executable rules
- `Evidence Status: Paraphrase-Only` = no direct quotes in the section body
- Gaps: marked [NO CANONICAL SOURCE FOUND]
- Incomplete sections: marked [NOT YET EXTRACTED]
- Codex fallback: marked [CODEX_FALLBACK]
- Source conflict: marked [SOURCE DIVERGENCE]
- Trade-management phase coverage is limited to the model-specific variations explicitly named inside each phase; the matrix must not infer unquoted defaults from missing phase content.

## ENTRY MODELS

### 1.1 Optimal Trade Entry (OTE)

**Primary Sources:** `ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html`
**Supporting Sources:** `ICT_BIBLE__SELECTING_PRECISION_PRICE_OBJECTIVES__2026-02-01.html`
**Era:** 2016/2017
**Teaching Context:** 2016/2017 mentorship
**Priority Tier:** 1
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] OTE is a retracement model: after an impulse leg and a market structure break, price pulls back into the 62%-79% retracement zone and the trader looks to buy dips or sell rallies in the direction of the setup.
Support: [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Definition]; [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Market Structure Break]; [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Fibonacci Settings]

**Definition:**
- "Optimal trade entry is really based on buying retracements" [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Definition]
- [paraphrase] The bearish version reverses the same logic: sell rallies after an impulse leg lower and a structure break. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Definition]

**Prerequisites / Conditions:**
1. [paraphrase] Start from a higher-timeframe framework, with monthly, weekly, and daily levels prioritized and four hours treated as the minimum for key institutional levels. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Higher Timeframes Priority]
2. [paraphrase] Price must produce an impulse leg and a break of market structure before the retracement is treated as OTE. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Definition]; [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Market Structure Break]
3. [paraphrase] The retracement should come below halfway into the 62%-79% zone, with 70.5% treated as the sweet spot. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Fibonacci Settings]
- [SOURCE DIVERGENCE] The source's spoken description gives 60% as the lower bound of the retracement zone, while the named Fibonacci level list gives 62%. This reference uses 62% as the operating floor because that is the explicit Fib setting, but the 60% spoken floor remains part of the source record. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Fibonacci Settings]

**Entry Sequence:**
1. [paraphrase] Determine whether the market context is bullish or bearish from the higher timeframe. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Higher Timeframes Priority]; [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Bullish Optimal Trade Entry]; [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Bearish Optimal Trade Entry]
2. [paraphrase] Identify the impulse leg and the structure break that validates the retracement. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Market Structure Break]
3. [paraphrase] Draw the Fibonacci on the price leg using candle bodies for the open/high reference. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Fibonacci Settings]
4. [paraphrase] Wait for price to retrace into the 62%-79% OTE zone rather than chasing the impulse. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Fibonacci Settings]
5. [paraphrase] Execute in the zone without needing the exact level if the location still makes sense. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Bullish Optimal Trade Entry]

**Stop Placement:**
- "My stop will be exactly at this low not 10 pips for 5 to put pips below that it's gonna be right at that low" [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Risk Model & Stop Loss]
- [paraphrase] The stop is defined by the reference points that frame the setup rather than an arbitrary cushion. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Risk Model & Stop Loss]

**Target Logic:**
- [paraphrase] First profit is taken at or just before the 0% level because price can fail before tagging the prior high or low exactly. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Targets & Profit Taking]
- [paraphrase] Additional objectives are the 127 extension, then the 162 extension, with a measured move as the extended objective. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Targets & Profit Taking]

**Invalidation:**
- [paraphrase] If price trades through the low or high that defines the retracement risk, the OTE idea is invalidated because the reference swing protecting the setup has failed. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Risk Model & Stop Loss]

**R:R Context:**
- "better than in my opinion better than two to one" [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Targets & Profit Taking]
- [paraphrase] He may accept slightly under 2:1 only when being very aggressive. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Targets & Profit Taking]

**Key Distinction:**
- [ANALYTICAL] OTE is not just any pullback entry; it specifically combines an impulse leg, a structure break, and a Fibonacci retracement into the 62%-79% zone. Support: [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Definition]; [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Market Structure Break]; [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Fibonacci Settings]

**Cross-References:**
- Management phases: [0, 1, 4, 5, 9]
- Related models: [2.2 Silver Bullet]
- Relationship basis: [ANALYTICAL] Silver Bullet explicitly lists a classic ICT OTE as one valid framework inside the time-window model. Support: [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Types of Draws on Liquidity]

### 1.2 Order Block Entry

**Primary Sources:** `ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html`; `ICT_BIBLE__HTF_PD_ARRAYS_HIERARCHY__2026-02-01.html`
**Supporting Sources:** `ICT_BIBLE__CHANGE_IN_STATE_OF_DELIVERY__2026-02-01.html`
**Era:** 2016/2017
**Teaching Context:** 2016/2017 mentorship
**Priority Tier:** 1
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] An ICT order block entry uses the candle that marks a change in delivery and then looks to transact on the repricing back into that area. The setup is framed by higher-timeframe premium/discount context and the order must be planned during the kill zone, not chased later.
Support: [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Order Block Definition]; [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Kill Zones - True Purpose]; [ICT_BIBLE__HTF_PD_ARRAYS_HIERARCHY__2026-02-01.html | Premium Arrays]

**Definition:**
- "it's a change in the state of delivery" [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | 0:07]
- [paraphrase] Mechanically, a bullish order block is the last down-close candle in the delivery sequence before the up move and a bearish order block is the last up-close candle in the delivery sequence before the down move. The opening price of that qualifying candle is the trigger level that marks the change in state of delivery. [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Order Block Definition]; [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Change in State of Delivery]
- [SOURCE DIVERGENCE] The standalone Change in State of Delivery lesson gives "three down closed candles" as the example delivery context before naming the opening price trigger; this section therefore treats the qualifying order-block candle as the last candle of that delivery sequence rather than any isolated single candle. [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Change in State of Delivery]; [ICT_BIBLE__CHANGE_IN_STATE_OF_DELIVERY__2026-02-01.html | Definition]
- [paraphrase] Order blocks are framed inside a premium/discount hierarchy so the trader knows which array should be encountered first as price reprices. [ICT_BIBLE__HTF_PD_ARRAYS_HIERARCHY__2026-02-01.html | Premium Arrays]

**Prerequisites / Conditions:**
1. [paraphrase] The trader must first frame price as moving from discount to premium or premium to discount, then look for the next higher-timeframe PD array in sequence. [ICT_BIBLE__HTF_PD_ARRAYS_HIERARCHY__2026-02-01.html | Premium Arrays]; [ICT_BIBLE__HTF_PD_ARRAYS_HIERARCHY__2026-02-01.html | Discount Arrays]
2. [paraphrase] In the bearish example, price must trade below the reference candle's open and then break the swing low, signalling a change in state of delivery. [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Change in State of Delivery]
3. [paraphrase] If a valid order placement cannot be derived during the kill zone, there is no trade for that day. [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Kill Zones - True Purpose]; [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Timing Rules]

**Entry Sequence:**
1. [paraphrase] Determine whether price is repricing into a premium or discount array and what higher-timeframe array should be encountered first. [ICT_BIBLE__HTF_PD_ARRAYS_HIERARCHY__2026-02-01.html | Premium Arrays]; [ICT_BIBLE__HTF_PD_ARRAYS_HIERARCHY__2026-02-01.html | Discount Arrays]
2. [paraphrase] Mark the specific qualifying candle: the last down-close candle of the delivery sequence before the up move for bullish order blocks, or the last up-close candle of the delivery sequence before the down move for bearish order blocks. Use that candle's opening price as the change-in-delivery trigger. [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Order Block Definition]; [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Change in State of Delivery]; [ICT_BIBLE__CHANGE_IN_STATE_OF_DELIVERY__2026-02-01.html | Definition]
3. [paraphrase] Treat the rally back after that break as a suspect rally and look for the limit entry there. [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Suspect Rally]; [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Entry Setup and Execution]
4. [paraphrase] Plan and place the order during the kill zone; the fill does not need to occur inside that time window. [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Kill Zones - True Purpose]
5. [paraphrase] If the order is still unfilled by 11:30, pull it. [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Timing Rules]
6. [paraphrase] If a valid order placement cannot even be derived by 11:30, there is no trade for that day because the setup window has closed. [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Timing Rules]

**Stop Placement:**
- [paraphrase] The bearish example places the stop at the intermediate-term swing high because the imbalance there should not be traded through if the setup is valid. [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Intermediate Term Swing High]

**Target Logic:**
- [paraphrase] The setup expects another repricing lower after the suspect rally; no explicit multi-target framework is given in the source. [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Suspect Rally]

**Invalidation:**
- [paraphrase] A bearish order block idea is invalidated if price trades above the intermediate-term swing high that should cap the setup. [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Intermediate Term Swing High]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] Order Block Entry is not a generic pullback. It is specifically the repricing to a candle that marked a delivery shift, and it must be interpreted inside the premium/discount array hierarchy. Support: [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Order Block Definition]; [ICT_BIBLE__ORDER_BLOCKS_KILL_ZONES__2026-02-01.html | Change in State of Delivery]; [ICT_BIBLE__HTF_PD_ARRAYS_HIERARCHY__2026-02-01.html | Premium Arrays]

**Cross-References:**
- Management phases: [0, 1]
- Related models: [1.4 Breaker Entry]
- Relationship basis: [ANALYTICAL] The breaker explicitly uses the order block inside the breaker for fine-tuned entry, making breaker entry a more specific order-block application. Support: [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Entry Methods]

### 1.3 Turtle Soup

**Primary Sources:** `ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html`
**Supporting Sources:** `ict-2022-ep38.html`
**Era:** 2016/2017
**Teaching Context:** 2016/2017 mentorship
**Priority Tier:** 1
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] Turtle Soup is a false-break reversal model built around old highs or lows, but ICT's version is not just the Larry Connors false-break pattern. The highest-probability versions are tied to expansion swings, the last three days' key highs/lows, and higher-timeframe banking levels or premium/discount arrays.
Support: [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | Turtle Soup Core Concept]; [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | 1 & 2: Trading Previous Day Highs & Lows]; [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | 7: New York Session Reversals]

**Definition:**
- "it's the concept of turtle soup which is a false break above an old high or false break below an old low but it's one step further than that" [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | 6:11-6:20]
- [paraphrase] The "one step further" is ICT's requirement that the false break be paired with the right contextual array or banking level rather than traded as a generic stop hunt in isolation. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | 1 & 2: Trading Previous Day Highs & Lows]
- [paraphrase] Previous day highs/lows, intra-week highs/lows, intermediate-term highs/lows, New York session reversals, and London close reversals are all valid Turtle Soup contexts when the right narrative exists. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | The Eight Reversal Types]

**Prerequisites / Conditions:**
1. [paraphrase] There must be an obvious old high or old low with resting stops above or below it. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | 1 & 2: Trading Previous Day Highs & Lows]; [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | 5 & 6: Intermediate Term Highs & Lows]
2. [paraphrase] The crown-jewel versions appear during expansion swings, where a normal retracement raids the previous day's high or low and then resumes the larger directional move. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | Crown Jewel: Expansion Swings]
3. [paraphrase] The default reference set is the last three days, not arbitrary distant highs and lows. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | Always Refer to Last 3 Days]
4. [paraphrase] Higher-probability versions are paired with banking levels, a premium array above the old high for bearish reversals, or a discount array below the old low for bullish reversals. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | 1 & 2: Trading Previous Day Highs & Lows]
5. [paraphrase] Storyline and market context matter; intermediate-term versions are specifically described as context-dependent rather than automatic. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | 5 & 6: Intermediate Term Highs & Lows]

**Entry Sequence:**
1. [paraphrase] Start with the last three days and identify which reversal type is in play: previous-day high/low, intra-week high/low, intermediate-term high/low, New York session reversal, or London close reversal. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | The Eight Reversal Types]; [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | Always Refer to Last 3 Days]
2. [paraphrase] Wait for price to trade through that level and run the stops above or below it. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | Turtle Soup Core Concept]
3. [paraphrase] For bearish setups, prefer the stop run into a short-term premium array or banking level; for bullish setups, prefer the stop run into a discount array such as a fair value gap. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | 1 & 2: Trading Previous Day Highs & Lows]
4. [paraphrase] When the setup is part of an expansion swing, treat the false break as the retracement raid before the larger directional move resumes. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | Crown Jewel: Expansion Swings]
5. [paraphrase] Use the session-specific reversal windows when present, with New York and London close described as common delivery points for these reversals. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | 7: New York Session Reversals]; [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | 8: London Close Reversals]

**Stop Placement:**
- [paraphrase] In the worked buy-stop-into-fair-value-gap variant, the stop goes just below the lowest low after price trades into the setup area; the source does not state one universal stop template across all eight Turtle Soup variants. [ict-2022-ep38.html | Turtle Soup Structure]

**Target Logic:**
- [paraphrase] The model anticipates reversal away from the raided liquidity level, but the source does not state a universal target framework for all turtle soup variants. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | Turtle Soup Core Concept]
- [paraphrase] The source's taxonomy includes eight reversal variants: previous-day highs, previous-day lows, intra-week highs, intra-week lows, intermediate-term highs, intermediate-term lows, New York session reversals, and London close reversals. [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | The Eight Reversal Types]

**Invalidation:**
[NO CANONICAL SOURCE FOUND]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] Turtle Soup is not just a session fake move. Its defining feature is the false break of an established external liquidity level, while the Judas Swing is the session-timed fake move that can deliver the same kind of reversal on a smaller scale. Support: [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | Turtle Soup Core Concept]; [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | Judas Swing Connections]

**Cross-References:**
- Management phases: [0, 5]
- Related models: [1.5 Judas Swing Entry]
- Relationship basis: Explicit. The source says these reversal concepts can be reduced to Judas timing windows in London, New York, Asia, and London close. Support: [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | Judas Swing Connections]

### 1.4 Breaker Entry

**Primary Sources:** `ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html`; `ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html`
**Supporting Sources:** `ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md`
**Era:** 2016/2017
**Teaching Context:** 2016/2017 mentorship
**Priority Tier:** 1
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] A breaker entry is a liquidity-run-and-repricing model built around a breaker that also functions as an order block. The setup seeks a stop run into higher-timeframe liquidity, then uses the breaker range, its mean threshold, or a refined order block inside it to enter in the new direction.
Support: [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Definition]; [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Bread and Butter Targeting]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Entry Methods]

**Definition:**
- "this is my bearish breaker it is a schematic in terms of understanding how runs on liquidity and then a repricing lower occurs" [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Definition]
- "Theory Breakers are order blocks" [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Definition]

**Prerequisites / Conditions:**
1. [paraphrase] The highest-precision breaker has two stages of liquidity: a short-term pool and a higher-timeframe pool. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Two Stages of Liquidity]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Two-Stage Liquidity]
2. [paraphrase] The trader must isolate the A-to-B price leg and ignore the manipulation or time-distortion segment that ran liquidity. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Structure & Pattern Recognition]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | A-to-B Price Leg]
3. [SOURCE DIVERGENCE] The supporting note quotes the general PD-array idea that sometimes the entire range including wicks is used, but it immediately adds "Not when it comes to breakers." This reference therefore measures the breaker from the body/open-close range of the qualifying breaker candle rather than from wick extremes. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Breaker Entry — Lowest Down Close Candle, Full Range]
4. [paraphrase] Narrative and liquidity location matter; the pattern is not treated as a stand-alone shape. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Bearish Breaker Application]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Entry Methods]

**Entry Sequence:**
1. [paraphrase] Identify the short-term liquidity run and the higher-timeframe liquidity draw that completes the breaker context. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Two Stages of Liquidity]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Two-Stage Liquidity]
2. [paraphrase] Mark the A-to-B leg for targeting and context, ignoring the manipulation segment that created the stop run. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Structure & Pattern Recognition]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | A-to-B Price Leg]
3. [paraphrase] Use the breaker itself for entry; the source says it does not need to be traded as a break-and-retest. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Entry Refinement]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Entry Methods]
4. [paraphrase] Refine inside the breaker from the breaker candle's body/open-close range and then use the mean threshold or internal order-block logic if the example supports deeper refinement; the supporting note's wick-inclusive annotation is not followed because its own quoted rule says "Not when it comes to breakers." [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Breaker Entry — Lowest Down Close Candle, Full Range]; [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Entry Refinement]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Entry Methods]
5. [paraphrase] If desired, scale in as price trades deeper into the breaker. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Position Scaling Strategy]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Entry Methods]

**Stop Placement:**
[NO CANONICAL SOURCE FOUND]
- [paraphrase] The source is explicit that a breaker attempt can stop out and still be re-entered at half size if the narrative has not changed, but it does not state one universal precise stop level for breaker entry here. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Stop Loss Management]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Stop Loss Management]

**Target Logic:**
- "whatever this range is from here to here here one standard deviation lower that is the easiest bread and butter approach to using the breaker" [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Bread and Butter Targeting]
- [paraphrase] Extended objectives come from standard deviations off the A-to-B leg that line up with higher-timeframe liquidity. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Bread and Butter Targeting]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Standard Deviations From A-to-B Leg]

**Invalidation:**
- [paraphrase] If the trade runs into the stop loss and the repricing thesis is not yet confirmed, the current breaker attempt is invalidated. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Position Scaling Strategy]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Entry Methods]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] Breaker Entry is not a simple break-and-retest or any order block. It specifically follows a liquidity run and repricing sequence, with the breaker itself acting as an order block that can be traded before the classical retest pattern appears. Support: [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Definition]; [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Entry Refinement]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Entry Methods]

**Cross-References:**
- Management phases: [0, 1, 4, 7]
- Related models: [1.2 Order Block Entry, 2.1 Model 2022]
- Relationship basis: Explicit for 1.2 because the source states breakers are order blocks, and explicit for 2.1 because the source says the 2022 model can be used while entering through the breaker leg. Support: [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Definition]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Entry Methods]

### 1.5 Judas Swing Entry

**Primary Sources:** `ICT_BIBLE__JUDAS_SWING__2026-02-01.html`
**Supporting Sources:** none
**Era:** 2016/2017
**Teaching Context:** 2016/2017 mentorship
**Priority Tier:** 2
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] Judas Swing is the session-level false move that leads traders onto the wrong side before the real intraday direction unfolds. It is framed by higher-timeframe bias, the midnight New York opening price, and the Asian range.
Support: [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Definition]; [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Time Frame & Window]

**Definition:**
- "the Judas swing is a false rung that trips traders that lack the understanding of true direction of the day" [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Definition]
- [paraphrase] The model uses higher-timeframe analysis to decide which direction the Judas Swing should form before the intraday move begins. [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Introduction]

**Prerequisites / Conditions:**
1. [paraphrase] A higher-timeframe bullish or bearish premise must already be established. [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Bullish Judas Swing]; [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Bearish Judas Swing]
2. [paraphrase] The midnight New York opening price is the main reference line and the active hunting window is midnight to 5:00 AM New York time. [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Time Frame & Window]
3. [paraphrase] The Asian range provides the manipulation boundaries the Judas Swing runs against. [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Bullish Judas Swing]; [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Bearish Judas Swing]

**Entry Sequence:**
1. [paraphrase] Mark the midnight New York opening price and the Asian range. [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Time Frame & Window]
2. [paraphrase] In a bullish day, look for the pop above the Asian range high, then the drop below the opening price and below the Asian range low that forms the Judas Swing. [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Bullish Judas Swing]
3. [paraphrase] In a bearish day, look for the initial drop below the Asian range low first, then the rally above the Asian range high that also goes above the midnight opening price; that combined move through both levels is when the Judas Swing is confirmed. [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Bearish Judas Swing]
4. [paraphrase] Use the false move to fade traders trapped on the wrong side, rather than trading with the fake breakout. [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Definition]

**Stop Placement:**
[NO CANONICAL SOURCE FOUND]

**Target Logic:**
- [paraphrase] In the bullish example the Judas Swing creates the London-session low that becomes the low of the day, and the bearish version similarly marks the day’s trap high. [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Bullish Judas Swing]; [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Bearish Judas Swing]

**Invalidation:**
- [paraphrase] If the required opening-price and Asian-range elements are missing, the move should not be called a Judas Swing. [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Definition]; [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Bullish Judas Swing]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] Judas Swing is a time-window manipulation model around the midnight opening price and Asian range, whereas Turtle Soup is the broader false-break concept around old external liquidity levels. Support: [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Time Frame & Window]; [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | Turtle Soup Core Concept]

**Cross-References:**
- Management phases: [0, 5]
- Related models: [2.3 Power Three Entry (Opening Price Fade)]
- Relationship basis: [ANALYTICAL] Power Three uses the Judas Swing as the manipulation leg around the session opening price. Support: [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Definition]; [ict-2022-ep09-power-three-ny-pm.html | Judas Swing]

### 1.6 One Shot One Kill (Weekly)

**Primary Sources:** `ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html`
**Supporting Sources:** none
**Era:** 2016/2017
**Teaching Context:** 2016/2017 mentorship
**Priority Tier:** 3
**Evidence Status:** Paraphrase-Only

**Plain English Summary:**
[SUMMARY] One Shot One Kill is the back-end weekly opportunity that comes from correctly reading the weekly manipulation profile. The model is not one fixed candle shape; it uses weekly range structure, higher-timeframe liquidity, and profile recognition to take one well-framed trade rather than many intraday stabs.
Support: [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Overview]; [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Study & Review]

**Definition:**
- [paraphrase] Once the weekly range and directional characteristics are defined, the back end of the week can itself become the “one shot one kill” opportunity even if the Tuesday or Wednesday extreme was missed. [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Study & Review]
- [paraphrase] The source presents this as a library of weekly market-manipulation templates rather than one single intraday trigger. [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Overview]

**Prerequisites / Conditions:**
1. [paraphrase] The trader must know which weekly profile is developing, such as Tuesday low/high, Wednesday low/high, consolidation reversal, or seek-and-destroy. [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Overview]
2. [paraphrase] Higher-timeframe liquidity pools and premium/discount arrays frame the trade. [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Classic Tuesday Low of the Week]; [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Wednesday High of Week]
3. [paraphrase] Targets are taken from a timeframe lower than the array used for entry. [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Study & Review]

**Entry Sequence:**
1. [paraphrase] Determine the weekly profile and the higher-timeframe liquidity pool being raided or defended. [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Classic Tuesday Low of the Week]; [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Wednesday Weekly Reversal Profiles]
2. [paraphrase] Frame the actual entry on a lesser-timeframe PD array or order block that aligns with that weekly idea. [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Classic Tuesday High of the Week]; [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Consolidation Midweek Rally - Bullish]
3. [paraphrase] If the Tuesday or Wednesday extreme is missed, the later-week continuation into Friday can still be traded as the one-shot opportunity. [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Study & Review]

**Stop Placement:**
[NO CANONICAL SOURCE FOUND]

**Target Logic:**
- [paraphrase] Targets are lesser-timeframe premium/discount arrays, 127 or 168 extensions, perfect symmetrical price swings, and the fourth-stage terminus. [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Classic Tuesday Low of the Week]; [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Wednesday Low of Week]

**Invalidation:**
[NO CANONICAL SOURCE FOUND]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] One Shot One Kill is a weekly profile framework, not a single micro entry pattern. The profile tells you where the one good trade should come from during the week. Support: [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Overview]; [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Study & Review]

**Cross-References:**
- Management phases: [0, 5]
- Related models: [2.7 TGIF Entry]
- Relationship basis: [ANALYTICAL] Both models are back-end-of-week frameworks, but TGIF is specifically Friday’s retracement into the weekly range while One Shot One Kill covers the broader weekly profile opportunity. Support: [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Study & Review]; [tgif-setup-study.html | Core Definition]

### 1.7 Opening Price Entry (Midnight / Asian Range)

**Primary Sources:** `ICT_BIBLE__ASIAN_RANGE__2026-02-01.html`
**Supporting Sources:** none
**Era:** 2016/2017
**Teaching Context:** 2016/2017 mentorship
**Priority Tier:** 2
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] Opening Price Entry uses the midnight New York opening price together with the Asian range to frame post-midnight manipulation and entry. The core idea is to know the directional bias first, then use the opening price and Asian-range raid to get positioned with the true move.
Support: [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Definition]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Opening Price Concept Evolution (1994)]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Bias Requirements]

**Definition:**
- "If we're bullish it's going to go below that opening price to seek liquidity and then go higher and spend the rest of the day going higher when it's bearish it'll go above the opening price at midnight to reach for liquidity and then move lower" [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Opening Price Concept Evolution (1994)]
- [paraphrase] The Asian range provides the context or storyline for what price is likely to do after midnight when the algorithm resets. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Definition]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Midnight Algorithm Reset]

**Prerequisites / Conditions:**
1. [paraphrase] The trader needs a directional bias and may not change that bias because of small intraday noise. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Bias Requirements]
2. [paraphrase] The Asian range runs from 7:00 PM to midnight New York time, and narrower ranges set up larger trending potential. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Structure & Time Window]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Bullish Setup Sequence]
3. [paraphrase] Midnight is the algorithm reset and the opening price is extended through the morning to serve as the reference line. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Midnight Algorithm Reset]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Opening Price Concept Evolution (1994)]

**Entry Sequence:**
1. [paraphrase] Mark the Asian range and the midnight opening price extended forward in time. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Structure & Time Window]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Opening Price Concept Evolution (1994)]
2. [paraphrase] In a bullish day, wait for price to trade below the opening price and usually below the Asian low before looking for the long. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Bullish Setup Sequence]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Opening Price Concept Evolution (1994)]
3. [paraphrase] In a bearish day, wait for price to trade above the opening price and into the manipulation above the Asian high before selling. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Bearish Setup Sequence]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Opening Price Concept Evolution (1994)]
4. [paraphrase] Stop orders can be used to automate the entry if price reverses through the intended trigger. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Buy Stop / Sell Stop Contingent Orders]

**Stop Placement:**
- [paraphrase] The source rejects ultra-tight stops and gives a practical example of roughly 35 to 40 pips for this style. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Practical Rules & Guidelines]

**Target Logic:**
- [paraphrase] The base weekly objective is 50 to 75 pips, after which the trader is done for the week. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Practical Rules & Guidelines]

**Invalidation:**
- [paraphrase] In the bullish setup, the Asian range low must break before the buy-stop idea is valid; doing it first gets the trader burned. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Bullish Setup Sequence]

**R:R Context:**
- [paraphrase] The worked example uses roughly a 35-40 pip stop with an 80 pip take-profit. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Practical Rules & Guidelines]

**Key Distinction:**
- [ANALYTICAL] Opening Price Entry is not just "fade midnight." It is the midnight opening-price model interpreted through Asian-range context, the algorithm reset, and a prior directional bias. Support: [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Definition]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Midnight Algorithm Reset]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Bias Requirements]

**Cross-References:**
- Management phases: [0, 2, 3, 9]
- Related models: [1.5 Judas Swing Entry]
- Relationship basis: Explicit. The midnight opening price and Asian-range manipulation are the same core elements used in Judas Swing. Support: [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Opening Price Concept Evolution (1994)]; [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Time Frame & Window]

### 1.8 Stop Entry Long-Term

**Primary Sources:** `ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html`; `ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html`
**Supporting Sources:** none
**Era:** 2016/2017
**Teaching Context:** 2016/2017 mentorship
**Priority Tier:** 3
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] Stop Entry Long-Term is a higher-timeframe execution model. Monthly and weekly order flow set the directional thesis, but the actual trigger is a stop order placed at the open of a completed daily candle that matches the setup.
Support: [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Definition]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | Overview]

**Definition:**
- "Stop entry techniques for long-term Traders" [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Definition]
- "We're trading on the higher time frame monthly and weekly but we're executing on The Daily" [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Definition]

**Prerequisites / Conditions:**
1. [paraphrase] Monthly or weekly order flow must already be pointing to a PD array above or below daily market price. [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Buying with Stop Orders]; [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Selling with Stop Orders]
2. [paraphrase] The daily candle must be complete; it is not valid while the daily candle is still forming. [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Buying with Stop Orders]; [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Selling with Stop Orders]
3. [paraphrase] Longs use completed down-close candles and shorts use completed up-close candles. [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Buying with Stop Orders]; [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Selling with Stop Orders]

**Entry Sequence:**
1. [paraphrase] For longs, wait for a completed bearish daily candle and place the buy stop at that candle's opening price. [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Buying with Stop Orders]
2. [paraphrase] For shorts, wait for a completed bullish daily candle and place the sell stop at that candle's opening price. [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Selling with Stop Orders]
3. [paraphrase] If the order does not fill, move forward to the next new qualifying daily candle and repeat. [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Buying with Stop Orders]
4. [paraphrase] The technique is equivalent to using the daily order-block opening price as the trigger. [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Order Block Theory Connection]

**Stop Placement:**
- [paraphrase] After entry, the initial trailing stop is below the lowest low of the last 40 trading days for bullish positions or above the highest high of the last 40 trading days for bearish positions. [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | Stop Loss Management]
- [paraphrase] Once the move reaches the later part of its expected range, the stop tightens to a 20-day lookback. [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | Stop Loss Management]

**Target Logic:**
- [paraphrase] The trade is held toward the monthly or weekly premium/discount array that justified the setup. [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Position Scaling & Re-Entry]
- [paraphrase] The source also permits taking partials, then re-entering at the same opening price on retracements while the higher-timeframe objective is unchanged. [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Position Scaling & Re-Entry]

**Invalidation:**
[NO CANONICAL SOURCE FOUND]

**R:R Context:**
- [paraphrase] Buy-stop entries fill more often, but they also increase the distance between entry and the stop-loss level. [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | Bullish Market Conditions Framework]

**Key Distinction:**
- [ANALYTICAL] This is not an intraday stop-entry tactic. It is daily execution of a higher-timeframe monthly/weekly thesis using daily candle opens as order-block-like triggers. Support: [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Definition]; [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Order Block Theory Connection]

**Cross-References:**
- Management phases: [1, 3, 4, 5, 9]
- Related models: [1.2 Order Block Entry]
- Relationship basis: Explicit. The source directly says the stop-entry technique is the same entry-price logic used at bullish and bearish order blocks. Support: [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Order Block Theory Connection]

### 2.1 Model 2022

**Primary Sources:** `ict-2022-ep38.html`; `ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html`; `immediate_rebalance_notes.html`
**Supporting Sources:** none
**Era:** 2022
**Teaching Context:** 2022 mentorship
**Priority Tier:** 1
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] Model 2022 is the core 2022 liquidity-sweep setup: price raids liquidity, shifts market structure, forms a fair value gap, and offers the entry on the return into that gap. The model is narrative-driven rather than purely time-driven, but it can be blended with time-window models such as Silver Bullet.
Support: [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Integration with Other ICT Models]; [immediate_rebalance_notes.html | Model 2022 &amp; Silver Bullet — Blended]; [ict-2022-ep38.html | Narrative — Defined]

**Definition:**
- "this right here is model 2022 buy side taken shift in Market structure fair value Gap go short that's M 2022" [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Integration with Other ICT Models]
- [paraphrase] The same logic can be used inversely after a sell-side sweep in a bullish narrative. [immediate_rebalance_notes.html | Model 2022 &amp; Silver Bullet — Blended]; [ict-2022-ep38.html | Narrative — Defined]

**Prerequisites / Conditions:**
1. [paraphrase] A narrative must already exist for what price should do and what liquidity it should encounter. [ict-2022-ep38.html | Narrative — Defined]
2. [paraphrase] Price must first sweep external liquidity, then shift market structure. [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Integration with Other ICT Models]; [immediate_rebalance_notes.html | Model 2022 &amp; Silver Bullet — Blended]
3. [paraphrase] A fair value gap must exist in the displacement range that follows the shift. [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Integration with Other ICT Models]; [immediate_rebalance_notes.html | Model 2022 &amp; Silver Bullet — Blended]

**Entry Sequence:**
1. [paraphrase] Define the session narrative and higher-timeframe reason for the trade before precision hunting begins. [ict-2022-ep38.html | Narrative — Defined]
2. [paraphrase] Let price sweep buy-side or sell-side liquidity and create the market structure shift. [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Integration with Other ICT Models]; [immediate_rebalance_notes.html | Model 2022 &amp; Silver Bullet — Blended]
3. [paraphrase] Identify the fair value gap that forms in that displacement. [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Integration with Other ICT Models]
4. [paraphrase] Enter on the trade back into the gap, then aim for the next opposing liquidity pool. [immediate_rebalance_notes.html | Model 2022 &amp; Silver Bullet — Blended]
5. [paraphrase] When the larger narrative is an afternoon continuation or reversal, the same logic can be used to frame the lunch or PM session run. [ict-2022-ep38.html | New York Lunch Hour — Bullish Pattern]

**Stop Placement:**
[NO CANONICAL SOURCE FOUND]

**Target Logic:**
- [paraphrase] The example targets another pass into the sell-side liquidity pool after the gap entry. [immediate_rebalance_notes.html | Model 2022 &amp; Silver Bullet — Blended]
- [paraphrase] In the bullish afternoon narrative example, the model is framed around the run into the later-day objective rather than a fixed tick target. [ict-2022-ep38.html | Narrative — Defined]; [ict-2022-ep38.html | New York Lunch Hour — Bullish Pattern]

**Invalidation:**
- [paraphrase] If there is no fair value gap after the liquidity sweep and structure shift, the model is not present. [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Integration with Other ICT Models]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] Model 2022 is a structural liquidity-sweep model, not a clock-window model. Silver Bullet can host a Model 2022 entry, but the model itself is defined by the sweep, the structure shift, and the fair value gap. Support: [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Integration with Other ICT Models]; [immediate_rebalance_notes.html | Model 2022 &amp; Silver Bullet — Blended]

**Cross-References:**
- Management phases: [0, 5, 7]
- Related models: [2.2 Silver Bullet]
- Relationship basis: Explicit. The source says Model 2022 and Silver Bullet can be blended when the structure appears inside the time window. Support: [immediate_rebalance_notes.html | Model 2022 &amp; Silver Bullet — Blended]

### 2.2 Silver Bullet

**Primary Sources:** `ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html`; `immediate_rebalance_notes.html`
**Supporting Sources:** `silver_bullet.html`
**Era:** 2022
**Teaching Context:** 2022 mentorship
**Priority Tier:** 1
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] Silver Bullet is a time-gated fair-value-gap entry model. The trader first determines the next draw on liquidity, then takes entry into the qualifying fair value gap inside one of three New York session windows: London open, AM session, or PM session. The fair value gap itself may already exist before the active hour begins.
Support: [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Definition]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Types of Draws on Liquidity]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Critical Rules & Guidelines]

**Definition:**
- "ICT Silver Bullet trade setup which is a time-based algorithmic trading model for all asset classes" [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Definition]
- [paraphrase] ICT states that some market will offer one of these setups every trading day. [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Definition]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Critical Rules & Guidelines]
- [paraphrase] The setup may not appear in the specific instrument currently being watched, which is why the source recommends specializing in one market instead of forcing the pattern everywhere. [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Critical Rules & Guidelines]

**Prerequisites / Conditions:**
1. [paraphrase] Charts must be calibrated to New York local time. [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Critical Rules & Guidelines]
2. [paraphrase] The trader must first determine the next draw on liquidity rather than starting with entry precision. [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Types of Draws on Liquidity]
3. [paraphrase] One of three windows must be active: 3:00-4:00 AM, 10:00-11:00 AM, or 2:00-3:00 PM New York local time. [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | London Open Silver Bullet]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | AM Session Silver Bullet]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | PM Session Silver Bullet]
4. [paraphrase] The entry must occur inside the active window; the fair value gap itself can either form in the window or pre-exist it. [immediate_rebalance_notes.html | 56:56]

**Entry Sequence:**
1. [paraphrase] Select the likely draw on liquidity from the available framework: previous day high/low, previous session highs/lows, previous week high/low, new week opening gap, classic OTE, or inefficiency. [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Types of Draws on Liquidity]
2. [paraphrase] Wait for the active London, AM, or PM Silver Bullet window in New York local time. [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | London Open Silver Bullet]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | AM Session Silver Bullet]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | PM Session Silver Bullet]
3. [paraphrase] Identify the fair value gap that will be traded; it may have formed earlier in the session rather than inside the active hour itself. [immediate_rebalance_notes.html | 56:56]
4. [paraphrase] Enter on the reprice into that gap inside the active Silver Bullet window; the examples treat bodies staying inside the gap as supporting behaviour. [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | London Open Silver Bullet]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | AM Session Silver Bullet]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | PM Session Silver Bullet]
5. [paraphrase] Entry is taken inside the active window, but the trade can continue beyond the one-hour window; the timing restriction governs the setup and entry, not the exit. [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Critical Rules & Guidelines]; [immediate_rebalance_notes.html | 56:56]

**Stop Placement:**
- [paraphrase] Silver Bullet stop placement follows the OTE stop framework named in the source: the stop belongs at the reference swing extreme that defines the setup risk, not at an arbitrary buffer beyond the gap. [silver_bullet.html | 10:41]; [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Risk Model & Stop Loss]

**Target Logic:**
- [paraphrase] The examples aim at the next draw on liquidity, including sell side liquidity, relative equal highs, and premium inefficiency above price. [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Types of Draws on Liquidity]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | AM Session Silver Bullet]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | PM Session Silver Bullet]

**Invalidation:**
[NO CANONICAL SOURCE FOUND]

**R:R Context:**
- [paraphrase] The minimum trade framework is 10 points or 40 ticks for index futures and 15 pips for forex, but the source says this is the best-case price delivery, not the actual entry-to-exit range. [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Minimum Trade Framework]

**Key Distinction:**
- [ANALYTICAL] Silver Bullet is not defined by fair value gap alone; it is a fair-value-gap entry restricted to three specific New York time windows and organised around the next draw on liquidity. Support: [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Definition]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Types of Draws on Liquidity]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Critical Rules & Guidelines]

**Cross-References:**
- Management phases: [4, 5]
- Related models: [1.1 Optimal Trade Entry (OTE)]
- Relationship basis: Explicit for 1.1, because the source lists a classic ICT OTE as one valid Silver Bullet framework. Support: [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Types of Draws on Liquidity]

### 2.3 Power Three Entry (Opening Price Fade)

**Primary Sources:** `ict-2022-ep09-power-three-ny-pm.html`; `ict-2022-ep21.html`
**Supporting Sources:** `ict-2022-ep17-forex-model.html`
**Era:** 2022
**Teaching Context:** 2022 mentorship
**Priority Tier:** 1
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] Power Three Entry is an opening-price model built around accumulation, manipulation, and distribution. The trader marks the opening price, waits for the Judas-style fake move through it, and then trades the return in the true directional bias using an order block or fair value gap.
Support: [ict-2022-ep09-power-three-ny-pm.html | Power Three — Defined]; [ict-2022-ep21.html | 8:30 AM Opening Price — New York Session]; [ict-2022-ep09-power-three-ny-pm.html | The 8:30 Opening Price]

**Definition:**
- "Power Three which is accumulation, manipulation and distribution" [ict-2022-ep09-power-three-ny-pm.html | Power Three — Defined]
- [paraphrase] For the New York session, the 8:30 opening price is the anchor ICT uses for the Power Three framework. [ict-2022-ep21.html | 8:30 AM Opening Price — New York Session]

**Prerequisites / Conditions:**
1. [paraphrase] The trader must have a bullish or bearish bias before using the opening price. [ict-2022-ep09-power-three-ny-pm.html | Power Three — Defined]; [ict-2022-ep21.html | Power 3]
2. [paraphrase] The opening price, especially 8:30 for New York, is the reference line for the manipulation phase. [ict-2022-ep09-power-three-ny-pm.html | The 8:30 Opening Price]; [ict-2022-ep21.html | 8:30 AM Opening Price — New York Session]
3. [paraphrase] The trader should not chase a strong overnight move; the model waits for the fake move and more information. [ict-2022-ep09-power-three-ny-pm.html | How to Handle Overnight Runs]
4. [paraphrase] New York-session traders start with the midnight opening price, but the framework is recalibrated at 8:30 for the intraday session model. [ict-2022-ep17-forex-model.html | Recalibrating at 8:30 for New York Session]

**Entry Sequence:**
1. [paraphrase] Mark the opening price for the relevant session, with 8:30 used for the New York session and midnight used for the broader daily-range Power Three. [ict-2022-ep21.html | Midnight New York Opening Price]; [ict-2022-ep21.html | 8:30 AM Opening Price — New York Session]
2. [paraphrase] If the midnight and 8:30 opening prices disagree, recalibrate at 8:30: in bearish setups use the lower of the two as the minimum threshold for the Judas/protraction higher, and reverse that logic for bullish setups. [ict-2022-ep17-forex-model.html | Recalibrating at 8:30 for New York Session]
3. [paraphrase] Wait for the manipulation leg or Judas swing through the opening price in the opposite direction of the intended trade. [ict-2022-ep09-power-three-ny-pm.html | Judas Swing]; [ict-2022-ep21.html | 8:30 AM Opening Price — New York Session]
4. [paraphrase] Confirm the return with the entry checklist: trade through the opening price, hit the imbalance, run the short-term low or high, and align with an order block or OTE/FVG. [ict-2022-ep09-power-three-ny-pm.html | The 8:30 Opening Price]
5. [paraphrase] Enter inside the order block and fair value gap retracement rather than buying or selling the opening move blindly. [ict-2022-ep09-power-three-ny-pm.html | Identifying a High Probability Order Block]
6. [paraphrase] In the PM example, the short-term low formed after the fair value gap becomes the limit-entry reference. [ict-2022-ep09-power-three-ny-pm.html | New York PM Session]

**Stop Placement:**
- [paraphrase] In the PM-session example, the stop belongs at the short-term low that forms after the fair value gap. [ict-2022-ep09-power-three-ny-pm.html | New York PM Session]
- [paraphrase] When two fair value gaps exist, the lower one is used for entry and the upper one is used as the risk reference. [ict-2022-ep21.html | Two Fair Value Gaps — Entry vs Risk]

**Target Logic:**
- [paraphrase] The distribution leg seeks the important high or low that fits the session bias, including the later-day PM run. [ict-2022-ep21.html | Power 3]; [ict-2022-ep09-power-three-ny-pm.html | New York PM Session]
- [paraphrase] In the bullish daily structure, price is expected to open near low, manipulate lower, and close near the high. [ict-2022-ep09-power-three-ny-pm.html | Power Three — Defined]

**Invalidation:**
- [paraphrase] A slight trade below the fair value gap does not automatically invalidate the PM-session setup if candle bodies continue respecting the level. [ict-2022-ep09-power-three-ny-pm.html | FVG Entry &amp; Stop Loss Rules (PM Session)]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] Power Three Entry is defined by the opening-price manipulation cycle, while Judas Swing names the fake move itself. The model is the full accumulation-manipulation-distribution framework around that move. Support: [ict-2022-ep09-power-three-ny-pm.html | Power Three — Defined]; [ict-2022-ep09-power-three-ny-pm.html | Judas Swing]; [ict-2022-ep21.html | Power 3]

**Cross-References:**
- Management phases: [0, 1, 5]
- Related models: [1.5 Judas Swing Entry]
- Relationship basis: Explicit. The opening-price model repeatedly defines the manipulation phase as a Judas swing or fake move. Support: [ict-2022-ep09-power-three-ny-pm.html | Judas Swing]; [ict-2022-ep21.html | 8:30 AM Opening Price — New York Session]

### 2.4 FVG Entry Drill (Timeframe Cascade)

**Primary Sources:** `ict-2022-ep06-market-efficiency-paradigm.html`; `ict-2022-ep25-rebalancing-drill-stops.html`
**Supporting Sources:** none
**Era:** 2022
**Teaching Context:** 2022 mentorship
**Priority Tier:** 1
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] FVG Entry Drill treats the fair value gap as the executable model and teaches the trader to drill from a higher timeframe down to lower timeframes until the fair value gap that formed in displacement is located. Entry, stop, and partial logic all come off that fair value gap rather than generic pattern recognition.
Support: [ict-2022-ep06-market-efficiency-paradigm.html | The Market Efficiency Paradigm]; [ict-2022-ep06-market-efficiency-paradigm.html | Entry &amp; Exit Rules]; [ict-2022-ep25-rebalancing-drill-stops.html | The Fair Value Gap Is the Model]

**Definition:**
- "The bearish ICT fair value gap this is institutional order flow and it's a pattern that you can see the order flow actually coming into the marketplace." [ict-2022-ep06-market-efficiency-paradigm.html | Bearish ICT Fair Value Gap]
- [paraphrase] In the 2022 drill, the fair value gap itself is the model to focus on because it is the easiest thing for a new trader to understand and execute. [ict-2022-ep25-rebalancing-drill-stops.html | The Fair Value Gap Is the Model]

**Prerequisites / Conditions:**
1. [paraphrase] The fair value gap should form after the market raids liquidity and delivers an energetic displacement with a structure shift. [ict-2022-ep06-market-efficiency-paradigm.html | Bearish ICT Fair Value Gap]; [ict-2022-ep06-market-efficiency-paradigm.html | Displacement High &amp; Displacement Low]
2. [paraphrase] If there is no fair value gap in the displacement range, there is no trade. [ict-2022-ep06-market-efficiency-paradigm.html | Displacement High &amp; Displacement Low]
3. [paraphrase] The drill begins on the 15-minute bellwether chart and then steps down through lower timeframes until the tradable gap is found. [ict-2022-ep06-market-efficiency-paradigm.html | Top-Down Time Frame Process]; [ict-2022-ep25-rebalancing-drill-stops.html | Drilling Down to Find the FVG — 5 to 1 Minute]
4. [paraphrase] For short setups, price must first reach premium; the source explicitly rejects selling in discount. [ict-2022-ep25-rebalancing-drill-stops.html | Never Sell in a Discount — Must Reach Premium First]

**Entry Sequence:**
1. [paraphrase] Start on the 15-minute chart, mark the narrative level and the 8:30 time anchor, then step down through the lower timeframes. [ict-2022-ep06-market-efficiency-paradigm.html | Top-Down Time Frame Process]
2. [paraphrase] Wait for the liquidity run and the displacement candle that creates the market structure shift. [ict-2022-ep06-market-efficiency-paradigm.html | Bearish ICT Fair Value Gap]; [ict-2022-ep06-market-efficiency-paradigm.html | Displacement High &amp; Displacement Low]
3. [paraphrase] Locate the fair value gap inside that displacement range; if it is not present on one timeframe, drill down further. [ict-2022-ep06-market-efficiency-paradigm.html | Displacement High &amp; Displacement Low]; [ict-2022-ep25-rebalancing-drill-stops.html | Drilling Down to Find the FVG — 5 to 1 Minute]
4. [paraphrase] The easiest bearish entry is a limit just above candle number three's high. [ict-2022-ep06-market-efficiency-paradigm.html | Entry &amp; Exit Rules]
5. [paraphrase] The model permits multiple entries as price continues to offer the fair value gap. [ict-2022-ep06-market-efficiency-paradigm.html | Entry &amp; Exit Rules]

**Stop Placement:**
- "Place your stop right above candle number one or you can put it above candle number two." [ict-2022-ep06-market-efficiency-paradigm.html | Entry &amp; Exit Rules]
- [paraphrase] A more conservative version can use the wider swing high and, if the distance is too large, trade micros instead of minis. [ict-2022-ep25-rebalancing-drill-stops.html | Stop Placement]

**Target Logic:**
- [paraphrase] Take partials at internal range liquidity and treat external range liquidity as the full trade objective. [ict-2022-ep06-market-efficiency-paradigm.html | Internal Range Liquidity vs External Range Liquidity]
- [paraphrase] Equal lows and the external sell-side pool are the main downside objectives in the bearish example. [ict-2022-ep06-market-efficiency-paradigm.html | Entry &amp; Exit Rules]

**Invalidation:**
- [paraphrase] If the displacement range contains no fair value gap, the setup is invalid and the trader waits or changes market. [ict-2022-ep06-market-efficiency-paradigm.html | Displacement High &amp; Displacement Low]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] FVG Entry Drill is not just "trade any gap." It is a time-and-liquidity-driven drilldown process where the fair value gap must form inside the displacement that followed the sweep and structure shift. Support: [ict-2022-ep06-market-efficiency-paradigm.html | Bearish ICT Fair Value Gap]; [ict-2022-ep06-market-efficiency-paradigm.html | Displacement High &amp; Displacement Low]; [ict-2022-ep25-rebalancing-drill-stops.html | The Fair Value Gap Is the Model]

**Cross-References:**
- Management phases: [1, 3, 5]
- Related models: [2.2 Silver Bullet]
- Relationship basis: [ANALYTICAL] Silver Bullet is a time-windowed fair-value-gap entry, while FVG Entry Drill is the general institutional-order-flow drill for locating and trading the gap across timeframes. Support: [ict-2022-ep06-market-efficiency-paradigm.html | Entry &amp; Exit Rules]; [ICT_BIBLE__SILVER_BULLET_TIME_BASED_TRADING__2026-02-01.html | Definition]

### 2.5 Buying Sell Stops / Selling Buy Stops

**Primary Sources:** `ict-2022-ep38.html`
**Supporting Sources:** none
**Era:** 2022
**Teaching Context:** 2022 mentorship
**Priority Tier:** 2
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] This model enters where trapped stop orders become smart-money liquidity. In the explicit bullish example, the trader buys sell-side liquidity inside a fair value gap after lunch; the bearish side is the same logic reversed around buy-side liquidity.
Support: [ict-2022-ep38.html | Buying Sell Stops — Inside the Fair Value Gap]; [ict-2022-ep38.html | Narrative — Defined]

**Definition:**
- "I want to be like smart money and do what? Buy. Sell stops — that is buying sell-side liquidity." [ict-2022-ep38.html | Buying Sell Stops — Inside the Fair Value Gap]
- [ANALYTICAL] Selling buy stops is the inverse application: use buy-side liquidity as the fill source in a bearish narrative. Support: [ict-2022-ep38.html | Buying Sell Stops — Inside the Fair Value Gap]

**Prerequisites / Conditions:**
1. [paraphrase] A narrative must already exist for the later-day move, such as the bullish afternoon run in the source example. [ict-2022-ep38.html | Narrative — Defined]
2. [paraphrase] A fair value gap must coincide with the liquidity pool being raided. [ict-2022-ep38.html | Buying Sell Stops — Inside the Fair Value Gap]
3. [paraphrase] The short-term low or high being violated is the actual liquidity source used for the entry. [ict-2022-ep38.html | Buying Sell Stops — Inside the Fair Value Gap]

**Entry Sequence:**
1. [paraphrase] Establish the session narrative and the intended objective by the close. [ict-2022-ep38.html | Narrative — Defined]
2. [paraphrase] Let price sweep below a short-term low into the fair value gap in the bullish version. [ict-2022-ep38.html | Buying Sell Stops — Inside the Fair Value Gap]
3. [paraphrase] Buy that sell-side liquidity inside the gap, using the violated short-term low as the trigger reference. [ict-2022-ep38.html | Buying Sell Stops — Inside the Fair Value Gap]
4. [ANALYTICAL] Reverse the same logic for bearish conditions by selling into raided buy-side liquidity. Support: [ict-2022-ep38.html | Buying Sell Stops — Inside the Fair Value Gap]

**Stop Placement:**
- [paraphrase] In the related worked example, the stop belongs below the lower low created by the liquidity run. [ict-2022-ep38.html | Turtle Soup]

**Target Logic:**
- [paraphrase] The goal is the later-day objective already implied by the narrative, including the afternoon run into the chosen target by the close. [ict-2022-ep38.html | Buying Sell Stops — Inside the Fair Value Gap]

**Invalidation:**
[NO CANONICAL SOURCE FOUND]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] The defining feature is not the fair value gap alone; it is using the stop pool itself as the liquidity source for entry. Support: [ict-2022-ep38.html | Buying Sell Stops — Inside the Fair Value Gap]

**Cross-References:**
- Management phases: [1, 5]
- Related models: [1.3 Turtle Soup]
- Relationship basis: Explicit. The same source teaches buying sell stops alongside the related Turtle Soup / OTE entry logic at the same location. Support: [ict-2022-ep38.html | Buying Sell Stops — Inside the Fair Value Gap]; [ict-2022-ep38.html | Turtle Soup]

### 2.6 MMM Entry — Market Maker Buy/Sell Model Stages

**Primary Sources:** `ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html`; `market_maker_models.html`; `ict_SIBIFVG.html`
**Supporting Sources:** none
**Era:** 2022
**Teaching Context:** 2022 mentorship
**Priority Tier:** 2
**Evidence Status:** Direct

**Plain English Summary:**
[SUMMARY] MMM Entry is the advanced market-maker-model framework built around original consolidation, the side of the curve, and the staged transition from accumulation to reaccumulation or redistribution. Smart Money Reversal is the advanced top- or bottom-picking attempt at the curve turn; the Unicorn is the lower-risk deferred continuation entry defined as second-stage redistribution in the sell model or the corresponding second-stage reaccumulation in the buy model.
Support: [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Definition - Market Maker Models]; [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Unicorn Setup - Second Stage Redistribution]; [market_maker_models.html | Stages of the Sell Model]

**Definition:**
- "that's a unicorn okay unicorn is second stage redistribution in a cell model Market maker cell model" [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Unicorn Setup - Second Stage Redistribution]
- "this is what I refer to as a smart money reversal you are years away from ever being able to do that consistently" [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Smart Money Reversal]
- [paraphrase] The broader MMM framework is algorithmic price delivery in institutional price swings organized around original consolidation and the buy/sell side of the curve. [market_maker_models.html | What Is a Market Maker Model?]; [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Definition - Market Maker Models]

**Prerequisites / Conditions:**
1. [paraphrase] The trader must understand multiple PD arrays and multiple draws on liquidity; the source explicitly calls this advanced. [market_maker_models.html | What You Must Already Know]
2. [paraphrase] Original consolidation and the side of the curve must be identified correctly. [market_maker_models.html | Original Consolidation]; [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Buy Side of Curve vs Sell Side of Curve]
3. [paraphrase] The buy model includes first-stage accumulation and second-stage reaccumulation, while the sell model includes smart money reversal and second-stage redistribution. [market_maker_models.html | Stages of the Sell Model]; [market_maker_models.html | Stages of the Buy Model]
4. [paraphrase] Smart Money Reversal is the most advanced form of the idea and should not be conflated with the lower-risk Unicorn continuation entry. [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Smart Money Reversal]; [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Unicorn Setup - Second Stage Redistribution]

**Entry Sequence:**
1. [paraphrase] Identify the original consolidation and whether price is on the buy side or sell side of the curve. [market_maker_models.html | Original Consolidation]; [market_maker_models.html | The Buy Side and Sell Side of the Curve]
2. [paraphrase] In the buy model, look for return to the original consolidation or the first-stage accumulation area first, then second-stage reaccumulation if price does not deliver the deeper return. [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Original Consolidation]; [market_maker_models.html | Stages of the Buy Model]
3. [paraphrase] In the sell model, Smart Money Reversal marks the advanced top-picking attempt near the curve turn, but the lower-risk canonical continuation entry is the bearish order block that forms second-stage redistribution. [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Smart Money Reversal]; [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Unicorn Setup - Second Stage Redistribution]; [market_maker_models.html | Stages of the Sell Model]
4. [paraphrase] Treat the Unicorn as the body of the qualifying redistribution or reaccumulation order block, using mean-threshold or body logic inside that block rather than substituting a 60-minute fair value gap consequent encroachment as the Unicorn itself. [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Unicorn Setup - Second Stage Redistribution]; [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Original Consolidation]; [ict_SIBIFVG.html | The Unicorn Trade]
5. [paraphrase] Once price has crossed to the other side of the curve, the old discount arrays should begin acting as premium arrays in the new sell-side delivery. [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Buy Side of Curve vs Sell Side of Curve]

**Stop Placement:**
- [paraphrase] The source gives explicit stop guidance for the lower-risk post-reversal short-entry variation, but does not give one universal stop rule that covers every stage of the full buy/sell model. [market_maker_models.html | Low Risk Short Entry Guidance]

**Target Logic:**
- [paraphrase] On the sell side of the curve, delivery is aiming for the original consolidation low and sell-side liquidity. [market_maker_models.html | The Buy Side and Sell Side of the Curve]
- [paraphrase] The Unicorn is expected to be the fastest elevator ride of the move lower because second-stage redistribution is the easiest high-speed, low-resistance delivery in the sell model. [market_maker_models.html | Stages of the Sell Model]; [ict_SIBIFVG.html | The Unicorn Trade]

**Invalidation:**
[NO CANONICAL SOURCE FOUND]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] MMM Entry is an advanced structural model, not just an FVG or breaker trade. Smart Money Reversal is the aggressive turn attempt; Unicorn is the lower-risk second-stage continuation entry that comes after the turn is already established. Support: [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Smart Money Reversal]; [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Unicorn Setup - Second Stage Redistribution]; [market_maker_models.html | Original Consolidation]

**Cross-References:**
- Management phases: [5, 7]
- Related models: [2.1 Model 2022]
- Relationship basis: Explicit. The source lists Model 2022 as one of the simpler models that sits inside the broader market-maker-model framework. Support: [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Integration with Other ICT Models]

### 2.7 TGIF Entry

**Primary Sources:** `tgif-setup-study.html`
**Supporting Sources:** none
**Era:** 2022
**Teaching Context:** 2022 mentorship
**Priority Tier:** 2
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] TGIF is Friday’s retracement model inside the weekly range. After a bullish or bearish week reaches the higher-timeframe premium or discount objective, the model expects a controlled Friday retracement into the 20-30% slice of the weekly range, while allowing the trader to choose whichever entry model fits the move.
Support: [tgif-setup-study.html | Core Definition]; [tgif-setup-study.html | Required Conditions]

**Definition:**
- "TGIF thank God it's Friday the pattern or setup is simply using 20 to 30 of the weekly range as the draw on liquidity on a Friday" [tgif-setup-study.html | Summary Definition]
- [paraphrase] TGIF is a day-specific Friday model rather than a general reversal pattern for any session. [tgif-setup-study.html | Core Definition]

**Prerequisites / Conditions:**
1. [paraphrase] The weekly range must already be defined from the low of the week to the high of the week. [tgif-setup-study.html | Core Definition]
2. [paraphrase] The market must have already traded into a higher-timeframe premium array or discount array; otherwise it can simply close on the extreme. [tgif-setup-study.html | Required Conditions]
3. [paraphrase] The TGIF sweet spot is the 20-30% slice of the weekly range. [tgif-setup-study.html | The 20-30% Retracement Levels]

**Entry Sequence:**
1. [paraphrase] Measure the weekly range and mark the 20% and 30% retracement levels. [tgif-setup-study.html | The 20-30% Retracement Levels]
2. [paraphrase] Confirm the week has already reached the higher-timeframe premium or discount array that justifies the Friday retracement. [tgif-setup-study.html | Required Conditions]
3. [paraphrase] Wait for the Friday high or low to form, often around the Judas or PM-session timing discussed in the source. [tgif-setup-study.html | Timing of the High]
4. [paraphrase] Use any suitable entry model inside the move, including Model 2022, fair value gap, breaker, rejection block, or Silver Bullet. [tgif-setup-study.html | Entry Models]

**Stop Placement:**
- [paraphrase] In the worked short example, the trader wanted to be ahead of the triggering candle’s high. [tgif-setup-study.html | Execution Example]

**Target Logic:**
- [paraphrase] The main target is the 20-30% retracement zone of the weekly range. [tgif-setup-study.html | The 20-30% Retracement Levels]
- [paraphrase] The source also allows partials through gradients inside that 20-30% zone and then tighter stop management if the move extends. [tgif-setup-study.html | Partial Exit Strategy Option]
- [paraphrase] Retracements of 40% or more are tied to reversal, market-top, or market-bottom conditions rather than ordinary TGIF delivery. [tgif-setup-study.html | 18:15]

**Invalidation:**
- [paraphrase] If price has not yet reached the required higher-timeframe premium or discount array, the TGIF retracement may not appear and the market can keep closing on the extreme. [tgif-setup-study.html | Required Conditions]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] TGIF is defined by Friday’s weekly-range retracement target, not by one mandatory entry pattern. The entry model is flexible; the draw on liquidity is fixed. Support: [tgif-setup-study.html | Summary Definition]; [tgif-setup-study.html | Entry Models]

**Cross-References:**
- Management phases: [4, 5]
- Related models: [2.2 Silver Bullet, 2.1 Model 2022]
- Relationship basis: Explicit. The source names Silver Bullet and Model 2022 as valid entry implementations inside TGIF. Support: [tgif-setup-study.html | Entry Models]

### 3.1 Venom Model

**Primary Sources:** `ICT_BIBLE__VENOM_MODEL__2026-04-04.md`
**Supporting Sources:** `ICT_BIBLE__MANUAL_INTERVENTION_PDA_EXPIRATION_OR_PROJECTIONS_MACROS__2026-04-04.md`
**Era:** 2023-2025
**Teaching Context:** Post-mentorship lecture series
**Priority Tier:** 1
**Evidence Status:** Direct

**Plain English Summary:**
[SUMMARY] Venom is a deferred turtle-soup-style entry. Price runs sell-side liquidity, forms a SIBI-then-BISI "two fangs" sequence, and the trader buys back at or below the return into the leaving candle while tolerating time distortion. If the trader does not use the Venom trigger itself, the same source allows an alternative inversion-fair-value-gap entry after the consolidation proves higher.
Support: [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 6:25]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 10:55]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 11:30]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | Alternative Entry: Inversion Fair Value Gap]

**Definition:**
- "So, we have SIBI, inject the venom, run away from it." [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 6:25]
- "You have to have a SIBI first and then a BISI leaving it or it's not a venom." [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 10:55]

**Prerequisites / Conditions:**
1. [paraphrase] There must be a sell-side liquidity pool being targeted. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 6:01]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | Structure / Pattern Description]
2. [paraphrase] A single candle run below that pool creates the injection. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 6:01]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 10:48]
3. [paraphrase] Price must leave that low higher, giving the BISI second fang after the initial SIBI. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 6:07]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 10:55]
4. [paraphrase] Time distortion is part of the setup rather than a reason to abandon it immediately. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 7:02]

**Entry Sequence:**
1. [paraphrase] Identify the sell-side liquidity pool and the single-candle run below it. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 6:01]
2. [paraphrase] Confirm the SIBI-then-BISI sequence that leaves the low higher. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 6:25]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 10:55]
3. [paraphrase] Buy at the opening price of the leaving candle or less, and specifically below the second candle closing price. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 6:44]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 10:57]
4. [paraphrase] Place risk below the injection candle low. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 7:58]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 8:05]
5. [paraphrase] Hold through the time distortion instead of trying to enter during the stop hunt itself. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 7:02]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 11:35]

**Alternative Entry (IFVG):**
- "If you were not going to use the venom type model in here, you could have used an inversion fair value gap right here." [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | Alternative Entry: Inversion Fair Value Gap]
- [paraphrase] The alternative entry waits for price to leave the consolidation higher, prove displacement above the local high, and then return into the iFVG with bodies holding the upper half of the range. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | Alternative Entry: Inversion Fair Value Gap]

**Stop Placement:**
- "This candlestick's low is risk" [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 7:58]
- "the stop needs to be below here" [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 8:05]

**Target Logic:**
- [NO CANONICAL SOURCE FOUND]
- [paraphrase] In the worked example, the trade targeted the first presented fair value gap of the morning / week. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | Worked Example: December Mini NASDAQ — May 12, 2025 (5-Minute Chart)]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | First Presented FVG of the Week]

**Invalidation:**
- "You have to have a SIBI first and then a BISI leaving it or it's not a venom." [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 10:55]
- "You got to enter below the second candle closing price or it's not a venom." [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 10:57]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [paraphrase] Venom is explicitly a deferred-entry form of Turtle Soup: the trader waits for the model to be given after the stop hunt instead of entering during the actual stop hunt. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 11:30]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 11:35]

**Cross-References:**
- Management phases: [1, 5]
- Related models: [1.3 Turtle Soup, 4.1 IFVG as Entry Trigger]
- Relationship basis: Explicit. The source says Venom is another form of deferred Turtle Soup and separately names the inversion fair value gap as the alternative entry if Venom itself is not used. Support: [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 11:30]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 11:35]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | Alternative Entry: Inversion Fair Value Gap]

### 3.2 Gauntlet

**Primary Sources:** `ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md`
**Supporting Sources:** none
**Era:** 2023-2025
**Teaching Context:** Post-mentorship lecture series
**Priority Tier:** 1
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] The Gauntlet is a very specific fair value gap chosen from inside a breaker leg. Instead of trading any gap in the move, the trader works backward through the breaker and uses the first direction-specific imbalance plus its adjacent volume imbalance as the precise entry area, which can also overlap with a Silver Bullet window.
Support: [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]; [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Gauntlet vs Silver Bullet]

**Definition:**
- "This specific fair value gap is labeled by my PDAs as the gauntlet." [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | [May 7 — 15:03]]
- "It has to be the SIBI." [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]
- [paraphrase] Mechanically, a bullish breaker leg uses the very first SIBI encountered when tracing back from the low through the run-to-liquidity leg. A bearish breaker leg uses the very first BISI encountered when tracing back from the high through that same run-to-liquidity leg. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]

**Prerequisites / Conditions:**
1. [paraphrase] A breaker leg or price run to liquidity must already exist. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]
2. [paraphrase] The trader must work backward through that leg and identify the first qualifying imbalance rather than picking an arbitrary gap. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]
3. [paraphrase] The annotation must include the adjacent volume imbalance; the Gauntlet is not just the fair value gap proper. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]
4. [paraphrase] The concept can overlap with a Silver Bullet, but the Silver Bullet provides the time window while the Gauntlet provides the exact level. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Gauntlet vs Silver Bullet]

**Entry Sequence:**
1. [paraphrase] Identify the breaker leg that ran liquidity. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]
2. [paraphrase] In a bullish breaker leg, go back from the low and locate the very first SIBI; in a bearish breaker leg, go back from the high and locate the very first BISI. That direction-specific first imbalance is the Gauntlet. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]
3. [paraphrase] Include the adjoining volume imbalance in the annotation and use the Gauntlet's internal levels and quadrants as the precise entry reference. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]; [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | [May 7 — 15:02]]
4. [paraphrase] If the same level appears during the Silver Bullet timing window, the Gauntlet becomes the precise Silver Bullet level. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Gauntlet vs Silver Bullet]

**Stop Placement:**
[NO CANONICAL SOURCE FOUND]

**Target Logic:**
- [paraphrase] The Gauntlet is used to reach the next liquidity objective in the breaker narrative, but the source does not give one fixed target framework for all examples. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]

**Invalidation:**
[NO CANONICAL SOURCE FOUND]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] The Gauntlet is not the Silver Bullet itself and it is not "whichever first gap looks good." Silver Bullet is the time window; the Gauntlet is the first direction-specific imbalance plus volume-imbalance annotation selected inside the breaker leg. Support: [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]; [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Gauntlet vs Silver Bullet]

**Cross-References:**
- Management phases: [5]
- Related models: [1.4 Breaker Entry, 2.2 Silver Bullet, 4.1 IFVG as Entry Trigger]
- Relationship basis: Explicit. The source ties the Gauntlet directly to the breaker leg, explicitly states that Gauntlet and Silver Bullet can overlap, and treats the selected SIBI/BISI as part of later inversion-fair-value-gap logic. Support: [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]; [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Gauntlet vs Silver Bullet]

### 3.3 Gray Pool

**Primary Sources:** `ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md`
**Supporting Sources:** none
**Era:** 2023-2025
**Teaching Context:** Post-mentorship lecture series
**Priority Tier:** 2
**Evidence Status:** Direct

**Plain English Summary:**
[SUMMARY] Gray Pool is a wick-midpoint entry model. Instead of using a fair value gap, it projects the midpoint of two consecutive discount wicks and treats the band between them as the entry zone, with the low of that band preferred for execution.
Support: [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gray Pool]; [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Gray Pool — Not Chasing Price]

**Definition:**
- "This is my gray pool." [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gray Pool]
- "Algorithmic gray pool." [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gray Pool]

**Prerequisites / Conditions:**
1. [paraphrase] The trader needs a significant discount wick on one candle and the next candle’s discount wick to create the two midpoint references. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gray Pool]
2. [paraphrase] The entry should still be below 50% of the FPFVG-to-target range so it is truly a discount entry rather than chasing price. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Gray Pool — Not Chasing Price]
3. [paraphrase] The model assumes the larger daily target has already been identified so the pool can be judged against that range. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Gray Pool — Not Chasing Price]

**Entry Sequence:**
1. [paraphrase] Identify the first significant discount wick and mark its midpoint. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gray Pool]
2. [paraphrase] Mark the midpoint of the next candle’s discount wick. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gray Pool]
3. [paraphrase] Treat the range between those two midpoint levels as the Gray Pool. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gray Pool]
4. [paraphrase] Enter at the low of the Gray Pool rather than the upper end. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gray Pool]

**Stop Placement:**
[NO CANONICAL SOURCE FOUND]

**Target Logic:**
- [paraphrase] The entry is framed against the larger daily target or volume-imbalance objective already identified; the source uses that higher objective to justify the discount entry. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Gray Pool — Not Chasing Price]

**Invalidation:**
- [paraphrase] If the Gray Pool entry is no longer in discount relative to the FPFVG-to-target range, the model loses the “not chasing price” validation. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Gray Pool — Not Chasing Price]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] Gray Pool is not a fair-value-gap model. Its defining entry band comes from the midpoint of consecutive discount wicks. Support: [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gray Pool]

**Cross-References:**
- Management phases: [5]
- Related models: [3.4 Immediate Rebalance]
- Relationship basis: [ANALYTICAL] The same source presents Gray Pool and Immediate Rebalance as adjacent entry techniques, with Gray Pool using a structured wick-midpoint band and Immediate Rebalance using the direct no-gap rebalance. Support: [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Cross-References]

### 3.4 Immediate Rebalance

**Primary Sources:** `ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md`; `immediate_rebalance_notes.html`
**Supporting Sources:** none
**Era:** 2023-2025
**Teaching Context:** Post-mentorship lecture series
**Priority Tier:** 1
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] Immediate Rebalance is the no-gap version of redelivery. ICT uses the term for two canonical patterns: the open-to-level version where a session opens and trades directly to a previous reference high or low, and the consecutive-candle version where a later candle immediately rebalances back to a just-broken candle high or low. In both cases, price goes directly to the rebalance level without leaving deferred inefficiency.
Support: [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Immediate Rebalance — Entry Rules]; [immediate_rebalance_notes.html | Immediate Rebalance — Definition &amp; Significance]

**Definition:**
- "so we opened here, traded down to a previous day's high." [immediate_rebalance_notes.html | Immediate Rebalance — Definition &amp; Significance]
- "My immediate rebalance, which is this candlestick's high. It rallies through it here and then the next candle opens, trades right back down. That candle's high. That's an immediate rebalance." [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Immediate Rebalance — Entry Rules]
- [paraphrase] Variant A is the open-to-level version: the session opens and trades directly to a previous reference high or low. Variant B is the consecutive-candle version: a candle's high or low is traded through and the next candle immediately returns to that same level. [immediate_rebalance_notes.html | Immediate Rebalance — Definition &amp; Significance]; [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Immediate Rebalance — Entry Rules]

**Prerequisites / Conditions:**
1. [paraphrase] A rebalance level from prior price action must already be present. [immediate_rebalance_notes.html | Immediate Rebalance — Definition &amp; Significance]
2. [paraphrase] In Variant A, the session open must trade directly into the prior reference high or low without leaving a fair value gap or deferred inefficiency. [immediate_rebalance_notes.html | Immediate Rebalance — Definition &amp; Significance]
3. [paraphrase] In Variant B, price must first trade through the significant candle high or low and then have the next candle open and return directly to that prior candle level. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Immediate Rebalance — Entry Rules]

**Entry Sequence:**
1. [paraphrase] Identify which variant is present: an open-to-level immediate rebalance or a consecutive-candle immediate rebalance. [immediate_rebalance_notes.html | Immediate Rebalance — Definition &amp; Significance]; [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Immediate Rebalance — Entry Rules]
2. [paraphrase] In Variant A, mark the previous high or low and wait for the session open to trade directly to it with no deferred inefficiency left behind. [immediate_rebalance_notes.html | Immediate Rebalance — Definition &amp; Significance]
3. [paraphrase] In Variant B, mark the significant candle high or low, wait for price to trade through it, and then use the next candle's immediate return to that same level as the entry reference. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Immediate Rebalance — Entry Rules]
4. [paraphrase] Expect the next candle or the one after that to start running if the rebalance is valid. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Immediate Rebalance — Entry Rules]

**Stop Placement:**
[NO CANONICAL SOURCE FOUND]

**Target Logic:**
- [paraphrase] The model is used to anticipate fast, immediate directional delivery rather than a slow rebalance-and-fill sequence. [immediate_rebalance_notes.html | Immediate Rebalance — Definition &amp; Significance]

**Invalidation:**
- [paraphrase] If price stops short of the rebalance point or leaves deferred inefficiency instead, the setup becomes fair-value-gap protocol rather than immediate rebalance. [immediate_rebalance_notes.html | Immediate Rebalance — Definition &amp; Significance]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] Immediate Rebalance is defined by the absence of deferred inefficiency in either of its canonical forms. Gray Pool and Gauntlet refine into structured entry zones, while Immediate Rebalance is the direct no-gap signature. Support: [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Immediate Rebalance — Entry Rules]; [immediate_rebalance_notes.html | Immediate Rebalance — Definition &amp; Significance]

**Cross-References:**
- Management phases: [0, 5]
- Related models: [3.3 Gray Pool, 3.9 9:30 Candle as FPFVG]
- Relationship basis: [ANALYTICAL] The same source presents Gray Pool and Immediate Rebalance as adjacent entry solutions, with Immediate Rebalance serving as the simpler direct alternative, while the 9:30-candle framework is another opening-session delivery model that must be distinguished from both Immediate Rebalance variants. Support: [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Cross-References]; [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Cross-References]

### 3.5 Rejection Block Deferred TS

**Primary Sources:** `ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md`
**Supporting Sources:** none
**Era:** 2023-2025
**Teaching Context:** Post-mentorship lecture series
**Priority Tier:** 2
**Evidence Status:** Direct

**Plain English Summary:**
[SUMMARY] Rejection Block Deferred TS is a deferred-entry version of Turtle Soup. Instead of entering at the false breakout itself, the trader waits for price to return to the rejection block's closing price after the reversal has already been proven by a pre-session iFVG, a five-minute premium-wick consequent encroachment, and one-minute displacement away from that rejection.
Support: [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Definition — Rejection Block Deferred Turtle Soup Entry]

**Definition:**
- "This is a deferred entry to a turtle soup false breakout higher high reversal pattern." [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Definition — Rejection Block Deferred Turtle Soup Entry]
- "That is the rejection block. It's a bearish rejection block." [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Definition — Rejection Block Deferred Turtle Soup Entry]

**Prerequisites / Conditions:**
1. [paraphrase] A turtle-soup-style false breakout must already be underway. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Definition — Rejection Block Deferred Turtle Soup Entry]
2. [paraphrase] The inversion fair value gap must already be identified before the opening bell on the higher reference time frame. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Rules & Conditions]
3. [paraphrase] The reversal must first prove itself at the consequent encroachment of the five-minute premium wick and by leaving the iFVG lower on one-minute execution. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Structure / Pattern Description]
4. [paraphrase] Bodies must show the rejection narrative with successive higher closes followed by algorithmic displacement lower. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Rules & Conditions]
5. [paraphrase] Wicks are allowed to do damage above the iFVG, but bodies tell the actual narrative. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Rules & Conditions]
6. [paraphrase] The rejection block is the up-close candle whose closing price becomes the deferred entry level on the one-minute chart while the five-minute iFVG/premium-wick logic stays authoritative. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Structure / Pattern Description]; [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Rules & Conditions]

**Entry Sequence:**
1. [paraphrase] Pre-label the five-minute iFVG and premium-wick consequent encroachment before the opening bell. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Structure / Pattern Description]; [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Cross-References]
2. [paraphrase] Let the opening rally run the high and hit the five-minute premium-wick consequent encroachment or the iFVG. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Structure / Pattern Description]
3. [paraphrase] Confirm the bodies: higher, higher, higher into rejection, then algorithmic displacement lower leaving the iFVG. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Rules & Conditions]
4. [paraphrase] Mark the up-close candle that becomes the rejection block. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Definition — Rejection Block Deferred Turtle Soup Entry]
5. [paraphrase] Wait for price to trade back to the rejection block closing price on the way down. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Definition — Rejection Block Deferred Turtle Soup Entry]
6. [paraphrase] Once that level is hit, expect the algorithm to start spooling lower. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Rules & Conditions]

**Stop Placement:**
[NO CANONICAL SOURCE FOUND]

**Target Logic:**
- [paraphrase] The setup is used for the continuation lower after the false breakout is proven, but the source does not provide one fixed universal target ladder. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Structure / Pattern Description]

**Invalidation:**
- [paraphrase] If price action has not first proven the false breakout reversal, the deferred rejection-block entry is not present. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Definition — Rejection Block Deferred Turtle Soup Entry]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] This model is not the stop-hunt entry itself; it is the deferred one-minute execution taken after Turtle Soup has already been confirmed by five-minute iFVG and premium-wick logic. Support: [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Definition — Rejection Block Deferred Turtle Soup Entry]; [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Structure / Pattern Description]

**Cross-References:**
- Management phases: [5]
- Related models: [1.3 Turtle Soup, 1.4 Breaker Entry, 4.1 IFVG as Entry Trigger]
- Relationship basis: Explicit. The source directly ties the setup to Turtle Soup, cross-references breaker logic, and makes the pre-established inversion fair value gap part of the setup architecture. Support: [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Cross-References]

### 3.6 Suspension Block Entry

**Primary Sources:** `ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md`; `ICT_BIBLE__SUSPENSION_BLOCK_ANNOTATION_RULES__2026-04-04.md`
**Supporting Sources:** `SusBlock.html`
**Era:** 2023-2025
**Teaching Context:** Post-mentorship lecture series
**Priority Tier:** 2
**Evidence Status:** Direct

**Plain English Summary:**
[SUMMARY] A suspension block is a single candle suspended between a volume imbalance on both sides. It behaves like a PD array similar to a fair value gap, is classified as a premium or discount array depending on where price approaches it from, can be graded with consequent encroachment and quadrants, and can invert after reversals.
Support: [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Definition — Suspension Block]; [ICT_BIBLE__SUSPENSION_BLOCK_ANNOTATION_RULES__2026-04-04.md | Annotation Method — Volume Imbalance Boundaries]

**Definition:**
- "This is my ICT suspension block." [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Definition — Suspension Block]
- "Whenever you have one single candle that has a volume imbalance to the low and a volume imbalance to the high, that is going to act just like a fair value gap." [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Structure / Pattern Description]

**Prerequisites / Conditions:**
1. [paraphrase] The candle must have a volume imbalance at both the high end and the low end. [ICT_BIBLE__SUSPENSION_BLOCK_ANNOTATION_RULES__2026-04-04.md | Annotation Method — Volume Imbalance Boundaries]
2. [paraphrase] The range is annotated from volume-imbalance low to volume-imbalance high, not from the wick extremes. [ICT_BIBLE__SUSPENSION_BLOCK_ANNOTATION_RULES__2026-04-04.md | Annotation Method — Volume Imbalance Boundaries]
3. [paraphrase] A bullish suspension block is typically an up-close candle used as a discount array, while a bearish suspension block is a down-close candle used as a premium array when narrative and orderflow are moving lower. [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Bullish vs Bearish Suspension Block]
4. [paraphrase] Wicks or prior back-and-forth price action to the left do not disqualify the block; the defining condition is the dual volume imbalance around the candle. [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Rules & Conditions]

**Entry Sequence:**
1. [paraphrase] Identify the qualifying single candle with volume imbalance on both ends. [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Structure / Pattern Description]
2. [paraphrase] Annotate the block from the volume-imbalance low to the volume-imbalance high and grade it with consequent encroachment and quadrants. [ICT_BIBLE__SUSPENSION_BLOCK_ANNOTATION_RULES__2026-04-04.md | Annotation Method — Volume Imbalance Boundaries]
3. [paraphrase] Classify it as the relevant premium or discount array based on where price is approaching it from, not as generic support or resistance. [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Bullish vs Bearish Suspension Block]; [ICT_BIBLE__SUSPENSION_BLOCK_ANNOTATION_RULES__2026-04-04.md | Suspension Block as Premium or Discount Array]
4. [paraphrase] If the market reverses and comes back from the other side, treat the suspension block as capable of inversion and look for bodies respecting consequent encroachment in its new role. [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Suspension Block Behaviour — Inversion]
5. [paraphrase] If the first presented fair value gap is not being respected and correlated markets are decoupling, downgrade the suspension-block read because high-resistance-liquidity-run conditions are more likely. [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | First Presented Fair Value Gap — Non-Respect as Warning Signal]; [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | High Resistance Liquidity Run Conditions]

**Context Notes:**
- [paraphrase] Non-respect of the first presented fair value gap is a warning signal: no sway, no body consolidation, and no clean respect implies "trouble waters." [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | First Presented Fair Value Gap — Non-Respect as Warning Signal]
- [paraphrase] Decoupling across correlated markets is treated as a warning for high-resistance-liquidity-run conditions rather than clean low-resistance delivery. [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | High Resistance Liquidity Run Conditions]
- [paraphrase] The source explicitly frames suspension blocks as one of the most powerful PD arrays, but pairs that with the admonition that the best skill may be knowing when not to risk money in hostile conditions. [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Psychology & Logic]

**Stop Placement:**
[NO CANONICAL SOURCE FOUND]

**Target Logic:**
- [paraphrase] The block acts as a premium or discount PD array and can deliver movement to its consequent encroachment, upper quadrant, or the next linked array, but the source gives no single universal target ladder. [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Structure / Pattern Description]; [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Worked Example: December Mini NASDAQ Futures — September 30, 2025]

**Invalidation:**
- [paraphrase] If the candle lacks volume imbalance on both sides, it is not a suspension block. [ICT_BIBLE__SUSPENSION_BLOCK_ANNOTATION_RULES__2026-04-04.md | Common Mistakes — What Is NOT a Suspension Block]
- [paraphrase] If price comes back down inside a bullish suspension block after it has already used its consequent encroachment, bullish bias weakens. [ICT_BIBLE__SUSPENSION_BLOCK_ANNOTATION_RULES__2026-04-04.md | Suspension Block Inversion — Further Examples]
- [paraphrase] If the trader is reading the level as generic support/resistance rather than as a premium or discount array, the frame is no longer using the source's own classification system. [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Bullish vs Bearish Suspension Block]; [ICT_BIBLE__SUSPENSION_BLOCK_ANNOTATION_RULES__2026-04-04.md | Suspension Block as Premium or Discount Array]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] Suspension Block is not just a fair value gap with a new name. Its range is defined by the two volume imbalances on a single candle, and the annotation rules explicitly reject wick-based anchoring. Support: [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Structure / Pattern Description]; [ICT_BIBLE__SUSPENSION_BLOCK_ANNOTATION_RULES__2026-04-04.md | Annotation Method — Volume Imbalance Boundaries]

**Cross-References:**
- Management phases: [5, 8]
- Related models: [2.4 FVG Entry Drill, 4.1 IFVG as Entry Trigger]
- Relationship basis: Explicit. The source repeatedly compares suspension blocks to fair value gaps and inversion fair value gaps while distinguishing their annotation rules. Support: [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Cross-References]; [ICT_BIBLE__SUSPENSION_BLOCK_ANNOTATION_RULES__2026-04-04.md | Cross-References]

### 3.7 Two 15-Min FVG Dynamic Canvas

**Primary Sources:** `ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md`
**Supporting Sources:** none
**Era:** 2023-2025
**Teaching Context:** Post-mentorship lecture series
**Priority Tier:** 1
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] This model treats two nearby 15-minute fair value gaps as a six-level canvas for reading order flow throughout the session. Rather than using one gap in isolation, the trader studies how price sweeps, respects, and travels between both gaps while blending them with other confluent PD arrays.
Support: [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Definition — Two 15-Minute FVG Dynamic Canvas]; [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Rules & Conditions]

**Definition:**
- "Those six levels being the high, the consequent encroachment or midpoint of it, and the low of two specific 15-minute fair value gaps." [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Definition — Two 15-Minute FVG Dynamic Canvas]
- [paraphrase] The 15-minute chart is the bellwether chart for this framework because it already contains the main liquidity pools and imbalances needed for framing. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | 15-Minute Bellweather Chart]

**Prerequisites / Conditions:**
1. [paraphrase] Two relevant 15-minute fair value gaps must be in close proximity. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Definition — Two 15-Minute FVG Dynamic Canvas]
2. [paraphrase] The trader must choose the important pair, not just any two gaps, and the chosen gap can sit inside a breaker or other PD-array context. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Selecting Which 15-Minute FVGs to Use]
3. [paraphrase] The selected pair should be blended with other PD arrays rather than treated in isolation. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Confluence of PD Arrays — Blending]
4. [paraphrase] If price runs away and leaves both gaps behind, the trader should advance to the next new 15-minute fair value gap. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Rules & Conditions]

**Entry Sequence:**
1. [paraphrase] Mark the two chosen 15-minute fair value gaps and all six levels derived from them. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Definition — Two 15-Minute FVG Dynamic Canvas]
2. [paraphrase] Use the 15-minute bellwether chart to frame the main liquidity and imbalance context. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | 15-Minute Bellweather Chart]
3. [paraphrase] Blend those gaps with the other PD arrays that made them important in the first place, such as breaker context, FPFVG, or inversion logic. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Confluence of PD Arrays — Blending]
4. [paraphrase] Study how price sweeps above or below the levels and then returns to use them again. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Sweeping Above/Below FVGs]
5. [paraphrase] Read the high-frequency opportunities that form off those two fair value gaps throughout the session. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | High Frequency Setups From Two FVGs]
6. [paraphrase] As the day evolves, add a new 15-minute fair value gap onto the previous canvas rather than resetting the framework blindly. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Rules & Conditions]

**Stop Placement:**
[NO CANONICAL SOURCE FOUND]

**Target Logic:**
- [paraphrase] The framework allows trades from one side of the canvas to another and to nearby linked objectives, but the source does not prescribe one universal target ladder for every example. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | High Frequency Setups From Two FVGs]; [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Cross-References]
- [paraphrase] Concrete high-frequency examples given by the speaker include buying the low of the lower FVG and taking profit at the high of that same FVG after a sell-side sweep, or buying the high of the lower FVG and targeting the low of the upper FVG when price runs between the two. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | High Frequency Setups From Two FVGs]

**Invalidation:**
- [paraphrase] If price leaves both selected 15-minute fair value gaps behind, the trader stops using that pair and advances to the next relevant 15-minute gap. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Rules & Conditions]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] This is not a single-gap model. Its edge comes from reading order flow in relationship to two nearby 15-minute fair value gaps as one blended PD-array framework. Support: [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Definition — Two 15-Minute FVG Dynamic Canvas]; [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Confluence of PD Arrays — Blending]; [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Rules & Conditions]

**Cross-References:**
- Management phases: [5]
- Related models: [3.9 9:30 Candle as FPFVG]
- Relationship basis: Explicit. The source directly cross-references the first presented fair value gap as part of the canvas framework. Support: [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Cross-References]

### 3.8 Pre-Market Liquidity (7:00-9:30)

**Primary Sources:** `ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md`
**Supporting Sources:** none
**Era:** 2023-2025
**Teaching Context:** Post-mentorship lecture series
**Priority Tier:** 1
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] Pre-Market Liquidity is a 90-minute opening-bell framework. At 9:30, the trader looks back to 7:00, maps the visible pools of liquidity, and treats those nearby equal highs/lows as the low-hanging-fruit objectives without needing NWOG or NDOG.
Support: [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Pre-Market Liquidity Framework (7:00-9:30) — Trading Without NWOG/NDOG]

**Definition:**
- "7:00 in the morning to 9:30, that 90-minute window. We're spanning from the 9:30 opening bell back to 7:00. Where is the pools of liquidity?" [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Pre-Market Liquidity Framework (7:00-9:30) — Trading Without NWOG/NDOG]
- [paraphrase] The executions in this framework are based on pure liquidity and time of day rather than new week or new day opening gaps. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Pre-Market Liquidity Framework (7:00-9:30) — Trading Without NWOG/NDOG]

**Prerequisites / Conditions:**
1. [paraphrase] The trader starts from the 9:30 opening bell and looks back across the prior 90 minutes. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Pre-Market Liquidity Framework (7:00-9:30) — Trading Without NWOG/NDOG]
2. [paraphrase] The framework depends on visible pools of liquidity such as relative equal highs/lows and short-term highs/lows. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Pre-Market Liquidity Framework (7:00-9:30) — Trading Without NWOG/NDOG]
3. [paraphrase] NWOG and NDOG are not required for the setup. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Pre-Market Liquidity Framework (7:00-9:30) — Trading Without NWOG/NDOG]

**Entry Sequence:**
1. [paraphrase] At 9:30, project back to 7:00 and mark the liquidity pools in that window. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Pre-Market Liquidity Framework (7:00-9:30) — Trading Without NWOG/NDOG]
2. [paraphrase] If an opening range gap exists, anticipate the market may first attempt to move into it. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Pre-Market Liquidity Framework (7:00-9:30) — Trading Without NWOG/NDOG]
3. [paraphrase] Target the first or easiest relative equal highs/lows looking left from the opening bell. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Pre-Market Liquidity Framework (7:00-9:30) — Trading Without NWOG/NDOG]
4. [paraphrase] Once price trades back into the marked area, expect it to flip and run at least to that low-hanging-fruit objective. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Pre-Market Liquidity Framework (7:00-9:30) — Trading Without NWOG/NDOG]

**Stop Placement:**
[NO CANONICAL SOURCE FOUND]

**Target Logic:**
- [paraphrase] The model targets the first easy pool of relative equal highs or lows in the 7:00-9:30 window. [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Pre-Market Liquidity Framework (7:00-9:30) — Trading Without NWOG/NDOG]

**Invalidation:**
[NO CANONICAL SOURCE FOUND]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] Pre-Market Liquidity is a standalone opening-bell liquidity scan, not a gap-dependent model. Its defining feature is that pure time-of-day plus nearby liquidity is sufficient. Support: [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Pre-Market Liquidity Framework (7:00-9:30) — Trading Without NWOG/NDOG]

**Cross-References:**
- Management phases: [0, 8]
- Related models: [3.9 9:30 Candle as FPFVG]
- Relationship basis: [ANALYTICAL] Both frameworks are organized around the 9:30 opening bell and session-liquidity sequencing, but Pre-Market Liquidity focuses on the 7:00-9:30 pools immediately left of the open. Support: [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Pre-Market Liquidity Framework (7:00-9:30) — Trading Without NWOG/NDOG]; [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Session Liquidity Hierarchy]

### 3.9 9:30 Candle as FPFVG

**Primary Sources:** `ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md`; `ICT_BIBLE__OPENING_RANGE_THEORY_AND_FIRST_PRESENTED_FVG__2026-04-04.md`
**Supporting Sources:** `ICT_BIBLE__RTH_OPENING_RANGE_GAP__2026-04-04.md`
**Era:** 2023-2025
**Teaching Context:** Post-mentorship lecture series
**Priority Tier:** 1
**Evidence Status:** Mixed

**Plain English Summary:**
[SUMMARY] This model extends first presented fair value gap rules for the RTH open. Normally the AM-session FPFVG is the first 1-minute gap that forms from 9:31 to 10:00, but in a special opening-gap-and-liquidity-raid condition the 9:30 one-minute candle itself becomes the valid FPFVG reference and takes precedence over later AM-session gaps. The setup must be read through RTH and ETH market-structure blending, opening-range-gap consequent encroachment, and time-based session delivery rather than as a stand-alone candle rule.
Support: [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Definition — When the 9:30 Candle IS the First Presented FVG]; [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | May 18 — 9:39]; [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | RTH vs ETH Market Structure Blending]; [ICT_BIBLE__OPENING_RANGE_THEORY_AND_FIRST_PRESENTED_FVG__2026-04-04.md | Definition — Opening Range]

**Definition:**
- "He would have to use the very first presented fair value gap that he could use would be at 9:31 Eastern time between 9:31 and 10:00. The very first fair value gap that forms on a one minute chart. That is his gap to use." [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Definition — When the 9:30 Candle IS the First Presented FVG]
- [paraphrase] The 9:30 candle itself becomes the FPFVG when the opening creates the displacement and raids previous RTH relative equal highs, making the opening candle the true first presented gap. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Definition — When the 9:30 Candle IS the First Presented FVG]

**Prerequisites / Conditions:**
1. [paraphrase] The default AM-session rule is to use the first 1-minute fair value gap that forms between 9:31 and 10:00. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Definition — When the 9:30 Candle IS the First Presented FVG]
2. [paraphrase] The 9:30 exception requires a large premium opening range gap and a raid of previous regular-trading-hours relative equal highs. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Definition — When the 9:30 Candle IS the First Presented FVG]
3. [paraphrase] The opening range is the first 30 minutes of regular trading hours, 9:30 to 10:00 AM Eastern time, and the first presented FVG is qualified by displacement and market-structure shift rather than by clock sequence alone. [ICT_BIBLE__OPENING_RANGE_THEORY_AND_FIRST_PRESENTED_FVG__2026-04-04.md | Definition — Opening Range]; [ICT_BIBLE__OPENING_RANGE_THEORY_AND_FIRST_PRESENTED_FVG__2026-04-04.md | Rules & Conditions]
4. [paraphrase] RTH and ETH market structure must be blended: professionals measure from the session open and close, while also respecting overnight liquidity, inefficiencies, and prior RTH session structure. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | RTH vs ETH Market Structure Blending]
5. [paraphrase] The opening-range-gap consequent encroachment has a reinforced 70% tendency to be revisited by 10:00 AM. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Opening Range Gap CE by 10:00 AM — 70% Rule (Reinforced)]
6. [paraphrase] Session-liquidity sequencing matters because the market is expected to work through Asia, London, pre-market, AM, lunch, and PM liquidity in order. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Session Liquidity Hierarchy]

**Entry Sequence:**
1. [paraphrase] Decide whether the open qualifies for the 9:30 exception or whether the normal 9:31-10:00 rule still applies. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Definition — When the 9:30 Candle IS the First Presented FVG]
2. [paraphrase] Read the open from a professional RTH/ETH perspective: what did the market open at, how is it delivering from that open, and what overnight liquidity or inefficiency is still relevant. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | RTH vs ETH Market Structure Blending]
3. [paraphrase] Use that first presented fair value gap as the operative AM-session reference, and when the special criteria are met prefer the 9:30 one-minute FVG over later 9:31-10:00 gaps because later levels are respected less than the 9:30 reference. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Definition — When the 9:30 Candle IS the First Presented FVG]; [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | May 18 — 9:39]
4. [paraphrase] Measure the opening-range-gap consequent encroachment as an active retracement level into 10:00 AM. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Opening Range Gap CE by 10:00 AM — 70% Rule (Reinforced)]
5. [paraphrase] If the FPFVG changes character intraday, judge it at consequent encroachment: bodies must hold the current bias while wicks are allowed to do damage. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | FVG Character Change (Reinforced)]; [ICT_BIBLE__FVG_CHARACTER_CHANGE_INTRADAY__2026-04-04.md | Rules & Conditions — Character Change Logic]
6. [paraphrase] Read the setup inside the larger session-liquidity hierarchy and time-based-delivery model rather than as a stand-alone candle rule. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Session Liquidity Hierarchy]; [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Time-Based Delivery — Core Principle]
7. [paraphrase] Clear the chart and reassess price action during the session so the trader does not become married to stale annotations. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Naked Chart Philosophy]
8. [paraphrase] The same first-presented-fair-value-gap logic repeats in the PM session from 1:30 to 2:00 Eastern time. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | PM Session First Presented FVG (1:30-2:00 ET)]

**Stop Placement:**
[NO CANONICAL SOURCE FOUND]

**Target Logic:**
- [paraphrase] The opening-range-gap consequent encroachment is a reinforced target or reaction level by 10:00 AM, with the source stating a 70% likelihood of that pullback. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Opening Range Gap CE by 10:00 AM — 70% Rule (Reinforced)]
- [paraphrase] The model uses the session-liquidity hierarchy itself as the targeting logic, with PM session using lunch or AM-session liquidity after the earlier cycle completes. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Session Liquidity Hierarchy]
- [paraphrase] Weekly wick delivery is judged through the lower half first rather than assuming the entire wick will be traded immediately. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Weekly Wick Grading — Lower Half Focus]
- [paraphrase] The 3:15-3:45 PM macro is part of the broader delivery map for late-day runs, but the macro itself is already extracted in the environmental-adjustments phase and is cross-referenced here rather than duplicated as a standalone rule set. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | 315-345 Macro]; [ICT_BIBLE__MANUAL_INTERVENTION_PDA_EXPIRATION_OR_PROJECTIONS_MACROS__2026-04-04.md | Macro Time Windows]

**Invalidation:**
- [paraphrase] If the open does not satisfy the special 9:30 criteria, the trader defaults back to the normal 9:31-10:00 first-presented-fair-value-gap rule. [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Definition — When the 9:30 Candle IS the First Presented FVG]

**R:R Context:**
[NO CANONICAL SOURCE FOUND]

**Key Distinction:**
- [ANALYTICAL] The model is defined by the exception logic between the normal 9:31 rule and the rare 9:30-candle rule, read through opening-range, RTH/ETH, and time-based-delivery logic. It is not simply "trade the 9:30 candle" every day. Support: [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Definition — When the 9:30 Candle IS the First Presented FVG]; [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | RTH vs ETH Market Structure Blending]; [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Time-Based Delivery — Core Principle]

**Cross-References:**
- Management phases: [0, 5, 8]
- Related models: [3.4 Immediate Rebalance, 3.8 Pre-Market Liquidity (7:00-9:30), 4.1 IFVG as Entry Trigger]
- Relationship basis: Explicit. The source cross-references immediate rebalance as part of the 9:30/session-liquidity framework, and the same session logic sits directly next to the pre-market-liquidity model while interacting with later inversion-fair-value-gap character changes. Support: [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Cross-References]; [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | RTH vs ETH Market Structure Blending]; [ICT_BIBLE__FVG_CHARACTER_CHANGE_INTRADAY__2026-04-04.md | Rules & Conditions — Character Change Logic]

## CROSS-CUTTING ENTRY MECHANISMS

### 4.1 Inversion Fair Value Gap (IFVG) as Entry Trigger

**Primary Sources:** `ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html`; `ICT_BIBLE__INVERSION_FAIR_VALUE_GAP_BREAKAWAY__2026-02-01.html`; `ICT_BIBLE__FVG_CHARACTER_CHANGE_INTRADAY__2026-04-04.md`; `ICT_BIBLE__WICK_GRADING_FPFVG_DISPLACEMENT_IFVG_RULES__2026-04-04.md`
**Supporting Sources:** `ICT_BIBLE__2026_LIVE_JAN29_SMART_MONEY__2026-02-01.html`; `ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md`
**Evidence Status:** Direct

**Plain English Summary:**
[SUMMARY] An inversion fair value gap is the failed-fair-value-gap entry model. When a fair value gap fails in its original role and price returns to it, the same inefficiency can act in the opposite direction. Scenario A and Scenario B determine whether price should only respect the low/CE area or may trade all the way to the high, and body behaviour at consequent encroachment or the high is the proof condition.
Support: [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Scenario A: Candle Trading Through Upper Portion]; [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Scenario B: No Prior Penetration of FVG]; [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP_BREAKAWAY__2026-02-01.html | Signature Pattern - When Fair Value Gaps Should NOT Close]

**Definition:**
- "inversion fair value app all this area should stay open or a portion of it should stay open okay" [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP_BREAKAWAY__2026-02-01.html | Signature Pattern - When Fair Value Gaps Should NOT Close]
- [paraphrase] A fair value gap becomes an IFVG when it fails in its original bullish or bearish function and later acts in the opposite direction on return. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Study & Review]
- [paraphrase] The same logic also appears structurally after a low is formed, price retraces, and then a lower low is created, leaving the earlier imbalance with a high probability of later inversion. [ICT_BIBLE__WICK_GRADING_FPFVG_DISPLACEMENT_IFVG_RULES__2026-04-04.md | Inversion Fair Value Gap — Structural Rule (Low Then Lower Low)]

**Prerequisites / Conditions:**
1. [paraphrase] The original fair value gap must have failed in its first role and price must later return to it. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Study & Review]
2. [paraphrase] Scenario A applies when a prior candle has already traded into the upper portion of the gap; on the later return, price should be sensitive at the low or consequent encroachment and not need the full high. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Scenario A: Candle Trading Through Upper Portion]
3. [paraphrase] Scenario B applies when no prior candle has penetrated the gap; in that case the later inversion may legitimately trade all the way to the high. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Scenario B: No Prior Penetration of FVG]
4. [paraphrase] Conservative proof requires a body close at the high or a body close at consequent encroachment. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP_BREAKAWAY__2026-02-01.html | Signature Pattern - When Fair Value Gaps Should NOT Close]
5. [paraphrase] Bodies tell the narrative and wicks are allowed to do damage while the IFVG is being judged. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP_BREAKAWAY__2026-02-01.html | Signature Pattern - When Fair Value Gaps Should NOT Close]; [ICT_BIBLE__FVG_CHARACTER_CHANGE_INTRADAY__2026-04-04.md | Rules & Conditions — Character Change Logic]
6. [paraphrase] A lower-low structural run with an imbalance in between carries a high probability of later becoming an inversion fair value gap. [ICT_BIBLE__WICK_GRADING_FPFVG_DISPLACEMENT_IFVG_RULES__2026-04-04.md | Inversion Fair Value Gap — Structural Rule (Low Then Lower Low)]

**Entry Sequence:**
1. [paraphrase] Identify the failed fair value gap, lower-low structural pattern, or breaker leg where an IFVG is likely to emerge. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Study & Review]; [ICT_BIBLE__WICK_GRADING_FPFVG_DISPLACEMENT_IFVG_RULES__2026-04-04.md | Inversion Fair Value Gap — Structural Rule (Low Then Lower Low)]
2. [paraphrase] Classify the setup as Scenario A or Scenario B based on whether the upper portion of the gap has already been penetrated. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Scenario A: Candle Trading Through Upper Portion]; [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Scenario B: No Prior Penetration of FVG]
3. [paraphrase] Aggressive traders may enter on the return into the zone itself; conservative traders wait for body proof at the high or consequent encroachment. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP_BREAKAWAY__2026-02-01.html | Entry Rules]
4. [paraphrase] If using a CE-sensitive execution, allow a small mohawk rather than assuming exact-line perfection. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Mohawk Concept]
5. [paraphrase] If price only wicks through a gap while leaving no body inside it, treat that as revisit/reclaimed behaviour rather than automatically calling it a full inversion. [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Volume Imbalance with Wick Overlap — 90% Revisit Rule]

**Stop Placement:**
- [paraphrase] In the cited CE-sensitive example, stop-loss can be limited to just above consequent encroachment with extra room for a mohawk. The source frames this as a specific execution style, not a universal stop template for every IFVG. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Mohawk Concept]

**Target Logic:**
- [paraphrase] Once the signature is proven, the algorithm is expected to spool in the opposite direction and deliver to the next objective. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP_BREAKAWAY__2026-02-01.html | Algorithm Logic]
- [paraphrase] IFVGs can also sit inside larger breaker structures and become part of higher-grade A+ setups when liquidity has already been taken and price rallies back above the breaker fulcrum. [ICT_BIBLE__2026_LIVE_JAN29_SMART_MONEY__2026-02-01.html | 23:41]; [ICT_BIBLE__2026_LIVE_JAN29_SMART_MONEY__2026-02-01.html | 24:18]

**Invalidation:**
- [paraphrase] If the expected body proof never appears at the high or consequent encroachment, the conservative IFVG confirmation is absent. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP_BREAKAWAY__2026-02-01.html | Signature Pattern - When Fair Value Gaps Should NOT Close]
- [paraphrase] In Scenario A, if price needs the upper portion that should already have been effectively delivered, the clean IFVG sensitivity is degraded. [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Scenario A: Candle Trading Through Upper Portion]

**Key Distinction:**
- [ANALYTICAL] IFVG is not the same thing as an ordinary fair value gap and it is not the same thing as a reclaimed/revisited gap. A normal FVG expects original-direction delivery to resume from the inefficiency. An IFVG expects the failed gap to act in the opposite direction on return. A reclaimed/revisited gap only says price is likely to revisit the area because no candle body really lived inside it. Support: [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Study & Review]; [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP_BREAKAWAY__2026-02-01.html | Signature Pattern - When Fair Value Gaps Should NOT Close]; [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Volume Imbalance with Wick Overlap — 90% Revisit Rule]

**Cross-References:**
- Related models: [2.2 Silver Bullet, 3.1 Venom Model, 3.2 Gauntlet, 3.5 Rejection Block Deferred TS, 3.9 9:30 Candle as FPFVG]
- Relationship basis: Explicit for 3.1, 3.5, and 3.9 because those sources directly name IFVG logic; analytical for 2.2 and 3.2 because the cited 2025 material treats the qualifying imbalance as part of later inversion logic even when the model heading is different. Support: [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | Alternative Entry: Inversion Fair Value Gap]; [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Structure / Pattern Description]; [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | FVG Character Change (Reinforced)]; [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Confluence of PD Arrays — Blending]

## GLOSSARY

- `Consequent Encroachment (CE)`: the midpoint of a fair value gap or wick, treated as the most important internal reference level inside that inefficiency. Support: [ICT_BIBLE__FAIR_VALUE_GAP_TRADING__2026-02-01.html | Consequent Encroachment Priority]; [ICT_BIBLE__FAIR_VALUE_GAP_TRADING__2026-02-01.html | Consequent Encroachment of Wicks]
- `Displacement`: an impulse price swing strong enough to matter for price delivery; the smaller specific impulse swings are often the manipulative moves that frame later execution. Support: [ICT_BIBLE__IMPULSE_PRICE_SWINGS_AND_MARKET_PROTRACTION__2026-02-01.html | Impulse Price Swings - Definition]
- `Market Structure Shift (MSS) vs Break of Structure (BOS)`: intraday MSS names the shorter-term draw-on-liquidity shift inside the day, while a market-structure break carries heavier multi-day implications. Support: [ict-2022-ep03-internal-range-liquidity-mss.html | Market Structure Shift vs. Market Structure Break]
- `Mean Threshold (MT)`: the 50% midpoint of a breaker or order-block range. Support: [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Mean Threshold Entry]; [ICT_BIBLE__ADVANCED_BREAKER_THEORY__2026-02-01.html | Mean Threshold Within Breaker Range]
- `Draw on Liquidity`: the sole purpose of price delivery; price moves for buy-side liquidity, sell-side liquidity, or inefficiency in that direction. Support: [ICT_BIBLE__ONE_SETUP_FOR_LIFE__2026-02-01.html | Draw on Liquidity]
- `Seek and Destroy Profile`: a neutral or low-probability weekly profile where shallow intraweek stop runs and later expansion create a hostile, low-quality environment. Support: [ICT_BIBLE__WEEKLY_RANGE_PROFILES__2026-02-01.html | Seek and Destroy Profiles]
- `Time Distortion`: prolonged consolidation inside a live setup that does not, by itself, invalidate the model. Support: [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | [7:02] — Time Distortion]
- `Bellwether Chart`: the go-to chart that already shows most of the relevant liquidity pools, imbalances, and inefficiencies without requiring much higher-timeframe markup. Support: [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | 15-Minute Bellweather Chart]
- `IPDA`: Interbank Price Delivery Algorithm. Support: [ICT_BIBLE__IPDA_DATA_RANGES__2026-02-01.html | IPDA Definition]
- `IPDA Data Ranges (20/40/60-day)`: the look-back and cast-forward ranges used to mimic how the algorithm searches prior liquidity and future timing windows. Support: [ICT_BIBLE__IPDA_DATA_RANGES__2026-02-01.html | IPDA Definition]; [ICT_BIBLE__IPDA_DATA_RANGES__2026-02-01.html | Purpose of IPDA]
- `Liquidity Void vs Fair Value Gap`: a fair value gap is a one-sided range in price delivery; on a lower timeframe that same range often appears as a multi-candle liquidity void. Support: [ICT_BIBLE__FAIR_VALUE_GAP__2026-02-01.html | Core Definition]; [ICT_BIBLE__FAIR_VALUE_GAP__2026-02-01.html | 5-Minute Chart - Liquidity Void Detail]
- `NWOG / NDOG`: New Week Opening Gap and New Day Opening Gap, both used as carried-forward fair-valuation references rather than random empty space. Support: [ict-opening-gaps-study.html | What is the ICT New Week Opening Gap?]; [ict-opening-gaps-study.html | New Day Opening Gap (NDOG)]
- `SIBI / BISI`: Sell Side Imbalance Buy Side Inefficiency and Buy Side Imbalance Sell Side Inefficiency, the two directional fair-value-gap classifications. Support: [immediate-rebalance.html | SIBI & BISI]
- `Premium Array / Discount Array`: the higher-timeframe PD-array surfaces encountered above or below equilibrium as price reprices. Support: [ICT_BIBLE__HTF_PD_ARRAYS_HIERARCHY__2026-02-01.html | Premium Arrays Hierarchy (Monthly, Weekly, Daily)]; [ICT_BIBLE__HTF_PD_ARRAYS_HIERARCHY__2026-02-01.html | Discount Arrays Hierarchy (Monthly, Weekly, Daily)]
- `Change in State of Delivery`: the delivery change that makes the order block meaningful; it is not just one candle by itself. Support: [ICT_BIBLE__CHANGE_IN_STATE_OF_DELIVERY__2026-02-01.html | Definition]; [ICT_BIBLE__CHANGE_IN_STATE_OF_DELIVERY__2026-02-01.html | Order Block Formation]

## TRADE MANAGEMENT

**Phase Coverage Status**

| Phase | Explicit Canonical Coverage |
|-------|------------------------------|
| 0 | 1.2 Order Block Entry; 1.5 Judas Swing Entry; 2.6 MMM Entry — Market Maker Buy/Sell Model Stages; 3.9 9:30 Candle as FPFVG |
| 1 | 1.1 OTE; 1.7 Opening Price Entry; 2.4 FVG Entry Drill; 3.1 Venom Model |
| 2 | 1.7 Opening Price Entry; 1.8 Stop Entry Long-Term |
| 3 | 1.2 Order Block Entry; 1.7 Opening Price Entry; 1.8 Stop Entry Long-Term; 2.4 FVG Entry Drill |
| 4 | 1.1 OTE; 1.4 Breaker Entry; 1.8 Stop Entry Long-Term; 2.7 TGIF Entry |
| 5 | 1.1 OTE; 2.2 Silver Bullet; 2.4 FVG Entry Drill; 3.7 Two 15-Min FVG Dynamic Canvas |
| 6 | 1.2 Order Block Entry; 1.4 Breaker Entry; 2.6 MMM Entry — Market Maker Buy/Sell Model Stages |
| 7 | 1.4 Breaker Entry; 2.4 FVG Entry Drill |
| 8 | 1.3 Turtle Soup; 2.7 TGIF Entry; 3.8 Pre-Market Liquidity; 3.9 9:30 Candle as FPFVG |
| 9 | 1.1 OTE; 1.7 Opening Price Entry; 2.4 FVG Entry Drill |

## PHASE 0: Pre-Trade Planning

**Release Class:** MVP
**Applicable To:** Intraday models that require narrative, session timing, and lower-timeframe confirmation before execution, with explicit source coverage strongest for 1.2 Order Block Entry, 1.4 Breaker Entry, 1.5 Judas Swing Entry, 2.2 Silver Bullet, 2.4 FVG Entry Drill, 2.6 MMM Entry, 3.8 Pre-Market Liquidity, and 3.9 9:30 Candle as FPFVG.
**Primary Sources:** `ep13-notes.html`; `ep13lecturenotes.pdf`
**Supporting Sources:** `ICT_BIBLE__ELEMENTS_OF_TRADE_SETUP__2026-02-01.html`

**Rules:**
1. [paraphrase] The setup must be framed by a narrative toward liquidity, not by candle shape alone; the required ingredients are imbalance, the qualifying candle, and the idea that price is likely to run toward the next pool of liquidity. [ep13-notes.html | Core Definition — The Three Required Elements]
2. [paraphrase] Pre-trade planning starts from the higher-timeframe idea and then drills down into the lower-timeframe entry; the liquidity matrix is expected to lead the execution. [ep13-notes.html | Entry Setup — Lower TF Confirmation & Hierarchy]
3. [paraphrase] Around the 9:30 equities open, the first move is often the wrong move, so the initial opening-bell volatility should be treated as a Judas swing rather than something to chase. [ep13-notes.html | 9:30 Equity Opening — The Judas Swing]
4. [paraphrase] For bullish intraday execution, the checklist is: price is in discount, the relevant order block is in play, the opening event has occurred, and the narrative still points to buy-side liquidity. [ep13-notes.html | 9:30 Equity Opening — The Judas Swing]
5. [paraphrase] Retracements should be framed with liquidity gaps or liquidity voids, while reversal ideas should be coupled to liquidity pools above old highs or below old lows. [ICT_BIBLE__ELEMENTS_OF_TRADE_SETUP__2026-02-01.html | Retracement]; [ICT_BIBLE__ELEMENTS_OF_TRADE_SETUP__2026-02-01.html | Reversal]

**Common Mistakes:**
- [paraphrase] Do not replace narrative-plus-imbalance logic with generic engulfing-candle logic; the notes explicitly reject that shortcut. [ep13-notes.html | Core Definition — The Three Required Elements]
- [paraphrase] Do not chase the fake move into the 9:30 open or the first burst immediately after it. [ep13-notes.html | 9:30 Equity Opening — The Judas Swing]
- [paraphrase] Do not enter without already knowing where the liquidity matrix is expected to lead later in the move. [ep13-notes.html | Entry Setup — Lower TF Confirmation & Hierarchy]

**Model-Specific Variations:**
- 1.2 Order Block Entry / 2.6 MMM Entry — Market Maker Buy/Sell Model Stages -> The plan must include imbalance, the qualifying candle, and the directional narrative toward liquidity before execution is valid. [ep13-notes.html | Core Definition — The Three Required Elements]
- 1.5 Judas Swing Entry / 3.9 9:30 Candle as FPFVG -> Opening-bell behavior itself is part of the setup, so the pre-trade plan must explicitly account for the 9:30 Judas-swing dynamic. [ep13-notes.html | 9:30 Equity Opening — The Judas Swing]
- Other models -> [NO CANONICAL SOURCE FOUND]

## PHASE 1: Initial Stop Placement

**Release Class:** MVP
**Applicable To:** All models, with explicit stop-placement rules currently verified for 1.1 OTE, 1.7 Opening Price Entry (Asian Range), 2.4 FVG Entry Drill, and 3.1 Venom Model.
**Primary Sources:** `ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html`; `ict-2022-ep06-market-efficiency-paradigm.html`; `ep13-notes.html`; `ict-2022-ep25-rebalancing-drill-stops.html`; `ICT_BIBLE__ASIAN_RANGE__2026-02-01.html`; `ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html`; `ICT_BIBLE__VENOM_MODEL__2026-04-04.md`; `first-hour-dealing-range-study.html`
**Supporting Sources:** none

**Rules:**
1. [paraphrase] For FVG-based entries, the minimum stop is one to two ticks beyond the candle that created the fair value gap. [ict-2022-ep25-rebalancing-drill-stops.html | 43:35]
2. [paraphrase] If a trader wants more room, the conservative stop can be placed beyond the swing high or swing low instead. [ict-2022-ep25-rebalancing-drill-stops.html | 43:47]
3. [paraphrase] If that wider stop is necessary, reduce size rather than forcing a tighter invalidation. [ict-2022-ep25-rebalancing-drill-stops.html | 44:04]
4. [paraphrase] OTE places the stop at the reference low or high that defines the setup risk. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Risk Model & Stop Loss]
5. [paraphrase] Venom places risk below the injection candle low. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 7:58]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 8:05]

**Common Mistakes:**
- [paraphrase] Do not trail the stop-loss tightly immediately after entry; that strangles the position and does not give the trade room to breathe. [ict-2022-ep25-rebalancing-drill-stops.html | 42:43]; [ict-2022-ep25-rebalancing-drill-stops.html | 43:02]
- [paraphrase] If the stop distance feels too large, the error is forcing a smaller stop instead of trading smaller size or micros. [ict-2022-ep25-rebalancing-drill-stops.html | 43:47]; [ict-2022-ep25-rebalancing-drill-stops.html | 44:04]

**Model-Specific Variations:**
- 1.1 OTE -> Stop exactly at the low or high that defines the retracement risk. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Risk Model & Stop Loss]
- 1.7 Opening Price Entry (Midnight / Asian Range) -> ICT states that stop-losses under 10 pips are too tight, and one example uses about 35-40 pips to sit comfortably. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 20:35-20:48]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 30:40-30:51]
- 2.4 FVG Entry Drill (Timeframe Cascade) -> Minimum stop above the FVG-creating candle high; conservative stop above the swing high. [ict-2022-ep25-rebalancing-drill-stops.html | 43:35]; [ict-2022-ep25-rebalancing-drill-stops.html | 43:47]
- 3.1 Venom Model -> Stop below the injection candle low. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 7:58]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 8:05]
- Other models -> [NO CANONICAL SOURCE FOUND]

## PHASE 2: Anti-Break-Even Rule

**Release Class:** MVP
**Applicable To:** Trades intended to survive expansion rather than exit at the first favorable tick, with explicit source coverage strongest for 1.7 Opening Price Entry (Midnight / Asian Range) and 1.8 Stop Entry Long-Term.
**Primary Sources:** `ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html`; `ICT_BIBLE__ASIAN_RANGE__2026-02-01.html`
**Supporting Sources:** none

**Rules:**
1. [paraphrase] In long-term position trading, the stop should not be rushed to break even; the source explicitly treats early break-even as the wrong approach. [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 13:10]
2. [paraphrase] Around the halfway point of the expected weekly or monthly range, the framework still permits the 40-day trailing-stop logic; halfway alone does not force a break-even move or immediate 20-day tightening. [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 7:24]
3. [paraphrase] The same source also describes a staged transition to the 20-day trail: once price is above halfway the trader begins the transition logic, and by about three quarters of the expected range the 20-day lookback should be the active trailing framework. [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 24:01]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 24:22]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 25:10]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 7:48]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 14:48]
4. [paraphrase] In the Asian Range framework, risk is first managed with partials while the original stop stays in place; only later, after New York retraces, does trailing become appropriate. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 32:48-33:05]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 33:08-33:14]

**Common Mistakes:**
- [paraphrase] Moving the stop to break even because of fear rather than because the move has matured enough to justify a tighter trail. [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 13:10]
- [paraphrase] Using break-even as a substitute for partial profit taking. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 32:48-33:05]
- [paraphrase] Treating the 40-day to 20-day shift as one hard switch point instead of a staged transition from above-halfway consideration to by-three-quarters tighter trailing. [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 24:01]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 25:10]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 7:48]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 14:48]

**Model-Specific Variations:**
- 1.7 Opening Price Entry (Midnight / Asian Range) -> No mechanical break-even move; take partials first, then trail only after New York has retraced. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 32:48-33:05]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 33:08-33:14]
- 1.8 Stop Entry Long-Term -> Explicit anti-break-even rule; keep the 40-day trail early, begin the 20-day transition once price is above halfway, and be on the tighter 20-day framework by about three quarters of the expected range. [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 13:10]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 24:01]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 24:22]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 14:48]
- Other models -> [NO CANONICAL SOURCE FOUND]

## PHASE 3: Trailing Stop Methods

**Release Class:** MVP
**Applicable To:** All models that require the position to remain open after entry, with explicit source coverage spanning intraday order-block trades, Asian Range holds, conditional first-hour trails, and long-term position campaigns.
**Primary Sources:** `ep13-notes.html`; `first-hour-dealing-range-study.html`; `ICT_BIBLE__ASIAN_RANGE__2026-02-01.html`; `ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html`
**Supporting Sources:** none

**Rules:**
1. [paraphrase] In order-block continuation trades, the stop stays below the protected candle until price clears the next set of supporting down-close candles; only after that structural progress can the stop be raised. [ep13-notes.html | Stop Loss Management]
2. [paraphrase] In the Asian Range framework, leave the original stop where it belongs, manage the campaign with partials, and trail only after New York has completed its retracement. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 32:48-33:05]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 33:08-33:14]
3. [paraphrase] The First Hour Dealing Range framework includes a mechanical three-candle trail: every new set of three candles ratchets the stop, and if that trail is hit the trade is done. [first-hour-dealing-range-study.html | Stop Management — Three Candle Trailing Rule]; [first-hour-dealing-range-study.html | 78:10]
4. [paraphrase] In long-term position trading, the default trail begins on the 40-day lookback, then transitions above halfway and is tightened to the 20-day lookback by about three quarters of the expected range. [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 5:50]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 24:01]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 24:22]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 14:48]

**Common Mistakes:**
- [paraphrase] Putting the stop inside the protected order-block area creates a premature stop-out. [ep13-notes.html | Stop Loss Management]
- [paraphrase] Trailing too tightly too early strangles otherwise valid trades. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 32:48-33:05]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 6:42]
- [paraphrase] Using the first-hour three-candle trail as a generic rule across unrelated models instead of keeping it inside the First Hour Dealing Range framework that defines it. [first-hour-dealing-range-study.html | Stop Management — Three Candle Trailing Rule]

**Model-Specific Variations:**
- 1.2 Order Block Entry -> Raise the stop only after the next protected candles have been taken out in the expected direction. [ep13-notes.html | Stop Loss Management]
- 1.7 Opening Price Entry (Midnight / Asian Range) -> Trail only after New York has retraced; before that, keep the original stop and work with partials. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 32:48-33:05]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 33:08-33:14]
- 1.8 Stop Entry Long-Term -> Use the 40-day lookback first, begin transition above halfway, and tighten to the 20-day lookback by about three quarters of the expected campaign range. [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 5:50]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 24:01]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 24:22]; [ICT_BIBLE__POSITION_TRADE_MANAGEMENT__2026-02-01.html | 14:48]
- 2.4 FVG Entry Drill (Timeframe Cascade) -> Do not roll the stop until the significant intermediate-term low or high has been taken. [ict-2022-ep06-market-efficiency-paradigm.html | 41:28]
- Other models -> [NO CANONICAL SOURCE FOUND]

## PHASE 4: Partials and Scaling

**Release Class:** MVP
**Applicable To:** Models where the campaign is distributed across scale-outs, pyramids, or re-adds, with explicit source coverage strongest for 1.1 OTE, 1.4 Breaker Entry, 1.8 Stop Entry Long-Term, and 2.7 TGIF Entry.
**Primary Sources:** `ICT_BIBLE__SELECTING_PRECISION_PRICE_OBJECTIVES__2026-02-01.html`; `tgif-setup-study.html`; `ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html`; `ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html`
**Supporting Sources:** none

**Rules:**
1. [paraphrase] Use a target ladder for distribution: first scale at the old high or low, then target 1, then target 2, then the symmetrical price swing. [ICT_BIBLE__SELECTING_PRECISION_PRICE_OBJECTIVES__2026-02-01.html | Target Scaling Framework]
2. [paraphrase] Each target hit is a profit-taking event because the larger daily context can change before the full measured move completes. [ICT_BIBLE__SELECTING_PRECISION_PRICE_OBJECTIVES__2026-02-01.html | 12:15]
3. [paraphrase] In long-term stop-entry campaigns, take some size off after a large move, then put that same piece back on at the same opening price if price retraces there. [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Position Scaling & Re-Entry]
4. [paraphrase] Breaker campaigns can be staged rather than entered all at once, with adds layered deeper into the breaker as the setup improves. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Position Scaling Strategy]

**Common Mistakes:**
- [paraphrase] Treating every campaign as all-in or all-out when the sources explicitly teach staged scale-outs and staged adds. [ICT_BIBLE__SELECTING_PRECISION_PRICE_OBJECTIVES__2026-02-01.html | Target Scaling Framework]; [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Position Scaling & Re-Entry]
- [paraphrase] Starting with full size when the framework is designed to let the trader start smaller and build as the move proves itself. [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Building Larger Positions]
- [paraphrase] Assuming TGIF must always be managed with no partials; the source presents both a full-pool example and a gradient-based partial framework. [tgif-setup-study.html | Target and Exit]; [tgif-setup-study.html | Partial Exit Strategy Option]

**Model-Specific Variations:**
- 1.1 OTE -> First scale-out is the old high or low, then target 1, target 2, then the symmetrical price swing. [ICT_BIBLE__SELECTING_PRECISION_PRICE_OBJECTIVES__2026-02-01.html | Target Scaling Framework]
- 1.4 Breaker Entry -> Stage adds into the breaker instead of entering maximum size at once. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Position Scaling Strategy]
- 1.8 Stop Entry Long-Term -> Take part of the position off after a large expansion and re-add the same piece at the same opening price on retracement. [ICT_BIBLE__STOP_ENTRY_TECHNIQUES_LONG_TERM__2026-02-01.html | Position Scaling & Re-Entry]
- 2.7 TGIF Entry -> Either hold full pool with no partials or use 20%-30% weekly-range gradients for staged exits. [tgif-setup-study.html | Target and Exit]; [tgif-setup-study.html | Partial Exit Strategy Option]
- Other models -> [NO CANONICAL SOURCE FOUND]

## PHASE 5: Target Selection

**Release Class:** MVP
**Applicable To:** All models, because target logic determines whether the setup has enough room and where the campaign should terminate.
**Primary Sources:** `ICT_BIBLE__SELECTING_PRECISION_PRICE_OBJECTIVES__2026-02-01.html`; `ict-2022-ep06-market-efficiency-paradigm.html`; `ict-2022-ep17-forex-model.html`; `first-hour-dealing-range-study.html`; `silver_bullet.html`
**Supporting Sources:** `ICT_BIBLE__VENOM_MODEL__2026-04-04.md`

**Rules:**
1. [paraphrase] Determine the next draw on liquidity before worrying about the exact entry or exit; target logic comes first. [silver_bullet.html | Types of Silver Bullet Draws]
2. [paraphrase] Daily-bias target logic begins with the previous day's high or low as the next liquidity objective, and a lower high switches that bias toward the previous day's low. [ICT_BIBLE__SELECTING_PRECISION_PRICE_OBJECTIVES__2026-02-01.html | Daily Bias Using Previous Day's High Runs]
3. [paraphrase] In the FVG drill framework, internal range liquidity is where partials come off, while external range liquidity is the real trade objective. [ict-2022-ep06-market-efficiency-paradigm.html | Internal Range Liquidity vs External Range Liquidity]
4. [paraphrase] The First Hour Dealing Range offers structured objectives: there is a strong tendency toward the opening-range-gap midpoint in the first 30 minutes, the 10:00 high becomes a lunch-macro target, and the completed first-hour range can be projected as a standard-deviation objective. [first-hour-dealing-range-study.html | 70% Likelihood — Opening Range Gap Midpoint]; [first-hour-dealing-range-study.html | 10 O'Clock High — Lunch Macro Target]; [first-hour-dealing-range-study.html | Standard deviation projection]
5. [paraphrase] Forex exits should not be aimed at the exact textbook level tick-for-tick; a small exit buffer is preferred so spread and friction do not steal the move. [ict-2022-ep17-forex-model.html | Exit Strategy &amp; Risk to Reward]

**Common Mistakes:**
- [paraphrase] Trading a setup without first knowing the likely next draw on liquidity. [silver_bullet.html | Types of Silver Bullet Draws]
- [paraphrase] Aiming only for the exact level and missing the exit because of overzealous targeting. [ict-2022-ep17-forex-model.html | Exit Strategy &amp; Risk to Reward]
- [paraphrase] Taking trades with too little room between entry and objective to justify the model. [silver_bullet.html | Points, Handles &amp; Pips]

**Model-Specific Variations:**
- 1.1 OTE -> The model uses a target ladder from first scale-out at the old high or low into target 1, target 2, and the symmetrical price swing. [ICT_BIBLE__SELECTING_PRECISION_PRICE_OBJECTIVES__2026-02-01.html | Target Scaling Framework]
- 2.2 Silver Bullet -> Targets are previous day or previous session highs and lows inside the active Silver Bullet window. [silver_bullet.html | Types of Silver Bullet Draws]; [silver_bullet.html | 3:00 AM – 4:00 AM Setup]
- 2.4 FVG Entry Drill (Timeframe Cascade) -> Internal range liquidity is for partials; external range liquidity is the actual campaign target. [ict-2022-ep06-market-efficiency-paradigm.html | Internal Range Liquidity vs External Range Liquidity]
- 3.1 Venom Model -> The worked example targets the first presented fair value gap of the morning / week rather than an arbitrary fixed multiple. [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | Worked Example: December Mini NASDAQ — May 12, 2025 (5-Minute Chart)]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | First Presented FVG of the Week]
- 3.7 Two 15-Min FVG Dynamic Canvas -> The six levels from the two selected 15-minute gaps become the entire targeting canvas. [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Definition — Two 15-Minute FVG Dynamic Canvas]; [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Rules & Conditions]

## PHASE 6: Invalidation and Exit

**Release Class:** MVP
**Applicable To:** Models using protected candle structure or intermediate-term swing logic to determine when the idea has failed.
**Primary Sources:** `ep13-notes.html`; `ep13lecturenotes.pdf`; `ict-2022-ep12-market-structure-precision-technicians.html`
**Supporting Sources:** none

**Rules:**
1. [paraphrase] If price breaks the protected down-close candles that were supposed to support the bullish trade, the stop-out is correct because the idea may be failing and going lower. [ep13-notes.html | Stop Loss Management]
2. [paraphrase] An intermediate-term high or low created by a rebalance becomes the structural line in the sand; if price trades through that level against the thesis, the trade idea is probably flawed and should not be forced. [ict-2022-ep12-market-structure-precision-technicians.html | 17:14]; [ict-2022-ep12-market-structure-precision-technicians.html | Intermediate Term High &amp; Low — Two Classifications]; [ict-2022-ep12-market-structure-precision-technicians.html | Intermediate Term High — Expected Behaviour]
3. [paraphrase] Do not place the stop inside the protected area; that causes a premature exit before the model has actually been invalidated. [ep13-notes.html | Stop Loss Management]

**Common Mistakes:**
- [paraphrase] Treating ordinary retracement noise as invalidation before the protected structural level has actually failed. [ep13-notes.html | Stop Loss Management]
- [paraphrase] Forcing the same trade again after the intermediate-term structure has already invalidated the thesis. [ict-2022-ep12-market-structure-precision-technicians.html | Intermediate Term High — Expected Behaviour]
- [paraphrase] Putting the stop inside the area that is supposed to be allowed to breathe. [ep13-notes.html | Stop Loss Management]

**Model-Specific Variations:**
- 1.2 Order Block Entry -> Invalidation occurs when the protected order-block candle or supporting down-close candles are violated. [ep13-notes.html | Stop Loss Management]
- 1.4 Breaker Entry / 2.6 MMM Entry — Market Maker Buy/Sell Model Stages -> If the intermediate-term rebalance swing is exceeded against the thesis, the setup is structurally wrong and should not be forced. [ict-2022-ep12-market-structure-precision-technicians.html | 17:14]; [ict-2022-ep12-market-structure-precision-technicians.html | Intermediate Term High — Expected Behaviour]
- Other models -> [NO CANONICAL SOURCE FOUND]

## PHASE 7: After a Stop-Out

**Release Class:** MVP
**Applicable To:** Models where the trade can be re-armed only if the narrative and structure still remain intact after the initial loss.
**Primary Sources:** `ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html`; `ict-2022-ep25-rebalancing-drill-stops.html`
**Supporting Sources:** none

**Rules:**
1. [paraphrase] The first response to a stop-out is simply to take the loss; there is no attempt to philosophize away the invalidation. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Position Scaling Strategy]
2. [paraphrase] If nothing material has changed in the narrative and the model still wants to continue, the re-entry is taken with half the original size, not the full first size. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Position Scaling Strategy]
3. [paraphrase] If the market stops you but the pattern still exists generally, do not become emotionally attached to that single loss; the model forms frequently enough that process matters more than one outcome. [ict-2022-ep25-rebalancing-drill-stops.html | 45:22]
4. [paraphrase] If the stop-out happens before a clean imbalance or repricing event, wait for the next proper imbalance instead of re-entering blindly. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Position Scaling Strategy]

**Common Mistakes:**
- [paraphrase] Increasing size after a stop-out instead of cutting size for the next attempt. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Position Scaling Strategy]
- [paraphrase] Re-entering before the market has created the next clean imbalance or repricing condition. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Position Scaling Strategy]
- [paraphrase] Caring so much about a single stop that the trader abandons the model's repeatable process. [ict-2022-ep25-rebalancing-drill-stops.html | 45:22]

**Model-Specific Variations:**
- 1.4 Breaker Entry -> If the breaker idea still wants continuation after the loss, re-enter with half the original size. [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Position Scaling Strategy]
- 2.4 FVG Entry Drill (Timeframe Cascade) -> Accept that being stopped can simply mean the current attempt failed; the pattern forms repeatedly, so the next valid structure matters more than the last miss. [ict-2022-ep25-rebalancing-drill-stops.html | 45:22]
- Other models -> [NO CANONICAL SOURCE FOUND]

## PHASE 8: Environmental Adjustments

**Release Class:** Full
**Applicable To:** All intraday models, especially those executed around session opens, first-presented fair value gaps, or manually distorted market conditions.
**Primary Sources:** `study-note-hr-conditions.html`; `ICT_BIBLE__MANUAL_INTERVENTION_PDA_EXPIRATION_OR_PROJECTIONS_MACROS__2026-04-04.md`
**Supporting Sources:** none

**Rules:**
1. [paraphrase] When price spends too much time inside inefficiencies or revisits them repeatedly, classify the day as high resistance, reduce leverage, and slow down. [study-note-hr-conditions.html | Inefficiency Behavior — The Primary Signal]; [study-note-hr-conditions.html | Two Conditions — Core Definition]
2. [paraphrase] On high-resistance days the stop has to be wider, while low-resistance days allow tighter consequent-encroachment-based risk and greater leverage only if precision is present. [study-note-hr-conditions.html | Stop Loss Rule on High Resistance Days]
3. [paraphrase] Manual intervention is identified by overlapping back-and-forth wicks, a lack of clean price runs, and first-presented fair value gaps that are not being respected; the stated response is to turn the charts off and wait. [ICT_BIBLE__MANUAL_INTERVENTION_PDA_EXPIRATION_OR_PROJECTIONS_MACROS__2026-04-04.md | Manual Intervention Recognition — When to Turn Charts Off]
4. [paraphrase] During extraordinary volatility, lower leverage sharply, reduce trade frequency, and use hard stops only; waiting is a valid professional action because stop losses may not fully protect flash moves. [ICT_BIBLE__MANUAL_INTERVENTION_PDA_EXPIRATION_OR_PROJECTIONS_MACROS__2026-04-04.md | Extraordinary Volatility — Risk Management Rules]
5. [paraphrase] Use only the stated macro windows - 9:50-10:10, 10:50-11:10, 11:30, 2:50-3:10, and 3:15-3:45 - and ignore invented after-the-hour macro folklore. [ICT_BIBLE__MANUAL_INTERVENTION_PDA_EXPIRATION_OR_PROJECTIONS_MACROS__2026-04-04.md | Macro Time Windows]

**Common Mistakes:**
- [paraphrase] Mistaking loss of PD-array precision for a broken model instead of recognizing manual intervention. [study-note-hr-conditions.html | Manual Intervention — The Mechanics]; [study-note-hr-conditions.html | Main Takeaways + Final Summary]
- [paraphrase] Using maximum leverage or normal real-money size on high-resistance days. [study-note-hr-conditions.html | Two Conditions — Core Definition]; [study-note-hr-conditions.html | Stop Loss Rule on High Resistance Days]
- [paraphrase] Trading extraordinary-volatility conditions with mental stops or normal size. [ICT_BIBLE__MANUAL_INTERVENTION_PDA_EXPIRATION_OR_PROJECTIONS_MACROS__2026-04-04.md | Extraordinary Volatility — Risk Management Rules]

**Model-Specific Variations:**
- 1.3 Turtle Soup -> In high-resistance bearish conditions, repeated turtle-soup stop-runs are part of the characteristic signature rather than a clean one-and-done reversal. [study-note-hr-conditions.html | Journaling Classification + Turtle Soup]
- 2.7 TGIF Entry -> Opening-range-gap size and lackluster morning conditions materially alter Friday expectations before execution. [study-note-hr-conditions.html | TGIF Measurement + HR Signature List]
- 3.8 Pre-Market Liquidity (7:00-9:30) / 3.9 9:30 Candle as FPFVG -> Opening-range measurement, macro timing, and first-usable-FVG rules depend on regular trading hours and session condition classification. [study-note-hr-conditions.html | Opening / Session Setup]; [study-note-hr-conditions.html | Quadrant Levels, Sell Side & Time Factor]; [ICT_BIBLE__MANUAL_INTERVENTION_PDA_EXPIRATION_OR_PROJECTIONS_MACROS__2026-04-04.md | Macro Time Windows]

## PHASE 9: Position Sizing and Risk

**Release Class:** MVP
**Applicable To:** All models, with explicit source coverage strongest for 1.1 OTE, 1.7 Opening Price Entry (Midnight / Asian Range), and FVG-based intraday trades using stop-distance math.
**Primary Sources:** `ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html`; `ICT_BIBLE__ASIAN_RANGE__2026-02-01.html`; `ict-2022-ep25-rebalancing-drill-stops.html`
**Supporting Sources:** none

**Rules:**
1. [paraphrase] Position size is derived from predefined account risk; OTE gives the example of taking the allowed percent risk on the account and converting it into per-pip leverage from the stop distance. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Risk Calculation]
2. [paraphrase] The first profit in the OTE framework should ordinarily return at least 2:1 on the initial risk. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Two-to-One Minimum]
3. [paraphrase] If the correct stop requires more room, the trader should use smaller products or micros instead of forcing a tighter invalidation. [ict-2022-ep25-rebalancing-drill-stops.html | Stop Placement]
4. [paraphrase] In the Asian Range model, a contingent stop-entry can be used for half size so the trader is not left with nothing if price reverses before the preferred retracement fills. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Bullish Buy Stop Entry]
5. [paraphrase] Stop-losses smaller than 10 pips are explicitly discouraged in the Asian Range framework. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Stop Loss Guidance]

**Common Mistakes:**
- [paraphrase] Forcing a tiny stop because full-size leverage cannot tolerate the correct stop distance. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 20:35-20:48]; [ict-2022-ep25-rebalancing-drill-stops.html | 44:04]
- [paraphrase] Trading minis when only micros fit the account and the required stop size. [ict-2022-ep25-rebalancing-drill-stops.html | Micros vs Minis]
- [paraphrase] Entering with full size when the framework specifically allows a half-position contingency order. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Bullish Buy Stop Entry]

**Model-Specific Variations:**
- 1.1 Optimal Trade Entry (OTE) -> Use account-risk percentage to calculate per-pip leverage, and require roughly 2:1 by first profit. [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Risk Calculation]; [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Two-to-One Minimum]
- 1.7 Opening Price Entry (Midnight / Asian Range) -> A half-position stop-entry contingency order is valid, and the source gives a comfortable 35-40 pip stop example. [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | Bullish Buy Stop Entry]; [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 30:40-30:51]
- 2.4 FVG Entry Drill (Timeframe Cascade) -> If the swing-high stop is the one that lets the trader hold the setup correctly, size down or use micros. [ict-2022-ep25-rebalancing-drill-stops.html | Stop Placement]
- Other models -> [NO CANONICAL SOURCE FOUND]

## CROSS-REFERENCE MATRIX

[SUMMARY] The matrix below compresses the already-evidenced model sections and trade-management phases above. It is a derivative navigation aid built from the extracted content, not a new evidence surface.

| Model | Stop Type | Anti-BE Rule | Trail Method | Partial Framework | Target Logic | Typical Timeframe |
|-------|-----------|--------------|--------------|-------------------|--------------|-------------------|
| 1.1 Optimal Trade Entry (OTE) | Reference swing low/high | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Old high/low first scale-out, then target ladder | OTE ladder into prior liquidity and extensions | HTF swing -> intraday execution |
| 1.2 Order Block Entry | Intermediate-term swing protecting the order-block idea | [NO CANONICAL SOURCE FOUND] | Raise only after protected candles are taken in the expected direction | [NO CANONICAL SOURCE FOUND] | Further repricing into next liquidity pool | HTF -> 5m/1m intraday |
| 1.3 Turtle Soup | Below the lowest low after the worked buy-stop/FVG variant fills | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Reversal away from raided external liquidity | Kill-zone / session reversal |
| 1.4 Breaker Entry | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Stage adds into the breaker | A-to-B standard deviation and HTF liquidity | Intraday PD-array reversal |
| 1.5 Judas Swing Entry | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Opposite side of opening fake move / session liquidity | Midnight-5:00 AM or opening-session reversal |
| 1.6 One Shot One Kill (Weekly) | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Weekly range objective | Weekly / swing |
| 1.7 Opening Price Entry (Midnight / Asian Range) | Midnight open / Asian-range structure | Partials first; no early BE | Trail only after New York retracement | Partials before stop movement | Midnight opening-price delivery / weekly objective | Midnight to London/NY open |
| 1.8 Stop Entry Long-Term | Daily candle open with wide structural risk | Explicit no early BE | 40-day lookback -> transition above halfway -> 20-day by about three quarters | Take off and re-add at same opening price | Weekly/monthly PD array | Daily / weekly / monthly |
| 2.1 Model 2022 | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Buy-side sweep -> MSS -> FVG -> reversal objective | RTH intraday |
| 2.2 Silver Bullet | OTE reference swing extreme defining the setup risk | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Next draw on liquidity inside the active Silver Bullet window | 3-4 AM, 10-11 AM, 2-3 PM |
| 2.3 Power Three Entry (Opening Price Fade) | Short-term low/high formed after FVG in the worked examples | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Session distribution leg from opening price into liquidity | 8:30 / 9:30 opening-price model |
| 2.4 FVG Entry Drill (Timeframe Cascade) | FVG creator or swing high/low | No early BE | Roll stop only after significant structure is taken | Internal partials, external objective | Internal then external liquidity | HTF -> LTF intraday |
| 2.5 Buying Sell Stops / Selling Buy Stops | Liquidity-run extreme beyond the entry | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Later-day narrative objective | Intraday stop-entry |
| 2.6 MMM Entry — Market Maker Buy/Sell Model Stages | Variation-specific; no universal stop template stated | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Original consolidation / buy-side or sell-side curve objective | HTF -> LTF intraday |
| 2.7 TGIF Entry | Weekly-range invalidation | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Full pool or 20%-30% weekly-range gradients | 20%-30% of weekly range; 40%+ implies reversal/top/bottom context | Friday PM / last hour |
| 3.1 Venom Model | Injection candle low/high | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | First presented FVG of the morning/week | 9:30 open / 1m |
| 3.2 Gauntlet | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Next liquidity objective in the breaker narrative | Intraday / breaker leg |
| 3.3 Gray Pool | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | FPFVG-to-target discount/premium frame | Intraday / session |
| 3.4 Immediate Rebalance | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Immediate directional delivery / next session objective | Opening-session intraday |
| 3.5 Rejection Block Deferred TS | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Continuation lower after confirmed false breakout | 9:30 opening reversal / 1m with 5m reference |
| 3.6 Suspension Block Entry | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | CE/quadrants to linked PD array | Intraday / session |
| 3.7 Two 15-Min FVG Dynamic Canvas | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | Travel between the six canvas levels | 15m framework -> intraday |
| 3.8 Pre-Market Liquidity (7:00-9:30) | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | First easy EQH/EQL in the 7:00-9:30 window | 7:00-9:30 / 9:30 open |
| 3.9 9:30 Candle as FPFVG | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | [NO CANONICAL SOURCE FOUND] | ORG CE, session-liquidity hierarchy, and PM FPFVG continuation | 9:30-10:00, 1:30-2:00 |

## DISCRIMINATION GUIDE

### Order Block Entry vs Breaker Entry

**Decision Question:** Are you entering the original directional candle-plus-imbalance in line with narrative, or a repriced structure that only exists after liquidity has been run and the market has created a breaker?
**Distinction:** Order Block Entry is defined by the qualifying candle, imbalance, and narrative toward liquidity. Breaker Entry is defined by the stop-run/repricing event itself and then uses the breaker structure plus the A-to-B leg for targeting and scaling.
**Basis:** Explicit.
**Support:** [ep13-notes.html | Core Definition — The Three Required Elements]; [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Structure & Pattern Recognition]

### Turtle Soup vs Judas Swing Entry

**Decision Question:** Is the defining event a false breakout of obvious liquidity, or simply the routine wrong-way move that accompanies a session open?
**Distinction:** Turtle Soup is a liquidity-raid reversal pattern. Judas Swing is the session-opening fake move itself. They can overlap, but Turtle Soup is defined by the stop run; Judas Swing is defined by the opening-bell displacement.
**Basis:** [ANALYTICAL].
**Support:** [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | Definition]; [ICT_BIBLE__JUDAS_SWING__2026-02-01.html | Definition]; [ep13-notes.html | 9:30 Equity Opening — The Judas Swing]

### Opening Price Entry vs Power Three Entry (Opening Price Fade)

**Decision Question:** Are you working from the midnight opening price and Asian-range logic, or from the later session opening-price fade inside a Power of Three day profile?
**Distinction:** Opening Price Entry extends the midnight opening price through the London/New York sessions and frames price around Asian-range behavior. Power Three Entry uses the session opening price as a fade anchor inside a specific accumulation-manipulation-distribution narrative.
**Basis:** [ANALYTICAL].
**Support:** [ICT_BIBLE__ASIAN_RANGE__2026-02-01.html | 12:20-13:58]; [ict-2022-ep21.html | 8:30 AM Opening Price — New York Session]; [ict-2022-ep21.html | Power 3]

### Model 2022 vs Silver Bullet

**Decision Question:** Are you identifying the MSS-plus-FVG reversal structure itself, or are you executing that idea only because price is inside one of the fixed Silver Bullet timing windows?
**Distinction:** Model 2022 is the structural pattern: buy side taken, shift in market structure, fair value gap, then the reversal. Silver Bullet is the time-window framework that can host a similar entry. One is the setup anatomy; the other is the timing regime.
**Basis:** Explicit.
**Support:** [market_maker_models.html | 55:29]; [silver_bullet.html | Silver Bullet Setup Windows]

### FVG Entry Drill vs Two 15-Min FVG Dynamic Canvas

**Decision Question:** Are you executing one specific fair value gap with direct stop-and-target logic, or using two 15-minute gaps as a six-level framework to read the entire session?
**Distinction:** FVG Entry Drill is a single-gap execution model. Two 15-Min FVG Dynamic Canvas is a rolling framework built from two nearby 15-minute gaps whose six levels become the session map.
**Basis:** Explicit.
**Support:** [ict-2022-ep06-market-efficiency-paradigm.html | Entry &amp; Exit Rules]; [ICT_BIBLE__TWO_15MIN_FVG_DYNAMIC_CANVAS__2026-04-04.md | Definition — Two 15-Minute FVG Dynamic Canvas]

### Gauntlet vs Silver Bullet

**Decision Question:** Are you selecting the very first qualifying imbalance inside the breaker leg, or are you primarily using the time-window logic of the Silver Bullet?
**Distinction:** The Gauntlet is the precise first SIBI/BISI inside the breaker's liquidity leg. Silver Bullet is the broader time-window concept. The sources explicitly say they can overlap, but the Gauntlet is the level-selection rule, not the time-window rule.
**Basis:** Explicit.
**Support:** [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]; [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Gauntlet vs Silver Bullet]

### Gauntlet vs Gray Pool

**Decision Question:** Are you anchoring to the first imbalance inside a breaker leg, or to the projected midpoint band of two consecutive discount wicks?
**Distinction:** Gauntlet is breaker-leg specific and imbalance specific. Gray Pool is a projected band built from two consecutive wick midpoints and then judged as discount or premium relative to the target range.
**Basis:** Explicit.
**Support:** [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gauntlet]; [ICT_BIBLE__GAUNTLET_GRAY_POOL_DEFERRED_ENTRIES__2026-04-04.md | Definition — Gray Pool]

### Venom Model vs Turtle Soup

**Decision Question:** Are you entering the stop hunt itself as a classic false-break reversal, or waiting for the post-raid Venom pattern with the SIBI-then-BISI "two fangs" sequence?
**Distinction:** Turtle Soup is the broader false-break reversal of external liquidity. Venom is explicitly taught as a deferred form of Turtle Soup that requires the two-fangs SIBI/BISI sequence after the sell-side raid.
**Basis:** Explicit.
**Support:** [ICT_BIBLE__TRADING_MARKET_REVERSALS_TURTLE_SOUPS__2026-02-01.html | Turtle Soup Core Concept]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 11:30]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 10:55]

### Venom Model vs Rejection Block Deferred TS

**Decision Question:** After the false breakout, are you using the Venom two-fangs pattern, or are you waiting for the one-minute rejection block to be hit after the five-minute iFVG and premium-wick rejection are already proven?
**Distinction:** Venom is defined by SIBI then BISI leaving the low and buying at the leaving candle or less. Rejection Block Deferred TS is defined by the return to the rejection-block closing price after the iFVG and premium-wick consequent encroachment have already rejected price.
**Basis:** Explicit.
**Support:** [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 10:55]; [ICT_BIBLE__VENOM_MODEL__2026-04-04.md | 10:57]; [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Definition — Rejection Block Deferred Turtle Soup Entry]; [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Structure / Pattern Description]

### OTE vs Breaker Entry

**Decision Question:** Are you buying or selling a retracement back into the 62%-79% OTE zone after an impulse and structure break, or are you trading a post-liquidity-run breaker that reprices through an order-block-like range?
**Distinction:** OTE is a Fibonacci retracement model after impulse and structure break. Breaker Entry is a liquidity-run-and-repricing model where the breaker itself becomes the executable PD array.
**Basis:** Explicit.
**Support:** [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Definition]; [ICT_BIBLE__OTE_OPTIMAL_TRADE_ENTRY__2026-02-01.html | Fibonacci Settings]; [ICT_BIBLE__BREAKER_BREAD_AND_BUTTER__2026-02-01.html | Definition]

### MMM Entry — Market Maker Buy/Sell Model Stages vs Model 2022

**Decision Question:** Are you working inside the full market-maker buy/sell model with original consolidation and stage logic, or just using the narrower 2022 sweep-shift-FVG slice of that larger framework?
**Distinction:** MMM is the broader staged buy/sell model. Model 2022 is one simpler structural expression inside that broader framework, not the whole model.
**Basis:** Explicit.
**Support:** [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Definition - Market Maker Models]; [ICT_BIBLE__MARKET_MAKER_MODELS__2026-02-01.html | Integration with Other ICT Models]

### IFVG vs Fair Value Gap (Same Zone)

**Decision Question:** Are you trading the gap for its original directional delivery, or are you trading that same inefficiency only after it has failed and returned in the opposite role?
**Distinction:** A normal fair value gap expects original-direction delivery to resume from the inefficiency. An inversion fair value gap is the failed fair value gap returned to later as an opposite-direction PD array.
**Basis:** Explicit.
**Support:** [ICT_BIBLE__FAIR_VALUE_GAP__2026-02-01.html | Core Definition]; [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Study & Review]

### IFVG vs Reclaimed / Revisited FVG

**Decision Question:** Did the gap fully fail and reverse role, or is the evidence only that price is likely to revisit it because no body ever really lived inside the gap?
**Distinction:** IFVG is a role-reversal model after the original FVG fails and price returns. A reclaimed or revisited gap is revisit logic: wick overlap and no body inside the gap imply the area is likely to be seen again, but that alone does not define a full inversion.
**Basis:** Explicit.
**Support:** [ICT_BIBLE__INVERSION_FAIR_VALUE_GAP__2026-02-01.html | Study & Review]; [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Volume Imbalance with Wick Overlap — 90% Revisit Rule]

### Immediate Rebalance vs 9:30 Candle as FPFVG

**Decision Question:** Are you trading an Immediate Rebalance variant, either open-to-level or next-candle return, or deciding whether the 9:30 candle itself qualifies as the session's first presented fair value gap?
**Distinction:** Immediate Rebalance is a no-gap rebalance signature, either from the session open directly into a prior level or from a just-broken candle high/low immediately being revisited by the next candle. The 9:30 Candle as FPFVG model is an exception framework for whether the opening candle itself becomes the operative first fair value gap.
**Basis:** [ANALYTICAL].
**Support:** [immediate_rebalance_notes.html | Immediate Rebalance — Definition &amp; Significance]; [ICT_BIBLE__930_FPFVG_SESSION_LIQUIDITY_RTH_ETH__2026-04-04.md | Definition — When the 9:30 Candle IS the First Presented FVG]

### Rejection Block Deferred TS vs Suspension Block Entry

**Decision Question:** Is the entry created by a displaced false breakout returning to a rejection-block close, or by a single candle suspended between two volume imbalances?
**Distinction:** Rejection Block Deferred TS is a deferred turtle-soup entry that waits for price to come back to the rejection block close after displacement. Suspension Block Entry is a different PD array entirely: one candle bracketed by a volume imbalance on each side, behaving like a special fair value gap.
**Basis:** Explicit.
**Support:** [ICT_BIBLE__REJECTION_BLOCK_DEFERRED_TURTLE_SOUP__2026-04-04.md | Definition — Rejection Block Deferred Turtle Soup Entry]; [ICT_BIBLE__SUSPENSION_BLOCK__2026-04-04.md | Definition — Suspension Block]

## BUILD LOG
- [2026-04-21] Phase 0 complete - bootstrap and source roots validated
- [2026-04-21] Phase 1 complete - working reference scaffold created
- [2026-04-21] Phase 2 complete - source registry generated and classified (164 rows)
- [2026-04-21] Phase 3 - 1.1 Optimal Trade Entry (OTE) complete with flags: Invalidation
- [2026-04-21] Phase 3 - 2.2 Silver Bullet complete with flags: Stop Placement, Invalidation, partial R:R
- [2026-04-21] Phase 3 - 3.1 Venom Model complete with flags: general target rule, R:R Context
- [2026-04-21] Phase 4 - Phase 1 Initial Stop Placement complete with flags: some models still unresolved
- [2026-04-21] Phase 3 - remaining 21 model sections completed; unresolved source gaps retained as explicit flags
- [2026-04-21] Phase 4 - phases 0, 2, 3, 4, 5, 6, 7, 8, and 9 completed
- [2026-04-21] Phase 6 - cross-reference matrix completed (24 rows)
- [2026-04-21] Phase 7 - discrimination guide completed (9 pairs)
- [2026-04-21] Phase 9 - release artifact prepared for `/Users/soonjeongguan/Desktop/ICTBible/outputs/ict-entry-models-reference__full-production__v1.0.0.md`
- [2026-04-21] Phase 9 - release artifact written to `/Users/soonjeongguan/Desktop/ICTBible/outputs/ict-entry-models-reference__full-production__v1.0.0.md`
- [2026-04-21] Tier 1 - sections 3.1, 3.2, 3.4, 3.5, 3.6, 3.7, and 3.9 rewritten for canonical mechanics and section-level source hygiene
- [2026-04-21] Tier 2 - added cross-cutting Section 4.1 for inversion fair value gap execution and integrated IFVG links into dependent models
- [2026-04-21] Tier 3 - glossary added for core ICT execution terminology used throughout the model sections
- [2026-04-21] Tier 4 / Tier 6 - release framing, phase-coverage table, matrix honesty, evidence-status rules, and discrimination guide updated under the fix plan
- [2026-04-21] Tier 2 / Tier 4 - audit-issues feedback integrated for grounding hierarchy, OTE invalidation, Turtle Soup worked-stop coverage, Power Three 8:30 recalibration, 9:30 FPFVG precedence, TGIF 40%+ context, and staged 40-day to 20-day trade-management rules
- [2026-04-21] ClaudeAudit integration - OTE 60/62 divergence and full stop quote, Order Block delivery-context and 11:30 scope, breaker body-based measurement and stop-level honesty, Judas bearish sequencing wording, and Silver Bullet OTE-linked stop guidance integrated

## AUDIT LOG
- [2026-04-21] Structural audit - 24 model placeholders and 10 management phase placeholders created
- [2026-04-21] Registry audit - all files in ClaudeLibrary and CodexLibrary classified
- [2026-04-21] Evidence audit - 1.1 OTE quotes and paraphrases checked against source headings
- [2026-04-21] Evidence audit - 2.2 Silver Bullet quotes and paraphrases checked against source headings
- [2026-04-21] Evidence audit - 3.1 Venom Model quotes and paraphrases checked against source timestamps
- [2026-04-21] Evidence audit - Phase 1 Initial Stop Placement checked against OTE, Venom, ep25, and Asian Range sources
- [2026-04-21] Structural audit - no body extraction placeholders remain; 24/24 model sections and 10/10 management phases complete
- [2026-04-21] Evidence audit - phases 0, 2, 3, 4, 5, 6, 7, 8, and 9 checked against cited primary sources; corrections applied inline
- [2026-04-21] Registry audit - 39 referenced exact filenames resolve through the registry; missing rows: 0; actual Codex fallback usage: 0; actual source divergence usage: 3
- [2026-04-21] Alias audit - no banned alias-only references found for `Ep6`, `Ep13`, `Ep21`, `Ep25`, `FHDR`, or `Position Mgmt`
- [2026-04-21] Release audit - output artifact exists and matched the audited working file byte-for-byte at publication time; checksum is recorded in the external `.sha1` manifest because embedding the file's own checksum here would self-invalidate it
- [2026-04-21] Fix-plan audit - Tier 1 and Tier 2 section rewrites rechecked against the cited source headings and timestamps before reinsertion
- [2026-04-21] Matrix audit - unsupported `Phase X default` claims removed and replaced with explicit unresolved cells where no canonical phase rule exists
- [2026-04-21] Audit-issues reconciliation - only feedback corroborated by cited source files or verified transcripts was promoted into canonical rules; unsupported suggestions were left out of the evidence surface
- [2026-04-21] ClaudeAudit reconciliation - breaker range, OTE divergence/stop precision, Order Block delivery context, Silver Bullet stop cross-reference, and Judas bearish sequencing rechecked against the cited source files before publication
- [2026-04-21] Open flags re-enumerated after the audit-issues pass - model sections: 41 active flags; phase sections: 8 active flags; total active section-level flags: 49

## STATUS LEDGER
- Models complete: 24/24
- Tier 1 complete: 14/14
- Tier 2 complete: 8/8
- Tier 3 complete: 2/2
- MVP phases complete: 9/9
- Full phases complete: 10/10
- Registry rows classified: 164/164
- Open flags: 49
