-- =====================================================================
-- Rol "editor" y auditoría de cambios
-- Ejecutar en: Supabase Dashboard → SQL Editor (antes de desplegar el frontend)
-- Es idempotente: se puede ejecutar más de una vez.
--
--  Acción                 user  editor  admin
--  Ver contenido           ✔      ✔      ✔
--  Crear/editar/eliminar   ✘      ✔      ✔   (contenido y miembros)
--  Eliminar usuarios       ✘      ✘      ✔
--  Cambiar roles           ✘      ✘      ✔
--  Ver auditoría           ✘      ✘      ✔
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Roles válidos
-- ---------------------------------------------------------------------
update public.users set role = 'user'
where role is null or role not in ('user', 'editor', 'admin');

alter table public.users alter column role set default 'user';

-- Quitar cualquier CHECK anterior sobre role (p. ej. uno que solo permitía 'admin' y 'user'):
-- los CHECK se suman, así que uno viejo bloquearía el rol 'editor'.
do $$
declare
  c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.users'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%role%'
  loop
    execute format('alter table public.users drop constraint %I', c.conname);
  end loop;
end $$;

alter table public.users
  add constraint users_role_valido check (role in ('user', 'editor', 'admin'));


-- ---------------------------------------------------------------------
-- 2. ¿El usuario actual puede gestionar contenido? (editor o admin)
-- ---------------------------------------------------------------------
create or replace function public.puede_editar()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role in ('editor', 'admin')
  );
$$;


-- ---------------------------------------------------------------------
-- 3. Contenido y miembros: escritura para editor y admin
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
    execute format('drop policy if exists "admin_insert" on public.%I', t);
    execute format('drop policy if exists "admin_update" on public.%I', t);
    execute format('drop policy if exists "admin_delete" on public.%I', t);
    execute format('drop policy if exists "editor_insert" on public.%I', t);
    execute format('drop policy if exists "editor_update" on public.%I', t);
    execute format('drop policy if exists "editor_delete" on public.%I', t);

    execute format('create policy "editor_insert" on public.%I for insert to authenticated with check (public.puede_editar())', t);
    execute format('create policy "editor_update" on public.%I for update to authenticated using (public.puede_editar()) with check (public.puede_editar())', t);
    execute format('create policy "editor_delete" on public.%I for delete to authenticated using (public.puede_editar())', t);
  end loop;
end $$;


-- ---------------------------------------------------------------------
-- 4. users: el editor puede leer la lista (la necesita para agregar miembros).
--    Editar a otros usuarios, borrarlos y cambiar roles sigue siendo solo admin.
-- ---------------------------------------------------------------------
drop policy if exists "users_lectura_propia_o_admin" on public.users;
drop policy if exists "users_lectura_propia_o_equipo" on public.users;

create policy "users_lectura_propia_o_equipo" on public.users
  for select to authenticated
  using (id = auth.uid() or public.puede_editar());


-- Solo un admin cambia roles, y nunca el suyo propio (evita quedarse sin admin)
create or replace function public.proteger_rol()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- SQL Editor / procesos internos (p. ej. registro): sin restricciones
  if coalesce(auth.role(), '') <> 'authenticated' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if not public.is_admin() then
      new.role := 'user';
    end if;
    return new;
  end if;

  if new.role is distinct from old.role then
    if not public.is_admin() then
      raise exception 'Solo un administrador puede cambiar el rol';
    end if;
    if new.id = auth.uid() then
      raise exception 'No puedes cambiar tu propio rol';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists proteger_rol on public.users;
create trigger proteger_rol
  before insert or update on public.users
  for each row execute function public.proteger_rol();


-- ---------------------------------------------------------------------
-- 5. Auditoría
-- ---------------------------------------------------------------------
create table if not exists public.auditoria (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  usuario_id    uuid,                 -- sin FK: el historial se conserva aunque se borre el usuario
  usuario_email text,
  usuario_rol   text,
  tabla         text not null,
  accion        text not null check (accion in ('INSERT', 'UPDATE', 'DELETE')),
  registro_id   text,
  descripcion   text,                 -- título / nombre del registro afectado
  antes         jsonb,                -- UPDATE: solo los campos que cambiaron
  despues       jsonb
);

create index if not exists auditoria_created_at_idx on public.auditoria (created_at desc);
create index if not exists auditoria_tabla_idx      on public.auditoria (tabla);
create index if not exists auditoria_usuario_idx    on public.auditoria (usuario_id);

-- Nadie escribe ni borra la auditoría desde la web; solo el admin la lee
alter table public.auditoria enable row level security;

revoke all on public.auditoria from anon, authenticated;
grant select on public.auditoria to authenticated;

drop policy if exists "auditoria_lectura_admin" on public.auditoria;
create policy "auditoria_lectura_admin" on public.auditoria
  for select to authenticated using (public.is_admin());


create or replace function public.registrar_auditoria()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old     jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end;
  v_new     jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end;
  v_fila    jsonb := coalesce(v_new, v_old);
  v_antes   jsonb;
  v_despues jsonb;
  v_uid     uuid  := auth.uid();
  v_email   text;
  v_rol     text;
begin
  if tg_op = 'UPDATE' then
    -- Solo los campos que realmente cambiaron
    select jsonb_object_agg(n.key, v_old -> n.key), jsonb_object_agg(n.key, n.value)
      into v_antes, v_despues
    from jsonb_each(v_new) as n
    where (v_old -> n.key) is distinct from n.value;

    if v_despues is null then
      return null;   -- UPDATE sin cambios reales: no se registra
    end if;
  else
    v_antes   := v_old;
    v_despues := v_new;
  end if;

  if v_uid is not null then
    select email, role into v_email, v_rol from public.users where id = v_uid;
  end if;

  insert into public.auditoria
    (usuario_id, usuario_email, usuario_rol, tabla, accion, registro_id, descripcion, antes, despues)
  values (
    v_uid,
    coalesce(v_email, case when v_uid is null then 'sistema' end),
    v_rol,
    tg_table_name,
    tg_op,
    v_fila ->> 'id',
    left(coalesce(v_fila ->> 'titulo', v_fila ->> 'title', v_fila ->> 'nombre',
                  v_fila ->> 'name', v_fila ->> 'email'), 200),
    v_antes,
    v_despues
  );

  return null;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'noticias', 'eventos', 'proyectos', 'publicaciones_cientificas',
    'lineas_investigacion', 'semilleros', 'aliados_institucionales', 'miembros', 'users'
  ]
  loop
    execute format('drop trigger if exists auditoria on public.%I', t);
    execute format(
      'create trigger auditoria after insert or update or delete on public.%I
         for each row execute function public.registrar_auditoria()', t);
  end loop;
end $$;


notify pgrst, 'reload schema';
