import { Link } from "react-router-dom";
import SanJose from "../../../shared/assets/images/san_jose.webp";
import { LogoIcon } from "../../../shared/ui/Logo";

// Contenedor de las pantallas de acceso: panel institucional (escritorio) + tarjeta del formulario.
export default function AuthLayout({ title, description, icon, tone = "teal", children, footer }) {
  const Icon = icon;
  const toneClass = tone === "error"
    ? "bg-red-50 text-red-600"
    : tone === "success"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-brand-teal-light text-brand-teal";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-stretch bg-slate-50">
      {/* PANEL INSTITUCIONAL */}
      <aside className="relative hidden w-5/12 overflow-hidden text-white lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${SanJose})` }}
        />
        <div className="absolute inset-0 bg-brand-navy/90" />
        <div className="relative z-10 flex h-full flex-col p-12">
          {/* LOGO GRANDE (ocupa el espacio libre del panel) */}
          <Link
            to="/"
            aria-label="Inicio"
            className="flex flex-1 flex-col items-center justify-center text-center"
          >
            <LogoIcon variant="light" className="h-28 w-auto drop-shadow-lg xl:h-36" />
            <span className="mt-6 font-brand text-5xl font-medium tracking-tight xl:text-6xl">
              Logiciel
            </span>
            <span className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-teal xl:text-sm">
              Investigación y Desarrollo en Software
            </span>
          </Link>
          <div className="pt-10">
            <div className="h-1 w-14 rounded-full bg-brand-teal" />
            <p className="mt-6 text-2xl font-semibold leading-snug">
              Grupo de Investigación LOGICIEL
            </p>
            <p className="mt-3 max-w-sm leading-relaxed text-slate-300">
              Fundación Universitaria de Popayán. Investigación y desarrollo en ingeniería de software.
            </p>
          </div>
        </div>
      </aside>

      {/* FORMULARIO */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="card p-8 hover:shadow-sm sm:p-10">
            {Icon && (
              <span className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${toneClass}`}>
                <Icon className="h-7 w-7" />
              </span>
            )}
            <h1 className={`text-2xl font-bold tracking-tight text-brand-navy ${Icon ? "text-center" : ""}`}>
              {title}
            </h1>
            {description && (
              <p className={`mt-2 text-sm leading-relaxed text-slate-600 ${Icon ? "text-center" : ""}`}>
                {description}
              </p>
            )}
            <div className="mt-7">{children}</div>
          </div>
          {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

// Campo con etiqueta para formularios de acceso
export function AuthField({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

export function AuthError({ children }) {
  if (!children) return null;
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
      {children}
    </div>
  );
}

export function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />;
}
