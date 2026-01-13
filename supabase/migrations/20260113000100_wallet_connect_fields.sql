-- Migration: Add WalletConnect fields for on-chain integration
-- Adds wallet_address, chain_id to users table
-- Creates on_chain_transactions and deposits tables for tracking blockchain state

-- ============================================================================
-- PART 1: Add wallet fields to users table
-- ============================================================================

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS wallet_address text,
ADD COLUMN IF NOT EXISTS chain_id integer,
ADD COLUMN IF NOT EXISTS wallet_connected_at timestamptz;

-- Add unique constraint on wallet_address (one wallet per user, one user per wallet)
-- Using a partial unique index to allow multiple NULLs
CREATE UNIQUE INDEX IF NOT EXISTS users_wallet_address_unique_idx 
ON public.users (wallet_address) 
WHERE wallet_address IS NOT NULL;

-- Index for lookups by wallet address
CREATE INDEX IF NOT EXISTS users_wallet_address_idx 
ON public.users (wallet_address) 
WHERE wallet_address IS NOT NULL;

COMMENT ON COLUMN public.users.wallet_address IS 'Connected EVM wallet address (e.g., 0x123...)';
COMMENT ON COLUMN public.users.chain_id IS 'Current chain ID (1=Ethereum, 11155111=Sepolia)';
COMMENT ON COLUMN public.users.wallet_connected_at IS 'When wallet was last connected';

-- ============================================================================
-- PART 2: Create on_chain_transaction_status enum
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE public.on_chain_tx_status AS ENUM ('pending', 'confirmed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.on_chain_tx_type AS ENUM ('deposit', 'bet', 'sell', 'claim', 'withdraw', 'approve');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- PART 3: Create on_chain_transactions table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.on_chain_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tx_hash text NOT NULL,
  chain_id integer NOT NULL,
  status public.on_chain_tx_status NOT NULL DEFAULT 'pending',
  tx_type public.on_chain_tx_type NOT NULL,
  amount_minor bigint,
  asset_code text REFERENCES public.assets(code),
  market_id uuid REFERENCES public.markets(id),
  trade_id uuid REFERENCES public.trades(id),
  nonce bigint,
  gas_used bigint,
  gas_price_gwei numeric,
  block_number bigint,
  block_timestamp timestamptz,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint on tx_hash + chain_id (same tx can exist on different chains theoretically)
CREATE UNIQUE INDEX IF NOT EXISTS on_chain_transactions_tx_hash_chain_idx 
ON public.on_chain_transactions (tx_hash, chain_id);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS on_chain_transactions_user_id_idx 
ON public.on_chain_transactions (user_id);

-- Index for pending transactions (for webhook processing)
CREATE INDEX IF NOT EXISTS on_chain_transactions_pending_idx 
ON public.on_chain_transactions (status, created_at) 
WHERE status = 'pending';

-- Index for market-related transactions
CREATE INDEX IF NOT EXISTS on_chain_transactions_market_id_idx 
ON public.on_chain_transactions (market_id) 
WHERE market_id IS NOT NULL;

COMMENT ON TABLE public.on_chain_transactions IS 'Tracks all blockchain transactions for audit trail and webhook sync';
COMMENT ON COLUMN public.on_chain_transactions.tx_hash IS 'Blockchain transaction hash';
COMMENT ON COLUMN public.on_chain_transactions.nonce IS 'Transaction nonce for replay protection';
COMMENT ON COLUMN public.on_chain_transactions.metadata IS 'Additional transaction metadata (e.g., contract call params)';

-- ============================================================================
-- PART 4: Create deposit_status enum and deposits table
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE public.deposit_status AS ENUM ('pending', 'confirmed', 'failed', 'credited');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tx_hash text NOT NULL,
  chain_id integer NOT NULL,
  amount_minor bigint NOT NULL,
  asset_code text NOT NULL REFERENCES public.assets(code),
  status public.deposit_status NOT NULL DEFAULT 'pending',
  from_address text NOT NULL,
  block_number bigint,
  block_timestamp timestamptz,
  credited_at timestamptz,
  wallet_tx_id uuid REFERENCES public.wallet_transactions(id),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint on tx_hash + chain_id for idempotency
CREATE UNIQUE INDEX IF NOT EXISTS deposits_tx_hash_chain_idx 
ON public.deposits (tx_hash, chain_id);

-- Index for user deposits
CREATE INDEX IF NOT EXISTS deposits_user_id_idx 
ON public.deposits (user_id);

-- Index for pending deposits (for webhook processing)
CREATE INDEX IF NOT EXISTS deposits_pending_idx 
ON public.deposits (status, created_at) 
WHERE status = 'pending';

COMMENT ON TABLE public.deposits IS 'Tracks USDC/USDT deposits from users wallets to the escrow vault';
COMMENT ON COLUMN public.deposits.from_address IS 'Wallet address that sent the deposit';
COMMENT ON COLUMN public.deposits.credited_at IS 'When the deposit was credited to user balance';
COMMENT ON COLUMN public.deposits.wallet_tx_id IS 'Reference to wallet_transactions entry when credited';

-- ============================================================================
-- PART 5: Add USDC to assets table (for Sepolia testnet)
-- ============================================================================

INSERT INTO public.assets (code, decimals, is_enabled, created_at)
VALUES 
  ('USDC', 6, true, now()),
  ('USDT', 6, true, now())
ON CONFLICT (code) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled;

-- ============================================================================
-- PART 6: RLS Policies for new tables
-- ============================================================================

-- Enable RLS
ALTER TABLE public.on_chain_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- on_chain_transactions: users can read their own transactions
CREATE POLICY "Users can view own on_chain_transactions" 
ON public.on_chain_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- on_chain_transactions: service role can do everything (for webhooks)
CREATE POLICY "Service role full access on_chain_transactions" 
ON public.on_chain_transactions 
FOR ALL 
USING (auth.role() = 'service_role');

-- deposits: users can read their own deposits
CREATE POLICY "Users can view own deposits" 
ON public.deposits 
FOR SELECT 
USING (auth.uid() = user_id);

-- deposits: service role can do everything (for webhooks)
CREATE POLICY "Service role full access deposits" 
ON public.deposits 
FOR ALL 
USING (auth.role() = 'service_role');

-- ============================================================================
-- PART 7: Update triggers for updated_at
-- ============================================================================

-- Trigger function (reuse if exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for on_chain_transactions
DROP TRIGGER IF EXISTS update_on_chain_transactions_updated_at ON public.on_chain_transactions;
CREATE TRIGGER update_on_chain_transactions_updated_at
BEFORE UPDATE ON public.on_chain_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for deposits
DROP TRIGGER IF EXISTS update_deposits_updated_at ON public.deposits;
CREATE TRIGGER update_deposits_updated_at
BEFORE UPDATE ON public.deposits
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- PART 8: Grant permissions to service_role for webhook operations
-- ============================================================================

GRANT ALL ON public.on_chain_transactions TO service_role;
GRANT ALL ON public.deposits TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
