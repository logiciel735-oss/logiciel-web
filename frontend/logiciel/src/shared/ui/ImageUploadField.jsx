import { PhotoIcon } from "@heroicons/react/24/outline";

// Vista previa + selector de archivo. La subida la maneja quien lo usa (onFileChange).
export default function ImageUploadField({
  value,
  onFileChange,
  uploading = false,
  disabled = false,
  contain = false, // logos: mostrar completos en lugar de recortar
}) {
  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
        {value ? (
          <img
            src={value}
            alt="Vista previa"
            className={`h-44 w-full ${contain ? "object-contain p-4" : "object-cover"}`}
          />
        ) : (
          <div className="flex h-32 flex-col items-center justify-center text-slate-400">
            <PhotoIcon className="h-8 w-8" />
            <span className="mt-1 text-xs">Sin imagen</span>
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onFileChange}
        disabled={disabled || uploading}
        className="mt-2 block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-teal file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-brand-teal-dark disabled:opacity-50"
      />
      {uploading && (
        <p className="mt-1 animate-pulse text-xs text-brand-teal">Subiendo imagen...</p>
      )}
    </div>
  );
}
