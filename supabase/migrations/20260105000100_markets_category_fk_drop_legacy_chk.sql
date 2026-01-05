-- Fix market creation failing with legacy check constraint on markets.category_id.
-- Some older databases enforce a CHECK constraint (markets_category_id_chk) with a fixed enum-like list.
-- Our current design uses public.market_categories as the source of truth.

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'markets_category_id_chk'
      and conrelid = 'public.markets'::regclass
  ) then
    alter table public.markets drop constraint markets_category_id_chk;
  end if;
exception
  when undefined_table then
    -- markets table doesn't exist yet in this environment
    null;
end
$$;

-- Backfill legacy category ids (older DBs stored enum-like uppercase values).
-- We normalize known legacy values to the new market_categories ids, and set unknowns to NULL.
do $$
begin
  if to_regclass('public.markets') is not null then
    update public.markets
    set category_id = case
      when category_id is null then null
      when upper(category_id) = 'CRYPTO' then 'crypto'
      when upper(category_id) = 'POLITICS' then 'politics'
      when upper(category_id) = 'WORLD' then 'world'
      when upper(category_id) = 'TECH' then 'tech'
      when upper(category_id) = 'SPORTS' then 'sports'
      when upper(category_id) = 'SOCIAL' then 'social'
      when upper(category_id) = 'SCIENCE' then 'science'
      when upper(category_id) = 'MUSIC' then 'music'
      when upper(category_id) = 'CELEBS' then 'celebs'
      when upper(category_id) = 'ELECTIONS' then 'politics'
      when upper(category_id) = 'ALL' then null
      else lower(category_id)
    end;

    -- If after normalization it's still not a valid category id, null it out so FK can be added.
    update public.markets m
    set category_id = null
    where m.category_id is not null
      and not exists (
        select 1 from public.market_categories c where c.id = m.category_id
      );
  end if;
exception
  when undefined_table then
    null;
end
$$;

do $$
begin
  -- Add FK to market_categories if not present
  if not exists (
    select 1
    from pg_constraint
    where conname = 'markets_category_id_fkey'
      and conrelid = 'public.markets'::regclass
  ) then
    alter table public.markets
      add constraint markets_category_id_fkey
      foreign key (category_id)
      references public.market_categories (id)
      on update cascade
      on delete set null;
  end if;
exception
  when undefined_table then
    null;
end
$$;


