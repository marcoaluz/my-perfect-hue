update storage.buckets set public = true where id = 'fotos';

drop policy if exists "Fotos public read" on storage.objects;
create policy "Fotos public read"
on storage.objects for select
using (bucket_id = 'fotos');

drop policy if exists "Fotos user upload" on storage.objects;
create policy "Fotos user upload"
on storage.objects for insert
with check (bucket_id = 'fotos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Fotos user update" on storage.objects;
create policy "Fotos user update"
on storage.objects for update
using (bucket_id = 'fotos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Fotos user delete" on storage.objects;
create policy "Fotos user delete"
on storage.objects for delete
using (bucket_id = 'fotos' and auth.uid()::text = (storage.foldername(name))[1]);
