insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'log-attachments',
  'log-attachments',
  false,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/json'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Team members can read log attachments" on storage.objects;
create policy "Team members can read log attachments"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'log-attachments'
  and public.is_team_member((storage.foldername(name))[1]::uuid)
);

drop policy if exists "Writers can upload log attachments" on storage.objects;
create policy "Writers can upload log attachments"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'log-attachments'
  and public.can_write_team((storage.foldername(name))[1]::uuid)
  and auth.uid()::text = (storage.foldername(name))[2]
);

drop policy if exists "Writers can update their team attachments" on storage.objects;
create policy "Writers can update their team attachments"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'log-attachments'
  and public.can_write_team((storage.foldername(name))[1]::uuid)
)
with check (
  bucket_id = 'log-attachments'
  and public.can_write_team((storage.foldername(name))[1]::uuid)
);

drop policy if exists "Writers can delete their team attachments" on storage.objects;
create policy "Writers can delete their team attachments"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'log-attachments'
  and public.can_write_team((storage.foldername(name))[1]::uuid)
);
