begin;

-- ============================================================================
-- Solana migration: replace EVM WalletConnect fields with Solana-native fields
-- - users: drop (wallet_address, chain_id, wallet_connected_at) and add solana_* equivalents
-- - on_chain_transactions: replace (tx_hash, chain_id) with (tx_sig, solana_cluster)
-- - deposits: replace (tx_hash, chain_id, from_address) with (tx_sig, solana_cluster, from_pubkey)
-- - market_onchain_map: replace (chain_id, vault_address, onchain_market_id) with
--   (solana_cluster, program_id, market_pda)
--
-- Notes:
-- - Solana tx signatures are base58 strings (often up to ~88 chars). We treat them as text and
--   enforce uniqueness by (solana_cluster, tx_sig).
-- - solana_cluster is stored as text (e.g. 'devnet', 'mainnet-beta').
-- ============================================================================

-- ============================================================================
-- PART 1: users table - drop EVM fields, add Solana fields
-- ============================================================================

-- Drop EVM wallet indexes (created in 20260113000100_wallet_connect_fields.sql)
drop index if exists public.users_wallet_address_unique_idx;
drop index if exists public.users_wallet_address_idx;

alter table public.users
  drop column if exists wallet_address,
  drop column if exists chain_id,
  drop column if exists wallet_connected_at;

alter table public.users
  add column if not exists solana_wallet_address text,
  add column if not exists solana_cluster text,
  add column if not exists solana_wallet_connected_at timestamptz;

create unique index if not exists users_solana_wallet_address_unique_idx
  on public.users (solana_wallet_address)
  where solana_wallet_address is not null;

create index if not exists users_solana_wallet_address_idx
  on public.users (solana_wallet_address)
  where solana_wallet_address is not null;

comment on column public.users.solana_wallet_address is 'Connected Solana wallet public key (base58)';
comment on column public.users.solana_cluster is 'Solana cluster (devnet, testnet, mainnet-beta)';
comment on column public.users.solana_wallet_connected_at is 'When Solana wallet was last connected';

-- ============================================================================
-- PART 2: on_chain_transactions - replace tx_hash/chain_id with tx_sig/solana_cluster
-- ============================================================================

-- Drop EVM unique index first
drop index if exists public.on_chain_transactions_tx_hash_chain_idx;

alter table public.on_chain_transactions
  drop column if exists tx_hash,
  drop column if exists chain_id;

alter table public.on_chain_transactions
  add column if not exists tx_sig text not null,
  add column if not exists solana_cluster text not null;

create unique index if not exists on_chain_transactions_tx_sig_cluster_idx
  on public.on_chain_transactions (solana_cluster, tx_sig);

comment on column public.on_chain_transactions.tx_sig is 'Solana transaction signature (base58)';
comment on column public.on_chain_transactions.solana_cluster is 'Solana cluster (devnet, testnet, mainnet-beta)';

-- ============================================================================
-- PART 3: deposits - replace tx_hash/chain_id/from_address with tx_sig/solana_cluster/from_pubkey
-- ============================================================================

drop index if exists public.deposits_tx_hash_chain_idx;

alter table public.deposits
  drop column if exists tx_hash,
  drop column if exists chain_id,
  drop column if exists from_address;

alter table public.deposits
  add column if not exists tx_sig text not null,
  add column if not exists solana_cluster text not null,
  add column if not exists from_pubkey text not null;

create unique index if not exists deposits_tx_sig_cluster_idx
  on public.deposits (solana_cluster, tx_sig);

comment on column public.deposits.tx_sig is 'Solana transaction signature (base58)';
comment on column public.deposits.solana_cluster is 'Solana cluster (devnet, testnet, mainnet-beta)';
comment on column public.deposits.from_pubkey is 'Solana pubkey that initiated the deposit (base58)';

-- ============================================================================
-- PART 4: market_onchain_map - replace chain_id/vault_address/onchain_market_id with solana fields
-- ============================================================================

drop index if exists public.market_onchain_map_chain_marketid_unique_idx;
drop index if exists public.market_onchain_map_chain_marketid_idx;

alter table public.market_onchain_map
  drop column if exists chain_id,
  drop column if exists vault_address,
  drop column if exists onchain_market_id;

alter table public.market_onchain_map
  add column if not exists solana_cluster text not null,
  add column if not exists program_id text not null,
  add column if not exists market_pda text not null;

-- Rebuild PK: (market_id, solana_cluster)
alter table public.market_onchain_map
  drop constraint if exists market_onchain_map_pkey;

alter table public.market_onchain_map
  add primary key (market_id, solana_cluster);

create unique index if not exists market_onchain_map_cluster_marketpda_unique_idx
  on public.market_onchain_map (solana_cluster, market_pda);

create index if not exists market_onchain_map_cluster_marketpda_idx
  on public.market_onchain_map (solana_cluster, market_pda);

comment on column public.market_onchain_map.program_id is 'Solana program id (base58) responsible for the market state';
comment on column public.market_onchain_map.market_pda is 'Market account PDA (base58). PDA scheme: seeds=[\"market\", market_uuid_bytes]';

commit;

