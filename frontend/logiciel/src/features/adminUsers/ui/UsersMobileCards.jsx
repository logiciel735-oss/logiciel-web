import { RoleBadge, UserAvatar } from "./UsersTable";

const UsersMobileCards = ({ users, onEdit, onPromote, onDelete }) => {
  return (
    <ul className="divide-y divide-slate-100 md:hidden">
      {users.map((user) => (
        <li key={user.id} className="space-y-3 p-4">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size="h-10 w-10" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-brand-navy">{user.name}</p>
              <p className="truncate text-sm text-slate-500">{user.email}</p>
            </div>
            <RoleBadge role={user.role} />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(user)}
              className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-teal hover:text-brand-teal"
            >
              Editar
            </button>

            {user.role !== "admin" && (
              <button
                onClick={() => onPromote(user.id)}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-navy hover:text-brand-navy"
              >
                Promover
              </button>
            )}

            <button
              onClick={() => onDelete(user.id)}
              className="flex-1 rounded-lg border border-red-200 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UsersMobileCards;
