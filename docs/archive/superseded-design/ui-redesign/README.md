# ICT Sweep Tracker Mobile UI Redesign

> Status: Superseded
> Last reviewed: 2026-07-09
> Source of truth: No


> Current-status note — 2026-07-08: this folder is retained as historical design and implementation context. The live app contract is in the root README, CHANGELOG, smoke tests, and Playwright tests.

This folder contains the implementation plan and agent workpack for bringing the uploaded mobile UI design to life in the ICT Sweep Tracker project.

## Source design

The source UI canvas is the uploaded file:

```text
ICT Sweep Tracker.dc(2).html
```

It defines:

- A light-mode premium mobile design system.
- A Manrope typography direction.
- A soft off-white canvas and white card system.
- Primary blue, confirmed green, warning orange, invalidation red, charcoal text, and soft grey surfaces.
- Nine mobile screens:
  1. Market Focus Home
  2. AI Trade Plan Builder
  3. Focus Card Details
  4. Saved Focus Cards
  5. Execution Timeline
  6. Liquidity Map / Setup Library
  7. Risk Tracker
  8. Trade Journal
  9. Trader Profile / Settings

## Documentation map

| File | Purpose |
| --- | --- |
| `01-implementation-plan.md` | Senior developer implementation roadmap, phases, sequencing and risks. |
| `02-design-system-spec.md` | Design tokens, layout rules, reusable components and interaction standards. |
| `03-screen-specs.md` | Screen-by-screen functional mapping from design to app behaviour. |
| `04-agent-workstreams.md` | Work split for multiple agents, dependencies and acceptance criteria. |
| `05-agent-prompt-pack.md` | Copy-ready prompts for Codex / coding agents. |
| `06-build-plan-gap-review.md` | Review of the attached build plan against this implementation pack, including missed items and updated priorities. |

## Implementation principle

Do **not** rebuild the whole app blindly. The current project is a static browser app using localStorage. Preserve working behaviour first, then progressively replace the visual layer.

Target approach:

1. Stabilise state and data model.
2. Add a component-based vanilla JavaScript UI layer.
3. Introduce the new design system tokens.
4. Rebuild the core screens one at a time.
5. Preserve migration/export/import compatibility.
6. Add smoke tests before visual expansion.

## Definition of done

The redesign is complete when:

- Existing saved-card data still loads.
- The planner still supports instrument, bias, validation, invalidation, DOL stack, sweep stack and FVG.
- Saved cards can still be reviewed, copied, edited, final-saved, deleted, exported and imported.
- The new UI is responsive on mobile-first widths and usable on desktop.
- Smoke tests cover navigation, saving, final-save analytics, export/import and key screens.
- No feature presents trade signals or financial advice.
