import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function PublicationCard({
  publication,
  isAdmin,
  normalizeAutores,
  onEdit,
  onDelete,
}) {
  const autoresRender = normalizeAutores(publication.autores).map((a, i) => {
    if (a.miembro_id) {
      return (
        <a
          key={i}
          href={`/members/${a.miembro_id}`}
          className="text-teal-600 hover:underline"
        >
          {a.nombre}
        </a>
      );
    }

    return <span key={i}>{a.nombre}</span>;
  });
  return (
    <div className="bg-white shadow rounded-lg p-5">
      <h3 className="font-semibold text-lg">
        {publication.titulo}
      </h3>

      <p>
        <strong>Autores:</strong>{" "}
        {autoresRender.map((el, i) => (
          <span key={i}>
            {el}
            {i < autoresRender.length - 1 && ", "}
          </span>
        ))}
      </p>
      <p>
        <strong>Año:</strong>{" "}
        {publication.anio || "—"}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">

        {publication.revista && (
          <a
            href={publication.revista}
            target="_blank"
            rel="noreferrer"
            className="text-center bg-[#0a192f] text-white px-4 py-2 rounded text-sm"
          >
            Ver publicación
          </a>
        )}

        {publication.pdf_url && (
          <a
            href={publication.pdf_url}
            target="_blank"
            rel="noreferrer"
            className="text-center bg-teal-300 text-[#0a192f] px-4 py-2 rounded text-sm"
          >
            Descargar PDF
          </a>
        )}

      </div>


      {isAdmin && (
        <div className="flex gap-4 mt-4 text-sm">
          <button
            onClick={() => onEdit(publication)}
            className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 transition"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Editar
          </button>


          <button
            onClick={() => onDelete(publication)}
            className="flex items-center gap-1 text-red-600 font-semibold hover:underline"
          >
            <TrashIcon className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}