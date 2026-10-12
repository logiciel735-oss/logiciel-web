import placeholderImg from "../../../shared/assets/images/placeholder.svg";
import { Link } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

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

  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <img
        src={image}
        alt={project.titulo}
        className="w-full h-48 sm:h-52 object-cover"
      />

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">
          {project.titulo}
        </h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">
          {project.min_descripcion || "Sin descripción"}
        </p>

        {project.integrantes?.length > 0 && (
          <p className="text-sm text-gray-500 mb-3">
            <strong>Integrantes:</strong>{" "}
            {normalizeAutores(project.integrantes).map((a, i) => (
              <span key={i}>
                {a.nombre}
                {i < project.integrantes.length - 1 && ", "}
              </span>
            ))}
          </p>
        )}

        <Link
          to={`${baseUrl}/${project.estado}/${project.id}`}
          className="text-blue-600 block mt-4"
        >
          Ver más
        </Link>
      </div>

      {isAdmin && (
        <div className="mt-2 flex gap-3 justify-center pb-4">
          <button
            onClick={() => onEdit(project)}
            className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 transition"
          >
            <PencilSquareIcon className="w-5 h-5" />
            Editar
          </button>
          <button
            onClick={() => onDelete(project)}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
          >
            <TrashIcon className="w-5 h-5" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}