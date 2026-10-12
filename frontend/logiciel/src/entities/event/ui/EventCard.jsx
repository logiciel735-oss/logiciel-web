import placeholderImg from "../../../shared/assets/images/placeholder.svg";
import { Link } from "react-router-dom";
import { ArrowRightIcon, MapPinIcon } from "@heroicons/react/24/outline";
import AdminActions from "../../../shared/ui/AdminActions";
import { optimizeImage } from "../../../shared/lib/image";

export default function EventCard({
  item,
  isAdmin,
  onEdit,
  onDelete,
}) {
  const fecha = item.date ? new Date(item.date) : null;
  const dia = fecha ? fecha.toLocaleDateString("es-CO", { day: "2-digit" }) : "—";
  const mes = fecha ? fecha.toLocaleDateString("es-CO", { month: "short" }).replace(".", "") : "";
  const anio = fecha ? fecha.getFullYear() : "";

  return (
    <article className="card group flex flex-col overflow-hidden hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={optimizeImage(item.image, 800) || placeholderImg}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* FECHA (bloque calendario) */}
        <div className="absolute left-3 top-3 w-14 overflow-hidden rounded-lg bg-white text-center shadow-md">
          <p className="bg-brand-navy py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            {mes || "Fecha"}
          </p>
          <p className="py-1 text-xl font-bold leading-none text-brand-navy">{dia}</p>
          <p className="pb-1 text-[10px] text-slate-500">{anio}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-brand-navy">
          {item.title}
        </h3>

        {item.location && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPinIcon className="h-4 w-4 shrink-0 text-brand-teal" />
            <span className="line-clamp-1">{item.location}</span>
          </p>
        )}

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {item.summary}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <Link
            to={`/events/${item.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal transition hover:text-brand-teal-dark"
          >
            Ver detalles
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {isAdmin && (
            <AdminActions
              onEdit={() => onEdit(item, "evento")}
              onDelete={() => onDelete(item, "evento")}
            />
          )}
        </div>
      </div>
    </article>
  );
}
