begin;

-- User-to-user follow relationships
create table if not exists public.user_follows (
  follower_id uuid not null references public.users(id) on delete cascade,
  following_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint no_self_follow check (follower_id != following_id)
);

-- Index both directions for efficient lookups
create index if not exists user_follows_follower_id_idx
  on public.user_follows (follower_id);
create index if not exists user_follows_following_id_idx
  on public.user_follows (following_id);

alter table public.user_follows enable row level security;

-- Public read: anyone can see who follows whom
create policy "user_follows_select_all"
  on public.user_follows for select using (true);

-- Only authenticated users can follow as themselves
create policy "user_follows_insert_own"
  on public.user_follows for insert
  with check (follower_id = auth.uid());

-- Only the follower can unfollow
create policy "user_follows_delete_own"
  on public.user_follows for delete
  using (follower_id = auth.uid());

grant select on table public.user_follows to anon;
grant select on table public.user_follows to authenticated;
grant all on table public.user_follows to service_role;

commit;
