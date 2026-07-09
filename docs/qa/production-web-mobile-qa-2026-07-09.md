# Production Web And Mobile-Site QA - 2026-07-09

> Status: Current
> Last reviewed: 2026-07-09
> Source of truth: No

## Scope

Release-risk evidence for deployed v0.8.6 shell visibility, current CI state, production price API behavior, local automated web/mobile-site coverage, and a credential-independent production browser smoke pass.

## Current Commit And CI

Latest local commit:

```bash
git log -1 --oneline
```

Result:

```text
1735654 feat: ship v0.8.6 planner and layout updates
```

GitHub Actions:

```bash
gh run list --repo JGDev1215/ICT --limit 12
```

Result: PASS for the v0.8.6 push on `main`.

- Static smoke test: success
- Browser E2E: success
- Deploy static site to GitHub Pages: success

## Production Shell Checks

Commands:

```bash
curl -sS https://ictict-lake.vercel.app/ | rg -n "ICT DOL Sweep Tracker|v0\.|assets/(app|config)\.js|assets/styles\.css|service-worker|0\.8\."
curl -sS https://jgdev1215.github.io/ICT/ | rg -n "ICT DOL Sweep Tracker|v0\.|assets/(app|config)\.js|assets/styles\.css|service-worker|0\.8\."
```

Results:

- Vercel `https://ictict-lake.vercel.app/`: PASS, title/footer reported `ICT DOL Sweep Tracker v0.8.6`; config, CSS, and app asset keys were `0.8.6-release-20260709`.
- GitHub Pages `https://jgdev1215.github.io/ICT/`: PASS, title/footer reported `ICT DOL Sweep Tracker v0.8.6`; config, CSS, and app asset keys were `0.8.6-release-20260709`.

## Production Price Endpoint

Commands:

```bash
curl -sS -D /tmp/ict-v086-prod-price.headers \
  'https://ictict-lake.vercel.app/api/price?symbol=MNQ' \
  -o /tmp/ict-v086-prod-price.json

curl -sS -D /tmp/ict-v086-prod-price-unsupported.headers \
  'https://ictict-lake.vercel.app/api/price?symbol=NOTAREALICTSYMBOL' \
  -o /tmp/ict-v086-prod-price-unsupported.json
```

Results:

- Supported symbol `MNQ`: PASS. HTTP 200 returned `symbol: MNQ`, `yfSymbol: MNQ=F`, numeric `price`, `source: yfinance`, `cached: false`, and a UTC timestamp.
- Unsupported symbol `NOTAREALICTSYMBOL`: PASS. HTTP 400 returned `error: unsupported symbol`, the requested symbol, and a supported-alias list.

## Local Automated Web/Mobile-Site QA

Commands:

```bash
npm test
npm run test:e2e -- --reporter=dot
```

Results:

- `npm test`: PASS. Smoke, unit, and API boundary tests passed.
- `npm run test:e2e -- --reporter=dot`: PASS. 65 passed, 1 skipped. The skipped case is the existing Playwright WebKit offline reload limitation.

Coverage recorded by local automation:

- Mobile widths 390px and 430px keep bottom navigation and Planner sticky actions usable.
- Desktop width uses left sidebar navigation and labeled New analysis action.
- Home, Planner, Saved, Focus Card, Timeline, Liquidity Map, Risk, Profile, and Component Gallery routes render.
- Legacy `journal` route redirects to Home and no Journal nav item renders.
- Focus Card create/save/reload flows remain covered.
- Clear-device behavior remains local-only and clears local sync metadata.
- JSON import/export UI remains available.
- Manual price fallback remains available when auto-detect fails.
- Price Map DOL taken and DOL Stack DOL taken controls mirror one saved state.
- Potential R:R derives invalidation/stop from current/entry, selected DOL, direction, and ratio.
- Chromium offline service-worker shell reload remains covered; WebKit offline reload remains skipped as previously documented.

## Production Browser Smoke

A one-off Playwright smoke was run against the deployed sites without server writes. It cleared only the isolated test browser's localStorage/sessionStorage.

Covered:

- Vercel v0.8.6 home renders.
- Vercel desktop New analysis action renders.
- Vercel mobile primary nav renders.
- Vercel mobile Planner renders.
- GitHub Pages v0.8.6 home renders.
- GitHub Pages desktop New analysis action renders.
- GitHub Pages mobile primary nav renders.
- GitHub Pages mobile Planner renders.
- Vercel Planner creates a Focus Card from complete inputs.
- Vercel Focus Card details and Price Map Dashboard render.
- Vercel Focus Card persists after reload.
- Vercel final-save succeeds after choosing a non-Open outcome.
- Vercel Saved route renders and shows the saved `MNQ` card.

Result: PASS.

## Supabase Credential-Independent Checks

These checks do not prove authenticated cloud sync, but they verify the production project is reachable, anonymous writes are blocked by RLS, and the deployed app keeps backup optional when signed out.

Commands:

```bash
node <inline Supabase REST probe>
node <inline Playwright Profile signed-out smoke>
```

Results:

- Supabase Auth settings endpoint: PASS, HTTP 200.
- `focus_cards` anon select: PASS, HTTP 200 with no visible rows in anon context.
- `user_settings` anon select: PASS, HTTP 200 with no visible rows in anon context.
- `focus_cards` anon insert: PASS, HTTP 401 with Postgres code `42501`, `new row violates row-level security policy for table "focus_cards"`.
- `user_settings` anon insert: PASS, HTTP 401 with Postgres code `42501`, `new row violates row-level security policy for table "user_settings"`.
- Production Profile signed-out Account & Backup smoke: PASS. The Profile page shows signed-out backup copy, local Planner draft save works without login, and Clear this device data clears local cards after warning that cloud backup is not deleted.

These checks support the safety of optional backup in signed-out/local-first mode. They do not confirm the real admin user's password, authenticated merge, upload, reload, or second-browser restore behavior.

## Credential-Dependent QA

Live admin login and Supabase Account & Backup sync/reload were performed against the production Vercel app with the real `admin` account.

Production browser flow:

1. Created a browser-local QA Focus Card while signed out.
2. Signed in from Profile using username `admin`.
3. Confirmed the local card backup queue flushed to Supabase.
4. Reloaded the same browser context and confirmed the backed-up card remained visible.
5. Opened a second clean browser context, signed in as `admin`, and confirmed the card restored from Supabase.
6. Final-saved the card with outcome `Hit` while signed in.
7. Confirmed the Supabase row had `instrument = MNQ-CODEX-QA`, `outcome = Hit`, and `final_saved = true`.
8. Ran Clear this device data and confirmed the dialog warned that cloud backup is not deleted.
9. Opened a third clean browser context, signed in as `admin`, and confirmed the final-saved card restored from Supabase after device-local clear.
10. Deleted the QA card row from Supabase and confirmed no `MNQ-CODEX-QA` QA rows remained.

Result: PASS.

Security note:

Supabase security advisor reports `auth_leaked_password_protection` is disabled. Remediation: <https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection>

## Admin Password Rotation

The deployed `admin@ict.local` Supabase Auth password was rotated after the credentialed QA pass.

Rotation evidence:

- `.env.local` is ignored and untracked; the rotated password was stored there under `ICT_ADMIN_SUPABASE_PASSWORD`.
- The Supabase Auth `encrypted_password` hash for `admin@ict.local` was updated.
- Existing admin refresh token/session state was revoked/deleted where exposed by the Auth schema.
- The previous weak/default password was rejected by Supabase Auth after rotation.
- The rotated password was accepted by Supabase Auth.
- A focused production Account & Backup smoke signed in with the rotated password, backed up a temporary `MNQ-ROTATED-QA` Focus Card, reloaded the page, and restored the card.
- The temporary rotated-password QA row was deleted from Supabase and cleanup was confirmed.

Result: PASS.

## v0.8.7 PIN Login Rotation

The single-user Account & Backup credential was rotated again after the v0.8.7 PIN-login feedback.

Rotation evidence:

- `.env.local` is ignored and untracked; the generated PIN was stored there under `ICT_ADMIN_PIN` and `ICT_ADMIN_SUPABASE_PASSWORD`.
- The Supabase Auth `encrypted_password` hash for `admin@ict.local` was updated.
- Existing admin refresh token/session state was revoked/deleted where exposed by the Auth schema.
- The previous rotated password was rejected by Supabase Auth after the PIN rotation.
- The generated 4-digit PIN was accepted by Supabase Auth.

Security note: this intentionally prioritizes the requested private single-user PIN workflow over password strength. It is not suitable as public multi-user authentication.

Result: PASS.

Remaining security advisor:

- Leaked password protection remains disabled in Supabase Auth. The current connector exposes this advisor but does not expose an Auth config update tool. Enable it from the Supabase Dashboard before moving beyond private/single-user beta if the project plan supports it.

## Deployment Readiness Decision

v0.8.6 is safe for single-user, local-first web deployment where browser storage plus JSON export/import are the primary reliability path and Supabase is optional backup. Credential-independent Supabase checks passed for project reachability, anon RLS write denial, and signed-out optional-backup behavior. Credentialed Supabase Account & Backup QA also passed for sign-in, backup, reload, second-browser restore, final-save sync, clear-device local-only behavior, and cleanup. The deployed admin password has been rotated away from the weak/default value and verified through Supabase Auth plus production UI backup smoke.

Enable Supabase leaked-password protection from the dashboard before public release if the project plan supports it.

## GitHub Issue

GitHub Issue `#7` was closed on 2026-07-09 as superseded by the current production web/mobile-site QA scope. Physical-device/PWA install gates are no longer required by the current repo docs.
