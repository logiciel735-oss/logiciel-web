-- =====================================================================
-- Recuperación de contraseña: verificar que el correo esté registrado
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- =====================================================================

-- Devuelve true si existe una cuenta en Supabase Auth con ese correo.
-- security definer: auth.users no es accesible para anon directamente.
create or replace function public.email_registrado(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from auth.users
    where lower(email) = lower(trim(p_email))
      and deleted_at is null
  );
$$;

revoke execute on function public.email_registrado(text) from public;
grant execute on function public.email_registrado(text) to anon, authenticated;
