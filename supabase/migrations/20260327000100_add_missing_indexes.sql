-- Add missing indexes for common query patterns.
-- These indexes cover the most expensive sequential scans found during audit.

begin;

-- positions: leaderboard queries filter by user_id with IN clause
-- Existing index only covers (market_id, outcome_id)
create index if not exists positions_user_id_idx
  on public.positions (user_id);

-- trades: leaderboard queries filter by user_id, activity queries sort by created_at
-- Existing index only covers (market_id, outcome_id, created_at desc)
create index if not exists trades_user_id_created_at_idx
  on public.trades (user_id, created_at desc);

-- wallet_transactions: user transaction history queries filter by user_id + sort by created_at
-- No index existed at all on this table
create index if not exists wallet_transactions_user_id_created_at_idx
  on public.wallet_transactions (user_id, created_at desc);

-- wallet_transactions: leaderboard PnL aggregation filters by kind
create index if not exists wallet_transactions_kind_user_id_idx
  on public.wallet_transactions (kind, user_id)
  where kind in ('trade', 'payout', 'fee');

-- market_price_candles: volume aggregation queries filter by market_id
-- Primary key may exist but explicit index ensures the IN query uses it
create index if not exists market_price_candles_market_id_idx
  on public.market_price_candles (market_id);

commit;
