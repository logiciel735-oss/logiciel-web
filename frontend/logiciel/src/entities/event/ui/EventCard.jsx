import { Link } from "react-router-dom";
import {
  PencilSquareIcon,
  TrashIcon,
  CalendarDaysIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function EventCard({
  item,
  isAdmin,
  onEdit,
  onDelete,
}) {

  const formatDate = (date) => {
    if (!date) return "Sin fecha";

    return new Date(date).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <article
      className="
        bg-white rounded-2xl overflow-hidden
        shadow-md hover:shadow-2xl
        transition-all duration-300
        hover:-translate-y-1
        border border-gray-100
      "
    >

      {/* IMAGE */}
      <div className="relative overflow-hidden">

        <img
          src={
            item.image ||
            "/assets/images/placeholder.jpg"
          }
          alt={item.title}
          className="
            w-full h-56 object-cover
            transition-transform duration-500
            hover:scale-105
          "
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* FECHA */}
        <div
          className="
            absolute top-4 left-4
            bg-white/95 backdrop-blur-sm
            rounded-xl px-3 py-2
            shadow-lg
          "
        >
          <div className="flex items-center gap-2 text-teal-700">

            <CalendarDaysIcon className="w-5 h-5" />

            <span className="text-sm font-bold">
              {formatDate(item.date)}
            </span>

          </div>
        </div>

        {/* UBICACIÓN */}
        {item.location && (
          <div
            className="
              absolute bottom-4 left-4
              bg-black/60 backdrop-blur-sm
              text-white
              px-3 py-1.5 rounded-full
              flex items-center gap-2
              text-sm
            "
          >
            <MapPinIcon className="w-4 h-4" />

            <span>{item.location}</span>
          </div>
        )}

      </div>

      {/* CONTENT */}
      <div className="p-6">

        <h3
          className="
            text-2xl font-bold text-gray-800
            mb-3 line-clamp-2
          "
        >
          {item.title}
        </h3>

        <p
          className="
            text-gray-600 leading-relaxed
            line-clamp-3
          "
        >
          {item.summary}
        </p>

        {/* LINK */}
        <Link
          to={`/events/${item.id}`}
          className="
            inline-flex items-center gap-2
            mt-5 text-teal-700 font-semibold
            hover:text-teal-900 transition
          "
        >
          Ver detalles →
        </Link>

        {/* ADMIN */}
        {isAdmin && (
          <div className="mt-5 pt-4 border-t flex gap-5">

            <button
              onClick={() => onEdit(item, "evento")}
              className="
                flex items-center gap-2
                text-yellow-600 hover:text-yellow-700
                font-medium transition
              "
            >
              <PencilSquareIcon className="w-5 h-5" />
              Editar
            </button>

            <button
              onClick={() => onDelete(item, "evento")}
              className="
                flex items-center gap-2
                text-red-600 hover:text-red-700
                font-medium transition
              "
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