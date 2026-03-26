-- RPC function to aggregate candle volumes per market in SQL instead of JS.
-- Replaces fetching 20k rows + summing in memory with a single GROUP BY query.

begin;

create or replace function public.aggregate_market_volumes(market_ids uuid[])
returns table (market_id uuid, total_volume_minor bigint)
language sql
stable
security definer
as $$
  select
    c.market_id,
    coalesce(sum(c.volume_minor), 0)::bigint as total_volume_minor
  from public.market_price_candles c
  where c.market_id = any(market_ids)
  group by c.market_id;
$$;

-- Grant access to the roles that need it
grant execute on function public.aggregate_market_volumes(uuid[]) to anon;
grant execute on function public.aggregate_market_volumes(uuid[]) to authenticated;
grant execute on function public.aggregate_market_volumes(uuid[]) to service_role;

commit;
