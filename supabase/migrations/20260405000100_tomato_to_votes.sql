-- Rename TOMATO asset to VOTE and rename tomato-specific tables to generic "votes"
begin;

-- 1. Insert VOTE asset (copy from TOMATO)
insert into public.assets (code, is_enabled, decimals)
select 'VOTE', is_enabled, decimals from public.assets where code = 'TOMATO'
on conflict (code) do nothing;

-- 2. Migrate all references from TOMATO → VOTE
update public.wallet_balances set asset_code = 'VOTE' where asset_code = 'TOMATO';
update public.wallet_transactions set asset_code = 'VOTE' where asset_code = 'TOMATO';
update public.markets set settlement_asset_code = 'VOTE' where settlement_asset_code = 'TOMATO';
update public.trades set asset_code = 'VOTE' where asset_code = 'TOMATO';

-- 3. Delete old TOMATO asset (no more references)
delete from public.assets where code = 'TOMATO';

-- 4. Rename tomato_votes → votes
alter table if exists public.tomato_votes rename to votes;

-- 5. Rename tomato_transactions → vote_transactions
alter table if exists public.tomato_transactions rename to vote_transactions;

-- 6. Rename indexes
alter index if exists idx_tomato_votes_market rename to idx_votes_market;
alter index if exists idx_tomato_votes_user rename to idx_votes_user;
alter index if exists idx_tomato_tx_user rename to idx_vote_tx_user;

-- 7. Rename RLS policies
alter policy if exists "tomato_votes_select" on public.votes rename to "votes_select";
alter policy if exists "tomato_tx_select_own" on public.vote_transactions rename to "vote_tx_select_own";

commit;
