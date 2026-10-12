import { Link } from "react-router-dom";
export default function LoginForm({ handleChange, handleSubmit, loading, error }) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        className="bg-white shadow-lg p-10 rounded-xl w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Iniciar Sesión
        </h2>

        <input
          type="email"
          placeholder="Correo institucional"
          className="w-full p-3 border mb-4 rounded"
          onChange={handleChange("email")}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 border mb-4 rounded"
          onChange={handleChange("password")}
        />

        {error && (
          <p className="text-red-500 mb-4 text-sm">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="bg-teal-400 w-full py-3 rounded font-bold"
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>

        <p className="text-center mt-4">
          ¿No tienes cuenta?
          <Link to="/register" className="text-blue-500 ml-1">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}