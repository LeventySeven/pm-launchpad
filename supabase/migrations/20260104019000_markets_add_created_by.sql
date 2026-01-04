alter table public.markets
  add column if not exists created_by uuid;

do $$
begin
  -- Add FK if it doesn't exist (safe-ish block).
  if not exists (
    select 1
    from pg_constraint
    where conname = 'markets_created_by_fkey'
  ) then
    alter table public.markets
      add constraint markets_created_by_fkey
      foreign key (created_by)
      references public.users(id)
      on delete set null;
  end if;
end
$$;

create index if not exists markets_created_by_idx
  on public.markets(created_by);


