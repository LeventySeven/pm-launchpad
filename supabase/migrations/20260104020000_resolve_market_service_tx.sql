-- Resolve a market and credit winnings to holders of the winning outcome.
-- Called by backend with service_role. Also allows admin users (is_admin=true) via authenticated session.

-- NOTE: Postgres cannot change a function's return type via CREATE OR REPLACE.
-- If the function already exists (from earlier iterations), we must drop it first.
drop function if exists public.resolve_market_service_tx(uuid, text);

create or replace function public.resolve_market_service_tx(
  p_market_id uuid,
  p_outcome text
) returns table (
  market_id uuid,
  outcome text,
  total_payout_minor bigint,
  winners_count integer
) language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_role text := coalesce(current_setting('request.jwt.claim.role', true), '');
  v_uid uuid := auth.uid();
  v_market public.markets%rowtype;
  v_asset public.assets%rowtype;
  v_decimals int;
  v_scale numeric;
  v_total bigint := 0;
  v_winners int := 0;
begin
  -- Authorization: service_role OR authenticated creator of the market.
  if v_role <> 'service_role' then
    if v_uid is null then
      raise exception 'NOT_AUTHENTICATED';
    end if;
  end if;

  if p_outcome not in ('YES', 'NO') then
    raise exception 'INVALID_OUTCOME';
  end if;

  select *
    into v_market
    from public.markets
   where id = p_market_id
   for update;

  if not found then
    raise exception 'MARKET_NOT_FOUND';
  end if;

  if v_market.resolve_outcome is not null or v_market.state = 'resolved' then
    raise exception 'MARKET_ALREADY_RESOLVED';
  end if;

  if v_role <> 'service_role' then
    if v_market.created_by is null or v_market.created_by <> v_uid then
      raise exception 'CREATOR_ONLY';
    end if;
  end if;

  -- Only allow resolution after the event end timestamp.
  if v_market.expires_at is not null and v_market.expires_at > v_now then
    raise exception 'EVENT_NOT_ENDED';
  end if;

  select *
    into v_asset
    from public.assets
   where code = coalesce(v_market.settlement_asset_code, 'VCOIN')
   for update;

  if not found or not v_asset.is_enabled then
    raise exception 'ASSET_DISABLED';
  end if;

  v_decimals := greatest(0, least(coalesce(v_asset.decimals, 6), 6));
  v_scale := power(10::numeric, v_decimals::numeric);

  -- Lock-in outcome & mark resolved.
  update public.markets
     set resolve_outcome = p_outcome::public.outcome_side,
         state = 'resolved'
   where id = p_market_id;

  -- Compute payouts.
  with payouts as (
    select
      p.user_id,
      sum(floor(p.shares * v_scale))::bigint as payout_minor
    from public.positions p
    where p.market_id = p_market_id
      and p.outcome = p_outcome::public.outcome_side
      and p.shares > 0
    group by p.user_id
    having sum(floor(p.shares * v_scale)) > 0
  )
  select
    coalesce(sum(payout_minor), 0)::bigint,
    coalesce(count(*), 0)::int
  into v_total, v_winners
  from payouts;

  -- Credit winners' wallet balances.
  insert into public.wallet_balances (user_id, asset_code, balance_minor, updated_at)
  select user_id, v_asset.code, payout_minor, v_now
  from (
    select
      p.user_id,
      sum(floor(p.shares * v_scale))::bigint as payout_minor
    from public.positions p
    where p.market_id = p_market_id
      and p.outcome = p_outcome::public.outcome_side
      and p.shares > 0
    group by p.user_id
    having sum(floor(p.shares * v_scale)) > 0
  ) a
  on conflict (user_id, asset_code)
  do update set
    balance_minor = public.wallet_balances.balance_minor + excluded.balance_minor,
    updated_at = excluded.updated_at;

  -- Write payout transactions (ledger).
  insert into public.wallet_transactions (id, user_id, asset_code, amount_minor, kind, market_id, trade_id, external_ref, created_at)
  select
    gen_random_uuid(),
    user_id,
    v_asset.code,
    payout_minor,
    'payout'::public.wallet_tx_kind,
    p_market_id,
    null,
    'market:' || p_market_id::text,
    v_now
  from (
    select
      p.user_id,
      sum(floor(p.shares * v_scale))::bigint as payout_minor
    from public.positions p
    where p.market_id = p_market_id
      and p.outcome = p_outcome::public.outcome_side
      and p.shares > 0
    group by p.user_id
    having sum(floor(p.shares * v_scale)) > 0
  ) t;

  return query
    select p_market_id, p_outcome, v_total, v_winners;
end;
$$;

revoke all on function public.resolve_market_service_tx(uuid, text) from public;
grant execute on function public.resolve_market_service_tx(uuid, text) to service_role;
grant execute on function public.resolve_market_service_tx(uuid, text) to authenticated;


