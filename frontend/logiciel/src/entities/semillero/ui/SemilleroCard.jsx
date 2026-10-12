import { ArrowTopRightOnSquareIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import AdminActions from "../../../shared/ui/AdminActions";
import { optimizeImage } from "../../../shared/lib/image";

export default function SemilleroCard({
  semillero,
  isAdmin,
  onEdit,
  onDelete,
}) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden hover:-translate-y-1">
      {/* LOGO: object-contain para no recortar */}
      <div className="flex h-40 items-center justify-center border-b border-slate-100 bg-slate-50 p-6">
        {semillero.imagen_url ? (
          <img
            src={optimizeImage(semillero.imagen_url, 800)}
            alt={semillero.nombre}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <AcademicCapIcon className="h-12 w-12 text-slate-300" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-semibold text-brand-navy">
          {semillero.nombre}
        </h3>

        {semillero.slogan && (
          <p className="mt-2 line-clamp-2 text-sm italic leading-relaxed text-slate-500">
            "{semillero.slogan}"
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          {semillero.link && (
            <a
              href={semillero.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal transition hover:text-brand-teal-dark"
            >
              Visitar sitio
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
          )}

          {isAdmin && (
            <AdminActions
              className="ml-auto"
              onEdit={() => onEdit(semillero)}
              onDelete={() => onDelete(semillero)}
            />
          )}
        </div>
      </div>
    </article>
  );
}
