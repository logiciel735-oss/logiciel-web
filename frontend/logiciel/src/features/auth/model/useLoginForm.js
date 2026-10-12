import { useState, useContext } from "react";
import { AuthContext } from "../../../features/auth/providers/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";


export function useLoginForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await login(formData.email, formData.password);
      navigate("/");


    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleChange,
    handleSubmit,
    loading,
    error,
  };
}