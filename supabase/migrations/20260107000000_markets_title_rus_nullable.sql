-- Make title_rus nullable to support English-only markets
-- This allows markets to be created without Russian titles, focusing on English audience

alter table public.markets
  alter column title_rus drop not null;

comment on column public.markets.title_rus is 'Market title in Russian (optional, nullable for English-only markets)';
