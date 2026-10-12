import { useState } from "react";
import { requestPasswordReset } from "../api/authApi";

export function useForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sentTo, setSentTo] = useState(null);

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await requestPasswordReset(email);
      setSentTo(email.toLowerCase().trim());
    } catch (err) {
      setError(err.message || "Error enviando el correo de recuperación");
    } finally {
      setLoading(false);
    }
  };

  return { email, loading, error, sentTo, handleChange, handleSubmit };
}
