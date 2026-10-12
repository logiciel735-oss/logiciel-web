import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout, { AuthField, AuthError, Spinner } from "./AuthLayout";
import PasswordInput from "./PasswordInput";

export default function LoginForm({ handleChange, handleSubmit, loading, error }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout
      title="Iniciar sesión"
      description="Accede con tu cuenta del grupo de investigación."
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="font-semibold text-brand-teal hover:text-brand-teal-dark">
            Regístrate
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField label="Correo electrónico" htmlFor="login-email">
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            className="input-base py-2.5"
            onChange={handleChange("email")}
          />
        </AuthField>

        <AuthField label="Contraseña" htmlFor="login-password">
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            show={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
            onChange={handleChange("password")}
          />
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-brand-teal hover:text-brand-teal-dark">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </AuthField>

        <AuthError>{error}</AuthError>

        <button disabled={loading} className="btn-primary w-full py-3">
          {loading && <Spinner />}
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </AuthLayout>
  );
}
