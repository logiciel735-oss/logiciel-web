import { useState } from "react";

import { useAdminUsers } from "../model/useAdminUsers";

import Loader from "../../../shared/components/Loader";
import ConfirmModal from "../../../shared/ui/ConfirmModal";
import SectionHeader from "../../../shared/ui/SectionHeader";

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
    return (
      <div className="relative min-h-[50vh]">
        <Loader text="Cargando usuarios…" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">

      <SectionHeader
        eyebrow="Administración"
        title="Gestión de usuarios"
        description={`${users.length} ${users.length === 1 ? "usuario registrado" : "usuarios registrados"} en la plataforma.`}
      />

      <div className="card overflow-hidden hover:shadow-sm">
        {users.length === 0 ? (
          <p className="py-12 text-center text-slate-500">No hay usuarios registrados.</p>
        ) : (
          <>
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
          </>
        )}
      </div>

      <ConfirmModal
        open={!!userToDelete}
        title="Eliminar usuario"
        message="Se eliminará la cuenta y su perfil. Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={async () => {
          await deleteUser(userToDelete);
          setUserToDelete(null);
        }}
        onCancel={() => setUserToDelete(null)}
      />

      <EditUserModal
        key={editingUser?.id ?? "sin-usuario"}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={updateUser}
      />

    </div>
  );
};

export default AdminUsersManagement;
