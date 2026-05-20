alter table public.profiles 
  add column if not exists formato_rosto text,
  add column if not exists cabelo_comprimento text,
  add column if not exists cabelo_textura text;

create table if not exists public.consultas_salvas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ocasiao text not null,
  formato_rosto text,
  cabelo_comprimento text,
  cabelo_textura text,
  penteado_id text,
  pecas_look uuid[],
  maquiagem jsonb,
  joias jsonb,
  favorito boolean default false,
  created_at timestamptz default now()
);

alter table public.consultas_salvas enable row level security;

create policy "Usuários veem suas consultas" 
  on public.consultas_salvas for select 
  using (auth.uid() = user_id);

create policy "Usuários criam consultas" 
  on public.consultas_salvas for insert 
  with check (auth.uid() = user_id);

create policy "Usuários atualizam suas consultas" 
  on public.consultas_salvas for update 
  using (auth.uid() = user_id);

create policy "Usuários deletam suas consultas" 
  on public.consultas_salvas for delete 
  using (auth.uid() = user_id);