import { createClient } from "@supabase/supabase-js";

// Se lee antes de createClient: supabase-js procesa y limpia el hash de la URL al iniciar.
// Llega así cuando el correo de recuperación usa {{ .ConfirmationURL }}.
const hashParams = new URLSearchParams(window.location.hash.slice(1));

export const recoveryRedirect = {
  isRecovery: hashParams.get("type") === "recovery",
  error: hashParams.get("error_code") || hashParams.get("error"),
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Revisa el archivo .env o las variables de entorno de Vercel."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
