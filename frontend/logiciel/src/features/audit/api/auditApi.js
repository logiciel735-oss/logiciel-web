import { supabase } from "../../../shared/config/supabase";

export const AUDIT_PAGE_SIZE = 25;

// Registro de auditoría (solo admin: lo impone la política RLS de la tabla auditoria)
export const getAuditoria = async ({ tabla = "", accion = "", usuario = "", page = 0 } = {}) => {
  const from = page * AUDIT_PAGE_SIZE;

  let query = supabase
    .from("auditoria")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + AUDIT_PAGE_SIZE - 1);

  if (tabla) query = query.eq("tabla", tabla);
  if (accion) query = query.eq("accion", accion);

  const busqueda = usuario.trim().replace(/[%_,()]/g, "");
  if (busqueda) query = query.ilike("usuario_email", `%${busqueda}%`);

  const { data, error, count } = await query;
  if (error) throw error;

  return { rows: data || [], total: count ?? 0 };
};
