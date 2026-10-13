import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../features/auth/model/useAuth";

export function useRegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!form.nombres.trim() || !form.apellidos.trim()) {
      toast.error("Escribe tus nombres y apellidos");
      return;
    }

    if (form.password !== form.confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      const { needsConfirmation } = await register(form.nombres, form.apellidos, form.email, form.password);

      if (needsConfirmation) {
        setRegisteredEmail(form.email.toLowerCase().trim());
      } else {
        toast.success("Cuenta creada. ¡Bienvenido!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    showPassword,
    showConfirm,
    setShowPassword,
    setShowConfirm,
    handleChange,
    handleSubmit,
    loading,
    registeredEmail,
  };
}
