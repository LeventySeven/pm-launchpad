begin;

-- Lock down wallet tables (no public reads). Users can read their own rows only.

alter table public.wallet_balances enable row level security;
alter table public.wallet_transactions enable row level security;

drop policy if exists "wallet_balances_select_own" on public.wallet_balances;
create policy "wallet_balances_select_own"
  on public.wallet_balances
  for select
  using (auth.uid() is not null and user_id = auth.uid());

drop policy if exists "wallet_transactions_select_own" on public.wallet_transactions;
create policy "wallet_transactions_select_own"
  on public.wallet_transactions
  for select
  using (auth.uid() is not null and user_id = auth.uid());

-- No public grants; authenticated can select (RLS enforces own).
revoke all on table public.wallet_balances from anon;
revoke all on table public.wallet_balances from authenticated;
revoke all on table public.wallet_transactions from anon;
revoke all on table public.wallet_transactions from authenticated;

grant select on table public.wallet_balances to authenticated;
grant select on table public.wallet_transactions to authenticated;

grant all on table public.wallet_balances to service_role;
grant all on table public.wallet_transactions to service_role;

commit;


