import React from "react";

const UsersTable = ({ users, onEdit, onPromote, onDelete }) => {
  return (
    <table className="w-full hidden md:table">
      <thead className="bg-[#0a192f] text-white">
        <tr>
          <th className="py-3 px-4 text-left">Nombre</th>
          <th className="py-3 px-4 text-left">Correo</th>
          <th className="py-3 px-4 text-left">Rol</th>
          <th className="py-3 px-4 text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr
            key={user.uid}
            className="border-b hover:bg-gray-50 transition-colors"
          >
            <td className="py-3 px-4">
              <div className="flex items-center gap-3">

                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#0a192f] text-white flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}

                <span>{user.name}</span>

              </div>
            </td>

            <td className="py-3 px-4">{user.email}</td>

            <td className="py-3 px-4 capitalize">{user.role}</td>

            <td className="py-3 px-4">
              <div className="flex gap-2 justify-center">

                <button
                  onClick={() => onEdit(user)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  Editar
                </button>

                {user.role !== "admin" && (
                  <button
                    onClick={() => onPromote(user.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    Promover
                  </button>
                )}

                <button
                  onClick={() => onDelete(user.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Eliminar
                </button>

              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;