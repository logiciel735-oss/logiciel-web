-- =====================================================================
-- Perfil: enlace de LinkedIn y ficha de miembro sincronizada
-- Ejecutar en: Supabase Dashboard → SQL Editor (antes de desplegar el frontend)
-- Es idempotente: se puede ejecutar más de una vez.
-- =====================================================================


-- 1. LinkedIn (opcional). Solo perfiles https://…linkedin.com/in/… (o /pub/…)
alter table public.users
  add column if not exists linkedin_url text;

alter table public.users drop constraint if exists users_linkedin_valido;
alter table public.users
  add constraint users_linkedin_valido check (
    linkedin_url is null
    or linkedin_url ~* '^https://([a-z]{2,3}\.)?linkedin\.com/(in/[^[:space:]/?#]+/?|pub/[^[:space:]?#]+)([?#][^[:space:]]*)?$'
  );


-- 2. La ficha de miembro guarda copia del nombre y la foto: mantenerla al día
--    (si el usuario cambia o quita su foto, la tarjeta de "Miembros" también cambia)
create or replace function public.sincronizar_miembro()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.miembros
  set name  = new.name,
      image = new.avatar
  where user_id::text = new.id::text
    and (name is distinct from new.name or image is distinct from new.avatar);

  return new;
end;
$$;

-- Sin "of name, avatar": name lo compone el trigger componer_nombre, y los triggers
-- por columna no se disparan con cambios hechos por otro trigger BEFORE.
drop trigger if exists sincronizar_miembro on public.users;
create trigger sincronizar_miembro
  after update on public.users
  for each row
  when (old.name is distinct from new.name or old.avatar is distinct from new.avatar)
  execute function public.sincronizar_miembro();

-- Poner al día las fichas existentes
update public.miembros m
set name = u.name, image = u.avatar
from public.users u
where m.user_id::text = u.id::text
  and (m.name is distinct from u.name or m.image is distinct from u.avatar);


-- 3. Perfil público: incluye LinkedIn
create or replace function public.perfil_publico(p_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id',           j -> 'id',
    'name',         j -> 'name',
    'nombres',      j -> 'nombres',
    'apellidos',    j -> 'apellidos',
    'email',        j -> 'email',        -- se muestra como contacto en el perfil público
    'avatar',       j -> 'avatar',
    'universidad',  j -> 'universidad',
    'carrera',      j -> 'carrera',
    'descripcion',  j -> 'descripcion',
    'cvlac_url',    j -> 'cvlac_url',
    'linkedin_url', j -> 'linkedin_url'
  )
  from public.users u
  cross join lateral (select to_jsonb(u) as j) as x
  where u.id = p_id
    and exists (select 1 from public.miembros m where m.user_id::text = u.id::text);
$$;

revoke execute on function public.perfil_publico(uuid) from public;
grant execute on function public.perfil_publico(uuid) to anon, authenticated;


notify pgrst, 'reload schema';
