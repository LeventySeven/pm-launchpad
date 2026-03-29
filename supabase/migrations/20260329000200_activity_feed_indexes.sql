-- Indexes required for the community activity feed UNION ALL query

create index if not exists idx_trades_market_created
  on public.trades(market_id, created_at desc);

create index if not exists idx_community_markets_community_market
  on public.community_markets(community_id, market_id);

create index if not exists idx_markets_created_by_at
  on public.markets(created_by, created_at desc);
