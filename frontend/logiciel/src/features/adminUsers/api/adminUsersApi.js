import { supabase } from "../../../shared/config/supabase";
import {
  fetchDoc,
  fetchCollection,
  pickFields,
  insertDoc,
  updateDoc,
  deleteDoc,
} from "../../../shared/firebaseEntities/firebaseEntities";

const COL_USERS = "users";
const COL_MIEMBROS = "miembros";

// role no se cambia aquí (solo con promoteUserToAdmin)
const USER_FIELDS = ["name", "email", "avatar", "universidad", "descripcion", "cvlac_url", "numero"];
const MIEMBRO_FIELDS = ["user_id", "name", "role", "image"];

// ── Lectura pública ──────────────────────────────────
export const getPublicUsers = () => fetchCollection(COL_USERS, "name", "asc");

export const getPublicUser = (uid) => fetchDoc(COL_USERS, uid);

// ── Admin ────────────────────────────────────────────
export const getAllUsers = async () => {
  const { data, error } = await supabase.from(COL_USERS).select("*");
  if (error) throw error;
  return data;
};

export const getUserById = (uid) => fetchDoc(COL_USERS, uid);

export const updateUserById = async (uid, data) => {
  // igual que Django: ignora campos vacíos
  const clean = Object.fromEntries(
    Object.entries(pickFields(data, USER_FIELDS)).filter(
      ([, v]) => v !== null && v !== ""
    )
  );

  if (Object.keys(clean).length === 0) {
    throw new Error("No hay campos para actualizar");
  }

  return updateDoc(COL_USERS, uid, clean, USER_FIELDS);
};

export const promoteUserToAdmin = async (uid) => {
  const { data, error } = await supabase
    .from(COL_USERS)
    .update({ role: "admin" })
    .eq("id", uid)
    .select("id, role")
    .single();

  if (error) throw error;
  return data;
};

// Borra la cuenta de Supabase Auth y su perfil (función SQL admin_delete_user)
export const deleteUserById = async (uid) => {
  const { error } = await supabase.rpc("admin_delete_user", { target_id: uid });
  if (error) throw error;
  return { deleted: true };
};

// ── Miembros ─────────────────────────────────────────
export const createMiembro = async (data) => {
  // igual que Django: nombre e imagen salen del usuario vinculado
  const { data: user, error } = await supabase
    .from(COL_USERS)
    .select("name, avatar")
    .eq("id", data.user_id)
    .maybeSingle();

  if (error) throw error;
  if (!user) throw new Error("Usuario no encontrado");

  return insertDoc(
    COL_MIEMBROS,
    { ...data, name: user.name, image: user.avatar },
    MIEMBRO_FIELDS
  );
};

export const updateMiembro = (id, data) => updateDoc(COL_MIEMBROS, id, data, MIEMBRO_FIELDS);

export const deleteMiembro = (id) => deleteDoc(COL_MIEMBROS, id);
