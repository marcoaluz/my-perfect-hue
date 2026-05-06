
update storage.buckets set public = false where id = 'fotos';

drop policy if exists "Fotos leitura pública por arquivo" on storage.objects;
create policy "Fotos leitura própria"
  on storage.objects for select
  using (
    bucket_id = 'fotos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
