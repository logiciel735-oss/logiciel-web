import { useState } from "react";
import toast from "react-hot-toast";
import { XMarkIcon, MagnifyingGlassIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useMiembros } from "../../entities/member/model/useMiembros";
import { formatPersonName, validatePersonName } from "../lib/validators";

export default function AuthorSelector({ autores = [], setAutores, label = "Autores" }) {
  const { miembros } = useMiembros();
  const [searchQ, setSearchQ]     = useState("");
  const [nombreExt, setNombreExt] = useState("");
  const [rolExt, setRolExt]       = useState("Autor");

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
    const nameError =
      validatePersonName(nombreExt, { label: "Nombre del autor" }) ||
      validatePersonName(rolExt, { label: "Rol", required: false, max: 40 });
    if (nameError) { toast.error(nameError); return; }
    setAutores([
      ...autores,
      { miembro_id: "", nombre_externo: formatPersonName(nombreExt), rol: rolExt || "Autor" },
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

  // Busca por nombre y por rol (sin distinguir mayúsculas)
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
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-slate-700">{label}</p>}

      {/* SELECCIONADOS */}
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
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2 shadow-sm"
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${esExterno ? "bg-slate-100 text-slate-500" : "bg-brand-teal text-white"}`}>
                  {displayName?.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-brand-navy">{displayName}</span>
                {esExterno && <span className="text-xs italic text-slate-400">externo</span>}
                {a.rol && <span className="text-xs text-slate-400">· {a.rol}</span>}
                <button
                  type="button"
                  onClick={() => handleRemove(a.miembro_id, a.nombre_externo)}
                  className="rounded-full p-0.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Quitar"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* BUSCAR MIEMBRO */}
      <div className="relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="input-base pl-9 text-sm"
          placeholder="Buscar miembro del grupo..."
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
        />
        {searchQ.length > 0 && miembrosFiltrados.length === 0 && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 shadow-lg">
            No se encontró ningún miembro
          </div>
        )}
        {miembrosFiltrados.length > 0 && (
          <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
            {miembrosFiltrados.map((m) => (
              <button
                key={m.user_id}
                type="button"
                onClick={() => handleAddInterno(m)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left transition hover:bg-brand-teal-light"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-semibold text-white">
                  {m.name?.charAt(0).toUpperCase()}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-brand-navy">{m.name}</span>
                  <span className="block text-xs capitalize text-slate-500">{m.role}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* AUTOR EXTERNO */}
      <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Autor externo</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className="input-base text-sm"
            placeholder="Nombre completo"
            value={nombreExt}
            onChange={(e) => setNombreExt(e.target.value)}
          />
          <input
            className="input-base text-sm"
            placeholder="Rol (ej. Investigador, Colaborador)"
            value={rolExt}
            onChange={(e) => setRolExt(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={handleAddExterno}
          className="btn-secondary w-full py-2 text-sm"
        >
          <UserPlusIcon className="h-4 w-4" />
          Agregar externo
        </button>
      </div>
    </div>
  );
}
