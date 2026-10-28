import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import placeholderImg from "../../../shared/assets/images/placeholder.svg";
import { optimizeImage } from "../../../shared/lib/image";
import { formatCalendarDate } from "../../../shared/utils/formatDateInput";

// Fila enlazada para listas relacionadas del perfil (proyectos, noticias).
export default function RelatedItem({ to, image, title, subtitle, date }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-xl border border-slate-200 p-3 transition hover:border-brand-teal/50 hover:bg-brand-teal-light/40"
    >
      <img
        src={optimizeImage(image, 160) || placeholderImg}
        alt=""
        className="h-16 w-16 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-brand-navy transition group-hover:text-brand-teal">
          {title}
        </p>
        {subtitle && (
          <p className="mt-0.5 truncate text-sm text-slate-500">{subtitle}</p>
        )}
        {date && (
          <p className="mt-0.5 text-xs text-slate-400">
            {formatCalendarDate(date, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
      <ArrowRightIcon className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-teal" />
    </Link>
  );
}
