-- Events within communities, optionally grouped
create table if not exists public.community_events (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  group_id uuid references public.community_event_groups(id) on delete set null,
  title text not null,
  description text,
  image_url text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text, -- free-form: url, address, or "online"
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_events_community on public.community_events(community_id, starts_at desc);
create index if not exists idx_events_group on public.community_events(group_id) where group_id is not null;

alter table public.community_events enable row level security;

create policy "Events are publicly readable"
  on public.community_events for select using (true);

create policy "Community members can create events"
  on public.community_events for insert
  with check (
    exists (
      select 1 from public.community_members cm
      where cm.community_id = community_events.community_id
        and cm.user_id = auth.uid()
    )
  );

create policy "Event creator or moderator can update"
  on public.community_events for update
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.community_members cm
      where cm.community_id = community_events.community_id
        and cm.user_id = auth.uid()
        and cm.role in ('creator', 'moderator')
    )
  );

create policy "Event creator or moderator can delete"
  on public.community_events for delete
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.community_members cm
      where cm.community_id = community_events.community_id
        and cm.user_id = auth.uid()
        and cm.role in ('creator', 'moderator')
    )
  );
