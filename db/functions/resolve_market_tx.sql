-- Resolves a market and pays out winners in one transaction.
-- Parameters:
--   p_market_id uuid
--   p_outcome text ('YES' | 'NO')
-- Returns:
--   market_id uuid
--   outcome text
--   total_pool numeric
--   winner_pool numeric
--   updated_bets_count int
create or replace function resolve_market_tx(
    p_market_id uuid,
    p_outcome text
) returns table (
  market_id uuid,
  outcome text,
  total_pool numeric,
  winner_pool numeric,
  updated_bets_count int
) language plpgsql
security definer
set search_path = public
as $$
declare
  v_pool_yes numeric;
  v_pool_no numeric;
begin
  select pool_yes, pool_no, outcome
    into v_pool_yes, v_pool_no, outcome
  from markets
  where id = p_market_id
  for update;

  if not found then
    raise exception 'MARKET_NOT_FOUND';
  end if;

  total_pool := coalesce(v_pool_yes, 0) + coalesce(v_pool_no, 0);
  winner_pool := case when p_outcome = 'YES' then coalesce(v_pool_yes, 0) else coalesce(v_pool_no, 0) end;

  -- Idempotent: if already resolved with same outcome, just return summary
  if outcome is not null and outcome = p_outcome then
    updated_bets_count := (select count(*) from bets where market_id = p_market_id and status in ('won','lost'));
    return query select p_market_id, p_outcome, total_pool, winner_pool, updated_bets_count;
    return;
  end if;

  with bet_rows as (
    select
      id,
      user_id,
      side,
      coalesce(
        shares,
        case
          when price_at_bet is not null and price_at_bet > 0 then amount / price_at_bet
          else amount
        end
      ) as computed_shares
    from bets
    where market_id = p_market_id
      and status = 'open'
    for update
  ),
  updated as (
    update bets b
      set status = case when br.side = p_outcome then 'won' else 'lost' end,
          shares = br.computed_shares,
          payout = case when br.side = p_outcome then br.computed_shares else 0 end
    from bet_rows br
    where b.id = br.id
    returning br.user_id, b.payout, b.status
  ),
  winners as (
    select user_id, sum(payout) as total_payout
    from updated
    where status = 'won'
    group by user_id
  )
  update users u
    set balance = balance + w.total_payout
  from winners w
  where w.user_id = u.id;

  updated_bets_count := (select count(*) from bets where market_id = p_market_id and status in ('won','lost'));

  update markets set outcome = p_outcome where id = p_market_id;

  return query select p_market_id, p_outcome, total_pool, winner_pool, updated_bets_count;
end;
$$;

