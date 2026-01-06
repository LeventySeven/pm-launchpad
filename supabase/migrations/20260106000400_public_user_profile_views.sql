begin;

-- Public per-user PnL time series (aggregated; no individual transactions).
-- Uses only kinds that affect trading PnL.
drop view if exists public.user_pnl_daily_public;
create view public.user_pnl_daily_public as
select
  user_id,
  date_trunc('day', created_at) as day,
  coalesce(sum(amount_minor), 0) as pnl_minor
from public.wallet_transactions
where kind in ('trade', 'payout', 'fee')
group by user_id, date_trunc('day', created_at)
order by day asc;

revoke all on public.user_pnl_daily_public from public;
grant select on public.user_pnl_daily_public to anon;
grant select on public.user_pnl_daily_public to authenticated;
grant select on public.user_pnl_daily_public to service_role;

-- Public list of markets a user voted for (no wallet amounts).
drop view if exists public.user_market_votes_public;
create view public.user_market_votes_public as
select
  user_id,
  market_id,
  outcome,
  max(created_at) as last_bet_at
from public.trades
where action = 'buy'
group by user_id, market_id, outcome;

revoke all on public.user_market_votes_public from public;
grant select on public.user_market_votes_public to anon;
grant select on public.user_market_votes_public to authenticated;
grant select on public.user_market_votes_public to service_role;

commit;


