import {
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import AdminActions from "../../../shared/ui/AdminActions";

export default function PublicationCard({
  publication,
  isAdmin,
  normalizeAutores,
  onEdit,
  onDelete,
}) {
  const autoresRender = normalizeAutores(publication.autores).map((a, i) => {
    if (a.miembro_id) {
      return (
        <a
          key={i}
          href={`/members/${a.miembro_id}`}
          className="font-medium text-brand-teal hover:underline"
        >
          {a.nombre}
        </a>
      );
    }

    return <span key={i}>{a.nombre}</span>;
  });

  return (
    <article className="card flex h-full flex-col p-5 hover:border-brand-teal/40">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-teal-light text-brand-teal">
          <DocumentTextIcon className="h-5 w-5" />
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {publication.anio || "—"}
        </span>
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug text-brand-navy">
        {publication.titulo}
      </h3>

      {autoresRender.length > 0 && (
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {autoresRender.map((el, i) => (
            <span key={i}>
              {el}
              {i < autoresRender.length - 1 && ", "}
            </span>
          ))}
        </p>
      )}

      {(publication.revista || publication.pdf_url) && (
        <div className="mt-5 flex flex-wrap gap-2">
          {publication.revista && (
            <a
              href={publication.revista}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-navy-light"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              Ver publicación
            </a>
          )}

          {publication.pdf_url && (
            <a
              href={publication.pdf_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-teal px-3 py-2 text-xs font-semibold text-brand-teal transition hover:bg-brand-teal hover:text-white"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Descargar PDF
            </a>
          )}
        </div>
      )}

      {isAdmin && (
        <div className="mt-auto pt-5">
          <AdminActions
            className="border-t border-slate-100 pt-4"
            onEdit={() => onEdit(publication)}
            onDelete={() => onDelete(publication)}
          />
        </div>
      )}
    </article>
  );
}
