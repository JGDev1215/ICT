# Intraday Order Flow and Daily Range Framework

> **Source:** 2022 ICT Mentorship Episode 5 | ICT (Inner Circle Trader) | Duration: 46:04
> **Concepts covered:** Daily range setup, intraday order flow, morning session, afternoon session, New York lunch hour, liquidity matrix, Fair Value Gaps
> **ICT Bible status:** New entry

---

## Definition

> "Everything in this lecture is going to be predominantly around teaching you the elements of the e-mini, setting up your daily range and your intraday layouts."

> "The idea of the afternoon session—I wasn't going to teach that—but because I see a lot of nonsense on YouTube, I'm going to teach it to you."

---

## Prerequisites & Context

> "These things that I'm teaching today are directly linked to index futures, okay, like S&P, NASDAQ, and the Dow."

- [paraphrase] When you're looking at futures, especially the index futures, these contracts trade with expiration dates.

---

## Structure / Pattern Description

**Daily framework structure:**

- [paraphrase] Your daily range on an intraday basis, all set up and laid out. So these are your boundaries: your morning trade is between 8:30 in the morning (why? because there's news events that come out at 8:30) all the way to noon.

**Three session structure:**

1. [paraphrase] **Morning (8:30-11:00 AM)** — Initial move based on overnight developments and news
2. [paraphrase] **Lunch (Noon-1:00 PM)** — No trade zone; consolidation often occurs
3. [paraphrase] **Afternoon (1:30-4:00 PM)** — Continuation or reversal based on morning bias

- [paraphrase] I like 8:30. Okay, you use the opening price here at 8:30. Draw that out in time.

**Liquidity matrix concept:**

- [paraphrase] This here is your range. This is the low of the day and this is the high of the day thus far. So if we take that range and split it from the low to the high to get the midpoint, all this can be determined by a simple 50-level on a Fibonacci.

- [paraphrase] Anything above that 50-level, this is referred to from an algorithmic stance as a premium market. It means it is expensive. Now, markets can stay in a premium for a while and not go to a discount.

**Key elements:**

- [paraphrase] TradingView setup with vertical lines at key times
- [paraphrase] 8:30 opening as start of analysis
- [paraphrase] Noon lunch hour boundary
- [paraphrase] 1:30 afternoon session start
- [paraphrase] 50% equilibrium level for targeting

---

## Rules & Conditions

**Stated rules:**

1. [paraphrase] Set all charts to New York local time (critical)
2. [paraphrase] Do not trade during New York lunch (noon-1:00 PM)
3. [paraphrase] Morning session focus: 8:30-11:00 AM
4. [paraphrase] Afternoon session: 1:30-4:00 PM
5. [paraphrase] Earliest afternoon trade entry: 1:30 PM

> "I don't care who tells you that they can do this and do that. If you're learning from me, just don't trade during that time. Okay, not even in demo because just trust me, don't do it."

- [paraphrase] Everything I'm showing you is directly linked to New York local time. If you do it with any other time frame, you're going to mess up.

---

## Entry / Exit / Trade Management

**Morning entry approach:**

> "I want you to think about how if this day was bullish for you—say you had the benefit of knowing that through analysis—you felt that this was going to go higher. Okay, if that's the case, this swing low here, first swing low, any importance after 1:30."

**Afternoon setup (1:30 PM):**

> "1:30, I'm looking for swing highs and swing lows for the afternoon session. That's what I'm looking for. It's the same context that I use for the morning session."

**Two trade patterns:**

- [paraphrase] Consolidation in the morning session and then it trends in the afternoon higher or lower.

---

## Psychology & Logic

- [paraphrase] Remember those equal lows down here? I was telling you about what's below that? Sell stops. So you want to be taking profits here and or here.

- [paraphrase] You want to find a nice price leg intraday. I'm not promising you how to buy, sell short, buy, sell short, buy, sell short—that's mine, okay?

---

## Session & Time Context (Critical)

- [paraphrase] So it's going to be a complete daily treatise on the entire daily range of indices so that way if your interest is in this asset class, you'll have a far better chance of being successful in my opinion using the information I'm going to give you.

- [paraphrase] These are your three times of the day that I'm looking for specific key highs and kilos. And any intraday high and low forming right before the equities open at 9:30.

**Afternoon acceleration pattern:**

- [paraphrase] There's mechanisms that are built in that help this market really accelerate into the close. If you studied the price action in your lower time frame charts, you'll see that there's a repeating phenomenon at typically around 20 minutes to 4, 10 minutes to 4, and 4:00.

---

## Cross-References

- [paraphrase] **Fair Value Gap** — Used within the daily range framework for targeting
- [paraphrase] **Market Structure** — Foundation for determining daily bias
- [paraphrase] **Swing Points** — Reference points for morning and afternoon sessions
- [paraphrase] **Liquidity Matrix** — The 50% equilibrium and premium/discount concept

---

## Key Quotes Index

- [paraphrase] `(6:57)` — "This is the bellwether time frame."
- [paraphrase] `(9:46)` — "noon to 1:00 in the afternoon New York time—that is a no trade time period"
- [paraphrase] `(16:22)` — "On the daily chart, you're looking for swing highs and swing lows"
- [paraphrase] `(32:03)` — "If you know what your daily bias is"
- [paraphrase] `(35:02)` — "Internal range liquidity"

---

## Timeline

### `(1:57)` — Asset Class Focus
> "These things that I'm teaching today are directly linked to index futures"
- [paraphrase] Scope limitation to ES, NQ, YM
- [paraphrase] Not applicable to other markets

### `(7:44)` — Daily Range Setup
> "So when you're in TradingView or you can do this in your own platform"
- [paraphrase] Setting up boundaries
- [paraphrase] Creating the framework

### `(11:30)` — Session Breakdown
> "The idea of the afternoon session"
- [paraphrase] Morning through close outline
- [paraphrase] No-trade lunch hour

### `(16:22)` — Daily Chart Analysis
- [paraphrase] On the daily chart, you're looking for swing highs and swing lows
- [paraphrase] Primary analysis timeframe
- [paraphrase] Foundation for intraday bias

### `(32:03)` — Daily Bias Application
- [paraphrase] If you know what your daily bias is
- [paraphrase] Using morning data for afternoon
- [paraphrase] Continuation vs reversal logic

### `(33:12)` — So now think about this: I'm thinking that
> "So now think about this: I'm thinking that these stops are in jeopardy because it's too clean. The level's too clean. Straight-line edges in the market they don't tend to stay like that. There's going to be a disruption. The market's been going higher, hasn't it? Yes. There's this pent-up aggression that this market wants to go higher, but it's seeing short-term resistance here. Here it tried it a little bit here, and then retraced inside the lunch hour."

### `(33:44)` — The algorithm reserved the price run until later
> "The algorithm reserved the price run until later in the day. Now watch what happens. This swing low here gets violated right there. See that? That swing low gets violated right there. That small little stop hunt is all that's necessary. That will start what is called a buy program. A buy program is when the algorithms go into the process of spooling. Spooling is where it just continuously keeps offering higher prices. If it's a buy program, it just keeps offering higher prices. It does not matter what the volume is. It does not matter. I don't care who you know worked at the exchange. I don't care. Trust me, when I tell you, if you go through the charts, you're going to see this. Okay, look at the volume that comes in sometimes. It'll be good volume, and another like, why is this happening right? That's your signature. That's how you know that this is being completely manipulated. So if it's being manipulated, doesn't it stand profitable for you to know what it's likely to do? Not if you're going to know it all the time. You're not going to know it. I don't know it all the time. But these things tend to repeat, and if they repeat a majority of the time—not every day, but the majority of time—if these things are in alignment, if they start showing the same fingerprints, it's probably going to pan out."

### `(35:07)` — And then you can start doing long entries
> "And then you can start doing long entries and then hold for the close. Don't get in here and try to trade these little Mickey Mouse moves and worry about them and over-leverage and try to put more contracts on than your account can really weather. Because if you don't know what you're doing, cheap leverage, discount leverage can murder you—can absolutely murder you—especially in these kind of markets. They're very fast markets right now. I'm loving it, but it's very quick, violent volatility. If you don't know what you're doing, you can literally be dismantled very quickly, expediently."

### `(35:58)` — So inside this area, the market creates a
> "So inside this area, the market creates a swing low, runs through this low stop hunt. So the stops below here are what—sell stops. Buy those sell stops. I know it feels scary, but go through your charts and you'll see many examples of this happening. It's the same thing that took place over here: buy the sell stops that are resting below here, and expect this level to be taken out."

### `(36:27)` — Consolidation through lunch. After 1:30 in the afternoon
> "Consolidation through lunch. After 1:30 in the afternoon, wait for a swing low to be violated, and then rally. What if you don't get a swing low that trades below it? What do you look for? Well, you look for a move higher that's sudden displacement higher. Then look for a Fair Value Gap. If it trades back down in the Fair Value Gap, you buy that. There's your two patterns. That's it. That's the only two patterns you need. You don't need 15 different gimmicky names. Okay, you don't need Breakers. You don't need an order block. See how easy that is? Very simple strategy. Very, very simple strategy. You have a trade one way or the other, and the logic has to be there for either one of them to form."

### `(37:14)` — Now, I was not in the E-mini S&P
> "Now, I was not in the E-mini S&P today. I was trading NASDAQ. So let's go over to NASDAQ, and I'm going to save time and not put all the lipstick on the chart. I hope you can allow me that. But here is 1:30. We have a swing low there, and it's basically almost the same low as that one. So what's happening here? What's that? It's trading down below it. See that? Look further to the left. What's that? Fair Value Gap, man. It can't be that easy. It can't be that easy. These relative equal highs—what's above that? Buy side liquidity. Okay, watch. I'm going to drop into a one-minute chart."

### `(38:07)` — Scrub back here to 1:30. And I don't
> "Scrub back here to 1:30. And I don't need to do 20 contracts or 10 contracts to do like a $20,000 day. That's kind of like the flavor of the month right now. If you look at this low and this low here, what are those? They're relative equal lows. So that's going to be viewed as what—support, retail support. They're going to buy those little runs here. They're basically going to chase that. So if you look at this through the scope of below this level, there's sell stops. And you think it's going to go higher, like I believed it was going to go higher today, I want to be buying those stops."

### `(38:57)` — All right, so say you're watching price. It's
> "All right, so say you're watching price. It's meandering through, through, through, and then all of a sudden that swing low forms right there, and we had this low here. We had this sudden drop down. When you see that—if you're watching it on a like a one-minute chart—that's going to look so dynamic, so aggressive. If you're zoomed in, it's going to feel like the floor has just dropped out. But that's exactly what you're looking for: to buy now."

### `(39:42)` — You see, fellas, out there on YouTube, you're
> "You see, fellas, out there on YouTube, you're going to see, by contrast, there are folks out there that are trying to trade you know just a handful of ticks with a lot of contracts. To me, that doesn't make any sense. But if that works for you, did great, okay. But I want you to think about in comparison and by contrast what seems more logical for you to feel it's worth more to pursue in study and learning how to do something like that: where it's risk a lot, put a lot behind the trade, and try to get just a little bit of a move. Or now, this is a demo account, okay, but I did trade live today too. But just for the purposes of teaching the content right there, that low is the lowest candle. It rallies all the way up. And then right here, that was a close."

### `(40:43)` — There's a better way to do this. If
> "There's a better way to do this. If you know what you're looking for, you can be very, very precise about it. You can be dialed in like nobody's business. Like, it is unbelievable in terms of the predictable nature of these markets, especially these markets because they're traded by a lot of institutions and a lot of professional traders. The manipulation that takes place in these markets is still there, but it's not as vulgar or ruthless as it is sometimes in Forex. The inbank markets, man, they can really, really do you dirty quick and more frequently. The futures market, they tend to be a little bit more cleaner, a little bit more predictable, much more nicer in their delivery."

### `(41:38)` — Now, there are times when reports come out
> "Now, there are times when reports come out or something unannounced comes into the world scene and causes volatility. When that occurs, then you'll get that noisy look to price action. Just stand on the sidelines, wait for things to smooth out. It may not be that same trading day. It may require you a day or maybe even a week. Let the markets go back into sync, and then they'll start delivering very nice again. But the main thing I want you to take away is that showing entries like this and exits and stuff—it's not all that much of a big deal. Okay, but it becomes a sticking point, okay, a stumbling block for people that want to try to learn how to do this. Because if you lay it in front of them, they have to have lots of contracts to do something to be profitable in such a small little move. To me, it communicates that that person that's trying to trade like that—whether it's the person that created the system or someone that's trying to learn the system—they really have no idea how price works and how it books. Because if they did, they wouldn't be trying to take these little tiny little micro out of the marketplace. They would be trading like I'm showing you here."

### `(43:03)` — So if you were to think to yourself
> "So if you were to think to yourself, "Hey, I want to know what it's like to be in a move where I can be comfortable, knowing that the daily range is going to unfold and I'm just going to submit to it"—well, these markets offer that. Forex offers it too, but right now in the last couple months, really Forex has been rather funky. Okay, and because of that, we have transitioned to index futures. There are times of the year where I teach index futures trading because they're predominantly more liquid. Or if there's no real topic for me to teach to my paid mentorship group, I'll say I got nothing for you for Forex, and then I'll point to something in futures. It may be a commodity market. Last year, I told everybody: buy the grain market. Say we're going to have a huge bull market boom. They went up. It's a matter of knowing how to navigate the price action, okay. But these markets here (except for the summer months—that being like July and August—those months can be a little hit or miss) but the rest of the year, they tend to be really nice markets."

### `(44:16)` — So if you're looking to have your trading
> "So if you're looking to have your trading business framed on an asset class that is really nice, it's professionally delivered (where it's not like a bucket shop, you know, penny stock type market), these markets are really nice. They're very systematic in the way they do things, and they repeat. But if you don't know what you're looking for or understanding behind these mechanics that I'm outlining here at the very basic level, then you can obviously hurt yourself still."

### `(44:51)` — So right away, I'm showing you that there
> "So right away, I'm showing you that there are times in the day that you want to be looking for setups. You're not trying to do 25 trades. You're not trying to do 30 trades. You're not in there trying to micro scalp. You're looking for the real moves in the morning and the real moves in the afternoon, and preferably, if you get one in the morning, you don't trade in the afternoon. Go to a demo and practice there. Don't give the money back to the marketplace, especially while you're, you know, you're new. Don't do that."

### `(45:18)` — And I'm actually telling you not to trade
> "And I'm actually telling you not to trade with live funds. But I know a lot of you like to see things that are traded with a live account like it's a real account that shows entries and things of that nature. That's the things I'm doing this year. Okay, I'm not going to do it in 2023. I'm not going to do it forever. Okay, I did it so that way my students can feel at ease about it because even in my paid mentorship group, I don't trade live funds there because for my protection, I'm doing what I'm showing you right here in a demo. But I've been showing live account trades this to approve it—it works."

### `(46:01)` — So hopefully you found this insightful, and until
> "So hopefully you found this insightful, and until I'll talk to you on Thursday, be safe."
