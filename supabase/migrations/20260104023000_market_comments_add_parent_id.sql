alter table public.market_comments
  add column if not exists parent_id uuid null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'market_comments_parent_id_fkey'
  ) then
    alter table public.market_comments
      add constraint market_comments_parent_id_fkey
      foreign key (parent_id)
      references public.market_comments(id)
      on delete set null;
  end if;
end
$$;

create index if not exists market_comments_market_parent_created_at_idx
  on public.market_comments (market_id, parent_id, created_at asc);


