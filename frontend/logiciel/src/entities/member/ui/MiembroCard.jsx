import { useNavigate } from "react-router-dom";
import AdminActions from "../../../shared/ui/AdminActions";
import { optimizeImage } from "../../../shared/lib/image";
import { getMemberRole } from "../model/memberRoles";

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
      className="card group flex h-full w-60 cursor-pointer flex-col items-center p-6 text-center hover:-translate-y-1 hover:border-brand-teal/40"
    >
      {miembro.image ? (
        <img
          src={optimizeImage(miembro.image, 400)}
          alt={miembro.name}
          className="h-28 w-28 rounded-full object-cover ring-4 ring-slate-100 transition group-hover:ring-brand-teal-light"
        />
      ) : (
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-navy text-4xl font-semibold text-white ring-4 ring-slate-100 transition group-hover:ring-brand-teal-light">
          {miembro.name?.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Nombre: siempre 2 líneas de alto, así todas las tarjetas miden lo mismo */}
      <h3
        className="mt-4 line-clamp-2 min-h-[2.75rem] font-semibold leading-snug text-brand-navy transition-colors group-hover:text-brand-teal"
        title={miembro.name}
      >
        {miembro.name}
      </h3>

      <div className="mt-2 flex h-6 items-center">
        {miembro.role && (
          <span className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${getMemberRole(miembro.role).badge}`}>
            {getMemberRole(miembro.role).label}
          </span>
        )}
      </div>

      {isAdmin && (
        <AdminActions
          className="mt-4 w-full justify-center border-t border-slate-100 pt-4"
          onEdit={() => onEdit(miembro)}
          onDelete={() => onDelete(miembro)}
        />
      )}
    </article>
  );
}
