-- Add a safe semantic flag to the public trade feed without exposing user identities.
-- Keeps the existing `public.trades_public` view readable by anon/authenticated.

begin;

drop view if exists public.trades_public;

create or replace view public.trades_public
with (security_invoker = true)
as
select
  id,
  market_id,
  action,
  (action = 'sell') as is_sold,
  outcome,
  asset_code,
  collateral_gross_minor,
  fee_minor,
  collateral_net_minor,
  shares_delta,
  price_before,
  price_after,
  created_at
from public.trades;

revoke all on public.trades_public from public;
grant select on public.trades_public to anon;
grant select on public.trades_public to authenticated;

commit;


