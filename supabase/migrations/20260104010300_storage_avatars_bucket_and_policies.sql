-- Storage bucket + RLS policies for user avatars
-- Bucket is public so avatars can be rendered without auth.
-- Users can only write to their own folder: avatars/{auth.uid()}/...

begin;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = excluded.public;

-- Public read
drop policy if exists "public read avatars" on storage.objects;
create policy "public read avatars"
on storage.objects
for select
using (bucket_id = 'avatars');

-- Users can upload into their own folder
drop policy if exists "user insert own avatars" on storage.objects;
create policy "user insert own avatars"
on storage.objects
for insert
with check (
  bucket_id = 'avatars'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own files
drop policy if exists "user update own avatars" on storage.objects;
create policy "user update own avatars"
on storage.objects
for update
using (
  bucket_id = 'avatars'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own files
drop policy if exists "user delete own avatars" on storage.objects;
create policy "user delete own avatars"
on storage.objects
for delete
using (
  bucket_id = 'avatars'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = auth.uid()::text
);

commit;


