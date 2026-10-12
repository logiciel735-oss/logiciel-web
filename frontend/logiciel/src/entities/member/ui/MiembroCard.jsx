import { useNavigate } from "react-router-dom";
import AdminActions from "../../../shared/ui/AdminActions";

export default function MiembroCard({
  miembro,
  isAdmin,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  const openProfile = () => {
    navigate(`/members/${miembro.user_id}`);
  };

  return (
    <article
      onClick={openProfile}
      className="card group flex w-60 cursor-pointer flex-col items-center p-6 text-center hover:-translate-y-1 hover:border-brand-teal/40"
    >
      {miembro.image ? (
        <img
          src={miembro.image}
          alt={miembro.name}
          className="h-28 w-28 rounded-full object-cover ring-4 ring-slate-100 transition group-hover:ring-brand-teal-light"
        />
      ) : (
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-navy text-4xl font-semibold text-white ring-4 ring-slate-100 transition group-hover:ring-brand-teal-light">
          {miembro.name?.charAt(0).toUpperCase()}
        </div>
      )}

      <h3 className="mt-4 line-clamp-2 font-semibold leading-snug text-brand-navy transition-colors group-hover:text-brand-teal">
        {miembro.name}
      </h3>

      {miembro.role && (
        <span className="mt-2 rounded-full bg-brand-teal-light px-3 py-0.5 text-xs font-semibold capitalize text-brand-teal-dark">
          {miembro.role}
        </span>
      )}

      {isAdmin && (
        <AdminActions
          className="mt-5 border-t border-slate-100 pt-4"
          onEdit={() => onEdit(miembro)}
          onDelete={() => onDelete(miembro)}
        />
      )}
    </article>
  );
}
