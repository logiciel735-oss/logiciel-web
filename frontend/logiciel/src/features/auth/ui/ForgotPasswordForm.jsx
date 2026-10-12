import { Link } from "react-router-dom";
import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";
import AuthLayout, { AuthField, AuthError, Spinner } from "./AuthLayout";

const backToLogin = (
  <Link to="/login" className="font-semibold text-brand-teal hover:text-brand-teal-dark">
    Volver a iniciar sesión
  </Link>
);

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
      <AuthLayout icon={EnvelopeIcon} title="Revisa tu correo">
        <p className="text-center leading-relaxed text-slate-600">
          Te enviamos un enlace a <span className="font-semibold text-brand-navy">{sentTo}</span>{" "}
          para restablecer tu contraseña. Revisa tu bandeja de entrada o spam.
          El enlace expira en 1 hora.
        </p>
        <Link to="/login" className="btn-primary mt-7 w-full py-3">
          Volver a iniciar sesión
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={KeyIcon}
      title="Recuperar contraseña"
      description="Escribe el correo de tu cuenta y te enviaremos un enlace para crear una nueva contraseña."
      footer={backToLogin}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField label="Correo electrónico" htmlFor="forgot-email">
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            className="input-base py-2.5"
            value={email}
            onChange={handleChange}
            disabled={loading}
          />
        </AuthField>

        <AuthError>{error}</AuthError>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading && <Spinner />}
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>
    </AuthLayout>
  );
}
