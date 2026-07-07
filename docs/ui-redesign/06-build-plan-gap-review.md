# 06 — Build Plan Gap Review

## Verdict

The current UI redesign plan is directionally strong and already covers the major product areas: local-first data, design system, app shell, the 9 target screens, final-save workflow, export/import, QA and multi-agent workstreams.

The attached build plan adds several delivery-level details that should be folded into the agent work before implementation starts.

## Already covered in current plan

| Area | Covered? | Notes |
| --- | --- | --- |
| 9-screen mobile scope | Yes | Current docs include Home, Planner, Focus Card, Saved, Timeline, Liquidity Map, Risk, Journal and Profile. |
| 5-tab shell | Yes | Home, Planner, Saved, Journal and Profile are specified as primary tabs. |
| Local-first storage | Yes | Current docs require localStorage/browser-local data and no backend. |
| Saved-card model | Yes | Current docs define a normalised card shape with bias, validation, invalidation, DOL, sweep, FVG, markers and final-save state. |
| Design tokens/components | Yes | Current docs define palette, typography, cards, buttons, chips, badges and form controls. |
| Draft vs final-save | Yes | Current docs preserve Save changes vs Final save and final-hit-rate logic. |
| Export/import | Yes | Current docs preserve JSON backup and migration. |
| Multi-agent execution | Yes | Current docs split State/Data, Design System, App Shell, Planner, Saved/Focus, Secondary Screens and QA. |

## Gaps / underweighted items from the attached build plan

### 1. Explicit stack decision document

The attached build plan asks for a signed-off technical decision before build starts.

Current docs say to avoid new dependencies and keep the app static unless approved. That is sensible for the current repo, but the agents need an explicit decision record.

Recommendation:

- Add `docs/ui-redesign/00-tech-decision.md` before coding starts.
- Record one of:
  - **Option A:** stay vanilla JS/Web Components for v1.
  - **Option B:** migrate to Preact/React + Vite, with a new build/deploy plan.

Default senior recommendation:

- Stay vanilla/static for v1 because the repo is already GitHub Pages compatible and the user wants fast local-agent implementation.
- Reconsider Preact only after the data model and redesigned screens are proven.

### 2. Component preview / gallery harness

The attached plan includes a component gallery page. The current plan has a design system spec, but not a dedicated preview harness.

Recommendation:

- Add `design-system.html` or `docs/ui-redesign/component-gallery.html`.
- It should render:
  - buttons
  - chips
  - badges
  - cards
  - inputs
  - progress bars
  - timeline nodes
  - empty states

Agent owner:

- Design System Agent.

### 3. Unit-style data fixtures, not only smoke tests

Current docs rely heavily on `tests/smoke.js`. The attached build plan correctly calls for hand-calculated fixtures for create, draft-save, final-save, export, wipe and import.

Recommendation:

- Expand `tests/smoke.js` with deterministic data fixtures.
- Add tests for:
  - final hit rate
  - sample size
  - breakeven count
  - needs-final-save count
  - plan-followed rate
  - export/import round trip
  - migration from older card shapes

Agent owner:

- State/Data Agent and QA Agent.

### 4. PWA installability and offline service worker

Current docs mention static GitHub Pages and optional PWA work. The attached build plan treats PWA as the first launch package.

Recommendation:

Move PWA from optional to planned v1 polish:

- service worker
- app icons
- manifest completeness
- offline cache
- install prompt handling where browser-supported
- iOS Safari home-screen QA
- Android Chrome home-screen QA

Agent owner:

- QA Agent or separate PWA Agent after core screens are stable.

### 5. Safe-area and real-device mobile QA

Current design spec mentions mobile-first and sticky CTAs. The attached build plan is more specific about notch/dynamic-island safe areas and phone home-screen testing.

Recommendation:

Add acceptance criteria:

- iOS Safari: no CTA blocked by safe area.
- Android Chrome: bottom tab and sticky CTA visible.
- PWA home-screen launch works.
- Secondary screens push/pop correctly on phone viewport.

Agent owner:

- App Shell Agent and QA Agent.

### 6. Global floating plus action

The attached build plan specifies a global floating `+` that always starts a new plan. Current docs mention FAB mainly on Saved.

Recommendation:

- Add global FAB rule:
  - Visible on Home, Saved, Journal, Risk and Profile.
  - Hidden or converted to secondary save action on Planner and Focus Card Details.
  - Always starts a new draft plan after confirmation if unsaved draft changes exist.

Agent owner:

- App Shell Agent.

### 7. Silent autosave draft behaviour

Current docs say Save Draft should save incomplete cards. The attached build plan adds a stronger distinction: draft is silent autosave, final-save is deliberate.

Recommendation:

- Add autosave for planner draft state.
- Keep manual Save Draft as visible confirmation if needed.
- Final save should remain deliberate and require outcome.
- Show `Draft saved` quietly, not as a heavy modal.

Agent owner:

- Planner Agent and State/Data Agent.

### 8. Outcome capture as a post-trade ritual

Current docs include outcome on saved-card review. The attached build plan frames post-trade capture as: hit/miss/breakeven + behaviour tags → journal + stats.

Recommendation:

- Add a post-trade review panel to Focus Card Details or Timeline.
- Require outcome before final-save.
- Add behaviour tags:
  - patient
  - chased
  - followed plan
  - invalidated
  - revenge risk
  - work-call distraction
  - early exit
  - held to target

Agent owner:

- Focus Card Agent and Journal Agent.

### 9. Share as image

Current docs include copy/share text. The attached plan mentions shareable text/image.

Recommendation:

- v1: Web Share API text + clipboard fallback.
- v1.1: generate share-card image from Focus Card Details.
- Avoid complex image export until core app is stable.

Agent owner:

- Focus Card Agent, later enhancement.

### 10. Import validation

Current docs say export/import should work. The attached plan specifically calls for validation on import.

Recommendation:

Add import validation rules:

- Reject non-object payloads.
- Accept current and previous schema versions.
- Normalise card fields.
- Deduplicate by `id`.
- Never wipe existing cards unless user explicitly confirms.
- Show import result count.

Agent owner:

- State/Data Agent.

### 11. Screenshot handling decision

Current docs say screenshots are optional. The attached build plan includes screenshots as part of FocusCard / Journal.

Recommendation:

For v1:

- Store screenshot metadata only or use local IndexedDB if images are required.
- Do not base64 large screenshots into localStorage.
- Add clear size limits if screenshots are supported.

Agent owner:

- State/Data Agent and Journal Agent.

### 12. Beta feedback loop

Current docs include QA but not a beta process. The attached build plan includes beta testing with ICT traders.

Recommendation:

Add a release gate:

- Internal smoke test pass.
- Manual iOS/Android pass.
- 3-5 trader beta review.
- Specific feedback focus: plan-building friction, final-save clarity and saved-card review usefulness.

Agent owner:

- QA Agent / Coordinator.

## Revised implementation priorities

### Must add before coding

1. Tech decision doc.
2. Data fixture tests.
3. Import validation rules.
4. Component preview/gallery requirement.
5. Safe-area/mobile QA criteria.

### Should add during build

1. Silent draft autosave.
2. Global FAB behaviour.
3. Outcome + behaviour-tag review ritual.
4. PWA install/offline support.
5. Share text via native Web Share API.

### Later / v1.1

1. Share card as image.
2. Screenshot image storage.
3. Capacitor wrapper for App Store / Play Store.
4. Dark mode.
5. More advanced motion/skeleton loading.

## Agent prompt updates required

### State/Data Agent

Add:

- Create schema versioning decisions.
- Add deterministic fixtures.
- Add import validation.
- Decide localStorage vs IndexedDB for screenshots.

### Design System Agent

Add:

- Build component gallery.
- Check visual parity against design-system panel.

### App Shell Agent

Add:

- Safe-area handling.
- Global FAB.
- PWA shell behaviour.

### Planner Agent

Add:

- Silent autosave.
- Unsaved draft protection.
- Strong draft vs final-save visual distinction.

### Focus Card / Journal Agent

Add:

- Outcome capture ritual.
- Behaviour tags.
- Share text first, image later.

### QA Agent

Add:

- Manual iOS Safari / Android Chrome QA.
- PWA install test.
- Beta checklist.
- Data fixture tests.

## Final senior recommendation

Do not change the whole implementation approach to React/Preact yet. The current repo is small, static and already deployable. The fastest low-risk path is:

1. Keep vanilla/static for v1.
2. Introduce a proper state module and component helper layer.
3. Build the design system and component gallery.
4. Rebuild screens progressively.
5. Add PWA/offline support before beta.
6. Revisit framework migration only if vanilla code becomes hard to maintain.
