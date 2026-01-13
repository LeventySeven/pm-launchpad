begin;

-- Multi-chain mapping from Supabase market UUID -> on-chain bytes32 market id per chain.
-- Keeps reconciliation stable across chains and redeployments.

create table if not exists public.market_onchain_map (
  market_id uuid not null references public.markets(id) on delete cascade,
  chain_id integer not null,
  vault_address text not null,
  onchain_market_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (market_id, chain_id)
);

comment on table public.market_onchain_map is
  'Mapping of market UUIDs to on-chain bytes32 market ids per chain (used for webhook reconciliation).';

comment on column public.market_onchain_map.onchain_market_id is
  '0x-prefixed 32-byte hex string (bytes32) used as market identifier on-chain.';

create unique index if not exists market_onchain_map_chain_marketid_unique_idx
  on public.market_onchain_map (chain_id, onchain_market_id);

create index if not exists market_onchain_map_chain_marketid_idx
  on public.market_onchain_map (chain_id, onchain_market_id);

create index if not exists market_onchain_map_market_idx
  on public.market_onchain_map (market_id);

-- updated_at trigger (reuse existing function from earlier migrations if present)
drop trigger if exists update_market_onchain_map_updated_at on public.market_onchain_map;
create trigger update_market_onchain_map_updated_at
before update on public.market_onchain_map
for each row execute function public.update_updated_at_column();

-- RLS: only service role (webhook + backend) should access this mapping.
alter table public.market_onchain_map enable row level security;

drop policy if exists "market_onchain_map_service_role_all" on public.market_onchain_map;
create policy "market_onchain_map_service_role_all"
  on public.market_onchain_map
  for all
  using (auth.role() = 'service_role');

revoke all on table public.market_onchain_map from anon;
revoke all on table public.market_onchain_map from authenticated;
grant all on table public.market_onchain_map to service_role;

commit;

