begin;

-- 1. Insert TOMATO asset (copy from VCOIN)
insert into public.assets (code, is_enabled, decimals)
select 'TOMATO', is_enabled, decimals from public.assets where code = 'VCOIN'
on conflict (code) do nothing;

-- 2. Migrate all children to TOMATO
update public.wallet_balances set asset_code = 'TOMATO' where asset_code = 'VCOIN';
update public.wallet_transactions set asset_code = 'TOMATO' where asset_code = 'VCOIN';
update public.markets set settlement_asset_code = 'TOMATO' where settlement_asset_code = 'VCOIN';
update public.trades set asset_code = 'TOMATO' where asset_code = 'VCOIN';

-- 3. Delete old VCOIN (no more references)
delete from public.assets where code = 'VCOIN';

commit;
