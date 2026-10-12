import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

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

  const imageUrl = miembro.image ? `${miembro.image}?t=${new Date().getTime()}` : null;

  return (
    <div
      onClick={openProfile}
      className="group min-w-[260px] bg-white rounded-2xl border border-slate-100 p-6 cursor-pointer hover:shadow-xl hover:border-teal-100 transition-all duration-300 flex flex-col items-center"
    >
      {/* Contenedor de Foto */}
      <div className="relative mb-4">
        {miembro.image ? (
          <img
            src={imageUrl}
            alt={miembro.name}
            className="w-32 h-32 object-cover rounded-full ring-4 ring-slate-50 group-hover:ring-teal-50 transition-all shadow-sm"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-teal-600 text-white flex items-center justify-center text-4xl font-bold shadow-inner">
            {miembro.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Información */}
      <div className="text-center w-full">
        <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-teal-600 transition-colors">
          {miembro.name}
        </h3>
        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-wide">
          {miembro.role}
        </p>
      </div>

      {/* Acciones Admin */}
      {isAdmin && (
        <div
          className="mt-6 flex justify-center gap-2 pt-4 border-t border-slate-50 w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(miembro)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDelete(miembro)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}