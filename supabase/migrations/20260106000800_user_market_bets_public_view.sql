begin;

-- Public bets surface:
-- - Based on buy history (user_market_votes_public) BUT marks whether the user still has an active position.
-- - No amounts/shares are exposed (only a boolean is_active).
drop view if exists public.user_market_bets_public;
create view public.user_market_bets_public
with (security_barrier = true)
as
select
  v.user_id,
  v.market_id,
  v.outcome,
  v.last_bet_at,
  (coalesce(p.shares, 0) > 0) as is_active,
  p.updated_at as position_updated_at
from public.user_market_votes_public v
left join public.positions p
  on p.user_id = v.user_id
 and p.market_id = v.market_id
 and p.outcome = v.outcome;

revoke all on public.user_market_bets_public from public;
grant select on public.user_market_bets_public to anon;
grant select on public.user_market_bets_public to authenticated;
grant select on public.user_market_bets_public to service_role;

commit;


