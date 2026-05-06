
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  subtom text,
  paleta_sazonal text,
  plano text not null default 'free',
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles select own" on public.profiles for select using (auth.uid() = id);
create policy "Profiles insert own" on public.profiles for insert with check (auth.uid() = id);
create policy "Profiles update own" on public.profiles for update using (auth.uid() = id);

-- analises
create table public.analises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  foto_url text,
  subtom_detectado text,
  paleta jsonb,
  confianca float,
  created_at timestamptz not null default now()
);
alter table public.analises enable row level security;
create policy "Analises own" on public.analises for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- pecas_roupa
create table public.pecas_roupa (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  foto_url text,
  categoria text,
  cor_hex text,
  combina_com_subtom boolean default true,
  created_at timestamptz not null default now()
);
alter table public.pecas_roupa enable row level security;
create policy "Pecas own" on public.pecas_roupa for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- looks
create table public.looks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pecas uuid[] not null default '{}',
  ocasiao text,
  favorito boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.looks enable row level security;
create policy "Looks own" on public.looks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- trigger: cria profile quando um novo usuário se cadastra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- bucket de fotos
insert into storage.buckets (id, name, public) values ('fotos', 'fotos', true);

create policy "Fotos públicas leitura"
  on storage.objects for select
  using (bucket_id = 'fotos');

create policy "Usuários autenticados enviam suas fotos"
  on storage.objects for insert
  with check (
    bucket_id = 'fotos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Usuários atualizam suas fotos"
  on storage.objects for update
  using (
    bucket_id = 'fotos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Usuários removem suas fotos"
  on storage.objects for delete
  using (
    bucket_id = 'fotos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
