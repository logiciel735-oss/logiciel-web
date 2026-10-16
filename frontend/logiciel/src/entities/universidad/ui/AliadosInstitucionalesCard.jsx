import { BuildingLibraryIcon, ArrowTopRightOnSquareIcon, MapPinIcon } from "@heroicons/react/24/outline";
import AdminActions from "../../../shared/ui/AdminActions";
import CardLogoHeader from "../../../shared/ui/CardLogoHeader";

// Misma estructura que SemilleroCard: altura fija sin importar cuánta información tenga.
export default function AliadosInstitucionalesCard({
  aliado,
  isAdmin,
  onEdit,
  onDelete,
}) {
  if (!aliado) return null;

  // Aliados antiguos guardados sin nombre: se usa el tipo como título
  const titulo = aliado.nombre?.trim() || aliado.tipo || "Aliado institucional";
  const tipo = aliado.nombre?.trim() ? aliado.tipo : "";

  const goToSite = () => {
    if (aliado.sitio_web) {
      window.open(aliado.sitio_web, "_blank");
    }
  };

  return (
    <article
      onClick={goToSite}
      className={`group relative flex h-full flex-col items-center overflow-hidden rounded-3xl border border-slate-200 bg-white text-center shadow-sm transition-all duration-300 hover:shadow-lg ${
        aliado.sitio_web ? "cursor-pointer hover:-translate-y-1" : ""
      }`}
    >
      <CardLogoHeader
        src={aliado.logo_url}
        alt={titulo}
        fallbackIcon={BuildingLibraryIcon}
      />

      <div className="flex w-full flex-1 flex-col px-4 pb-4 pt-3">
        {/* Siempre 2 líneas de alto */}
        <h3
          className="line-clamp-2 min-h-[2.5rem] text-base font-semibold leading-5 text-brand-navy transition-colors group-hover:text-brand-teal"
          title={titulo}
        >
          {titulo}
        </h3>

        {/* Tipo y país en una sola línea */}
        <p className="mt-1.5 flex min-h-[1.25rem] items-center justify-center gap-1.5 truncate text-xs text-slate-500">
          {tipo && (
            <span className="truncate font-semibold uppercase tracking-wide text-brand-teal-dark">{tipo}</span>
          )}
          {tipo && aliado.pais && <span className="text-slate-300">•</span>}
          {aliado.pais && (
            <span className="inline-flex shrink-0 items-center gap-0.5">
              <MapPinIcon className="h-3.5 w-3.5" />
              {aliado.pais}
            </span>
          )}
        </p>

        <div className="mt-auto flex min-h-[2.25rem] items-center justify-center pt-3">
          {aliado.sitio_web && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-teal-light px-4 py-1.5 text-sm font-semibold text-brand-teal-dark transition group-hover:bg-brand-teal group-hover:text-white">
              Sitio web
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </span>
          )}
        </div>

        {isAdmin && (
          <AdminActions
            className="mt-3 justify-center border-t border-slate-100 pt-3"
            onEdit={() => onEdit(aliado)}
            onDelete={() => onDelete(aliado)}
          />
        )}
      </div>
    </article>
  );
}
