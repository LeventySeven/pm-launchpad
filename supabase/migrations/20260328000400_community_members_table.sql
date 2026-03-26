begin;

create table if not exists public.community_members (
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role community_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

create index if not exists community_members_user_id_idx
  on public.community_members (user_id);
create index if not exists community_members_community_id_role_idx
  on public.community_members (community_id, role);

alter table public.community_members enable row level security;

-- Public read: anyone can see community members
create policy "community_members_select_all"
  on public.community_members for select using (true);

-- Authenticated users can join (insert themselves)
create policy "community_members_insert_own"
  on public.community_members for insert
  with check (user_id = auth.uid());

-- Users can leave (delete themselves)
create policy "community_members_delete_own"
  on public.community_members for delete
  using (user_id = auth.uid());

grant select on table public.community_members to anon;
grant select on table public.community_members to authenticated;
grant all on table public.community_members to service_role;

-- Trigger to maintain member_count on communities
create or replace function public.update_community_member_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.communities set member_count = member_count + 1 where id = NEW.community_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.communities set member_count = greatest(0, member_count - 1) where id = OLD.community_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_community_members_count on public.community_members;
create trigger trg_community_members_count
  after insert or delete on public.community_members
  for each row execute function public.update_community_member_count();

commit;
