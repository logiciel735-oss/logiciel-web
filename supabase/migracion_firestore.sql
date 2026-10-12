-- =====================================================================
-- Migración Firestore + Django → Supabase
-- Ejecutar completo en: Supabase Dashboard → SQL Editor
-- Es idempotente: se puede ejecutar más de una vez.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Columnas que usa el frontend y no existen en las tablas
-- ---------------------------------------------------------------------
alter table public.proyectos
  add column if not exists fecha_creacion timestamptz not null default now();

alter table public.publicaciones_cientificas
  add column if not exists id_revista   text,
  add column if not exists link_revista text;

alter table public.lineas_investigacion
  add column if not exists coordinador text,
  add column if not exists imagen_url  text,
  add column if not exists estado      text default 'activa';

alter table public.semilleros
  add column if not exists slogan     text,
  add column if not exists link       text,
  add column if not exists imagen_url text;

-- Copiar datos de las columnas con otro nombre (si ya había datos)
update public.lineas_investigacion set imagen_url = image   where imagen_url is null and image   is not null;
update public.semilleros           set imagen_url = image   where imagen_url is null and image   is not null;
update public.publicaciones_cientificas set id_revista = revista where id_revista is null and revista is not null;


-- ---------------------------------------------------------------------
-- 2. ¿El usuario actual es admin?
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;


-- ---------------------------------------------------------------------
-- 3. Tablas de contenido: lectura pública, escritura solo admin
-- ---------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'noticias', 'eventos', 'proyectos', 'publicaciones_cientificas',
    'lineas_investigacion', 'semilleros', 'aliados_institucionales', 'miembros'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "lectura_publica" on public.%I', t);
    execute format('create policy "lectura_publica" on public.%I for select using (true)', t);

    execute format('drop policy if exists "admin_insert" on public.%I', t);
    execute format('create policy "admin_insert" on public.%I for insert to authenticated with check (public.is_admin())', t);

    execute format('drop policy if exists "admin_update" on public.%I', t);
    execute format('create policy "admin_update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);

    execute format('drop policy if exists "admin_delete" on public.%I', t);
    execute format('create policy "admin_delete" on public.%I for delete to authenticated using (public.is_admin())', t);
  end loop;
end $$;


-- ---------------------------------------------------------------------
-- 4. Tabla users
-- ---------------------------------------------------------------------
alter table public.users enable row level security;

drop policy if exists "users_lectura_publica" on public.users;
create policy "users_lectura_publica" on public.users
  for select using (true);

drop policy if exists "users_insert_propio" on public.users;
create policy "users_insert_propio" on public.users
  for insert to authenticated with check (id = auth.uid());

drop policy if exists "users_update_propio_o_admin" on public.users;
create policy "users_update_propio_o_admin" on public.users
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "users_delete_admin" on public.users;
create policy "users_delete_admin" on public.users
  for delete to authenticated using (public.is_admin());

-- Un usuario normal no puede cambiar su propio rol.
-- (Desde el SQL Editor sí se puede, para crear el primer admin.)
create or replace function public.proteger_rol()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') <> 'authenticated' or public.is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.role := 'user';
  elsif new.role is distinct from old.role then
    raise exception 'Solo un administrador puede cambiar el rol';
  end if;

  return new;
end;
$$;

drop trigger if exists proteger_rol on public.users;
create trigger proteger_rol
  before insert or update on public.users
  for each row execute function public.proteger_rol();


-- ---------------------------------------------------------------------
-- 5. Perfil en public.users al registrarse en Supabase Auth
--    OJO: si ya tienes otro trigger sobre auth.users que crea el perfil,
--    revisa con:  select tgname from pg_trigger where tgrelid = 'auth.users'::regclass;
--    y deja solo uno.
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name, role, email_verified)
  values (
    new.id,
    new.email,
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

-- Mantener email y email_verified sincronizados con Supabase Auth
create or replace function public.handle_user_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
  set email = new.email,
      email_verified = new.email_confirmed_at is not null
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update of email, email_confirmed_at on auth.users
  for each row execute function public.handle_user_update();


-- ---------------------------------------------------------------------
-- 6. Eliminar usuario (cuenta de Auth + perfil). Solo admin.
--    Lo llama el frontend con supabase.rpc('admin_delete_user', ...)
-- ---------------------------------------------------------------------
create or replace function public.admin_delete_user(target_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;

  if target_id = auth.uid() then
    raise exception 'No puedes eliminar tu propia cuenta';
  end if;

  delete from public.users where id = target_id;
  delete from auth.users where id = target_id;
end;
$$;

revoke execute on function public.admin_delete_user(uuid) from public, anon;
grant execute on function public.admin_delete_user(uuid) to authenticated;


-- ---------------------------------------------------------------------
-- 7. Formulario de contacto: cualquiera inserta, solo admin lee.
--    Mismos límites que tenía Django (10 minutos).
-- ---------------------------------------------------------------------
alter table public.contacto_mensajes enable row level security;

drop policy if exists "contacto_insert_publico" on public.contacto_mensajes;
create policy "contacto_insert_publico" on public.contacto_mensajes
  for insert to anon, authenticated with check (true);

drop policy if exists "contacto_admin_select" on public.contacto_mensajes;
create policy "contacto_admin_select" on public.contacto_mensajes
  for select to authenticated using (public.is_admin());

drop policy if exists "contacto_admin_update" on public.contacto_mensajes;
create policy "contacto_admin_update" on public.contacto_mensajes
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "contacto_admin_delete" on public.contacto_mensajes;
create policy "contacto_admin_delete" on public.contacto_mensajes
  for delete to authenticated using (public.is_admin());

create or replace function public.contacto_validar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ip   text;
  limite timestamptz := now() - interval '10 minutes';
begin
  v_ip := coalesce(
    nullif(trim(split_part(
      current_setting('request.headers', true)::json ->> 'x-forwarded-for', ',', 1
    )), ''),
    'unknown'
  );

  new.email      := lower(trim(new.email));
  new.ip         := v_ip;
  new.read       := false;
  new.created_at := now();

  if length(coalesce(new.name, '')) < 3 or length(new.name) > 100 then
    raise exception 'El nombre debe tener entre 3 y 100 caracteres.';
  end if;

  if length(coalesce(new.subject, '')) = 0 or length(new.subject) > 200 then
    raise exception 'El asunto es obligatorio (máximo 200 caracteres).';
  end if;

  if length(coalesce(new.message, '')) < 10 then
    raise exception 'El mensaje es muy corto.';
  end if;

  if length(new.message) > 2000 then
    raise exception 'El mensaje es muy largo (máximo 2000 caracteres).';
  end if;

  if exists (
    select 1 from public.contacto_mensajes
    where email = new.email and created_at >= limite
  ) then
    raise exception 'Ya enviaste un mensaje con este correo. Intenta en 10 minutos.';
  end if;

  if v_ip <> 'unknown' and (
    select count(*) from public.contacto_mensajes
    where ip = v_ip and created_at >= limite
  ) >= 2 then
    raise exception 'Has enviado demasiados mensajes desde esta red. Intenta en 10 minutos.';
  end if;

  if (
    select count(*) from public.contacto_mensajes
    where created_at >= limite
  ) >= 20 then
    raise exception 'Servicio temporalmente saturado. Intenta más tarde.';
  end if;

  return new;
end;
$$;

drop trigger if exists contacto_validar on public.contacto_mensajes;
create trigger contacto_validar
  before insert on public.contacto_mensajes
  for each row execute function public.contacto_validar();


-- ---------------------------------------------------------------------
-- 8. Primer administrador (ejecutar una vez con tu correo)
-- ---------------------------------------------------------------------
-- update public.users set role = 'admin' where email = 'tu-correo@ejemplo.com';
