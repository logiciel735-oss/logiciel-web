import { useState } from "react";
import { sendContactMessage } from "../api/contactApi";
import { validatePersonName } from "../../../shared/lib/validators";

export function useContactForm() {
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [loading, setLoading]   = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError]       = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name || !form.email || !form.subject || !form.message)
      return "Todos los campos son obligatorios.";
    const nameError = validatePersonName(form.name, { label: "Nombre", max: 100 });
    if (nameError) return nameError;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "El correo electrónico no es válido.";
    if (form.message.length < 10)
      return "El mensaje es muy corto.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setError(null);

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    try {
      setLoading(true);
      const data = await sendContactMessage(form);
      setFeedback(data.message || "Mensaje enviado correctamente.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {

      setError(err.message || "Error enviando el mensaje. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, feedback, error, handleChange, handleSubmit };
}