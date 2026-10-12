import BaseModal from "../../shared/ui/BaseModal";

const EditMemberModal = ({
  data,
  onChange,
  onSave,
  onClose,
}) => (
  <BaseModal size="lg">
    <div className="p-5 border-b flex justify-between items-center">
      <h3 className="text-xl font-bold text-[#0a192f]">
        Editar Miembro
      </h3>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>

    <div className="p-6 overflow-y-auto space-y-4">
      {/* inputs */}
    </div>

    <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-6 py-2.5 text-gray-600 hover:bg-gray-200 rounded-lg"
      >
        Cancelar
      </button>

      <button
        onClick={onSave}
        className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-green-700"
      >
        Guardar Cambios
      </button>
    </div>
  </BaseModal>
);