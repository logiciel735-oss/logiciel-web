import { supabase } from "../../../shared/config/supabase";

// Los límites de envío y validaciones viven en la base de datos (trigger contacto_validar).
// El correo de aviso lo envía la Edge Function notificar-contacto vía webhook.
const errorMessage = (error) => {
  // P0001: excepción del trigger, ya viene en español
  if (error.code === "P0001") return error.message;
  if (error.code === "42501") return "No tienes permiso para enviar mensajes. Contacta al administrador.";
  return "No se pudo enviar el mensaje. Intenta más tarde.";
};

export const sendContactMessage = async ({ name, email, subject, message }) => {
  let result;

  try {
    result = await supabase
      .from("contacto_mensajes")
      .insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa tu conexión.");
  }

  if (result.error) {
    console.error("Error enviando contacto:", result.error);
    throw new Error(errorMessage(result.error));
  }

  return {
    message: "Mensaje enviado correctamente. Nos pondremos en contacto pronto.",
  };
};
