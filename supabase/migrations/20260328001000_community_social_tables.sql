-- Combined migration: event groups, events, messages
-- Requires: communities table and community_members table to already exist

-- ═══════════════════════════════════════════════════════════════
-- 1. Event Groups
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.community_event_groups (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null,
  title text not null,
  description text,
  color text default '#6366f1',
  sort_order int not null default 0,
  created_by uuid not null,
  created_at timestamptz not null default now(),

  constraint fk_event_groups_community
    foreign key (community_id) references public.communities(id) on delete cascade,
  constraint fk_event_groups_creator
    foreign key (created_by) references auth.users(id) on delete cascade
);

create index if not exists idx_event_groups_community
  on public.community_event_groups(community_id);

-- ═══════════════════════════════════════════════════════════════
-- 2. Events
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.community_events (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null,
  group_id uuid,
  title text not null,
  description text,
  image_url text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  created_by uuid not null,
  created_at timestamptz not null default now(),

  constraint fk_events_community
    foreign key (community_id) references public.communities(id) on delete cascade,
  constraint fk_events_group
    foreign key (group_id) references public.community_event_groups(id) on delete set null,
  constraint fk_events_creator
    foreign key (created_by) references auth.users(id) on delete cascade
);

create index if not exists idx_events_community
  on public.community_events(community_id, starts_at desc);
create index if not exists idx_events_group
  on public.community_events(group_id) where group_id is not null;

-- ═══════════════════════════════════════════════════════════════
-- 3. Messages
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null,
  user_id uuid not null,
  body text not null check (char_length(body) between 1 and 2000),
  reply_to uuid,
  created_at timestamptz not null default now(),

  constraint fk_messages_community
    foreign key (community_id) references public.communities(id) on delete cascade,
  constraint fk_messages_user
    foreign key (user_id) references auth.users(id) on delete cascade,
  constraint fk_messages_reply
    foreign key (reply_to) references public.community_messages(id) on delete set null
);

create index if not exists idx_messages_community
  on public.community_messages(community_id, created_at desc);

-- ═══════════════════════════════════════════════════════════════
-- 4. RLS
-- ═══════════════════════════════════════════════════════════════

alter table public.community_event_groups enable row level security;
alter table public.community_events enable row level security;
alter table public.community_messages enable row level security;

-- Event groups: public read
create policy "event_groups_select" on public.community_event_groups
  for select using (true);

-- Events: public read
create policy "events_select" on public.community_events
  for select using (true);

-- Messages: service role always reads (for tRPC server-side)
create policy "messages_select_service" on public.community_messages
  for select using (true);

-- Messages: members can insert
create policy "messages_insert" on public.community_messages
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.community_members cm
      where cm.community_id = community_messages.community_id
        and cm.user_id = auth.uid()
    )
  );

-- Messages: author can delete
create policy "messages_delete" on public.community_messages
  for delete using (user_id = auth.uid());
