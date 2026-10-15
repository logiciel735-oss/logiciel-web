-- =====================================================================
-- Auditoría: solo acciones de editores y administradores en sus funciones
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Es idempotente: se puede ejecutar más de una vez.
--
-- Se registra:
--   · Contenido y miembros: crear, editar, eliminar (hecho por editor o admin).
--   · Usuarios: lo que un admin hace sobre otras cuentas (cambio de rol,
--     edición de datos desde Gestión de usuarios, eliminación).
-- No se registra:
--   · Lo que hace un usuario normal (registro, editar su perfil, subir su foto).
--   · Ediciones del propio perfil, aunque sea de un editor o admin.
--   · Cambios automáticos en cascada de otros triggers (p. ej. la ficha de
--     miembro que se sincroniza con el perfil).
-- =====================================================================


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
  -- Cambios en cascada provocados por otro trigger: no son una acción directa
  if pg_trigger_depth() > 1 then
    return null;
  end if;

  -- Solo acciones de editores y administradores
  if v_uid is null then
    return null;
  end if;

  select email, role into v_email, v_rol from public.users where id = v_uid;

  if v_rol is null or v_rol not in ('editor', 'admin') then
    return null;
  end if;

  -- Usuarios: solo lo que un admin hace sobre OTRAS cuentas (rol, datos, eliminación).
  -- El registro y la edición del propio perfil no se auditan.
  if tg_table_name = 'users' then
    if tg_op = 'INSERT' or (v_fila ->> 'id') = v_uid::text then
      return null;
    end if;
  end if;

  if tg_op = 'UPDATE' then
    -- Solo los campos que realmente cambiaron
    select jsonb_object_agg(n.key, v_old -> n.key), jsonb_object_agg(n.key, n.value)
      into v_antes, v_despues
    from jsonb_each(v_new) as n
    where (v_old -> n.key) is distinct from n.value;

    if v_despues is null then
      return null;   -- UPDATE sin cambios reales
    end if;

  else
    v_antes   := v_old;
    v_despues := v_new;
  end if;

  insert into public.auditoria
    (usuario_id, usuario_email, usuario_rol, tabla, accion, registro_id, descripcion, antes, despues)
  values (
    v_uid,
    v_email,
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


-- Limpiar del historial lo que ya no se registraría con estas reglas
delete from public.auditoria a
where a.usuario_rol is null
   or a.usuario_rol not in ('editor', 'admin')
   -- registros de cuentas nuevas y ediciones del propio perfil
   or (a.tabla = 'users' and (a.accion = 'INSERT' or a.registro_id = a.usuario_id::text))
   -- sincronización automática de la propia ficha de miembro (nombre / foto)
   or (a.tabla = 'miembros' and a.accion = 'UPDATE'
       and exists (select 1 from public.miembros m
                   where m.id::text = a.registro_id and m.user_id::text = a.usuario_id::text)
       and (select bool_and(k in ('name', 'image')) from jsonb_object_keys(coalesce(a.despues, '{}'::jsonb)) as k));


notify pgrst, 'reload schema';
