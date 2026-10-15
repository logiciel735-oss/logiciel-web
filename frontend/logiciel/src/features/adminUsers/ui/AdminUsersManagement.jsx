import { useState } from "react";

import { useAdminUsers } from "../model/useAdminUsers";
import { useAuth } from "../../auth/model/useAuth";
import { ROLE_LABELS } from "../../auth/model/permissions";

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
    changeRole,
  } = useAdminUsers();

  const { user: currentUser } = useAuth();

  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [roleChange, setRoleChange] = useState(null); // { user, role }

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
              currentUserId={currentUser?.id}
              onEdit={setEditingUser}
              onChangeRole={(user, role) => setRoleChange({ user, role })}
              onDelete={setUserToDelete}
            />

            <UsersMobileCards
              users={users}
              currentUserId={currentUser?.id}
              onEdit={setEditingUser}
              onChangeRole={(user, role) => setRoleChange({ user, role })}
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

      <ConfirmModal
        open={!!roleChange}
        title="Cambiar rol"
        message={roleChange
          ? `¿Cambiar el rol de ${roleChange.user.name || roleChange.user.email} a ${ROLE_LABELS[roleChange.role]}?`
          : ""}
        confirmText="Cambiar rol"
        type="warning"
        cancelText="Cancelar"
        onConfirm={async () => {
          await changeRole(roleChange.user.id, roleChange.role);
          setRoleChange(null);
        }}
        onCancel={() => setRoleChange(null)}
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
