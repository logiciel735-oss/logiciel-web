import React, { useEffect, useState } from "react";

const EditUserModal = ({ user, onClose, onSave }) => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSave = () => {
    onSave(user.id, form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[60] p-4">

      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-bold mb-4 text-[#0a192f]">
          Editar Usuario
        </h2>

        <div className="space-y-4">

          <div>
            <label className="block mb-1 font-medium text-sm">Nombre</label>
            <input
              className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Correo</label>
            <input
              className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Rol</label>
            <select
              className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

        </div>

        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Guardar Cambios
          </button>

        </div>

      </div>

    </div>
  );
};

export default EditUserModal;