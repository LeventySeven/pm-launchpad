-- Event groups: logical containers for events within a community
create table if not exists public.community_event_groups (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  title text not null,
  description text,
  color text default '#6366f1', -- hex color for UI badge
  sort_order int not null default 0,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_event_groups_community on public.community_event_groups(community_id);

alter table public.community_event_groups enable row level security;

create policy "Event groups are publicly readable"
  on public.community_event_groups for select using (true);

create policy "Community members can create event groups"
  on public.community_event_groups for insert
  with check (
    exists (
      select 1 from public.community_members cm
      where cm.community_id = community_event_groups.community_id
        and cm.user_id = auth.uid()
        and cm.role in ('creator', 'moderator')
    )
  );
