-- Liguria Design Group: schema Supabase.
-- Da eseguire una volta nel SQL Editor di Supabase, prima di seed.sql.
-- Rieseguirlo non fa danni: crea solo quello che manca.

create extension if not exists pgcrypto;

-- ─── Amministratori ──────────────────────────────────────────────────────────
-- Possono modificare il sito solo gli utenti la cui email è in questa tabella.
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ─── Aggiornamento automatico di updated_at ──────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Contenuti pubblici ──────────────────────────────────────────────────────
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  logo text not null default '',
  website text not null default '',
  category text not null default '',
  description text not null default '',
  photos jsonb not null default '[]'::jsonb,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contract_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo text not null default '',
  website text not null default '',
  category text not null default '',
  description text not null default '',
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contract_types (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text not null default '',
  photo text not null default '',
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  photo text not null default '',
  bio text not null default '',
  linkedin text not null default '',
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  key text primary key,
  fields jsonb not null default '{}'::jsonb,
  sections jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- ─── Dati raccolti dal sito ──────────────────────────────────────────────────
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  kind text not null default '',
  message text not null,
  read boolean not null default false,
  emailed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  referrer text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists page_views_created_at_idx on public.page_views (created_at);

-- Trigger updated_at
do $$
declare t text;
begin
  foreach t in array array['brands','contract_brands','contract_types','team_members','pages'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ─── Permessi (Row Level Security) ───────────────────────────────────────────
alter table public.admins enable row level security;
alter table public.brands enable row level security;
alter table public.contract_brands enable row level security;
alter table public.contract_types enable row level security;
alter table public.team_members enable row level security;
alter table public.pages enable row level security;
alter table public.contacts enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.page_views enable row level security;

-- Contenuti: tutti leggono, solo gli admin scrivono
do $$
declare t text;
begin
  foreach t in array array['brands','contract_brands','contract_types','team_members','pages'] loop
    execute format('drop policy if exists "lettura pubblica" on public.%I', t);
    execute format('create policy "lettura pubblica" on public.%I for select using (true)', t);
    execute format('drop policy if exists "scrittura admin" on public.%I', t);
    execute format('create policy "scrittura admin" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Admin: si vedono tra loro (la creazione passa dalla funzione /api/admin-users)
drop policy if exists "admin leggono admin" on public.admins;
create policy "admin leggono admin" on public.admins for select to authenticated using (public.is_admin());

-- Messaggi: arrivano dalla funzione /api/contact (chiave di servizio); gli admin li leggono e gestiscono
drop policy if exists "admin gestiscono contatti" on public.contacts;
create policy "admin gestiscono contatti" on public.contacts for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Newsletter: chiunque può iscriversi, solo gli admin vedono e cancellano
drop policy if exists "iscrizione pubblica" on public.newsletter_subscribers;
create policy "iscrizione pubblica" on public.newsletter_subscribers for insert to anon, authenticated
  with check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' and length(email) <= 254);
drop policy if exists "admin gestiscono iscritti" on public.newsletter_subscribers;
create policy "admin gestiscono iscritti" on public.newsletter_subscribers for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Visite: il sito registra la pagina (solo con consenso), gli admin vedono le statistiche
drop policy if exists "registra visita" on public.page_views;
create policy "registra visita" on public.page_views for insert to anon, authenticated
  with check (length(path) <= 200 and length(referrer) <= 300 and path not like '/admin%' and path not like '/login%');
drop policy if exists "admin leggono visite" on public.page_views;
create policy "admin leggono visite" on public.page_views for select to authenticated using (public.is_admin());

-- Statistiche aggregate per la panoramica dell'admin
create or replace function public.page_stats()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare result json;
begin
  if not public.is_admin() then
    raise exception 'non autorizzato';
  end if;
  select json_build_object(
    'total', (select count(*) from page_views),
    'last30', (select count(*) from page_views where created_at >= now() - interval '30 days'),
    'topPages', coalesce((
      select json_agg(t) from (
        select path, count(*) as count from page_views
        group by path order by count desc limit 8
      ) t), '[]'::json),
    'byDay', coalesce((
      select json_agg(d) from (
        select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day, count(*) as count
        from page_views where created_at >= now() - interval '30 days'
        group by 1 order by 1
      ) d), '[]'::json)
  ) into result;
  return result;
end;
$$;
grant execute on function public.page_stats() to authenticated;

-- Pulizia: visite più vecchie di 13 mesi (chiamata dall'admin all'apertura della panoramica)
create or replace function public.prune_page_views()
returns void
language sql
security definer
set search_path = public
as $$
  delete from page_views where created_at < now() - interval '395 days' and public.is_admin();
$$;
grant execute on function public.prune_page_views() to authenticated;

-- ─── Immagini (Storage) ──────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media lettura pubblica" on storage.objects;
create policy "media lettura pubblica" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media caricamento admin" on storage.objects;
create policy "media caricamento admin" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media modifica admin" on storage.objects;
create policy "media modifica admin" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media eliminazione admin" on storage.objects;
create policy "media eliminazione admin" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
