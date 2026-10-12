import { Link } from "react-router-dom";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function ForgotPasswordForm({
  email,
  loading,
  error,
  sentTo,
  handleChange,
  handleSubmit,
}) {
  if (sentTo) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="bg-white p-10 rounded-xl shadow-lg w-96 text-center">
          <EnvelopeIcon className="h-14 w-14 text-teal-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Revisa tu correo</h2>
          <p className="text-gray-700 mb-6">
            Te enviamos un enlace a <span className="font-semibold">{sentTo}</span>{" "}
            para restablecer tu contraseña. Revisa tu bandeja de entrada o spam.
            El enlace expira en 1 hora.
          </p>
          <Link
            to="/login"
            className="inline-block bg-teal-400 w-full py-3 rounded font-bold"
          >
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <form
        className="bg-white shadow-lg p-10 rounded-xl w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-2 text-center">
          Recuperar contraseña
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Escribe el correo de tu cuenta y te enviaremos un enlace para crear una
          nueva contraseña.
        </p>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 border mb-4 rounded"
          value={email}
          onChange={handleChange}
          disabled={loading}
        />

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-teal-400 w-full py-3 rounded font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading && (
            <span className="h-5 w-5 border-2 border-[#0a192f] border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>

        <p className="text-center mt-4">
          <Link to="/login" className="text-blue-500">
            Volver a iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
