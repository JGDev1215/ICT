# Changelog

## v0.8.4 — 2026-07-09

### Fixed

- Changed Profile clearing to an explicit device-local reset that removes local sync metadata without deleting cloud backup or queuing remote deletes.
- Added notice severity so errors and warnings no longer render as success messages.
- Added a persistent screen-reader announcement region for notices and price auto-detect status updates.
- Added JSON import file-read error feedback and soft warnings for mismatched export schemas.
- Skipped the local `127.0.0.1` price-helper fallback on production HTTPS pages to avoid mixed-content noise while preserving manual price entry.
- Updated version/cache process guidance and documented the retained local static-serving fallback in `api/price.py`.

## v0.8.3 — 2026-07-09

### Added

- Added Planner validation that blocks empty/default-only draft saves while still allowing meaningful partial drafts.
- Added Generate Focus Plan validation for required instrument, session, bias, current-price/manual-price acknowledgement, and complete DOL rows.
- Added visible validation for partial DOL/Sweep rows so incomplete rows must be completed or cleared before generation.
- Added clearer price auto-detect status copy for ready, fetching, detected, unavailable, malformed, and unsupported-symbol states.
- Added Playwright coverage for empty Planner blocking, partial draft saving, and mocked price auto-detect success/failure.

### Changed

- Normalized price auto-detect symbols before lookup and validated helper responses before writing current price.
- Preserved manual current-price entry when auto-detect fails.

## v0.8.2 — 2026-07-09

### Changed

- Replaced the technical Profile Supabase panel with a single-user Account & Backup card.
- Changed visible login to username `admin` with a password field, mapped internally to the backing Supabase Auth email `admin@ict.local`.
- Removed visible signup, retry-sync, project URL, and email-confirmation copy from the normal Profile UI.
- Reworded first-sync actions to `Back up local cards` and `Keep on this device`.
- Documented that the static admin login is a convenience gate, not production-grade security.

## v0.8.1 — 2026-07-09

### Fixed

- Fixed first-login Supabase sync stalling in `Signing in to Supabase` until page reload.
- Added startup Supabase user revalidation so stale or deleted-user sessions are forced back to login state.
- Added a first-sync choice before existing browser-local Focus Cards upload to an empty Supabase account.
- Added Profile sync visibility for server-confirmed card count and first-sync decision state.
- Improved signup rate-limit copy so users know Supabase email limits may need retry or SMTP configuration.

## v0.8.0 checklist follow-up — 2026-07-08

### Added

- Added `assets/config.js` for runtime price-helper defaults and included it in static, service-worker, and Vercel deployment paths.
- Added visible price validation for zero/non-positive numeric levels in Planner and Focus Card Details.
- Added a keyboard skip link for Planner sticky actions and guarded the hash router so in-page anchors do not navigate away from the active route.
- Added active Home session filtering so session chips control the visible focus card and metrics.
- Added legacy bias validation/invalidation lines to text export while keeping those fields out of the active Planner/Focus UI.
- Added a Profile beta feedback link to GitHub Issues.
- Added `tools/bump-version.js` for coordinated visible-version, cache-key, service-worker, and docs updates.
- Added Playwright browser E2E coverage for Planner persistence, reload behavior, skip-link keyboard access, and Home session filters on desktop and mobile Chrome.
- Expanded release QA browser coverage to include 390px/430px mobile layouts, mobile Safari/WebKit emulation, cross-screen rendering, filter-chip ARIA state, and Chromium offline service-worker reload.
- Added an MIT `LICENSE`.

### Decisions

- Kept export schema `ict_dol_sweep_export_v7`; no incompatible saved-data shape change was introduced.
- Deferred real screenshot upload/preview and share-as-image because the current metadata-only screenshot field has lower beta risk and the image workflow needs product design.
- Deferred `assets/app.js` modularization because it is high-change-risk for the current static beta and now has stronger smoke plus browser coverage.

## v0.8.0 — 2026-07-08

### Added

- Completed the mobile-first UI redesign with Home, Planner, Saved, Focus Card Details, Timeline, Liquidity Map, Risk Tracker, Journal, and Profile screens.
- Added bottom tab navigation, a global new-plan action on eligible screens, mobile sticky planner CTAs, search/filter controls, favorite support, journal fields, and risk fields.
- Added local settings for default instrument, default session, watchlist, and default planned-risk values.
- Added Market Context to saved cards with Monthly, Weekly, Daily, 4H, 1H, and 15m phase, note, and potential-next-phase fields.
- Added planner time and manual/static current-price capture, plus DOL distance feedback in generated previews and Focus Card Details.
- Added optional local yfinance price-helper support for planner price auto-detect while keeping GitHub Pages manual-only.
- Added Timeframe Used and Taken status to DOL and Sweep stack records, with DOL timeframe required for complete records.
- Added the Price Map ladder visual with a CURRENT PRICE divider, DOL/Sweep rows, signed distance labels, empty/loading/error states, and yfinance/manual price source display.
- Added planner draft autosave/restore and hash-based tab/page routing for refresh and browser back/forward support.
- Added visible planner draft autosave state plus a discard-draft action.
- Added an internal Component Gallery route reachable from Profile for reusable UI state review.
- Added a linked PWA manifest with install icons for installed-app presentation.
- Added a Profile backup reminder that tells beta users to export JSON before clearing browser data or changing devices.
- Expanded smoke coverage for the normalized saved-card shape, route rendering, export/import round trip, import deduplication, invalid import no-op behavior, and final-save analytics boundaries.

### Changed

- Reworked the planner into a deterministic AI-style Trade Plan Builder while keeping the app static, local-only, and educational.
- Reworked saved-card review into a Focus Card Details screen while preserving Save changes, Final save, Copy, Share, Delete, export/import, and final hit-rate behavior.
- Added the current Vercel live domain to the price API CORS allow-list and clarified same-origin Vercel versus static-host price API setup in the README.
- Tightened price parsing so comma-thousands values keep their meaning while malformed, negative, scientific-notation, or ambiguous prices are rejected instead of silently rewritten.
- Improved light/dark contrast, chip touch targets, and the app landmark structure.
- Changed bias copy to “Bias Determination For Session” and added the before-10:30am NY warning that full-day prediction is not supported by this tool.
- Removed Validation of Bias and Invalidation of Bias from the planner and Focus Card Details workflow while preserving legacy data in normalized cards and JSON exports.
- Simplified visible DOL records to Price Level and Draw Rationale while preserving confidence and hit-time compatibility fields in normalized cards and exports.
- Updated DOL/Sweep review displays to show timeframe and taken/not-taken data points.
- Changed the Market Context Phase Map so timeframe inputs are added from a dropdown instead of forcing every timeframe row into the planner.
- Moved DOL Taken confirmation out of the planner and into Focus Card Details review.
- Made sweep confidence and hit time optional detail fields; Complete/Draft status now follows the visible required sweep fields: price level, sweep liquidity, and timeframe.
- Moved the Planner Price Map into a standalone visible ladder card instead of hiding it inside the generated text preview.
- Updated README documentation for the completed mobile UI redesign and remaining QA gaps.

### Notes

- No backend, build system, authentication, or trade-signal service was added.
- Screenshot support remains metadata-only for v1.
- Real-device iOS/Android and PWA/offline behavior still need manual verification beyond the static smoke test.

## v0.7.9 — 2026-07-06

### Added

- Added a Bias thesis panel to the planner with Bullish/Bearish selection.
- Added Validation of bias and Invalidation of bias inputs.
- Added saved-card display support for bias.
- Added Bias validated and Bias invalidated markers on the saved-card review page.
- Added enriched JSON export schema ict_dol_sweep_export_v7.
- Added assets/bias-extension.js and updated the smoke test to cover it.

### Notes

- Bias support is browser-local and educational only.
- The bias extension preserves the existing ict_cards_v078 storage key and stores bias metadata under ict_bias_card_meta_v1.

## v0.7.8 — 2026-07-06

### Fixed

- Restored the main page with Start new analysis, Saved cards, and Liquidity notes actions.
- Restored direct saved-card review pages with verification markers, notes, outcome, copy, load, delete, Save changes, and Final save actions.
- Fixed saved-card final-save analytics so only final-saved Hit/Miss outcomes count in the hit-rate sample.
- Fixed price-level input handling so decimal values and N/A work consistently.
- Added local migration from older storage keys into ict_cards_v078.
- Updated the app entrypoint to assets/app.js with a cache-busting query string.

### Added

- JSON export/import using schema ict_dol_sweep_export_v6.
- Text export for simple backups.
- manifest.webmanifest.
- GitHub Pages workflow.
- Static smoke test and smoke-test workflow.
- .nojekyll for static Pages deployment.

### Documentation

- Updated the live version references to v0.7.8.
- Documented the fixed app workflow, storage key, and deployment support.
