-- Public read-only view for the trade feed -----------------------------------
-- IMPORTANT:
-- Use SECURITY INVOKER so Postgres permissions + RLS are evaluated for the querying user,
-- not the view owner (fixes Supabase security warning).

begin;

drop view if exists public.trades_public;

create or replace view public.trades_public
with (security_invoker = true)
as
select
  id,
  market_id,
  action,
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

-- Remove implicit PUBLIC grants and grant read-only access explicitly.
revoke all on public.trades_public from public;
grant select on public.trades_public to anon;
grant select on public.trades_public to authenticated;

commit;


