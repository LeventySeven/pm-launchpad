begin;

-- Public community view with creator info (for discovery and listing)
drop view if exists public.communities_public;
create view public.communities_public
with (security_barrier = true)
as
select
  c.id,
  c.slug,
  c.name,
  c.description,
  c.banner_url,
  c.privacy::text as privacy,
  c.category,
  c.member_count,
  c.market_count,
  c.total_volume_minor,
  c.importance_score,
  c.created_at,
  c.created_by,
  coalesce(u.display_name, u.username) as creator_name,
  coalesce(u.avatar_url, u.telegram_photo_url) as creator_avatar_url
from public.communities c
join public.users u on u.id = c.created_by
where c.privacy = 'public';

revoke all on public.communities_public from public;
grant select on public.communities_public to anon;
grant select on public.communities_public to authenticated;
grant select on public.communities_public to service_role;

commit;
