import { useState } from "react";
import toast from "react-hot-toast";
import { ClipboardDocumentListIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { analyzePastedAuthors } from "../lib/authorMatching";
import { formatPersonName, validatePersonName } from "../lib/validators";

const STATUS = {
  member:    { label: "Miembro", className: "bg-brand-teal-light text-brand-teal-dark" },
  review:    { label: "Revisar", className: "bg-amber-100 text-amber-800" },
  external:  { label: "Externo", className: "bg-slate-100 text-slate-600" },
  duplicate: { label: "Ya agregado", className: "bg-slate-100 text-slate-400" },
};

// Pegar una lista de autores (p. ej. copiada de un artículo): reconoce a los miembros
// registrados y deja a los demás como externos. Nada se agrega sin confirmar la vista previa.
export default function AuthorPasteImport({ miembros = [], autores = [], onAdd }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [rows, setRows] = useState(null);

  const analizar = () => {
    const result = analyzePastedAuthors(text, miembros, autores).map((r) => ({
      ...r,
      error: r.status === "external" ? validatePersonName(r.name, { label: "Nombre" }) : null,
    }));
    if (!result.length) { toast.error("No se encontraron nombres en el texto"); return; }
    setRows(result);
  };

  const elegir = (i, choice) =>
    setRows((prev) => prev.map((r, j) => {
      if (j !== i) return r;
      const error = choice ? null : validatePersonName(r.name, { label: "Nombre" });
      return { ...r, choice, error };
    }));

  const agregables = (rows || []).filter((r) => r.status !== "duplicate" && !r.error);

  const confirmar = () => {
    const usados = new Set(autores.map((a) => a.miembro_id).filter(Boolean));
    const nuevos = [];
    for (const r of agregables) {
      if (r.choice) {
        if (usados.has(r.choice)) continue;
        usados.add(r.choice);
        const m = miembros.find((x) => x.user_id === r.choice);
        nuevos.push({ miembro_id: r.choice, nombre_externo: "", rol: m?.role || "Autor" });
      } else {
        nuevos.push({ miembro_id: "", nombre_externo: formatPersonName(r.name), rol: "Autor" });
      }
    }
    if (!nuevos.length) { toast.error("No hay autores nuevos para agregar"); return; }
    onAdd(nuevos);
    toast.success(nuevos.length === 1 ? "1 autor agregado" : `${nuevos.length} autores agregados`);
    setText("");
    setRows(null);
    setOpen(false);
  };

  return (
    <div className="rounded-lg border border-slate-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-semibold text-brand-navy"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <ClipboardDocumentListIcon className="h-4 w-4 text-brand-teal" />
          Pegar lista de autores
        </span>
        <ChevronDownIcon className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-3 border-t border-slate-200 p-3">
          {!rows ? (
            <>
              <textarea
                rows={4}
                className="input-base text-sm"
                placeholder={"Ej.: Óscar Santiago López Erazo, Leandro Antonelli y Marta Cecilia Camacho Ojeda\n(también uno por línea, o separados por punto y coma)"}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Se reconocen los miembros registrados aunque cambien las tildes, las mayúsculas o el orden
                del nombre. Los demás se agregan como autores externos. Podrá revisar todo antes de agregar.
              </p>
              <button type="button" onClick={analizar} disabled={!text.trim()} className="btn-secondary w-full py-2 text-sm">
                Reconocer autores
              </button>
            </>
          ) : (
            <>
              <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {rows.map((r, i) => {
                  const s = STATUS[r.status === "review" || r.status === "member" ? (r.choice ? r.status : "external") : r.status];
                  return (
                    <li key={`${r.name}-${i}`} className="flex flex-wrap items-center gap-2 px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${s.className}`}>{s.label}</span>
                      <span className={`min-w-0 flex-1 break-words text-sm ${r.status === "duplicate" ? "text-slate-400 line-through" : "text-brand-navy"}`}>
                        {r.name}
                      </span>
                      {r.status !== "duplicate" && r.candidates.length > 0 && (
                        <select
                          className="input-base w-full py-1.5 text-sm sm:w-auto"
                          value={r.choice}
                          onChange={(e) => elegir(i, e.target.value)}
                          aria-label={`Autor para ${r.name}`}
                        >
                          {r.candidates.map((m) => (
                            <option key={m.user_id} value={m.user_id}>{m.name} (miembro)</option>
                          ))}
                          <option value="">Agregar como externo</option>
                        </select>
                      )}
                      {r.error && <p className="w-full text-xs text-red-600">{r.error} Se omitirá.</p>}
                    </li>
                  );
                })}
              </ul>
              {rows.some((r) => r.status === "review") && (
                <p className="text-xs text-amber-800">
                  Los marcados como «Revisar» se parecen a un miembro, pero no coinciden del todo
                  (por ejemplo, con iniciales). Confirme que sea la persona correcta.
                </p>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => setRows(null)} className="btn-secondary flex-1 py-2 text-sm">
                  Volver
                </button>
                <button type="button" onClick={confirmar} disabled={!agregables.length} className="btn-primary flex-1 py-2 text-sm">
                  Agregar {agregables.length || ""} {agregables.length === 1 ? "autor" : "autores"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
