import { supabase } from "../../../shared/config/supabase";

// Mensajes de Supabase Auth → español
const AUTH_ERRORS = {
  "Invalid login credentials": "Credenciales incorrectas",
  "Email not confirmed": "Debes confirmar tu correo antes de iniciar sesión",
  "User already registered": "No fue posible crear la cuenta",
  "Token has expired or is invalid": "Token inválido o expirado",
  "email rate limit exceeded":
    "Se alcanzó el límite de correos enviados. Intenta de nuevo en unos minutos.",
  "Password should be at least 6 characters.":
    "La contraseña debe tener al menos 6 caracteres",
  "Unable to validate email address: invalid format": "El correo no es válido",
  "Error sending confirmation email":
    "No pudimos enviar el correo de verificación. Intenta más tarde o contacta al administrador.",
};

const authError = (error, fallback) =>
  new Error(AUTH_ERRORS[error?.message] || error?.message || fallback);

export const loginRequest = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password,
  });

  if (error) throw authError(error, "Credenciales incorrectas");

  return data;
};

export const registerRequest = async (name, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: {
      data: { name },
      emailRedirectTo: `${window.location.origin}/confirm-email`,
    },
  });

  if (error) throw authError(error, "Error al registrarte");

  // Supabase no devuelve error si el correo ya existe: devuelve un usuario sin identidades
  if (data.user?.identities?.length === 0) {
    throw new Error("No fue posible crear la cuenta");
  }

  // Sin "Confirm email" en Supabase la sesión llega iniciada y no se envía correo
  return { needsConfirmation: !data.session };
};

export const logoutRequest = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error("Error cerrando sesión");

  return true;
};

// El correo de confirmación debe apuntar a /confirm-email?token={{ .TokenHash }}
export const confirmEmailRequest = async (token) => {
  const { error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: "email",
  });

  if (error) throw authError(error, "Token inválido o expirado");

  return { message: "Cuenta confirmada" };
};
