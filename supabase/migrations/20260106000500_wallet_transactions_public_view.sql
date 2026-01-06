begin;

-- Public (PII-safe) transaction feed: only trading-related kinds.
-- Does NOT expose email, external_ref, or deposits/withdrawals.
drop view if exists public.wallet_transactions_public;
create view public.wallet_transactions_public as
select
  t.id,
  t.user_id,
  t.kind,
  t.asset_code,
  t.amount_minor,
  t.market_id,
  m.title_rus as market_title_rus,
  m.title_eng as market_title_eng,
  t.trade_id,
  t.created_at
from public.wallet_transactions t
left join public.markets m on m.id = t.market_id
where t.kind in ('trade', 'payout', 'fee', 'referral');

revoke all on public.wallet_transactions_public from public;
grant select on public.wallet_transactions_public to anon;
grant select on public.wallet_transactions_public to authenticated;
grant select on public.wallet_transactions_public to service_role;

commit;


