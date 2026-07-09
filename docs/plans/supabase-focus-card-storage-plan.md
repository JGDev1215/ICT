# Supabase Focus Card Storage Plan

## Summary

Supabase is the server-side source of truth for Focus Cards, while browser `localStorage` remains the immediate offline/cache layer. The app loads local cards first, then merges Supabase cards after login by newest `updatedAt`.

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

- Profile includes Supabase login/logout/sync controls.
- Profile includes Supabase account creation. If email confirmation is enabled, the user must confirm email before login.
- Card create/edit/final-save/favorite/delete updates localStorage first.
- If logged in, the app syncs the change to Supabase.
- If offline or unauthenticated, the change is queued locally and retried after login.
- On login, local and remote cards are merged by `id`, keeping the newest `updatedAt`.
- Settings are stored locally and synced to `user_settings` after login.
- JSON export/import remains as manual backup.

## Validation Checklist

- Create one Supabase Auth user manually in the Supabase dashboard.
- Or create an account from Profile and confirm the email before login.
- Confirm the publishable key is present in `index.html` or an injected config script before `assets/app.js`.
- Login from Profile.
- Create a Focus Card and confirm a row appears in `public.focus_cards`.
- Refresh the app and confirm the card reloads.
- Open the app in a second browser, login, and confirm the card appears.
- Edit/final-save/delete a card and confirm Supabase reflects the change.
