-- =====================================================================
-- Videos en noticias y proyectos (enlaces de YouTube o Google Drive)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- =====================================================================

alter table public.noticias
  add column if not exists videos jsonb not null default '[]'::jsonb;

alter table public.proyectos
  add column if not exists videos jsonb not null default '[]'::jsonb;

-- Solo se guardan enlaces de YouTube o Google Drive (refuerzo de la validación del frontend)
create or replace function public.videos_validos(lista jsonb)
returns boolean
language sql
immutable
as $$
  select coalesce(bool_and(
    v ~* '^https://(www\.|m\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)/'
    or v ~* '^https://drive\.google\.com/'
  ), true)
  from jsonb_array_elements_text(coalesce(lista, '[]'::jsonb)) as v;
$$;

alter table public.noticias drop constraint if exists noticias_videos_validos;
alter table public.noticias
  add constraint noticias_videos_validos check (public.videos_validos(videos));

alter table public.proyectos drop constraint if exists proyectos_videos_validos;
alter table public.proyectos
  add constraint proyectos_videos_validos check (public.videos_validos(videos));

notify pgrst, 'reload schema';
