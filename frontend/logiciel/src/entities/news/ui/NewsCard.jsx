import placeholderImg from "../../../shared/assets/images/placeholder.svg";
import { Link } from "react-router-dom";
import { ArrowRightIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import AdminActions from "../../../shared/ui/AdminActions";

export default function NewsCard({
  item,
  isAdmin,
  onEdit,
  onDelete,
}) {

  const formattedDate = item?.date
    ? new Date(item.date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <article className="card group flex flex-col overflow-hidden hover:-translate-y-1">
      <div className="h-48 overflow-hidden bg-slate-100">
        <img
          src={item.image || placeholderImg}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={item.title}
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        {formattedDate && (
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
            <CalendarDaysIcon className="h-4 w-4 text-brand-teal" />
            {formattedDate}
          </p>
        )}

        <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug text-brand-navy">
          {item.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {item.summary}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <Link
            to={`/news/${item.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal transition hover:text-brand-teal-dark"
          >
            Leer más
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {isAdmin && (
            <AdminActions
              onEdit={() => onEdit(item, "noticia")}
              onDelete={() => onDelete(item, "noticia")}
            />
          )}
        </div>
      </div>
    </article>
  );
}
