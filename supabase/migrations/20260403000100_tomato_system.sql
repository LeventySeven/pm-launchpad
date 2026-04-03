-- Tomato voting system: launchpad voting + transaction log
-- Tomato balance lives in wallet_balances with asset_code = 'TOMATO' (no separate table)
begin;

-- Tomato votes on markets (launchpad voting)
create table if not exists public.tomato_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  market_id uuid not null references public.markets(id) on delete cascade,
  amount int not null check (amount > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_tomato_votes_market on public.tomato_votes(market_id);
create index if not exists idx_tomato_votes_user on public.tomato_votes(user_id);

alter table public.tomato_votes enable row level security;

create policy "tomato_votes_select" on public.tomato_votes
  for select using (true);

grant select on table public.tomato_votes to anon;
grant select on table public.tomato_votes to authenticated;
grant all on table public.tomato_votes to service_role;

-- Tomato transaction log (earn/spend history for daily claims, votes, etc.)
create table if not exists public.tomato_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  amount int not null, -- positive = earn, negative = spend
  reason text not null, -- 'daily', 'trade_bonus', 'create_market', 'vote', 'signup'
  reference_id text, -- market_id or trade_id
  created_at timestamptz not null default now()
);

create index if not exists idx_tomato_tx_user on public.tomato_transactions(user_id, created_at desc);

alter table public.tomato_transactions enable row level security;

create policy "tomato_tx_select_own" on public.tomato_transactions
  for select using (user_id = auth.uid());

grant select on table public.tomato_transactions to authenticated;
grant all on table public.tomato_transactions to service_role;

-- Add last_daily_claim to users table for tracking daily tomato farming
alter table public.users add column if not exists last_daily_claim timestamptz;

commit;
