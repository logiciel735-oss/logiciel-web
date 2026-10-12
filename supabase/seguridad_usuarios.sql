-- =====================================================================
-- Seguridad: la tabla users deja de ser pública
-- Ejecutar en: Supabase Dashboard → SQL Editor (antes de desplegar el frontend)
-- Es idempotente: se puede ejecutar más de una vez.
--
-- Antes: cualquiera (incluso sin sesión) podía leer TODAS las columnas de
-- TODOS los usuarios (correo, rol, teléfono...) usando la anon key.
-- Ahora:
--   · cada usuario solo lee su propia fila; los admins leen todas;
--   · el perfil público de un MIEMBRO del grupo se obtiene con la función
--     perfil_publico(uid), que devuelve solo campos aptos para publicar.
-- =====================================================================


-- 1. Lectura de users: propia fila o admin
drop policy if exists "users_lectura_publica" on public.users;
drop policy if exists "users_lectura_propia_o_admin" on public.users;

create policy "users_lectura_propia_o_admin" on public.users
  for select to authenticated
  using (id = auth.uid() or public.is_admin());


-- 2. Perfil público de un miembro del grupo
--    Solo responde si el usuario está en la tabla miembros.
--    No expone rol de la plataforma, teléfono ni datos internos.
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
