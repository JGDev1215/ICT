# Supabase Focus Card Storage Plan

> Status: Current
> Last reviewed: 2026-07-09
> Source of truth: Yes


## Summary

Supabase is the optional server-side backup/sync store for Focus Cards, while browser `localStorage` remains the immediate source of truth for the running app. The app loads local cards first, then merges Supabase cards after login by newest `updatedAt`.

Project used:

- Supabase project: `ICT`
- Project ref: `cdcqklvvswzipmmvpzaj`
- Public URL: `https://cdcqklvvswzipmmvpzaj.supabase.co`

## Database Objects

Created in Supabase:

- `public.focus_cards`
- `public.user_settings`
- RLS enabled on both tables.
- Authenticated users can only read/write rows where `owner_id = auth.uid()`.
- `authenticated` has explicit Data API grants for the two RLS-protected tables.
- Indexes added for owner/update time, owner/instrument, and owner/outcome.
- `set_updated_at()` trigger maintains `updated_at`.

## Frontend Integration

The app expects Supabase JS v2 before `assets/app.js`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

The app defaults to the ICT project URL, and `index.html` includes the browser-safe publishable key before `assets/app.js` loads:

```html
<script>
window.ICT_SUPABASE_ANON_KEY = 'sb_publishable_YHmZBCKAV7f5fPh9wq2-cQ_XZCUjIR7';
</script>
```

Optional override:

```html
<script>
window.ICT_SUPABASE_URL = 'https://cdcqklvvswzipmmvpzaj.supabase.co';
</script>
```

Do not expose the Supabase service-role key in the frontend.

## Runtime Behavior

- Profile shows a user-facing Account & Backup card, not Supabase implementation details.
- The visible login is single-user admin access: username `admin`, password supplied by the user.
- The frontend maps `admin` to the backing Supabase Auth email `admin@ict.local` unless `window.ICT_ADMIN_SUPABASE_EMAIL` / `adminSupabaseEmail` config overrides it.
- Profile includes login/logout and manual backup controls for the authenticated admin user.
- Card create/edit/final-save/favorite/delete updates localStorage first.
- If logged in, the app syncs the change to Supabase.
- If offline or unauthenticated, the change is queued locally and retried after login.
- On login, local and remote cards are merged by `id`, keeping the newest `updatedAt`.
- Settings are stored locally and synced to `user_settings` after login.
- JSON export/import remains as manual backup.

## Validation Checklist

- Confirm one Supabase Auth user exists and is confirmed: `admin@ict.local` with the deployment password.
- Confirm the publishable key is present in `index.html` or an injected config script before `assets/app.js`.
- Login from Profile with username `admin`.
- Create a Focus Card and confirm a row appears in `public.focus_cards`.
- Refresh the app and confirm the card reloads.
- Open the app in a second browser, login, and confirm the card appears.
- Edit/final-save/delete a card and confirm Supabase reflects the change.
