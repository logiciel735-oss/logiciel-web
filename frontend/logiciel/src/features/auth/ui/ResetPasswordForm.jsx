import { Link } from "react-router-dom";
import { ExclamationTriangleIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import AuthLayout, { AuthField, AuthError, Spinner } from "./AuthLayout";
import PasswordInput from "./PasswordInput";

export default function ResetPasswordForm({
  linkError,
  form,
  showPassword,
  setShowPassword,
  loading,
  error,
  handleChange,
  handleSubmit,
}) {
  if (linkError) {
    return (
      <AuthLayout icon={ExclamationTriangleIcon} tone="error" title="Enlace inválido">
        <p className="text-center leading-relaxed text-slate-600">{linkError}</p>
        <Link to="/forgot-password" className="btn-primary mt-7 w-full py-3">
          Solicitar un nuevo enlace
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={LockClosedIcon}
      title="Nueva contraseña"
      description="Escribe tu nueva contraseña (mínimo 6 caracteres)."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField label="Nueva contraseña" htmlFor="reset-password">
          <PasswordInput
            id="reset-password"
            autoComplete="new-password"
            placeholder="Nueva contraseña"
            show={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
            value={form.password}
            onChange={handleChange("password")}
            disabled={loading}
          />
        </AuthField>

        <AuthField label="Confirmar contraseña" htmlFor="reset-confirm">
          <PasswordInput
            id="reset-confirm"
            autoComplete="new-password"
            placeholder="Repite la contraseña"
            show={showPassword}
            value={form.confirm}
            onChange={handleChange("confirm")}
            disabled={loading}
          />
        </AuthField>

        {error && (
          <AuthError>
            <p>{error}</p>
            {/expir|inválido/i.test(error) && (
              <Link to="/forgot-password" className="mt-1 inline-block font-semibold underline">
                Solicitar un nuevo enlace
              </Link>
            )}
          </AuthError>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading && <Spinner />}
          {loading ? "Guardando..." : "Guardar contraseña"}
        </button>
      </form>
    </AuthLayout>
  );
}
