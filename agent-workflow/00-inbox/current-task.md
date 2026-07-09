# Current Task

## User Task

PLEASE IMPLEMENT THIS PLAN:

Replace the sloppy Supabase/Profile panel with a clean single-user `admin` access experience:

- Replace visible “Supabase Focus Cards” copy with “Account & Backup.”
- Hide Supabase project URL, signup, retry sync, and technical account-copy.
- Use username `admin` and password field in the UI.
- Map `admin` to Supabase email `admin@ict.local` by default.
- Keep Supabase sync internals for server-side Focus Card storage.
- Create/ensure the confirmed Supabase Auth user `admin@ict.local` with password `admin`.
- Update app code, config, README, CHANGELOG, tests, cache/version strings, workflow files.
- Run smoke and local UI checks.
