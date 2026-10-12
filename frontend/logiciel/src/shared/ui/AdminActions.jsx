import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

// Botones Editar / Eliminar de las tarjetas para administradores.
// stopPropagation evita activar el clic de tarjetas que son enlaces.
export default function AdminActions({ onEdit, onDelete, className = "" }) {
  const stop = (fn) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    fn?.();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={stop(onEdit)}
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-brand-teal hover:text-brand-teal"
      >
        <PencilSquareIcon className="h-4 w-4" />
        Editar
      </button>
      <button
        type="button"
        onClick={stop(onDelete)}
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
      >
        <TrashIcon className="h-4 w-4" />
        Eliminar
      </button>
    </div>
  );
}
