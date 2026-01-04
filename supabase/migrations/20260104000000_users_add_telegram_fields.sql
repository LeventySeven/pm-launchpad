-- Telegram Mini App: one-click auth support
-- Adds Telegram identity fields to public.users and a partial unique index on telegram_id.

alter table public.users
  add column if not exists telegram_id bigint,
  add column if not exists telegram_username text,
  add column if not exists telegram_first_name text,
  add column if not exists telegram_last_name text,
  add column if not exists telegram_photo_url text,
  add column if not exists telegram_auth_date timestamptz;

create unique index if not exists users_telegram_id_unique
  on public.users (telegram_id)
  where telegram_id is not null;


