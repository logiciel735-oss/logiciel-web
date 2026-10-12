import { PencilSquareIcon, TrashIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function SemilleroCard({
  semillero,
  isAdmin,
  onEdit,
  onDelete,
}) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-all duration-300 overflow-hidden">
      
      {/* Contenedor de Imagen: Evita recortes */}
      <div className="w-full h-44 bg-slate-50 flex items-center justify-center p-6 border-b border-slate-50 relative overflow-hidden">
        {semillero.imagen_url ? (
          <img
            src={semillero.imagen_url}
            alt={semillero.nombre}
            className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="bg-slate-200 w-full h-full flex items-center justify-center rounded-lg">
            <span className="text-slate-400 text-xs">Sin logo</span>
          </div>
        )}
        {/* Overlay suave al hacer hover */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300" />
      </div>

      {/* Contenido de la Card */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">
          {semillero.nombre}
        </h3>

        {semillero.slogan && (
          <p className="text-slate-500 mb-4 italic text-sm leading-relaxed flex-grow line-clamp-2">
            "{semillero.slogan}"
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          {semillero.link && (
            <a
              href={semillero.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-teal-600 font-bold text-sm hover:text-teal-700 transition-colors"
            >
              Ver sitio web
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </a>
          )}

          {/* Botones Administrativos con diseño minimalista */}
          {isAdmin && (
            <div className="flex gap-1 ml-auto">
              <button
                onClick={() => onEdit(semillero)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="Editar"
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(semillero)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Eliminar"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}