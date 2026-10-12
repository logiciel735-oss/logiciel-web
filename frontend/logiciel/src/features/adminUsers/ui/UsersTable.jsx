import { PencilSquareIcon, TrashIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export const RoleBadge = ({ role }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
      role === "admin"
        ? "bg-brand-navy text-white"
        : "bg-slate-100 text-slate-600"
    }`}
  >
    {role === "admin" ? "Administrador" : "Usuario"}
  </span>
);

export const UserAvatar = ({ user, size = "h-9 w-9" }) =>
  user.avatar ? (
    <img
      src={user.avatar}
      alt={user.name}
      className={`${size} shrink-0 rounded-full object-cover`}
    />
  ) : (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white`}>
      {user.name?.charAt(0).toUpperCase() || "?"}
    </div>
  );

const actionBtn =
  "inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition";

const UsersTable = ({ users, onEdit, onPromote, onDelete }) => {
  return (
    <table className="hidden w-full text-sm md:table">
      <thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-700">
        <tr>
          <th className="px-5 py-3 font-semibold">Nombre</th>
          <th className="px-5 py-3 font-semibold">Correo</th>
          <th className="px-5 py-3 font-semibold">Rol</th>
          <th className="px-5 py-3 text-right font-semibold">Acciones</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {users.map((user) => (
          <tr key={user.id} className="transition-colors hover:bg-slate-50">
            <td className="px-5 py-3">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} />
                <span className="font-medium text-brand-navy">{user.name}</span>
              </div>
            </td>

            <td className="px-5 py-3 text-slate-600">{user.email}</td>

            <td className="px-5 py-3"><RoleBadge role={user.role} /></td>

            <td className="px-5 py-3">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onEdit(user)}
                  className={`${actionBtn} hover:border-brand-teal hover:text-brand-teal`}
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  Editar
                </button>

                {user.role !== "admin" && (
                  <button
                    onClick={() => onPromote(user.id)}
                    className={`${actionBtn} hover:border-brand-navy hover:text-brand-navy`}
                  >
                    <ShieldCheckIcon className="h-4 w-4" />
                    Promover
                  </button>
                )}

                <button
                  onClick={() => onDelete(user.id)}
                  className={`${actionBtn} hover:border-red-300 hover:bg-red-50 hover:text-red-600`}
                >
                  <TrashIcon className="h-4 w-4" />
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
