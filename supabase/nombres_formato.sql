-- =====================================================================
-- Nombres de personas con un formato único (nombre propio)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Es idempotente: se puede ejecutar más de una vez.
--
-- "JUAN CARLOS DE LA CRUZ" / "juan carlos de la cruz" → "Juan Carlos de la Cruz"
--
-- · formatear_nombre(): misma regla que formatPersonName (shared/lib/validators.js):
--   cada palabra con inicial mayúscula (también tras guion, apóstrofo o punto) y
--   las partículas de, del, la, las, los, y, e, da, das, do, dos, van, von en
--   minúscula salvo al inicio.
-- · componer_nombre (users) la aplica a nombres y apellidos en cada alta/edición;
--   name y la ficha de miembros (sincronizar_miembro) se actualizan solos.
-- · Miembros sin cuenta de usuario: trigger propio sobre miembros.name.
-- · Normaliza los registros que ya existen (no queda en la auditoría: se ejecuta
--   sin usuario conectado).
-- =====================================================================


-- 1. Función de formato
create or replace function public.formatear_nombre(p text)
returns text
language plpgsql
immutable
as $$
declare
  v_limpio    text;
  v_palabra   text;
  v_resultado text[] := '{}';
  v_i         int := 0;
begin
  v_limpio := lower(btrim(regexp_replace(coalesce(p, ''), '\s+', ' ', 'g')));
  if v_limpio = '' then
    return null;
  end if;

  foreach v_palabra in array string_to_array(v_limpio, ' ')
  loop
    v_i := v_i + 1;
    if v_i > 1 and v_palabra in ('de', 'del', 'la', 'las', 'los', 'y', 'e', 'da', 'das', 'do', 'dos', 'van', 'von') then
      v_resultado := v_resultado || v_palabra;
    else
      -- initcap pone en mayúscula la letra inicial y la que sigue a guion, apóstrofo o punto
      v_resultado := v_resultado || initcap(v_palabra);
    end if;
  end loop;

  return array_to_string(v_resultado, ' ');
end;
$$;


-- Comprobación: si la configuración regional de la BD no maneja bien las tildes,
-- se detiene aquí sin tocar ningún dato.
do $$
begin
  if public.formatear_nombre('MARÍA DE LOS ÁNGELES ñandú') <> 'María de los Ángeles Ñandú' then
    raise exception 'formatear_nombre no maneja bien las tildes en esta base de datos: %',
      public.formatear_nombre('MARÍA DE LOS ÁNGELES ñandú');
  end if;
end $$;


-- 2. Usuarios: nombres y apellidos formateados; name se compone a partir de ellos
create or replace function public.componer_nombre()
returns trigger
language plpgsql
as $$
begin
  new.nombres   := public.formatear_nombre(new.nombres);
  new.apellidos := public.formatear_nombre(new.apellidos);

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


-- 3. Miembros: también los que no tienen cuenta de usuario
create or replace function public.formatear_nombre_miembro()
returns trigger
language plpgsql
as $$
begin
  if new.name is not null then
    new.name := coalesce(public.formatear_nombre(new.name), new.name);
  end if;
  return new;
end;
$$;

drop trigger if exists formatear_nombre_miembro on public.miembros;
create trigger formatear_nombre_miembro
  before insert or update of name on public.miembros
  for each row execute function public.formatear_nombre_miembro();


-- 4. Normalizar los datos existentes
--    (se omiten filas con números, que el CHECK users_nombres_sin_numeros rechazaría)
update public.users
set nombres = nombres
where coalesce(nombres, '') !~ '[0-9]'
  and coalesce(apellidos, '') !~ '[0-9]'
  and (nombres   is distinct from public.formatear_nombre(nombres)
    or apellidos is distinct from public.formatear_nombre(apellidos)
    or name      is distinct from btrim(coalesce(public.formatear_nombre(nombres), '') || ' ' ||
                                        coalesce(public.formatear_nombre(apellidos), '')));

update public.miembros
set name = name
where name is not null
  and name is distinct from public.formatear_nombre(name);


-- 5. Resultado: cómo quedaron los nombres
select name, nombres, apellidos from public.users order by name;


notify pgrst, 'reload schema';
