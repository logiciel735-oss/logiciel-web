import React, { useState } from "react";

import { useAdminUsers } from "../model/useAdminUsers";

import Loader from "../../../shared/components/Loader";
import ConfirmModal from "../../../shared/ui/ConfirmModal";

import UsersTable from "./UsersTable";
import UsersMobileCards from "./UsersMobileCards";
import EditUserModal from "./EditUserModal";

const AdminUsersManagement = () => {

  const {
    users,
    loading,
    updateUser,
    deleteUser,
    promoteUser,
  } = useAdminUsers();

  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  if (loading) {
    return <Loader text="Cargando Usuarios…" fullscreen={false} />;
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">

      <h1 className="text-2xl md:text-3xl font-bold text-[#0a192f] mb-6">
        Gestión de Usuarios
      </h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">

        <UsersTable
          users={users}
          onEdit={setEditingUser}
          onPromote={promoteUser}
          onDelete={setUserToDelete}
        />

        <UsersMobileCards
          users={users}
          onEdit={setEditingUser}
          onPromote={promoteUser}
          onDelete={setUserToDelete}
        />

        <ConfirmModal
          open={!!userToDelete}
          title="Eliminar usuario"
          message="Esta acción no se puede deshacer"
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={async () => {
            await deleteUser(userToDelete);
            setUserToDelete(null);
          }} 
          onCancel={() => setUserToDelete(null)}
        />

        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={updateUser}
        />

      </div>

    </div>
  );
};

export default AdminUsersManagement;