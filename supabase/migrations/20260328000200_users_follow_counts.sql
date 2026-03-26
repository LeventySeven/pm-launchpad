begin;

-- Denormalized follower/following counts on users table.
-- Maintained by trigger on user_follows — avoids COUNT(*) on every profile view.

alter table public.users
  add column if not exists follower_count integer not null default 0,
  add column if not exists following_count integer not null default 0;

-- Trigger function to increment/decrement counts
create or replace function public.update_follow_counts()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.users set following_count = following_count + 1 where id = NEW.follower_id;
    update public.users set follower_count = follower_count + 1 where id = NEW.following_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.users set following_count = greatest(0, following_count - 1) where id = OLD.follower_id;
    update public.users set follower_count = greatest(0, follower_count - 1) where id = OLD.following_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_user_follows_counts on public.user_follows;
create trigger trg_user_follows_counts
  after insert or delete on public.user_follows
  for each row execute function public.update_follow_counts();

-- Backfill existing data (safe no-op if table is empty)
update public.users u set
  follower_count = (select count(*) from public.user_follows where following_id = u.id),
  following_count = (select count(*) from public.user_follows where follower_id = u.id);

commit;
