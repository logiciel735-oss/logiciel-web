-- =====================================================================
-- Nombres de personas sin números (refuerzo de la validación de la web)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Es idempotente: se puede ejecutar más de una vez.
--
-- La web valida el formato completo (validatePersonName: letras, espacios,
-- guiones, puntos y apóstrofos). Aquí solo se impide guardar dígitos, para no
-- depender de la configuración regional de la base de datos con las tildes.
-- Los CHECK se crean NOT VALID: se aplican a todo lo nuevo o editado, sin
-- bloquear por datos antiguos.
-- =====================================================================


-- 1. Columnas de texto
alter table public.users drop constraint if exists users_nombres_sin_numeros;
alter table public.users
  add constraint users_nombres_sin_numeros check (
    coalesce(nombres, '') !~ '[0-9]' and coalesce(apellidos, '') !~ '[0-9]'
  ) not valid;

alter table public.lineas_investigacion drop constraint if exists lineas_coordinador_sin_numeros;
alter table public.lineas_investigacion
  add constraint lineas_coordinador_sin_numeros check (coalesce(coordinador, '') !~ '[0-9]') not valid;

alter table public.contacto_mensajes drop constraint if exists contacto_nombre_sin_numeros;
alter table public.contacto_mensajes
  add constraint contacto_nombre_sin_numeros check (coalesce(name, '') !~ '[0-9]') not valid;


-- 2. Autores / integrantes externos (listas JSON): nombre y rol sin números
create or replace function public.autores_sin_numeros(lista jsonb)
returns boolean
language sql
immutable
as $$
  select not exists (
    select 1
    from jsonb_array_elements(
           case when jsonb_typeof(lista) = 'array' then lista else '[]'::jsonb end
         ) as a
    where jsonb_typeof(a) = 'object'
      and (coalesce(a ->> 'nombre_externo', '') ~ '[0-9]'
           or coalesce(a ->> 'rol', '') ~ '[0-9]')
  );
$$;

do $$
declare
  r record;
begin
  for r in
    select * from (values
      ('noticias', 'autores'),
      ('proyectos', 'integrantes'),
      ('publicaciones_cientificas', 'autores')
    ) as t(tabla, columna)
  loop
    -- Solo si la columna existe y es jsonb
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = r.tabla
        and column_name = r.columna and data_type = 'jsonb'
    ) then
      execute format('alter table public.%I drop constraint if exists %I',
                     r.tabla, r.tabla || '_autores_sin_numeros');
      execute format('alter table public.%I add constraint %I check (public.autores_sin_numeros(%I)) not valid',
                     r.tabla, r.tabla || '_autores_sin_numeros', r.columna);
    end if;
  end loop;
end $$;


notify pgrst, 'reload schema';
