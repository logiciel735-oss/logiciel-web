import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { confirmEmailRequest } from "../features/auth/api/authApi";

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


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">

        {status === "loading" && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Confirmando correo...
            </h2>
            <p className="text-gray-600">
              Por favor espera un momento.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ✅ ¡Correo confirmado!
            </h2>
            <p className="text-gray-700 mb-6">
              {message}
            </p>
            <Link
              to="/login"
              className="inline-block bg-[#0a192f] text-white px-6 py-2 rounded hover:bg-[#64ffda] hover:text-[#0a192f] transition"
            >
              Ir a iniciar sesión
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              ❌ Error
            </h2>
            <p className="text-gray-700 mb-6">
              {message}
            </p>
            <Link
              to="/register"
              className="inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
            >
              Volver a registrarme
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
