-- Minimal dispute mechanism: bettors can dispute a resolution, community admin can override.

alter table public.markets
  add column if not exists disputed boolean not null default false,
  add column if not exists dispute_reason text,
  add column if not exists dispute_resolved_by uuid references auth.users(id);
