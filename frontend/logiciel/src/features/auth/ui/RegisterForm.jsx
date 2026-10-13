import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import AuthLayout, { AuthField, Spinner } from "./AuthLayout";
import PasswordInput from "./PasswordInput";

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
      <AuthLayout icon={EnvelopeIcon} title="Revisa tu correo">
        <p className="text-center leading-relaxed text-slate-600">
          Hemos enviado un correo de verificación a{" "}
          <span className="font-semibold text-brand-navy">{registeredEmail}</span>. Por favor
          revisa tu bandeja de entrada o spam.
        </p>
        <Link to="/login" className="btn-primary mt-7 w-full py-3">
          Ir a iniciar sesión
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Crear cuenta"
      description="Regístrate para participar en el grupo. Te enviaremos un correo para confirmar tu cuenta."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-brand-teal hover:text-brand-teal-dark">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField label="Nombres" htmlFor="reg-nombres">
            <input
              id="reg-nombres"
              type="text"
              autoComplete="given-name"
              placeholder="Ej.: María José"
              className="input-base py-2.5"
              onChange={handleChange("nombres")}
            />
          </AuthField>

          <AuthField label="Apellidos" htmlFor="reg-apellidos">
            <input
              id="reg-apellidos"
              type="text"
              autoComplete="family-name"
              placeholder="Ej.: Muñoz Pérez"
              className="input-base py-2.5"
              onChange={handleChange("apellidos")}
            />
          </AuthField>
        </div>

        <AuthField label="Correo electrónico" htmlFor="reg-email">
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            className="input-base py-2.5"
            onChange={handleChange("email")}
          />
        </AuthField>

        <AuthField label="Contraseña" htmlFor="reg-password">
          <PasswordInput
            id="reg-password"
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            show={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
            onChange={handleChange("password")}
          />
        </AuthField>

        <AuthField label="Confirmar contraseña" htmlFor="reg-confirm">
          <PasswordInput
            id="reg-confirm"
            autoComplete="new-password"
            placeholder="Repite la contraseña"
            show={showConfirm}
            onToggle={() => setShowConfirm((prev) => !prev)}
            onChange={handleChange("confirm")}
          />
        </AuthField>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading && <Spinner />}
          {loading ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>
    </AuthLayout>
  );
}
