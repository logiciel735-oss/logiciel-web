import { Link } from "react-router-dom";
import {
  PencilSquareIcon,
  TrashIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

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
    <article
      className="
        bg-gray-100
        rounded-lg
        shadow-md
        overflow-hidden
        transition-all
        duration-300
        hover:shadow-xl
        hover:-translate-y-1
      "
    >
      {/* IMAGEN */}
      <img
        src={item.image}
        className="w-full h-52 object-cover"
        alt={item.title}
      />

      <div className="p-6 text-left">

        {/* FECHA */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <CalendarDaysIcon className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>

        {/* TITULO */}
        <h3 className="text-xl font-semibold line-clamp-2">
          {item.title}
        </h3>

        {/* RESUMEN */}
        <p className="text-gray-600 mt-2 line-clamp-3">
          {item.summary}
        </p>

        {/* LINK */}
        <Link
          to={`/news/${item.id}`}
          className="text-blue-600 block mt-4 hover:underline"
        >
          Leer más
        </Link>

        {/* ADMIN */}
        {isAdmin && (
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => onEdit(item, "noticia")}
              className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 transition"
            >
              <PencilSquareIcon className="w-5 h-5" />
              Editar
            </button>

            <button
              onClick={() => onDelete(item, "noticia")}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
            >
              <TrashIcon className="w-5 h-5" />
              Eliminar
            </button>
          </div>
        )}
      </div>
    </article>
  );
}