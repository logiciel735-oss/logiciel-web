import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getMiembros } from "../../entities/member/api/miembroApi";

export default function AuthorSelector({ autores = [], setAutores, label = "Autores" }) {
  const [miembros, setMiembros]   = useState([]);
  const [searchQ, setSearchQ]     = useState("");
  const [nombreExt, setNombreExt] = useState("");
  const [rolExt, setRolExt]       = useState("Autor");

  useEffect(() => {
    getMiembros().then(setMiembros).catch(() => {});
  }, []);

  const handleAddInterno = (miembro) => {
    const yaExiste = autores.some((a) => a.miembro_id === miembro.user_id);
    if (yaExiste) { toast.error("Este miembro ya está agregado"); return; }
    setAutores([
      ...autores,
      { miembro_id: miembro.user_id, nombre_externo: "", rol: miembro.role || "Autor" },
    ]);
    setSearchQ("");
  };

  const handleAddExterno = () => {
    if (!nombreExt.trim()) { toast.error("Escribe un nombre"); return; }
    setAutores([
      ...autores,
      { miembro_id: "", nombre_externo: nombreExt.trim(), rol: rolExt || "Autor" },
    ]);
    setNombreExt("");
    setRolExt("Autor");
  };

  const handleRemove = (miembro_id, nombre_externo) => {
    setAutores(
      autores.filter((a) =>
        miembro_id ? a.miembro_id !== miembro_id : a.nombre_externo !== nombre_externo
      )
    );
  };

  // ✅ busca por name Y por role, case insensitive, mínimo 1 caracter
  const miembrosFiltrados = searchQ.length > 0
    ? miembros.filter((m) => {
        const q = searchQ.toLowerCase();
        return (
          m.name?.toLowerCase().includes(q) ||
          m.role?.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-gray-700">{label}</p>

      {/* chips */}
      {autores.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {autores.map((a, i) => {
            const found       = miembros.find((m) => m.user_id === a.miembro_id);
            const esExterno   = !a.miembro_id || a.miembro_id === "";
            const displayName = esExterno ? a.nombre_externo : (found?.name || "Cargando...");
            if (!displayName) return null;
            return (
              <div
                key={a.miembro_id || a.nombre_externo || i}
                className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-3 py-1"
              >
                {!esExterno && (
                  <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-teal-700 text-sm font-medium">{displayName}</span>
                {esExterno && <span className="text-xs text-gray-400 italic">externo</span>}
                {a.rol && <span className="text-xs text-gray-400">· {a.rol}</span>}
                <button
                  type="button"
                  onClick={() => handleRemove(a.miembro_id, a.nombre_externo)}
                  className="text-red-400 hover:text-red-600 ml-1"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* buscador */}
      <div className="relative">
        <input
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="Buscar miembro registrado..."
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
        />
        {/* ✅ muestra "sin resultados" si hay búsqueda pero no coincide */}
        {searchQ.length > 0 && miembrosFiltrados.length === 0 && (
          <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 px-4 py-3 text-sm text-gray-400">
            No se encontró ningún miembro
          </div>
        )}
        {miembrosFiltrados.length > 0 && (
          <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
            {miembrosFiltrados.map((m) => (
              <button
                key={m.user_id}
                type="button"
                onClick={() => handleAddInterno(m)}
                className="w-full text-left px-4 py-2 hover:bg-teal-50 flex items-center gap-3 transition"
              >
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {m.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.role}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* externo */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
        <p className="text-xs font-semibold text-gray-500"> Autor externo</p>
        <input
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="Nombre completo"
          value={nombreExt}
          onChange={(e) => setNombreExt(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="Rol (ej: Investigador, Colaborador...)"
          value={rolExt}
          onChange={(e) => setRolExt(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAddExterno}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-2 rounded-lg transition"
        >
          + Agregar externo
        </button>
      </div>
    </div>
  );
}