
-- Restrict bucket listing: only owner can list their own folder
drop policy if exists "Fotos públicas leitura" on storage.objects;
create policy "Fotos leitura pública por arquivo"
  on storage.objects for select
  using (bucket_id = 'fotos');
-- (mantemos leitura pública porque as URLs servem o app; é o padrão para fotos exibidas)

-- Revoke public execute on the trigger function
revoke execute on function public.handle_new_user() from public, anon, authenticated;
