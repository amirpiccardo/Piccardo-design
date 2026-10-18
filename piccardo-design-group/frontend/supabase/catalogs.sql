-- Cataloghi PDF per i rivenditori. Da eseguire dopo roles.sql (si può rieseguire).
-- I cataloghi si vedono solo dalla pagina nascosta /cataloghi/<chiave>:
-- la tabella non è leggibile dal sito, la funzione catalogs_by_key li restituisce
-- solo a chi conosce la chiave (che l'admin può cambiare per disattivare il vecchio link).

create table if not exists public.brand_catalogs (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands (id) on delete cascade,
  title text not null,
  file text not null,
  size bigint not null default 0,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists brand_catalogs_brand_idx on public.brand_catalogs (brand_id, position);

drop trigger if exists touch_brand_catalogs on public.brand_catalogs;
create trigger touch_brand_catalogs before update on public.brand_catalogs
  for each row execute function public.touch_updated_at();

-- Impostazioni non pubbliche (per ora solo la chiave del link dei cataloghi)
create table if not exists public.private_settings (
  key text primary key,
  value text not null
);
insert into public.private_settings (key, value)
values ('catalogs_key', encode(gen_random_bytes(12), 'hex'))
on conflict (key) do nothing;

alter table public.brand_catalogs enable row level security;
alter table public.private_settings enable row level security;

drop policy if exists "cataloghi redazione" on public.brand_catalogs;
create policy "cataloghi redazione" on public.brand_catalogs for all to authenticated
  using (public.can_edit()) with check (public.can_edit());

drop policy if exists "impostazioni redazione" on public.private_settings;
create policy "impostazioni redazione" on public.private_settings for all to authenticated
  using (public.can_edit()) with check (public.can_edit());

-- Elenco dei cataloghi raggruppati per marchio, solo con la chiave giusta
create or replace function public.catalogs_by_key(k text)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if k is null or length(k) < 16 or not exists (
    select 1 from private_settings where key = 'catalogs_key' and value = k
  ) then
    return null;
  end if;
  return coalesce((
    select json_agg(b order by b.position) from (
      select br.name, br.slug, br.logo, br.category, br.website, br.position,
        (select json_agg(json_build_object('title', c.title, 'file', c.file, 'size', c.size, 'updated', c.updated_at) order by c.position)
           from brand_catalogs c where c.brand_id = br.id) as catalogs
      from brands br
      where exists (select 1 from brand_catalogs c where c.brand_id = br.id)
    ) b
  ), '[]'::json);
end;
$$;
grant execute on function public.catalogs_by_key(text) to anon, authenticated;

-- File PDF: bucket separato, solo PDF, massimo 50 MB per file
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cataloghi', 'cataloghi', true, 52428800, array['application/pdf'])
on conflict (id) do update set public = true, file_size_limit = 52428800, allowed_mime_types = array['application/pdf'];

drop policy if exists "cataloghi caricamento" on storage.objects;
create policy "cataloghi caricamento" on storage.objects for insert to authenticated with check (bucket_id = 'cataloghi' and public.can_edit());
drop policy if exists "cataloghi modifica" on storage.objects;
create policy "cataloghi modifica" on storage.objects for update to authenticated using (bucket_id = 'cataloghi' and public.can_edit());
drop policy if exists "cataloghi eliminazione" on storage.objects;
create policy "cataloghi eliminazione" on storage.objects for delete to authenticated using (bucket_id = 'cataloghi' and public.can_edit());
