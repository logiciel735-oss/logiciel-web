import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const TYPES = {
  danger: {
    button: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500",
    icon: ExclamationTriangleIcon,
    iconBox: "bg-red-100 text-red-600",
  },
  warning: {
    button: "bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-500",
    icon: ExclamationTriangleIcon,
    iconBox: "bg-amber-100 text-amber-600",
  },
  info: {
    button: "bg-brand-navy hover:bg-brand-navy-light focus-visible:ring-brand-navy",
    icon: InformationCircleIcon,
    iconBox: "bg-slate-100 text-brand-navy",
  },
  success: {
    button: "bg-brand-teal hover:bg-brand-teal-dark focus-visible:ring-brand-teal",
    icon: CheckCircleIcon,
    iconBox: "bg-brand-teal-light text-brand-teal",
  },
};

const ConfirmModal = ({
  open,
  title = "Confirmar acción",
  message = "¿Estás seguro?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
  type = "danger",
}) => {
  if (!open) return null;

  const styles = TYPES[type] || TYPES.danger;
  const Icon = styles.icon;

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-brand-navy/60 p-4 backdrop-blur-sm">
      <div role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex gap-4">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${styles.iconBox}`}>
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-brand-navy">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary py-2"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center justify-center rounded-lg px-5 py-2 font-semibold text-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 ${styles.button}`}
          >
            {loading ? "Procesando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
