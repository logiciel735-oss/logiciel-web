import placeholderImg from "../../../shared/assets/images/placeholder.svg";
import { Link } from "react-router-dom";
import { ArrowRightIcon, UsersIcon } from "@heroicons/react/24/outline";
import AdminActions from "../../../shared/ui/AdminActions";
import { optimizeImage } from "../../../shared/lib/image";

export default function ProjectCard({
  project,
  baseUrl,
  isAdmin,
  onEdit,
  onDelete,
  normalizeAutores,
}) {

  const image =
    project.image ||
    project.gallery?.[0] ||
    placeholderImg;

  const activo = project.estado === "activo";

  return (
    <article className="card group flex flex-col overflow-hidden hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={optimizeImage(image, 800)}
          alt={project.titulo}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {project.estado && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm ${
              activo
                ? "bg-brand-teal text-white"
                : "bg-white/95 text-slate-600"
            }`}
          >
            {activo ? "Activo" : "Finalizado"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-brand-navy">
          {project.titulo}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {project.min_descripcion || "Sin descripción"}
        </p>

        {project.integrantes?.length > 0 && (
          <p className="mt-4 flex gap-2 text-sm text-slate-500">
            <UsersIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
            <span className="line-clamp-2">
              {normalizeAutores(project.integrantes).map((a, i) => (
                <span key={i}>
                  {a.nombre}
                  {i < project.integrantes.length - 1 && ", "}
                </span>
              ))}
            </span>
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <Link
            to={`${baseUrl}/${project.estado}/${project.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal transition hover:text-brand-teal-dark"
          >
            Ver más
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {isAdmin && (
            <AdminActions
              onEdit={() => onEdit(project)}
              onDelete={() => onDelete(project)}
            />
          )}
        </div>
      </div>
    </article>
  );
}
