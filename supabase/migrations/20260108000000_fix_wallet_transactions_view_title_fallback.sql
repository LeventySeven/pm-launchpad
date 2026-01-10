-- Update wallet_transactions_public view to use English title as fallback when Russian title is null
-- This ensures markets without Russian titles (English-only markets) display correctly

begin;

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
  coalesce(m.title_rus, m.title_eng) as market_title_rus,
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
