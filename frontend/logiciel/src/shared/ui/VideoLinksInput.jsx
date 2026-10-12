import { useState } from "react";
import {
  ExclamationTriangleIcon,
  PlusIcon,
  XMarkIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { parseVideoUrl, VIDEO_URL_ERROR } from "../lib/video";

const PROVIDER_LABEL = { youtube: "YouTube", drive: "Google Drive" };

// Campo para que el administrador agregue videos como enlaces de YouTube o Google Drive.
//   value    → arreglo de enlaces
//   onChange → recibe el nuevo arreglo
export default function VideoLinksInput({ value = [], onChange, disabled = false }) {
  const [link, setLink] = useState("");
  const [error, setError] = useState(null);

  const videos = Array.isArray(value) ? value : [];

  const handleAdd = () => {
    const parsed = parseVideoUrl(link);

    if (!parsed) {
      setError(VIDEO_URL_ERROR);
      return;
    }

    if (videos.some((v) => parseVideoUrl(v)?.embedUrl === parsed.embedUrl)) {
      setError("Este video ya fue agregado.");
      return;
    }

    onChange([...videos, parsed.url]);
    setLink("");
    setError(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      {/* AVISO: formato obligatorio */}
      <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-amber-500" />
        <div className="space-y-1">
          <p className="font-semibold">Solo se aceptan enlaces de YouTube o Google Drive.</p>
          <ul className="list-disc space-y-0.5 pl-4 text-xs leading-relaxed text-amber-800">
            <li><strong>YouTube:</strong> sube el video como “Público” o “No listado” y pega el enlace.</li>
            <li><strong>Google Drive:</strong> comparte el archivo con “Cualquier persona con el enlace” y pega el enlace del archivo.</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="url"
          value={link}
          disabled={disabled}
          onChange={(e) => { setLink(e.target.value); setError(null); }}
          onKeyDown={handleKeyDown}
          placeholder="https://www.youtube.com/watch?v=...  o  https://drive.google.com/file/d/..."
          className={`input-base ${error ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled || !link.trim()}
          className="btn-primary shrink-0 px-4"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Agregar</span>
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {videos.length > 0 && (
        <ul className="space-y-2">
          {videos.map((v) => {
            const parsed = parseVideoUrl(v);
            return (
              <li
                key={v}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <PlayCircleIcon className="h-5 w-5 shrink-0 text-brand-teal" />
                <span className="shrink-0 rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-500 ring-1 ring-slate-200">
                  {PROVIDER_LABEL[parsed?.provider] || "Enlace"}
                </span>
                <a
                  href={v}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 flex-1 truncate text-sm text-slate-600 hover:text-brand-teal"
                >
                  {v}
                </a>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(videos.filter((x) => x !== v))}
                  className="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Quitar video"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
