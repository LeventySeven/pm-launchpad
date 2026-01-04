create table if not exists public.market_comment_likes (
  comment_id uuid not null references public.market_comments(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create index if not exists market_comment_likes_comment_id_idx
  on public.market_comment_likes (comment_id);

create index if not exists market_comment_likes_user_id_idx
  on public.market_comment_likes (user_id);

alter table public.market_comment_likes enable row level security;

-- Likes are public read (counts, transparency).
drop policy if exists "market_comment_likes_select_all" on public.market_comment_likes;
create policy "market_comment_likes_select_all"
  on public.market_comment_likes
  for select
  using (true);

-- Only authenticated users can like/unlike as themselves.
drop policy if exists "market_comment_likes_insert_own" on public.market_comment_likes;
create policy "market_comment_likes_insert_own"
  on public.market_comment_likes
  for insert
  with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists "market_comment_likes_delete_own" on public.market_comment_likes;
create policy "market_comment_likes_delete_own"
  on public.market_comment_likes
  for delete
  using (auth.uid() is not null and user_id = auth.uid());

grant select on table public.market_comment_likes to anon;
grant select on table public.market_comment_likes to authenticated;
grant all on table public.market_comment_likes to service_role;


