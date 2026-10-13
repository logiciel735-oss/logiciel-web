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
  "Error sending recovery email":
    "No pudimos enviar el correo de recuperación. Intenta más tarde.",
  "New password should be different from the old password.":
    "La nueva contraseña debe ser diferente a la anterior",
  "Auth session missing!": "El enlace de recuperación expiró. Solicita uno nuevo.",
};

const authError = (error, fallback) => {
  const message = error?.message || "";

  // "For security purposes, you can only request this after 42 seconds."
  const wait = message.match(/after (\d+) seconds?/);
  if (wait) return new Error(`Por seguridad, espera ${wait[1]} segundos antes de intentarlo de nuevo.`);

  return new Error(AUTH_ERRORS[message] || message || fallback);
};

export const loginRequest = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password,
  });

  if (error) throw authError(error, "Credenciales incorrectas");

  return data;
};

export const registerRequest = async (nombres, apellidos, email, password) => {
  const cleanNombres = nombres.trim();
  const cleanApellidos = apellidos.trim();

  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: {
      // El trigger handle_new_user los guarda en public.users
      data: {
        nombres: cleanNombres,
        apellidos: cleanApellidos,
        name: `${cleanNombres} ${cleanApellidos}`.trim(),
      },
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

// El correo de recuperación debe apuntar a /reset-password?token={{ .TokenHash }}
export const requestPasswordReset = async (email) => {
  const cleanEmail = email.toLowerCase().trim();

  // Verifica que el correo tenga una cuenta (función SQL email_registrado)
  const { data: exists, error: checkError } = await supabase.rpc("email_registrado", {
    p_email: cleanEmail,
  });

  if (checkError) throw new Error("No pudimos verificar el correo. Intenta más tarde.");
  if (!exists) throw new Error("No existe una cuenta registrada con ese correo.");

  const { error } = await supabase.auth.resetPasswordForEmail(
    cleanEmail,
    { redirectTo: `${window.location.origin}/reset-password` }
  );

  if (error) throw authError(error, "Error enviando el correo de recuperación");

  return true;
};

// Valida el token del correo: inicia una sesión temporal de recuperación
export const verifyRecoveryToken = async (token) => {
  const { error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: "recovery",
  });

  if (error) throw authError(error, "Token inválido o expirado");

  return true;
};

// Guarda la nueva contraseña (requiere haber verificado el token)
export const updatePassword = async (password) => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw authError(error, "Error actualizando la contraseña");

  // Se cierra la sesión de recuperación para que entre con la nueva contraseña
  await supabase.auth.signOut();

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
