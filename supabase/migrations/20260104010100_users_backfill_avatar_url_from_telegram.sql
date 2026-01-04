-- Backfill avatar_url from Telegram photo for existing users.
-- This keeps a single "current avatar" field while preserving telegram_photo_url for reference.

update public.users
set avatar_url = telegram_photo_url
where avatar_url is null
  and telegram_photo_url is not null;


