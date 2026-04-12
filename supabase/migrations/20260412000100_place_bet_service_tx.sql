-- Service-role wrappers for place_bet_tx and place_bet_multi_tx.
-- Allows the backend to place bets when the user's Supabase session has expired
-- but their auth_token JWT is still valid (we know who they are).
-- Follows the same pattern as sell_position_service_tx.

-- Binary market version
drop function if exists public.place_bet_service_tx(uuid, uuid, text, numeric);

create or replace function public.place_bet_service_tx(
  p_user_id uuid,
  p_market_id uuid,
  p_side text,
  p_amount numeric
) returns table (
  trade_id uuid,
  new_balance_minor bigint,
  shares_bought numeric,
  price_before numeric,
  price_after numeric
) language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_user_id is null then
    raise exception 'INVALID_USER';
  end if;

  -- Inject user context so auth.uid() resolves inside place_bet_tx
  perform set_config('request.jwt.claim.sub', p_user_id::text, true);
  perform set_config('request.jwt.claim.role', 'service_role', true);

  return query
    select * from public.place_bet_tx(p_market_id, p_side, p_amount);
end;
$$;

revoke all on function public.place_bet_service_tx(uuid, uuid, text, numeric) from public;
grant execute on function public.place_bet_service_tx(uuid, uuid, text, numeric) to service_role;

-- Multi-choice market version
drop function if exists public.place_bet_multi_service_tx(uuid, uuid, uuid, numeric);

create or replace function public.place_bet_multi_service_tx(
  p_user_id uuid,
  p_market_id uuid,
  p_outcome_id uuid,
  p_amount numeric
) returns table (
  trade_id uuid,
  new_balance_minor bigint,
  shares_bought numeric,
  price_before numeric,
  price_after numeric
) language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_user_id is null then
    raise exception 'INVALID_USER';
  end if;

  -- Inject user context so auth.uid() resolves inside place_bet_multi_tx
  perform set_config('request.jwt.claim.sub', p_user_id::text, true);
  perform set_config('request.jwt.claim.role', 'service_role', true);

  return query
    select * from public.place_bet_multi_tx(p_market_id, p_outcome_id, p_amount);
end;
$$;

revoke all on function public.place_bet_multi_service_tx(uuid, uuid, uuid, numeric) from public;
grant execute on function public.place_bet_multi_service_tx(uuid, uuid, uuid, numeric) to service_role;
