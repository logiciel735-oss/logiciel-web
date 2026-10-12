import { PencilSquareIcon, TrashIcon, GlobeAltIcon, TagIcon } from "@heroicons/react/24/outline";

export default function AliadosInstitucionalesCard({
  aliado,
  isAdmin,
  onEdit,
  onDelete,
}) {
  if (!aliado) return null;

  const goToSite = () => {
    if (aliado.sitio_web) {
      window.open(aliado.sitio_web, "_blank");
    }
  };

  // Timestamp para claridad y actualización de imagen
  const logoUrl = aliado.logo_url ? `${aliado.logo_url}?t=${new Date().getTime()}` : null;

  return (
    <div
      onClick={goToSite}
      className="group relative min-w-[240px] bg-white rounded-2xl border border-slate-100 p-6 flex flex-col h-full cursor-pointer hover:shadow-xl hover:border-teal-200 transition-all duration-300"
    >
      {/* BADGES SUPERIORES */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
        {/* Tipo de Aliado */}
        {aliado.tipo && (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 px-2 py-1 rounded-md border border-teal-100">
            <TagIcon className="w-3 h-3" />
            {aliado.tipo}
          </span>
        )}
        {/* País */}
        {aliado.pais && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            {aliado.pais}
          </span>
        )}
      </div>

      {/* CONTENEDOR DEL LOGO (Optimizado para claridad) */}
      <div className="h-28 w-full flex items-center justify-center mt-4 mb-4 transition-transform duration-500 group-hover:scale-105">
        {aliado.logo_url ? (
          <img
            src={logoUrl}
            alt={aliado.nombre}
            className="max-h-full max-w-[85%] object-contain antialiased"
            style={{ 
              filter: 'contrast(1.02) brightness(1.02)',
              imageRendering: 'auto' 
            }}
          />
        ) : (
          <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-dashed border-slate-200">
            <GlobeAltIcon className="w-8 h-8 text-slate-300" />
          </div>
        )}
      </div>

      {/* INFORMACIÓN */}
      <div className="text-center flex-grow flex flex-col justify-center">
        <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-2">
          {aliado.nombre}
        </h3>
      </div>

      {/* ACCIONES ADMIN (Estilo minimalista en la base) */}
      {isAdmin && (
        <div
          className="mt-5 pt-4 border-t border-slate-50 flex justify-center gap-1 w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(aliado)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Editar Aliado"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDelete(aliado)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Eliminar Aliado"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}