import { supabase } from "../../../shared/config/supabase";
import { uploadFile } from "../../../shared/uploadFile/api/uploadApi";

const PROFILE_FIELDS = ["name", "cvlac_url", "descripcion", "universidad", "numero"];

// Perfil del usuario autenticado (auth.users + public.users)
export const getMyProfile = async () => {
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  if (error) throw error;

  return {
    name: authUser.user_metadata?.name || authUser.email.split("@")[0],
    role: "user",
    ...profile,
    id: authUser.id,
    email: authUser.email,
  };
};

export const updateMyProfile = async (formData) => {
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) throw new Error("No autenticado");

  const updates = {};

  for (const [key, value] of formData.entries()) {
    if (PROFILE_FIELDS.includes(key)) updates[key] = value;
  }

  const avatar = formData.get("avatar");
  if (avatar instanceof File) {
    const { url } = await uploadFile(avatar, "avatars");
    updates.avatar = url;
  }

  // El correo vive en Supabase Auth: se envía un email de confirmación al nuevo correo
  const email = formData.get("email");
  if (email && email !== authUser.email) {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) throw error;
  }

  if (Object.keys(updates).length === 0) return getMyProfile();

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", authUser.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
