-- =====================================================================
-- Eventos: hora, modalidad y enlaces (inscripción y transmisión)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Ejecutarlo ANTES de desplegar el código que usa estas columnas.
-- Es idempotente: se puede ejecutar más de una vez.
--
-- Las fechas (fecha_inicio / fecha_fin) no cambian. La hora va en columnas
-- aparte (hora de Colombia), opcionales: un evento sin hora es de día completo.
-- Los campos vacíos se guardan como NULL.
-- La política puede_editar() y el trigger de auditoría de eventos ya cubren
-- las columnas nuevas.
-- =====================================================================

alter table public.eventos add column if not exists hora_inicio        time;
alter table public.eventos add column if not exists hora_fin           time;
alter table public.eventos add column if not exists modalidad          text;
alter table public.eventos add column if not exists enlace_inscripcion text;
alter table public.eventos add column if not exists enlace_virtual     text;

-- Modalidad: solo valores conocidos
alter table public.eventos drop constraint if exists eventos_modalidad_valida;
alter table public.eventos
  add constraint eventos_modalidad_valida
  check (modalidad is null or modalidad in ('presencial', 'virtual', 'hibrida'));

-- Enlaces: http(s) y sin espacios
alter table public.eventos drop constraint if exists eventos_enlaces_validos;
alter table public.eventos
  add constraint eventos_enlaces_validos
  check (
    (enlace_inscripcion is null or enlace_inscripcion ~* '^https?://\S+$')
    and (enlace_virtual is null or enlace_virtual ~* '^https?://\S+$')
  );

notify pgrst, 'reload schema';
