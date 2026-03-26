begin;

-- Custom enum types for communities
do $$ begin
  create type public.community_privacy as enum ('public', 'private');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.community_role as enum ('creator', 'moderator', 'member');
exception when duplicate_object then null;
end $$;

-- Main communities table
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

-- Public communities readable by all
create policy "communities_select_public"
  on public.communities for select
  using (privacy = 'public');

-- Authenticated users can create communities
create policy "communities_insert_authenticated"
  on public.communities for insert
  with check (created_by = auth.uid());

-- Creator can update their community
create policy "communities_update_creator"
  on public.communities for update
  using (created_by = auth.uid());

grant select on table public.communities to anon;
grant select on table public.communities to authenticated;
grant all on table public.communities to service_role;

commit;
