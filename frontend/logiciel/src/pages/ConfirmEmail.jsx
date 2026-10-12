import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { confirmEmailRequest } from "../features/auth/api/authApi";
import AuthLayout from "../features/auth/ui/AuthLayout";

// Ícono de carga girando
const SpinningIcon = ({ className }) => <ArrowPathIcon className={`${className} animate-spin`} />;

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // loading | success | error
  const [status, setStatus] = useState(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token ? "" : "Token de confirmación no encontrado."
  );

  // El token es de un solo uso: evita verificarlo dos veces (StrictMode en desarrollo)
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;

    confirmEmailRequest(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message || "Correo confirmado correctamente.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Error confirmando el correo.");
      });
  }, [token]);


  if (status === "loading") {
    return (
      <AuthLayout icon={SpinningIcon} title="Confirmando correo...">
        <p className="text-center text-slate-600">Por favor espera un momento.</p>
      </AuthLayout>
    );
  }

  if (status === "success") {
    return (
      <AuthLayout icon={CheckCircleIcon} tone="success" title="¡Correo confirmado!">
        <p className="text-center leading-relaxed text-slate-600">{message}</p>
        <Link to="/login" className="btn-primary mt-7 w-full py-3">
          Ir a iniciar sesión
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout icon={XCircleIcon} tone="error" title="No se pudo confirmar">
      <p className="text-center leading-relaxed text-slate-600">{message}</p>
      <Link to="/register" className="btn-primary mt-7 w-full py-3">
        Volver a registrarme
      </Link>
    </AuthLayout>
  );
};

export default ConfirmEmail;
