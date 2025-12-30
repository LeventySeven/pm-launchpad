## Database SQL layout

This repo uses **Supabase CLI migrations** as the deployable source of truth.

### Folders

- `supabase/migrations/`
  - **Deployable migrations** applied to local/remote DB via `supabase db reset` / `supabase db push`.
  - Never edit old migrations after they’ve been applied; create a new one instead.

- `db/functions/`
  - Human-edited **SQL function definitions** (easy to review / copy-paste).
  - When you change anything here, create a **new** migration in `supabase/migrations/` that contains the updated `create or replace function ...`.

- `db/views/`
  - Human-edited **view definitions** (plus grants/revokes).
  - Changes should also be shipped via a new migration.

### Notes

- `supabase/DB_CONTEXT.md` is a generated snapshot of the live `public` schema.
- `supabase/seed.sql` is optional seed data used by `supabase db reset` (kept empty by default).


