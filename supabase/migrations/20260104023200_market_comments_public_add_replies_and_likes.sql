-- Extend public view with replies + like counts.

drop view if exists public.market_comments_public;

create view public.market_comments_public
with (security_invoker = true)
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
  (
    select count(*)::int
    from public.market_comment_likes l
    where l.comment_id = c.id
  ) as likes_count
from public.market_comments c
join public.users u on u.id = c.user_id;

revoke all on public.market_comments_public from public;
grant select on public.market_comments_public to anon;
grant select on public.market_comments_public to authenticated;
grant select on public.market_comments_public to service_role;


