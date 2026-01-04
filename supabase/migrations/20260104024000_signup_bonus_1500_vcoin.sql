-- Give every newly registered user 1,500 VCOIN (in minor units) on first insert into public.users.
-- This is DB-level, so it works for both email signup and Telegram signup.

create or replace function public.users_grant_signup_bonus()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_bonus_minor bigint := 1500 * 1000000; -- VCOIN has 6 decimals
begin
  insert into public.wallet_balances (user_id, asset_code, balance_minor, updated_at)
  values (new.id, 'VCOIN', v_bonus_minor, v_now)
  on conflict (user_id, asset_code) do nothing;

  return new;
end;
$$;

drop trigger if exists users_signup_bonus_trigger on public.users;
create trigger users_signup_bonus_trigger
after insert on public.users
for each row
execute function public.users_grant_signup_bonus();


