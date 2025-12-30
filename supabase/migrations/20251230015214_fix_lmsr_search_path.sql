-- Fix Supabase linter: function_search_path_mutable (set search_path explicitly)
-- Applies to any existing public LMSR helper functions, even if not defined in this repo.
begin;

do $$
declare
  v_name text;
  v_oid oid;
  v_args text;
begin
  foreach v_name in array array[
    'lmsr_cost_safe',
    'lmsr_price_yes_safe',
    'lmsr_cost',
    'lmsr_price_yes',
    'lmsr_buy_delta_shares_for_amount'
  ]
  loop
    select p.oid, pg_get_function_identity_arguments(p.oid)
      into v_oid, v_args
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = v_name
    limit 1;

    if v_oid is null then
      -- function not present; skip
      continue;
    end if;

    execute format(
      'alter function public.%I(%s) set search_path = public, pg_temp',
      v_name,
      v_args
    );
  end loop;
end $$;

commit;


