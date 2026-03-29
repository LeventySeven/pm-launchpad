-- Community message wall / chat: public messages visible to all community members
create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  reply_to uuid references public.community_messages(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_community on public.community_messages(community_id, created_at desc);

alter table public.community_messages enable row level security;

create policy "Messages are readable by community members"
  on public.community_messages for select using (
    exists (
      select 1 from public.community_members cm
      where cm.community_id = community_messages.community_id
        and cm.user_id = auth.uid()
    )
  );

-- Service role can always read (for tRPC server-side queries)
create policy "Service role can read all messages"
  on public.community_messages for select
  using (current_setting('role', true) = 'service_role');

create policy "Community members can post messages"
  on public.community_messages for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.community_members cm
      where cm.community_id = community_messages.community_id
        and cm.user_id = auth.uid()
    )
  );

create policy "Message author can delete"
  on public.community_messages for delete
  using (user_id = auth.uid());
