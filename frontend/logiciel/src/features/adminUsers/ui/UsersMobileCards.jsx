import React from "react";

const UsersMobileCards = ({ users, onEdit, onPromote, onDelete }) => {
  return (
    <div className="md:hidden">
      {users.map((user) => (
        <div
          key={user.uid}
          className="p-4 border-b border-gray-200 space-y-2"
        >

          <div className="flex justify-between">
            <span className="font-bold text-[#0a192f]">Nombre:</span>
            <span>{user.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold text-[#0a192f]">Correo:</span>
            <span className="truncate ml-4">{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold text-[#0a192f]">Rol:</span>
            <span className="capitalize px-2 py-0.5 bg-gray-100 rounded text-sm">
              {user.role}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-3 justify-center">

            <button
              onClick={() => onEdit(user)}
              className="flex-1 bg-blue-600 text-white py-2 rounded text-sm"
            >
              Editar
            </button>

            {user.role !== "admin" && (
              <button
                onClick={() => onPromote(user.id)}
                className="flex-1 bg-green-600 text-white py-2 rounded text-sm"
              >
                Promover
              </button>
            )}

            <button
              onClick={() => onDelete(user.id)}
              className="flex-1 bg-red-600 text-white py-2 rounded text-sm"
            >
              Eliminar
            </button>

          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersMobileCards;