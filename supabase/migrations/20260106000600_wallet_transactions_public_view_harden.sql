begin;

-- Public (PII-safe) transaction feed (READ-ONLY):
-- - Intentionally exposes ONLY trading-related kinds
-- - Excludes deposits/withdrawals and any external refs
-- - Does not expose asset_code/trade_id to reduce correlation surface
drop view if exists public.wallet_transactions_public;
create view public.wallet_transactions_public
with (security_barrier = true)
as
select
  t.id,
  t.user_id,
  t.kind,
  t.amount_minor,
  t.market_id,
  m.title_rus as market_title_rus,
  m.title_eng as market_title_eng,
  t.created_at
from public.wallet_transactions t
left join public.markets m on m.id = t.market_id
where t.kind in ('trade', 'payout', 'fee', 'referral');

revoke all on public.wallet_transactions_public from public;
grant select on public.wallet_transactions_public to anon;
grant select on public.wallet_transactions_public to authenticated;
grant select on public.wallet_transactions_public to service_role;

commit;


