-- Wraps bet placement in a single transaction.
-- Parameters:
--   p_user_id uuid
--   p_market_id uuid
--   p_side text ('YES' | 'NO')
--   p_amount numeric
-- Returns:
--   bet_id uuid
--   new_balance numeric
create or replace function place_bet_tx(
    p_user_id uuid,
    p_market_id uuid,
    p_side text,
    p_amount numeric
) returns table (bet_id uuid, new_balance numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance numeric;
  v_bet_id uuid;
  v_expires_at timestamptz;
  v_outcome text;
  v_pool_yes numeric;
  v_pool_no numeric;
  v_total numeric;
  v_price_yes numeric;
  v_price_no numeric;
  v_price numeric;
  v_shares numeric;
begin
  perform id from users where id = p_user_id for update;
  select balance into v_balance from users where id = p_user_id;
  if v_balance is null then
    raise exception 'USER_NOT_FOUND';
  end if;
  if v_balance < p_amount then
    raise exception 'INSUFFICIENT_BALANCE';
  end if;

  perform id, outcome, expires_at from markets where id = p_market_id for update;
  if not found then
    raise exception 'MARKET_NOT_FOUND';
  end if;
  select outcome, expires_at, pool_yes, pool_no
    into v_outcome, v_expires_at, v_pool_yes, v_pool_no
  from markets
  where id = p_market_id;

  if v_outcome is not null then
    raise exception 'MARKET_RESOLVED';
  end if;
  if v_expires_at <= now() - interval '5 minutes' then
    raise exception 'MARKET_EXPIRED';
  end if;

  v_pool_yes := coalesce(v_pool_yes, 0);
  v_pool_no := coalesce(v_pool_no, 0);
  v_total := v_pool_yes + v_pool_no;

  if v_total = 0 then
    v_price_yes := 0.5;
    v_price_no := 0.5;
  else
    v_price_yes := v_pool_yes / v_total;
    v_price_no := v_pool_no / v_total;
  end if;

  if upper(p_side) = 'YES' then
    v_price := v_price_yes;
  else
    v_price := v_price_no;
  end if;

  if v_price is null or v_price <= 0 then
    raise exception 'PRICE_UNAVAILABLE';
  end if;

  v_shares := p_amount / v_price;

  update users set balance = balance - p_amount where id = p_user_id;

  if p_side = 'YES' then
    update markets set pool_yes = pool_yes + p_amount where id = p_market_id;
  else
    update markets set pool_no = pool_no + p_amount where id = p_market_id;
  end if;

  insert into bets(user_id, market_id, side, amount, status, price_at_bet, shares)
  values(p_user_id, p_market_id, p_side, p_amount, 'open', v_price, v_shares)
  returning id into v_bet_id;

  select balance into new_balance from users where id = p_user_id;

  return query
    select v_bet_id::uuid as bet_id, new_balance::numeric as new_balance;
  return;
end;
$$;

