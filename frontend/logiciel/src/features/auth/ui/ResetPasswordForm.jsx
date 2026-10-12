import { Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function ResetPasswordForm({
  token,
  form,
  showPassword,
  setShowPassword,
  loading,
  error,
  handleChange,
  handleSubmit,
}) {
  if (!token) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="bg-white p-10 rounded-xl shadow-lg w-96 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Enlace inválido</h2>
          <p className="text-gray-700 mb-6">
            El enlace de recuperación no es válido o está incompleto.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block bg-teal-400 w-full py-3 rounded font-bold"
          >
            Solicitar un nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  const type = showPassword ? "text" : "password";

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <form
        className="bg-white shadow-lg p-10 rounded-xl w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-2 text-center">
          Nueva contraseña
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Escribe tu nueva contraseña (mínimo 6 caracteres).
        </p>

        <div className="relative mb-4">
          <input
            type={type}
            placeholder="Nueva contraseña"
            className="w-full p-3 border rounded pr-12"
            value={form.password}
            onChange={handleChange("password")}
            disabled={loading}
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

        <input
          type={type}
          placeholder="Confirmar contraseña"
          className="w-full p-3 border mb-4 rounded"
          value={form.confirm}
          onChange={handleChange("confirm")}
          disabled={loading}
        />

        {error && (
          <div className="text-red-500 mb-4 text-sm">
            <p>{error}</p>
            {/expir|inválido/i.test(error) && (
              <Link to="/forgot-password" className="text-blue-500 underline">
                Solicitar un nuevo enlace
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-teal-400 w-full py-3 rounded font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading && (
            <span className="h-5 w-5 border-2 border-[#0a192f] border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Guardando..." : "Guardar contraseña"}
        </button>
      </form>
    </div>
  );
}
