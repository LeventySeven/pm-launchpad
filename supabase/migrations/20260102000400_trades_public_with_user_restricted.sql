-- Restricted view for analytics / visualization:
-- exposes user_id + sold flag, but is NOT readable by anon/authenticated.
-- Use service_role (server-only) to query this safely.

begin;

drop view if exists public.trades_public_with_user;

create or replace view public.trades_public_with_user
with (security_invoker = true)
as
select
  id,
  market_id,
  user_id,
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

revoke all on public.trades_public_with_user from public;
revoke all on public.trades_public_with_user from anon;
revoke all on public.trades_public_with_user from authenticated;
grant select on public.trades_public_with_user to service_role;

commit;


