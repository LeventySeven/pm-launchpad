-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  MERGED MIGRATION: 20260327000100 through 20260328001000               ║
-- ║  Run this in Supabase SQL Editor (single execution)                    ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

begin;

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 1: Missing indexes (20260327000100)
-- ═══════════════════════════════════════════════════════════════════════════

create index if not exists positions_user_id_idx
  on public.positions (user_id);

create index if not exists trades_user_id_created_at_idx
  on public.trades (user_id, created_at desc);

create index if not exists wallet_transactions_user_id_created_at_idx
  on public.wallet_transactions (user_id, created_at desc);

create index if not exists wallet_transactions_kind_user_id_idx
  on public.wallet_transactions (kind, user_id)
  where kind in ('trade', 'payout', 'fee');

create index if not exists market_price_candles_market_id_idx
  on public.market_price_candles (market_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 2: Aggregate market volumes RPC (20260327000200)
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function public.aggregate_market_volumes(market_ids uuid[])
returns table (market_id uuid, total_volume_minor bigint)
language sql
stable
security definer
as $$
  select
    c.market_id,
    coalesce(sum(c.volume_minor), 0)::bigint as total_volume_minor
  from public.market_price_candles c
  where c.market_id = any(market_ids)
  group by c.market_id;
$$;

grant execute on function public.aggregate_market_volumes(uuid[]) to anon;
grant execute on function public.aggregate_market_volumes(uuid[]) to authenticated;
grant execute on function public.aggregate_market_volumes(uuid[]) to service_role;

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 3: Optimize comments view (20260327000300)
-- ═══════════════════════════════════════════════════════════════════════════

drop view if exists public.market_comments_public;

create view public.market_comments_public
with (security_barrier = true)
as
select
  c.id,
  c.market_id,
  c.user_id,
  c.parent_id,
  c.body,
  c.created_at,
  coalesce(u.display_name, u.username) as author_name,
  u.username as author_username,
  coalesce(u.avatar_url, u.telegram_photo_url) as author_avatar_url,
  coalesce(lc.cnt, 0)::int as likes_count
from public.market_comments c
join public.users_public u on u.id = c.user_id
left join lateral (
  select count(*)::int as cnt
  from public.market_comment_likes l
  where l.comment_id = c.id
) lc on true;

revoke all on public.market_comments_public from public;
grant select on public.market_comments_public to anon;
grant select on public.market_comments_public to authenticated;
grant select on public.market_comments_public to service_role;

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 4: User follows (20260328000100)
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.user_follows (
  follower_id uuid not null references public.users(id) on delete cascade,
  following_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint no_self_follow check (follower_id != following_id)
);

create index if not exists user_follows_follower_id_idx
  on public.user_follows (follower_id);
create index if not exists user_follows_following_id_idx
  on public.user_follows (following_id);

alter table public.user_follows enable row level security;

create policy "user_follows_select_all"
  on public.user_follows for select using (true);
create policy "user_follows_insert_own"
  on public.user_follows for insert
  with check (follower_id = auth.uid());
create policy "user_follows_delete_own"
  on public.user_follows for delete
  using (follower_id = auth.uid());

grant select on table public.user_follows to anon;
grant select on table public.user_follows to authenticated;
grant all on table public.user_follows to service_role;

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 5: User follow counts (20260328000200)
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.users
  add column if not exists follower_count integer not null default 0,
  add column if not exists following_count integer not null default 0;

create or replace function public.update_follow_counts()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.users set following_count = following_count + 1 where id = NEW.follower_id;
    update public.users set follower_count = follower_count + 1 where id = NEW.following_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.users set following_count = greatest(0, following_count - 1) where id = OLD.follower_id;
    update public.users set follower_count = greatest(0, follower_count - 1) where id = OLD.following_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_user_follows_counts on public.user_follows;
create trigger trg_user_follows_counts
  after insert or delete on public.user_follows
  for each row execute function public.update_follow_counts();

update public.users u set
  follower_count = (select count(*) from public.user_follows where following_id = u.id),
  following_count = (select count(*) from public.user_follows where follower_id = u.id);

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 6: Communities table (20260328000300)
-- ═══════════════════════════════════════════════════════════════════════════

do $$ begin
  create type public.community_privacy as enum ('public', 'private');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.community_role as enum ('creator', 'moderator', 'member');
exception when duplicate_object then null;
end $$;

create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null check (char_length(name) >= 1 and char_length(name) <= 100),
  description text check (description is null or char_length(description) <= 2000),
  banner_url text,
  privacy community_privacy not null default 'public',
  category text,
  created_by uuid not null references public.users(id) on delete cascade,
  member_count integer not null default 0,
  market_count integer not null default 0,
  total_volume_minor bigint not null default 0,
  importance_score real not null default 0,
  search_tsv tsvector generated always as (
    to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(description, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists communities_slug_idx on public.communities (slug);
create index if not exists communities_category_idx on public.communities (category) where category is not null;
create index if not exists communities_importance_idx on public.communities (importance_score desc);
create index if not exists communities_search_idx on public.communities using gin (search_tsv);
create index if not exists communities_created_by_idx on public.communities (created_by);

alter table public.communities enable row level security;

create policy "communities_select_public"
  on public.communities for select using (privacy = 'public');
create policy "communities_insert_authenticated"
  on public.communities for insert
  with check (created_by = auth.uid());
create policy "communities_update_creator"
  on public.communities for update
  using (created_by = auth.uid());

grant select on table public.communities to anon;
grant select on table public.communities to authenticated;
grant all on table public.communities to service_role;

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 7: Community members (20260328000400)
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.community_members (
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role community_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

create index if not exists community_members_user_id_idx
  on public.community_members (user_id);
create index if not exists community_members_community_id_role_idx
  on public.community_members (community_id, role);

alter table public.community_members enable row level security;

create policy "community_members_select_all"
  on public.community_members for select using (true);
create policy "community_members_insert_own"
  on public.community_members for insert
  with check (user_id = auth.uid());
create policy "community_members_delete_own"
  on public.community_members for delete
  using (user_id = auth.uid());

grant select on table public.community_members to anon;
grant select on table public.community_members to authenticated;
grant all on table public.community_members to service_role;

create or replace function public.update_community_member_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.communities set member_count = member_count + 1 where id = NEW.community_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.communities set member_count = greatest(0, member_count - 1) where id = OLD.community_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_community_members_count on public.community_members;
create trigger trg_community_members_count
  after insert or delete on public.community_members
  for each row execute function public.update_community_member_count();

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 8: Community markets (20260328000500)
-- ═══════════════════════════════════════════════════════════════════════════

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

create policy "community_markets_select_all"
  on public.community_markets for select using (true);
create policy "community_markets_insert_authenticated"
  on public.community_markets for insert
  with check (added_by = auth.uid());
create policy "community_markets_delete_own"
  on public.community_markets for delete
  using (added_by = auth.uid());

grant select on table public.community_markets to anon;
grant select on table public.community_markets to authenticated;
grant all on table public.community_markets to service_role;

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

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 9: Community views (20260328000600)
-- ═══════════════════════════════════════════════════════════════════════════

drop view if exists public.communities_public;

create view public.communities_public
with (security_barrier = true)
as
select
  c.id,
  c.slug,
  c.name,
  c.description,
  c.banner_url,
  c.privacy::text as privacy,
  c.category,
  c.member_count,
  c.market_count,
  c.total_volume_minor,
  c.importance_score,
  c.created_at,
  c.created_by,
  coalesce(u.display_name, u.username) as creator_name,
  coalesce(u.avatar_url, u.telegram_photo_url) as creator_avatar_url
from public.communities c
join public.users u on u.id = c.created_by
where c.privacy = 'public';

revoke all on public.communities_public from public;
grant select on public.communities_public to anon;
grant select on public.communities_public to authenticated;
grant select on public.communities_public to service_role;

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 10: Event groups, events, messages (20260328000700-001000)
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.community_event_groups (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  title text not null,
  description text,
  color text default '#6366f1',
  sort_order int not null default 0,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_event_groups_community
  on public.community_event_groups(community_id);

create table if not exists public.community_events (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  group_id uuid references public.community_event_groups(id) on delete set null,
  title text not null,
  description text,
  image_url text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_events_community
  on public.community_events(community_id, starts_at desc);
create index if not exists idx_events_group
  on public.community_events(group_id) where group_id is not null;

create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  reply_to uuid references public.community_messages(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_community
  on public.community_messages(community_id, created_at desc);

-- RLS for new tables
alter table public.community_event_groups enable row level security;
alter table public.community_events enable row level security;
alter table public.community_messages enable row level security;

create policy "event_groups_select" on public.community_event_groups
  for select using (true);
create policy "events_select" on public.community_events
  for select using (true);
create policy "messages_select" on public.community_messages
  for select using (true);
create policy "messages_insert" on public.community_messages
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.community_members cm
      where cm.community_id = community_messages.community_id
        and cm.user_id = auth.uid()
    )
  );
create policy "messages_delete" on public.community_messages
  for delete using (user_id = auth.uid());

-- Grants for new tables
grant select on table public.community_event_groups to anon;
grant select on table public.community_event_groups to authenticated;
grant all on table public.community_event_groups to service_role;

grant select on table public.community_events to anon;
grant select on table public.community_events to authenticated;
grant all on table public.community_events to service_role;

grant select on table public.community_messages to anon;
grant select on table public.community_messages to authenticated;
grant all on table public.community_messages to service_role;

commit;
