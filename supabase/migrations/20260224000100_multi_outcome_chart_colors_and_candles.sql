begin;

alter table public.market_outcomes
  add column if not exists chart_color text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'market_outcomes_chart_color_hex_chk'
  ) then
    alter table public.market_outcomes
      add constraint market_outcomes_chart_color_hex_chk
      check (chart_color is null or chart_color ~* '^#[0-9A-F]{6}$');
  end if;
end $$;

update public.market_outcomes
set chart_color = '#' || upper(substr(md5((market_id::text || ':' || id::text)), 1, 6))
where chart_color is null or btrim(chart_color) = '';

create table if not exists public.market_outcome_price_candles (
  market_id uuid not null references public.markets(id) on delete cascade,
  outcome_id uuid not null references public.market_outcomes(id) on delete cascade,
  bucket timestamptz not null,
  open numeric not null,
  high numeric not null,
  low numeric not null,
  close numeric not null,
  volume_minor bigint not null default 0,
  trades_count integer not null default 0,
  primary key (market_id, outcome_id, bucket)
);

create index if not exists market_outcome_price_candles_bucket_idx
  on public.market_outcome_price_candles (bucket desc);

commit;
