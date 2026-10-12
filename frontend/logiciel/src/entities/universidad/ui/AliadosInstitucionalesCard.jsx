import { BuildingLibraryIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import AdminActions from "../../../shared/ui/AdminActions";

export default function AliadosInstitucionalesCard({
  aliado,
  isAdmin,
  onEdit,
  onDelete,
}) {
  if (!aliado) return null;

  const goToSite = () => {
    if (aliado.sitio_web) {
      window.open(aliado.sitio_web, "_blank");
    }
  };

  return (
    <article
      onClick={goToSite}
      className={`card group flex h-full w-60 flex-col p-5 ${
        aliado.sitio_web ? "cursor-pointer hover:-translate-y-1 hover:border-brand-teal/40" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        {aliado.tipo ? (
          <span className="rounded-full bg-brand-teal-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-teal-dark">
            {aliado.tipo}
          </span>
        ) : <span />}
        {aliado.pais && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {aliado.pais}
          </span>
        )}
      </div>

      {/* LOGO */}
      <div className="my-5 flex h-24 items-center justify-center">
        {aliado.logo_url ? (
          <img
            src={aliado.logo_url}
            alt={aliado.nombre}
            className="max-h-full max-w-[85%] object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <BuildingLibraryIcon className="h-12 w-12 text-slate-300" />
        )}
      </div>

      <h3 className="line-clamp-2 text-center text-sm font-semibold text-brand-navy transition-colors group-hover:text-brand-teal">
        {aliado.nombre}
      </h3>

      {aliado.sitio_web && (
        <p className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-400">
          Sitio web <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
        </p>
      )}

      {isAdmin && (
        <div className="mt-auto pt-5">
          <AdminActions
            className="justify-center border-t border-slate-100 pt-4"
            onEdit={() => onEdit(aliado)}
            onDelete={() => onDelete(aliado)}
          />
        </div>
      )}
    </article>
  );
}
