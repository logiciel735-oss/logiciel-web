import { createClient } from "@supabase/supabase-js";

// Se lee antes de createClient: supabase-js procesa y limpia el hash de la URL al iniciar.
// Llega así cuando el correo de recuperación usa {{ .ConfirmationURL }}.
const hashParams = new URLSearchParams(window.location.hash.slice(1));

export const recoveryRedirect = {
  isRecovery: hashParams.get("type") === "recovery",
  error: hashParams.get("error_code") || hashParams.get("error"),
};

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
