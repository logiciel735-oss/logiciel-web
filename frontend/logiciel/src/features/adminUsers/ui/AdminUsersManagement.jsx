import { useMemo, useState } from "react";

import { useAdminUsers } from "../model/useAdminUsers";
import { useAuth } from "../../auth/model/useAuth";
import { ROLE_LABELS } from "../../auth/model/permissions";

import Loader from "../../../shared/components/Loader";
import ConfirmModal from "../../../shared/ui/ConfirmModal";
import SectionHeader from "../../../shared/ui/SectionHeader";
import SearchInput from "../../../shared/ui/SearchInput";
import { matchesSearch } from "../../../shared/lib/search";

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
  const [search, setSearch] = useState("");

  // Búsqueda por nombre, correo o rol (sin distinguir tildes ni mayúsculas)
  const filteredUsers = useMemo(
    () => users.filter((u) =>
      matchesSearch(search, [u.name, u.nombres, u.apellidos, u.email, ROLE_LABELS[u.role] || u.role])
    ),
    [users, search]
  );

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

      {users.length > 0 && (
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre, correo o rol…"
            className="w-full sm:max-w-sm"
          />
          {search.trim() && (
            <p className="text-sm text-slate-500">
              {filteredUsers.length} {filteredUsers.length === 1 ? "resultado" : "resultados"}
            </p>
          )}
        </div>
      )}

      <div className="card overflow-hidden hover:shadow-sm">
        {users.length === 0 ? (
          <p className="py-12 text-center text-slate-500">No hay usuarios registrados.</p>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-semibold text-slate-600">Ningún usuario coincide con “{search}”</p>
            <button onClick={() => setSearch("")} className="mt-3 text-sm font-semibold text-brand-teal hover:text-brand-teal-dark">
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <>
            <UsersTable
              users={filteredUsers}
              currentUserId={currentUser?.id}
              onEdit={setEditingUser}
              onChangeRole={(user, role) => setRoleChange({ user, role })}
              onDelete={setUserToDelete}
            />

            <UsersMobileCards
              users={filteredUsers}
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
