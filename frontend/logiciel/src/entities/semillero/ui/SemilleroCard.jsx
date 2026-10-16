import { ArrowTopRightOnSquareIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import AdminActions from "../../../shared/ui/AdminActions";
import CardLogoHeader from "../../../shared/ui/CardLogoHeader";

// Tarjeta compacta de altura fija: el nombre ocupa 1 línea, el slogan 2 y el pie
// siempre reserva su espacio, así todas miden lo mismo tenga o no más información.
export default function SemilleroCard({
  semillero,
  isAdmin,
  onEdit,
  onDelete,
}) {
  return (
    <article className="group relative flex h-full flex-col items-center overflow-hidden rounded-3xl border border-slate-200 bg-white text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardLogoHeader
        src={semillero.imagen_url}
        alt={semillero.nombre}
        fallbackIcon={AcademicCapIcon}
      />

      <div className="flex w-full flex-1 flex-col px-4 pb-4 pt-3">
        <h3
          className="line-clamp-1 text-base font-semibold text-brand-navy"
          title={semillero.nombre}
        >
          {semillero.nombre}
        </h3>

        {/* Siempre 2 líneas de alto, haya slogan o no */}
        <p
          className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm italic leading-5 text-slate-500"
          title={semillero.slogan || undefined}
        >
          {semillero.slogan ? `"${semillero.slogan}"` : ""}
        </p>

        <div className="mt-auto flex min-h-[2.25rem] items-center justify-center pt-3">
          {semillero.link && (
            <a
              href={semillero.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-teal-light px-4 py-1.5 text-sm font-semibold text-brand-teal-dark transition hover:bg-brand-teal hover:text-white"
            >
              Visitar sitio
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Acciones de administración en su propia fila: misma altura en todas las tarjetas */}
        {isAdmin && (
          <AdminActions
            className="mt-3 justify-center border-t border-slate-100 pt-3"
            onEdit={() => onEdit(semillero)}
            onDelete={() => onDelete(semillero)}
          />
        )}
      </div>
    </article>
  );
}
