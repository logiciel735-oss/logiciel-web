import { Link } from "react-router-dom";

export default function MemberProfileCard({
  member,
  noticias = [],
  loadingRelated = false,
}) {
  return (
    <div className="space-y-8">

      {/* ── PERFIL ── */}
      <div className="bg-white shadow-xl rounded-2xl p-8 grid md:grid-cols-3 gap-8">

        <div className="flex flex-col items-center">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-36 h-36 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-teal-600 shadow-md flex items-center justify-center">
              <span className="text-5xl font-bold text-white">
                {member.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {member.role && (
            <span className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
              {member.role}
            </span>
          )}
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Información académica
          </h3>

          {member.universidad && (
            <p className="text-gray-600 mb-1">
              🎓 <strong>Universidad:</strong> {member.universidad}
            </p>
          )}

          {member.carrera && (
            <p className="text-gray-600 mb-1">
              📚 <strong>Carrera / Área:</strong> {member.carrera}
            </p>
          )}

          {member.descripcion && (
            <p className="mt-4 text-gray-700 leading-relaxed">
              {member.descripcion}
            </p>
          )}

          <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800">
            Contacto
          </h3>

          {member.email && (
            <p className="mb-2">
              📧{" "}
              <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                {member.email}
              </a>
            </p>
          )}

          {/* {member.numero && (
            <p className="mb-2">
              📞{" "}
              <a href={`tel:${member.numero}`} className="text-blue-600 hover:underline">
                {member.numero}
              </a>
            </p>
          )} */}
          {member.cvlac_url && (
            <div className="mb-2 flex items-center gap-2">
              📄
              <a
                href={member.cvlac_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                Ver CVLAC
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(member.cvlac_url);
                }}
                className="text-sm px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                Copiar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── NOTICIAS ── */}
      {loadingRelated ? (
        <p className="text-gray-400 text-sm text-center">Cargando noticias...</p>
      ) : noticias.length > 0 && (
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-5">
            📰 Noticias relacionadas

          </h3>
          <div className="space-y-3">
            {noticias.map((n) => (
              <Link
                key={n.id}
                to={`/news/${n.id}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-teal-50 hover:border-teal-200 transition group"
              >
                {(n.image || n.gallery?.[0]) && (
                  <img
                    src={n.image || n.gallery?.[0]}
                    alt={n.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  {/* ✅ campos mapeados: title, summary, date */}
                  <p className="font-semibold text-gray-800 group-hover:text-teal-700 transition truncate">
                    {n.title}
                  </p>
                  {n.summary && (
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {n.summary}
                    </p>
                  )}
                  {n.date && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.date).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <span className="text-teal-500 text-sm font-medium flex-shrink-0 group-hover:translate-x-1 transition-transform">
                  Ver →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}