import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyRecoveryToken, updatePassword } from "../api/authApi";
import { recoveryRedirect } from "../../../shared/config/supabase";

const MIN_PASSWORD = 6;

export function useResetPasswordForm() {
  const [searchParams] = useSearchParams();
  // Enlace propio: /reset-password?token=...  (plantilla en español)
  const token = searchParams.get("token");
  // Enlace por defecto de Supabase: llega con la sesión de recuperación ya iniciada
  const hasRecoverySession = recoveryRedirect.isRecovery;
  const navigate = useNavigate();

  const linkError = recoveryRedirect.error
    ? "El enlace de recuperación expiró o ya fue usado. Solicita uno nuevo."
    : !token && !hasRecoverySession
      ? "El enlace de recuperación no es válido o está incompleto."
      : null;

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // El token solo sirve una vez: si ya se validó, no se vuelve a enviar
  const [verified, setVerified] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (form.password.length < MIN_PASSWORD) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`);
      return;
    }

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (token && !verified) {
        await verifyRecoveryToken(token);
        setVerified(true);
      }

      await updatePassword(form.password);

      toast.success("Contraseña actualizada. Inicia sesión con tu nueva contraseña.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Error actualizando la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return {
    linkError,
    form,
    showPassword,
    setShowPassword,
    loading,
    error,
    handleChange,
    handleSubmit,
  };
}
