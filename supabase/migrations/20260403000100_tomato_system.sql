-- Tomato voting system: gamification currency for market launchpad
begin;

-- Tomato balances per user
create table if not exists public.tomato_balances (
  user_id uuid primary key references public.users(id) on delete cascade,
  balance int not null default 1000,
  total_earned int not null default 1000,
  total_spent int not null default 0,
  last_daily_claim timestamptz,
  created_at timestamptz not null default now()
);

alter table public.tomato_balances enable row level security;

create policy "tomato_balances_select" on public.tomato_balances
  for select using (true);

grant select on table public.tomato_balances to anon;
grant select on table public.tomato_balances to authenticated;
grant all on table public.tomato_balances to service_role;

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

-- Tomato transaction log (earn/spend history)
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

commit;
