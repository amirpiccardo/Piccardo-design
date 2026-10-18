-- Ruoli dell'area riservata. Da eseguire dopo schema.sql (si può rieseguire).
--   admin    : tutto, compresi gli utenti
--   editor   : pagine, marchi, persone, contract, messaggi e newsletter
--   messages : solo messaggi e newsletter

alter table public.admins add column if not exists role text not null default 'admin';
alter table public.admins drop constraint if exists admins_role_check;
alter table public.admins add constraint admins_role_check check (role in ('admin', 'editor', 'messages'));
alter table public.admins add column if not exists invited_by text not null default '';

create or replace function public.my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.admins
  where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  limit 1;
$$;
grant execute on function public.my_role() to authenticated;

-- is_admin() = può entrare nell'area riservata (qualsiasi ruolo)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select public.my_role() is not null; $$;

create or replace function public.can_edit()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce(public.my_role() in ('admin', 'editor'), false); $$;

create or replace function public.can_manage_users()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce(public.my_role() = 'admin', false); $$;
grant execute on function public.can_edit() to authenticated;
grant execute on function public.can_manage_users() to authenticated;

-- Contenuti: scrivono amministratori e redattori
do $$
declare t text;
begin
  foreach t in array array['brands','contract_brands','contract_types','team_members','pages'] loop
    execute format('drop policy if exists "scrittura admin" on public.%I', t);
    execute format('create policy "scrittura admin" on public.%I for all to authenticated using (public.can_edit()) with check (public.can_edit())', t);
  end loop;
end $$;

-- Immagini: caricano e cancellano amministratori e redattori
drop policy if exists "media caricamento admin" on storage.objects;
create policy "media caricamento admin" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.can_edit());
drop policy if exists "media modifica admin" on storage.objects;
create policy "media modifica admin" on storage.objects for update to authenticated using (bucket_id = 'media' and public.can_edit());
drop policy if exists "media eliminazione admin" on storage.objects;
create policy "media eliminazione admin" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.can_edit());

-- Utenti: ognuno vede sé stesso, l'amministratore vede tutti (inviti e modifiche passano dal server)
drop policy if exists "admin leggono admin" on public.admins;
create policy "admin leggono admin" on public.admins for select to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')) or public.can_manage_users());

-- Messaggi, newsletter e statistiche: tutti i ruoli (già legati a is_admin)
