# Senior Plan Review

## Plan Quality

The implementation plan is specific enough to execute and correctly limits the work to the requested feature changes, tests, documentation, and QA evidence. It respects the no-build app, local-first storage, manual price fallback, optional Supabase sync, GitHub Pages support, and the prohibition on modularizing `assets/app.js`.

## Missing Steps

- Explicitly preserve `journal` data through normalization, JSON export/import, Supabase payloads, and stored card compatibility while removing all user-facing Journal UI.
- Explicitly handle old `#journal` URLs in both route parsing and route normalization.
- Define a stable persisted R:R ratio field on `riskPlan`.
- Sync mirrored DOL taken checkboxes both ways in the DOM before save.
- Treat production `v0.8.5` verification as release-closure evidence, while the local feature pass becomes `v0.8.6`.
- Record Supabase live QA as credential-dependent if the admin password/session is unavailable.

## Risk Areas

- Broad string removals for `journal` could break stored/exported compatibility.
- Existing tests use broad source-string assertions that must be updated carefully instead of removing storage-contract coverage.
- The desktop sidebar must override bottom-nav body padding, app padding, sticky CTA positioning, and FAB visibility together.
- DOL taken mirrored state can be wrong if one checkbox remains checked while the other is unchecked; active DOM sync is required.
- Production GitHub Issue #7 update is an external write action and should be performed only after confirming scope and using available authenticated tooling.

## Overengineering Concerns

- Do not introduce a framework, build step, or module extraction.
- Do not redesign every screen for desktop. Use a sidebar shell and focused multi-column wrappers only where the detail/dashboard layout benefits.
- Do not create a new storage key or export schema for this feature pass.

## Simpler Alternatives

- Use existing `.tab-bar` markup and CSS media queries to turn it into a sidebar.
- Keep `journal` data model fields but hide/remove user-facing controls.
- Add `ratio` to `riskPlan` and calculate invalidation as derived output rather than adding multiple new fields.
- Add `prefix/index/fieldKey` metadata to price-map levels instead of creating a separate price-map state model.

## Required Amendments

1. Preserve `journal` data in cards and JSON compatibility, but remove Journal from user-facing UI, current README, current tests, text export, and search copy.
2. Make `go('journal')`, direct `#journal`, and any old Journal route resolve to Home.
3. Add `riskPlan.ratio`, using legacy `invalidationPrice` only as a best-effort source for old cards when possible, else defaulting to planned/default ratio.
4. Render R:R target/invalidation/risk/reward as calculated values from entry/current, selected DOL, direction, and ratio.
5. Render editable Price Map DOL taken controls only in Focus Card context, with stable IDs and two-way checkbox sync.
6. Add desktop layout tests and mobile preservation tests.
7. Record production `v0.8.5` evidence separately from local `v0.8.6` changes.

## Decision

APPROVED WITH AMENDMENTS
