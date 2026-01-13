begin;

-- Add mapping field from DB market UUID -> on-chain market identifier (bytes32 hex).
-- This is required to reconcile contract events back into Supabase.

alter table public.markets
  add column if not exists onchain_market_id text;

comment on column public.markets.onchain_market_id is
  'On-chain market identifier as 0x-prefixed 32-byte hex string (bytes32).';

create unique index if not exists markets_onchain_market_id_unique_idx
  on public.markets (onchain_market_id)
  where onchain_market_id is not null;

create index if not exists markets_onchain_market_id_idx
  on public.markets (onchain_market_id)
  where onchain_market_id is not null;

commit;

