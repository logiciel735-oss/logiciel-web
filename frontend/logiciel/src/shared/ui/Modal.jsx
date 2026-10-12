import { XMarkIcon } from "@heroicons/react/24/outline";

const SIZES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
};

// Ventana modal base para formularios de administración.
// Solo se cierra con los botones (evita perder un formulario por un clic accidental).
//   footer → botones de acción (se mantienen visibles al hacer scroll)
export default function Modal({
  open = true,
  title,
  description,
  onClose,
  children,
  footer,
  size = "lg",
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-brand-navy/60 p-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        className={`my-8 flex max-h-[calc(100vh-4rem)] w-full ${SIZES[size] || SIZES.lg} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-brand-navy">{title}</h3>
            {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Cerrar"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
