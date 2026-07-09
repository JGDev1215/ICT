# Supabase Auth Signup Fix Guide

> Status: Historical
> Last reviewed: 2026-07-09
> Source of truth: No


## Issue

End-to-end testing showed that Focus Card sync worked after a Supabase Auth user existed, but the app did not expose a user-facing account creation path. Testing also showed authenticated reload/session restore could trigger overlapping sync work, making the browser automation appear stalled.

## Fix Plan

1. Add a `Create account` action to the Profile Supabase panel.
2. Use `supabase.auth.signUp({ email, password, options: { emailRedirectTo } })` with a `#profile` redirect.
3. Show a clear confirmation message when Supabase requires email confirmation.
4. Keep `Login and sync` as the path that merges local cards with server cards after confirmation.
5. Prevent sync overlap on authenticated startup by allowing the queued local changes to flush during session restore.
6. Keep browser localStorage as the immediate source of truth while signup/login is pending.
7. Bump cache-busted asset URLs and the service worker cache name.
8. Update smoke tests for signup UI, signup API binding, and session-restore queue flushing.

## Acceptance Checks

- Profile shows Email, Password, `Login and sync`, `Create account`, and `Retry sync`.
- Creating an account with email confirmation enabled shows a confirmation-required message.
- Confirmed users can login and see `Connected`.
- Pending local cards sync to `public.focus_cards` after login.
- Reloading an authenticated session does not block queued local changes from flushing.
- Manual JSON export/import and local-only save behavior remain available.

## Operational Notes

- Supabase email confirmation is enabled by default on hosted projects. Users may need to confirm the email before login.
- The app must not expose a service-role key. The browser uses only the publishable key.
- RLS remains the enforcement layer for card ownership.
