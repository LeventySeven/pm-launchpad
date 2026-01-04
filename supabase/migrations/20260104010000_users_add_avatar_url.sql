-- User-editable avatar URL (separate from Telegram photo_url)
-- The app will prefer avatar_url, and fall back to telegram_photo_url when null.

alter table public.users
  add column if not exists avatar_url text;


