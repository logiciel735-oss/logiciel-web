import { UserIcon } from "@heroicons/react/24/outline";
import AdminActions from "../../../shared/ui/AdminActions";

export default function LineaCard({
  linea,
  isAdmin,
  onEdit,
  onDelete,
}) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      {linea.imagen_url && (
        <div className="h-48 overflow-hidden bg-slate-100">
          <img
            src={linea.imagen_url}
            alt={linea.nombre}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className={`flex flex-1 flex-col p-6 ${linea.imagen_url ? "" : "border-t-4 border-brand-teal"}`}>
        <h3 className="text-xl font-semibold text-brand-navy">
          {linea.nombre}
        </h3>

        <p className="mt-3 leading-relaxed text-slate-600">
          {linea.descripcion}
        </p>

        {linea.coordinador && (
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <UserIcon className="h-4 w-4 text-brand-teal" />
            Coordinador: <span className="font-medium text-slate-700">{linea.coordinador}</span>
          </p>
        )}

        {isAdmin && (
          <AdminActions
            className="mt-auto pt-5"
            onEdit={() => onEdit(linea)}
            onDelete={() => onDelete(linea)}
          />
        )}
      </div>
    </article>
  );
}
