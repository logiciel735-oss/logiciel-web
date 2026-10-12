import { TrashIcon } from "@heroicons/react/24/outline";
import BaseModal from "./BaseModal";

export default function ConfirmDeleteModal({
  title,
  message,
  onCancel,
  onConfirm,
  loading = false,
}) {
  return (
    <BaseModal size="sm" zIndex={110}>
      <div className="p-6 text-center">

        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrashIcon className="w-8 h-8 text-red-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          ¿Estás seguro?
        </h3>

        <p className="text-gray-500 mb-6 text-sm">
          {message ? (
            message
          ) : (
            <>
              Estás a punto de eliminar permanentemente:
              <br />
              <span className="font-semibold text-gray-800">
                "{title}"
              </span>
            </>
          )}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Borrando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}