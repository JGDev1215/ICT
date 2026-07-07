# Using IPDA Data Ranges

> **Source:** ICT Mentorship Core Content - Month 05 - Using IPDA Data Ranges | ICT | 2017
> **Duration:** 2:02:42
> **Concepts covered:** IPDA data ranges, interbank price delivery algorithm, quarterly market shift, 20/40/60-day lookback, cast forward, buy stops, sell stops, open interest, Australian Dollar futures, order block, fair value gap, liquidity pools, open float
> **ICT Bible status:** New entry

---

## Definition

> "ipta is the interbank price delivery algorithm"

> "the ipta data range okay. What it's really doing is it's highlighting you as the trader you're going to try to mimic what this algorithm is doing it's looking for the liquidity in the range of 60 days in the past where is the sell stops in the last 60 days where are the buy stops in the last 60 days where are the fair value gaps where's the price gaps that price has not been efficiently delivered in the last 60 days where are the the liquidity voids where price has only been delivered on the upside where it has to come back down to efficiently deliver price"

> "it's absolutely not random it's predetermined it's it's running on a script that refers to specific data points that it will go back to over and over and over again the ipta data range okay. You have a 20 day look back and cast forward range you have a 40 day look back and cast forward range and then you have a 60 day look back and cast forward range"

---

## Prerequisites & Context

> "when we taught or rather when I taught the ipta data ranges okay. Obviously I I asked everyone to hold off sending me emails but some of you were just overzealous and want to know it right now and these are things that are going to be building on your understanding as we go through the mentorship especially through january"

> "I want you to focus when you look at Your daily chart just simply go through and look at the last three months okay. Start whatever whatever time point you're looking at like right now let's assume we sat down with charts right now and this would be the first day we're looking at australian dollar we're a brand new trader brand new to the concept we're sitting down how will we how would we go about looking at where the ifta data ranges are"

> "it's imperative that you understand what they're both doing to get a complete picture you want to be looking at both" [paraphrase: referring to futures and forex contracts]

---

## Structure / Pattern Description

> "you're going to delineate where the most obvious one in the last three months has been then you're going to cast out 20 days go forward from the beginning of the the month that that market structure shift or quarterly shift takes place you're going to count out 20 days"

> "just divide your your daily chart into quarters like put one put a line on march put a line on june and september december and just keep doing that your your eye will go right to where these quarterly shifts are happening they're not going to always occur on those months there's a little bit of gray area which is the reason why we have a look back and cast forward"

> "the algorithm will look back 60 days and it'll find it's very easy if you if you know anything about computer programming and you don't even have to do that but just look at this first of november if you look back 60 days in the past what was the highest high in the last 60 days there's going to be buy stops above that high what's the lowest low in the last 60 days there's going to be sell stops below that low in the last 40 days what was the last highest high and what was the last lowest low looking back in the range"

> "what happens if there's a low that's really really obvious that's just outside the range of 60 days that's the farthest extreme that's when the open float will move aggressively and go outside that normal parameter of 60 days and you'll see that big run the market will jump and skip right down into that old low that's just outside that 60 day range"

> "you go forward count forward 60 days you can literally go on your daily chart in MT4 and change your date 60 days forward to make a vertical line and that way as price starts to paint you'll know you're approaching that 60 day"

> "the if the data ranges give you a means of looking back 20 40 and 60 days from specific days and specific price points because then you'll know what stops they're going to be reaching for above the old high and below an old low"

---

## Rules & Conditions

> "every three months there's going to be something like this occurring it could be a sell-off creating a high or it could be a a low where it starts to rally but every three months I want you to look at your charts and anticipate finding that"

> "you have to have these data points to know why the market's going to go at an old low what old low well where's the lowest low in the last 20 days where's the last 40 days where's the lowest low in that range where's the highest high in that last range and you need to be noting those because that's the one that they're going to run they're going to run rate for those"

> "if everything's been wiped out above and below the marketplace in other words the open float all the buy stops above old highs and all the sell stocks below all those in the last 68 darn your look back in other words everything to the left of that november vertical line at red line if everything's been cleaned out above and below the highs and lows there's no more buy stops there's no more sell stops it has to create a new expansion so you have to identify what the next high and low outside that range of 60 days looking back where that is and that's going to tell you where they're going to draw a price"

> "it's more it's more confirmed when you start applying it to the weekly chart in The monthly chart because you'll start seeing things align where that old low that's just outside of the last 60 days"

**Stated rules:**
1. Find the most obvious quarterly market structure shift in the last three to four months [paraphrase]
2. Roll back to the first day of the month in which that shift occurred [paraphrase]
3. Count back 20, 40, and 60 trading days from that anchor to identify the highs and lows where stops reside [paraphrase]
4. Cast forward 20, 40, and 60 trading days — expect a significant move within that window [paraphrase]
5. If all stops within 60 days have been cleared, look outside 60 days for the next significant high or low [paraphrase]

---

## Psychology & Logic

> "if the market really is influenced or controlled by smart money or if there is what I'm telling you there's an algorithm that controls what price is going to do it's absolutely not random it's predetermined"

> "how can a computer program know where everyone's stop is it has to have a range of data now just because we have the the numbers of price the value of price okay. They have to have a look back period the look pack period is 20 days 40 days and 60 days"

> "the algorithm just permits the price to move to that level which gives the opportunity for the traders to execute on that run that's the real story"

> "it has to be a computer program that refers to specific data points that it will go back to over and over and over again" [paraphrase: describing what led speaker to the IPDA discovery]

---

## Session & Time Context

> "by looking at the market structure shift that takes place in this november time period we are in instance saying that this is a quarterly shift therefore because of the daily chart this is going to give us insight about what the market should do on a three-month timeline as much as six months but I like to just remind you that I'm only really looking for about three months horizon time horizon"

> "I'm really accurate in about four to six weeks time horizon and it's about the half-life of a three-month cycle"

---

## Cross-References

- **Quarterly Market Shift** — "the quarterly effect comes in to operation at that moment okay. Where our eyes go immediately back to november because you can clearly see it"
- **Open Float** — "that's when the open float will move aggressively and go outside that normal parameter of 60 days and you'll see that big run"
- **Liquidity Pools** — "you'll know what stops they're going to be reaching for above the old high and below an old low" — the liquidity pools inside 20/40/60 day ranges
- **Order Block** — speaker identifies a bullish order block at the last down candle before the AUD rally in example [paraphrase]
- **Open Interest** — "if open interest has a 15 or more drop or change lower like it does here this is extended this is a very significant drop while price is sideways this is bullish"

---

## Key Quotes Index

- `(11:43)` — "ipta is the interbank price delivery algorithm"
- `(16:34)` — "the ipta data range okay. What it's really doing is it's highlighting you as the trader you're going to try to mimic what this algorithm is doing it's looking for the liquidity in the range of 60 days in the past"
- `(25:48)` — "the algorithm will look back 60 days and it'll find...the last 40 days...the last 20 days where's the highest high and the lowest low"
- `(28:28)` — "what happens if there's a low that's really really obvious that's just outside the range of 60 days that's the farthest extreme that's when the open float will move aggressively"
- `(31:31)` — "you have to have these data points to know why the market's going to go at an old low what old low well where's the lowest low in the last 20 days"
- `(45:20)` — "the if the data ranges give you a means of looking back 20 40 and 60 days from specific days and specific price points because then you'll know what stops they're going to be reaching for above the old high and below an old low"
- `(55:50)` — "if open interest has a 15 or more drop or change lower like it does here this is extended this is a very significant drop while price is sideways this is bullish"
- `(59:58)` — "Last 20 days where is the gaps where are the gaps in the last 40 days where is the gaps in the last 60 days that's where all your fair value levels are"

---

## Timeline

### `(0:06)` — Introduction: Australian Dollar IPDA Data Range Example
> "All right guys we're going to be looking at a ipta data range example and we'll be focusing on the australian dollar"

- Speaker references price run on AUD and explains he will break down why levels were expected to be hit [paraphrase]

### `(0:42)` — How to Use the Daily Review Charts
> "Daily reviews I'm taking you basically to the points at which I'm drawing my attention to on my own journal how I have reference points on my own charts"

- Students should print charts, date them, track how long it takes for anticipated levels to be reached [paraphrase]

### `(2:29)` — The Lesson of Waiting
> "There's a submission to time that's required and unfortunately we gloss over that many times even as educators like myself it's hard to communicate what's required in terms of having to wait for that thing to unfold"

- Speaker says most educators show only hindsight examples without communicating the waiting required [paraphrase]

### `(6:06)` — AUD Futures Chart Setup; Futures vs. Forex
> "if we're going to be trading forex okay. It's it's really important that you know that you can get a lot of insight just by studying the underlying futures price"

- Speaker shows March 2017 AUD futures contract daily chart [paraphrase]
- Emphasizes most retail forex traders never look at the underlying futures contract [paraphrase]

### `(10:01)` — How to Find the Quarterly Market Structure Shift
> "every three months there's going to be something like this occurring it could be a sell-off creating a high or it could be a a low where it starts to rally"

- Speaker points to November 2016 as the most obvious quarterly shift on the AUD daily chart [paraphrase]
- If everyone in the room were asked to identify the most obvious shift, they would all agree [paraphrase]

### `(11:43)` — IPDA Definition; November 2016 Shift Identified
> "ipta is the interbank price delivery algorithm that's for your notes again you're going to delineate where the most obvious one in the last three months has been then you're going to cast out 20 days"

- The shift in November occurred when buy stop liquidity above equal highs was taken out [paraphrase]

### `(16:34)` — How to Apply the 20/40/60-Day Ranges
> "the ipta data range okay. What it's really doing is it's highlighting you as the trader you're going to try to mimic what this algorithm is doing it's looking for the liquidity in the range of 60 days in the past where is the sell stops in the last 60 days where are the buy stops in the last 60 days"

> "just divide your your daily chart into quarters like put one put a line on march put a line on june and september december and just keep doing that your your eye will go right to where these quarterly shifts are happening"

### `(18:09)` — Three-Month Time Horizon
> "I like to just remind you that I'm only really looking for about three months horizon time horizon that far out I don't like to look beyond that"

> "I'm really accurate in about four to six weeks time horizon and it's about the half-life of a three-month cycle"

### `(25:41)` — Exercise Instruction: Study All Currency Pairs This Evening
> "I want you to spend your time this evening okay. And even tomorrow while we're not doing any live session go back through your charts and don't just look at the australian dollar look at every currency pair look at every commodity look at individual stocks look at indices"

### `(25:48)` — Algorithm's Lookback Process Explained
> "the algorithm will look back 60 days and it'll find it's very easy if you if you know anything about computer programming and you don't even have to do that but just look at this first of november if you look back 60 days in the past what was the highest high in the last 60 days there's going to be buy stops above that high"

### `(28:28)` — When Stops Are Outside the 60-Day Range
> "what happens if there's a low that's really really obvious that's just outside the range of 60 days that's the farthest extreme that's when the open float will move aggressively and go outside that normal parameter of 60 days and you'll see that big run"

### `(29:42)` — Cast Forward with Vertical Lines in MT4
> "you go forward count forward 60 days you can literally go on your daily chart in MT4 and change your date 60 days forward to make a vertical line and that way as price starts to paint you'll know you're approaching that 60 day"

### `(31:31)` — Summary: 20/40/60 Ranges and Direction
> "you have to have these data points to know why the market's going to go at an old low what old low well where's the lowest low in the last 20 days where's the last 40 days where's the lowest low in that range where's the highest high in that last range and you need to be noting those"

### `(33:07)` — Weekly and Monthly Confirmation
> "it's more it's more confirmed when you start applying it to the weekly chart in The monthly chart because you'll start seeing things align where that old low that's just outside of the last 60 days"

### `(35:20)` — AUD Example: 40-Day Cast Forward, 71.50 Level
> "this is the look forward okay. Or cast forward of november this is 20 days out from the 1st of november so we have 20 days here inside of that 20 day range there's going to be a significant setup that you can use for your trading"

- Price made a significant low at 71.50 approximately 40 days forward from November 1 [paraphrase]

### `(39:15)` — Identifying the 40-Day Period Shift
> "every three months this occurs write this down your notepad...every three months this pattern occurs where you're at a support level"

- Not necessarily on the exact 40th day; could be the 19th or 21st day but within the range [paraphrase]

### `(44:59)` — Cast Forward from New Turning Point
> "by having this on your chart you'll be able to look backwards and forwards and looking for the ranges just like the ipta algorithm will look for where the most recent 20 day 40 day and 60 day stops are"

### `(45:20)` — Summary: What IPDA Data Ranges Provide
> "the if the data ranges give you a means of looking back 20 40 and 60 days from specific days and specific price points because then you'll know what stops they're going to be reaching for above the old high and below an old low it's not just well I'm looking for the most recent obvious high and low no no no no it's not like that at all"

### `(46:16)` — AUD Candlestick Chart; 71.50 Weekly Support
> "why is that significant here we have a old low back in february of 2016...price hits this 70 150 level it's been down here before and they repelled aggressively away from that"

### `(47:54)` — Weekly Chart Order Block Analysis
> "on a weekly basis and then moved out once we moved out away from that level you'd see that they're going to be looking to do what they're going to be trading above these candles bodies and the wicks are next and we could potentially trade up into this last up candle in the last week of october of 2016. That's where the bearish order block is"

### `(54:43)` — Open Interest Introduction; Major Support at 71.50
> "if you see an expectation that price should be bullish we have been trading lower and we hit the level like we're seeing here at 71.50 as we just...I want you to look at what was going on as price was dropping down"

### `(55:50)` — Open Interest Declining Is Bullish Signal
> "larry williams says when open interest drops while you're in consolidation...if open interest has a 15 or more drop or change lower like it does here this is extended this is a very significant drop while price is sideways this is bullish"

> "open interest reflects the selling side of a provider of liquidity if this open interest declines aggressively like this that's indicating they do not want to hold the heavy short position they would be having by being a provider for those that want to buy australian dollar"

### `(59:58)` — Summary: Using IPDA Ranges on All Asset Classes
> "Last 20 days where is the gaps where are the gaps in the last 40 days where is the gaps in the last 60 days that's where all your fair value levels are think about it what's where's the consolidations in the last 20 days the last 40 days in the last 60 days that's where your equilibrium price points are going to be"

> "every single month a calendar month put put a vertical line on at every new month go back 60 days find the highest high and lowest low and you see if they don't wipe that out you can take any pair you can be the dollar index"

### `(1:03:52)` — Weekly Support, Open Interest Reset, And AUD Upside Path
> "that's the central bank getting rid of any of their remaining short position so now they're they're done they completed their cell program"

- The weekly `71.50` support and the collapse in open interest are used together to argue that the bearish program has been completed [paraphrase]
- Speaker then maps the bullish order block and the equal highs he expects AUD to trade through next [paraphrase]

### `(1:22:56)` — Time And Price On The Higher Time Frame
> "it's all time and price time and price time is date on the higher time frame it's not time of day it's date calendar days"

- The lecture shifts from the AUD example into broader application across higher-time-frame analysis [paraphrase]
- Speaker reiterates that the 20/40/60-day lookback gives the highs and lows the algorithm is likely to reach for [paraphrase]

### `(1:34:06)` — Reusing The Same Range Logic In Daily Analysis
> "there's a range I'm looking for it's 20 days back 40 days back 60 days back then I'm casting forward"

- The closing emphasis is that this same range logic should replace reactive opinion-chasing on daily direction [paraphrase]
- Future lessons are framed as repeated applications of the same 20/40/60-day range and cast-forward process [paraphrase]
