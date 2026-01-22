create table if not exists public.market_context (
  market_id uuid primary key references public.markets(id) on delete cascade,
  context text not null,
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
