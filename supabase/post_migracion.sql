-- =====================================================================
-- Después de copiar la base de datos a un proyecto Supabase NUEVO
-- (solo para la migración con pg_dump; NO hace falta si se transfiere el proyecto)
-- Ejecutar en: proyecto nuevo → SQL Editor
-- =====================================================================


-- 1. Triggers sobre auth.users (pg_dump del esquema public no los incluye)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update of email, email_confirmed_at on auth.users
  for each row execute function public.handle_user_update();


-- 2. Quitar el webhook copiado del proyecto viejo (apunta a la URL antigua).
--    Se vuelve a crear desde Database → Webhooks.
do $$
declare
  t record;
begin
  for t in
    select tg.tgname
    from pg_trigger tg
    join pg_proc p on p.oid = tg.tgfoid
    where tg.tgrelid = 'public.contacto_mensajes'::regclass
      and p.proname = 'http_request'
  loop
    execute format('drop trigger %I on public.contacto_mensajes', t.tgname);
  end loop;
end $$;


notify pgrst, 'reload schema';
