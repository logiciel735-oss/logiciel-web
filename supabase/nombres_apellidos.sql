-- =====================================================================
-- Nombres y apellidos separados en public.users
-- Ejecutar en: Supabase Dashboard → SQL Editor (antes de desplegar el frontend)
-- Es idempotente: se puede ejecutar más de una vez.
--
-- · Nuevas columnas: nombres, apellidos.
-- · La columna name (nombre completo) se sigue usando en toda la app y ahora
--   se compone sola: name = nombres + ' ' + apellidos.
-- =====================================================================


-- 1. Columnas
alter table public.users
  add column if not exists nombres   text,
  add column if not exists apellidos text;

-- Usuarios que ya existían: el nombre completo pasa a "nombres"
update public.users
set nombres = name
where nombres is null and apellidos is null and name is not null;


-- 2. name se compone automáticamente a partir de nombres y apellidos
create or replace function public.componer_nombre()
returns trigger
language plpgsql
as $$
begin
  new.nombres   := nullif(btrim(regexp_replace(coalesce(new.nombres, ''),   '\s+', ' ', 'g')), '');
  new.apellidos := nullif(btrim(regexp_replace(coalesce(new.apellidos, ''), '\s+', ' ', 'g')), '');

  if new.nombres is not null or new.apellidos is not null then
    new.name := btrim(coalesce(new.nombres, '') || ' ' || coalesce(new.apellidos, ''));
  end if;

  return new;
end;
$$;

drop trigger if exists componer_nombre on public.users;
create trigger componer_nombre
  before insert or update on public.users
  for each row execute function public.componer_nombre();


-- 3. Al registrarse, guardar nombres y apellidos enviados en el formulario
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, nombres, apellidos, name, role, email_verified)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'nombres', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(new.email, '@', 1)
    ),
    nullif(new.raw_user_meta_data ->> 'apellidos', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1)),
    'user',
    new.email_confirmed_at is not null
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 4. Perfil público de un miembro: incluye nombres y apellidos
create or replace function public.perfil_publico(p_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id',          j -> 'id',
    'name',        j -> 'name',
    'nombres',     j -> 'nombres',
    'apellidos',   j -> 'apellidos',
    'email',       j -> 'email',        -- se muestra como contacto en el perfil público
    'avatar',      j -> 'avatar',
    'universidad', j -> 'universidad',
    'carrera',     j -> 'carrera',
    'descripcion', j -> 'descripcion',
    'cvlac_url',   j -> 'cvlac_url'
  )
  from public.users u
  cross join lateral (select to_jsonb(u) as j) as x
  where u.id = p_id
    and exists (select 1 from public.miembros m where m.user_id::text = u.id::text);
$$;

revoke execute on function public.perfil_publico(uuid) from public;
grant execute on function public.perfil_publico(uuid) to anon, authenticated;


notify pgrst, 'reload schema';
