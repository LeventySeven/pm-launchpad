-- Market comments: users can leave comments under markets.
-- We store user_id + market_id + body; display name/avatar are derived by joining users on read.

begin;

create table if not exists public.market_comments (
  id uuid primary key default gen_random_uuid(),
  market_id uuid not null references public.markets(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  body text not null check (char_length(body) >= 1 and char_length(body) <= 2000),
  created_at timestamptz not null default now()
);

create index if not exists market_comments_market_id_created_at_idx
  on public.market_comments (market_id, created_at desc);

create index if not exists market_comments_user_id_created_at_idx
  on public.market_comments (user_id, created_at desc);

alter table public.market_comments enable row level security;

-- Anyone can read comments (public feed).
drop policy if exists "market_comments_select_all" on public.market_comments;
create policy "market_comments_select_all"
  on public.market_comments
  for select
  using (true);

-- Only authenticated users can insert their own comments.
drop policy if exists "market_comments_insert_own" on public.market_comments;
create policy "market_comments_insert_own"
  on public.market_comments
  for insert
  with check (auth.uid() is not null and user_id = auth.uid());

-- Only the author can delete their comment (optional but safe).
drop policy if exists "market_comments_delete_own" on public.market_comments;
create policy "market_comments_delete_own"
  on public.market_comments
  for delete
  using (auth.uid() is not null and user_id = auth.uid());

-- Public view that includes display name + avatar.
drop view if exists public.market_comments_public;
create view public.market_comments_public
with (security_invoker = true)
as
select
  c.id,
  c.market_id,
  c.user_id,
  c.body,
  c.created_at,
  coalesce(u.display_name, u.username) as author_name,
  u.username as author_username,
  coalesce(u.avatar_url, u.telegram_photo_url) as author_avatar_url
from public.market_comments c
join public.users u on u.id = c.user_id;

revoke all on public.market_comments_public from public;
grant select on public.market_comments_public to anon;
grant select on public.market_comments_public to authenticated;

commit;


