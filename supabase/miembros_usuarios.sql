-- =====================================================================
-- Al eliminar un usuario, se elimina también su ficha de miembro
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Es idempotente: se puede ejecutar más de una vez.
--
-- La FK de miembros.user_id (si existe) deja el campo en NULL al borrar el
-- usuario, así que la ficha quedaba huérfana. El trigger se ejecuta ANTES del
-- borrado, cuando user_id todavía apunta al usuario, y cubre cualquier origen:
-- la web (admin_delete_user) o el panel de Supabase.
-- =====================================================================


-- 1. Trigger: antes de borrar un perfil de users, borrar su fila en miembros
create or replace function public.borrar_miembro_de_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.miembros where user_id::text = old.id::text;
  return old;
end;
$$;

drop trigger if exists borrar_miembro_de_usuario on public.users;
create trigger borrar_miembro_de_usuario
  before delete on public.users
  for each row execute function public.borrar_miembro_de_usuario();


-- 2. Limpiar fichas huérfanas: sin usuario (user_id NULL) o con un usuario que ya no existe.
--    Toda ficha de miembro se crea a partir de una cuenta, así que estas son restos.
delete from public.miembros m
where m.user_id is null
   or not exists (select 1 from public.users u where u.id::text = m.user_id::text);


notify pgrst, 'reload schema';
