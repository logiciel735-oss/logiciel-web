import { EyeIcon, EyeSlashIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function RegisterForm({
  showPassword,
  showConfirm,
  setShowPassword,
  setShowConfirm,
  handleChange,
  handleSubmit,
  loading,
  registeredEmail,
}) {
  if (registeredEmail) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="bg-white p-10 rounded-xl shadow-lg w-96 text-center">
          <EnvelopeIcon className="h-14 w-14 text-teal-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Revisa tu correo</h2>
          <p className="text-gray-700 mb-6">
            Hemos enviado un correo de verificación a{" "}
            <span className="font-semibold">{registeredEmail}</span>. Por favor
            revisa tu bandeja de entrada o spam.
          </p>
          <Link
            to="/login"
            className="inline-block bg-teal-400 w-full py-3 rounded font-bold"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        className="bg-white p-10 rounded-xl shadow-lg w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Crear Cuenta
        </h2>

        <input
          type="text"
          placeholder="Nombre completo"
          className="w-full p-3 border mb-4 rounded"
          onChange={handleChange("name")}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 border mb-4 rounded"
          onChange={handleChange("email")}
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="w-full p-3 border rounded pr-12"
            onChange={handleChange("password")}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeSlashIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirmar contraseña"
            className="w-full p-3 border rounded pr-12"
            onChange={handleChange("confirm")}
          />

          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirm ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeSlashIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-teal-400 w-full py-3 rounded font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading && (
            <span className="h-5 w-5 border-2 border-[#0a192f] border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Creando cuenta..." : "Registrarme"}
        </button>

        <p className="text-center mt-4">
          ¿Ya tienes cuenta?
          <Link to="/login" className="text-blue-500 ml-1">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}