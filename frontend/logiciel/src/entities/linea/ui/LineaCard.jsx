import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function LineaCard({
  linea,
  isAdmin,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col h-full">

      {linea.imagen_url && (
        <img
          src={linea.imagen_url}
          alt={linea.nombre}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      <h3 className="text-xl font-semibold mb-2">
        {linea.nombre}
      </h3>

      <p className="text-gray-600 mb-2">
        {linea.descripcion}
      </p>

      {linea.coordinador && (
        <p className="text-sm text-gray-500">
          Coordinador: {linea.coordinador}
        </p>
      )}

      {isAdmin && (
        <div className="mt-auto pt-4 flex gap-3">
          <button
            onClick={() => onEdit(linea)}
            className="text-yellow-600 hover:text-yellow-700"
          >
            <PencilSquareIcon className="w-5 h-5" />
            Editar
          </button>

          <button
            onClick={() => onDelete(linea)}
            className="text-red-600 hover:text-red-700"
          >
            <TrashIcon className="w-5 h-5" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}