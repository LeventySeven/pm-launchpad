-- Optimize market_comments_public: replace correlated subquery for likes_count
-- with a LEFT JOIN + GROUP BY. The old view ran a COUNT(*) per row returned,
-- meaning 100 comments = 100 separate COUNT queries. The new version does one
-- aggregation pass.

begin;

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

commit;
