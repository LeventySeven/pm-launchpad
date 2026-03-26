begin;

create table if not exists public.community_markets (
  community_id uuid not null references public.communities(id) on delete cascade,
  market_id uuid not null references public.markets(id) on delete cascade,
  added_by uuid not null references public.users(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (community_id, market_id)
);

create index if not exists community_markets_market_id_idx
  on public.community_markets (market_id);
create index if not exists community_markets_community_id_idx
  on public.community_markets (community_id);

alter table public.community_markets enable row level security;

-- Public read
create policy "community_markets_select_all"
  on public.community_markets for select using (true);

-- Authenticated users can add markets (membership check at service level)
create policy "community_markets_insert_authenticated"
  on public.community_markets for insert
  with check (added_by = auth.uid());

-- Adder can remove their own additions
create policy "community_markets_delete_own"
  on public.community_markets for delete
  using (added_by = auth.uid());

grant select on table public.community_markets to anon;
grant select on table public.community_markets to authenticated;
grant all on table public.community_markets to service_role;

-- Trigger to maintain market_count on communities
create or replace function public.update_community_market_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.communities set market_count = market_count + 1 where id = NEW.community_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.communities set market_count = greatest(0, market_count - 1) where id = OLD.community_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_community_markets_count on public.community_markets;
create trigger trg_community_markets_count
  after insert or delete on public.community_markets
  for each row execute function public.update_community_market_count();

commit;
