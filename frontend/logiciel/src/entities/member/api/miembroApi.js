import { supabase } from "../../../shared/config/supabase";

const COL = "miembros";

/* ================= GET ================= */

// Obtener todos los miembros (lanza el error para poder mostrarlo en la UI)
export const getMiembros = async () => {
  const { data, error } = await supabase
    .from(COL)
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
};

// Obtener miembro por ID (null si no existe)
export const getMiembro = async (id) => {
  const { data, error } = await supabase
    .from(COL)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Obtener miembro por el id de su usuario (null si no es miembro del grupo)
export const getMiembroByUserId = async (userId) => {
  const { data, error } = await supabase
    .from(COL)
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};
