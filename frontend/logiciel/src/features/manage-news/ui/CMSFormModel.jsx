import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Loader from "../../../shared/components/Loader";
import Modal from "../../../shared/ui/Modal";
import FormField from "../../../shared/ui/FormField";
import VideoLinksInput from "../../../shared/ui/VideoLinksInput";

const LABELS = {
  title: "Título",
  summary: "Resumen",
  content: "Contenido",
  description: "Descripción",
  date: "Fecha inicio",
  dateEnd: "Fecha fin",
  location: "Ubicación",
  videos: "Videos",
};

// Fecha (string ISO, Date o Timestamp) → "YYYY-MM-DD" para <input type="date">
const toDateInput = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.split("T")[0];
  if (value instanceof Date) return value.toISOString().split("T")[0];
  if (value?.toDate) return value.toDate().toISOString().split("T")[0];
  return "";
};

export default function CMSFormModal({
  title,
  form,
  setForm,
  onSave,
  onClose,
  uploading,
  onImageUpload,
  fields,
}) {

  const [processing, setProcessing] = useState(false);

  const set = (k, v) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    try {
      setProcessing(true);

      await onSave();

    } finally {
      setProcessing(false);
    }
  };

  const busy = processing || uploading;

  return (
    <>
      {processing && (
        <Loader
          text="Procesando..."
          fullscreen={true}
          bg="bg-black/40 backdrop-blur-sm"
        />
      )}

      <Modal
        title={title}
        onClose={processing ? undefined : onClose}
        footer={
          <>
            <button onClick={onClose} disabled={processing} className="btn-secondary">
              Cancelar
            </button>
            <button onClick={handleSave} disabled={busy} className="btn-primary">
              {processing ? "Guardando..." : "Guardar"}
            </button>
          </>
        }
      >
        {/* IMAGEN PRINCIPAL */}
        <FormField label="Imagen principal" hint="JPG o PNG. Se mostrará en la tarjeta y en el encabezado.">
          <div className="overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
            {form.image ? (
              <img src={form.image} alt="Vista previa" className="h-44 w-full object-cover" />
            ) : (
              <div className="flex h-32 flex-col items-center justify-center text-slate-400">
                <PhotoIcon className="h-8 w-8" />
                <span className="mt-1 text-xs">Sin imagen</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            disabled={busy}
            className="mt-2 block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-teal file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-brand-teal-dark disabled:opacity-50"
          />
          {uploading && (
            <p className="mt-1 animate-pulse text-xs text-brand-teal">Subiendo imagen...</p>
          )}
        </FormField>

        {/* CAMPOS */}
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((key) => {
            if (key === "videos") return null;

            const fullWidth = !["date", "dateEnd"].includes(key);

            return (
              <FormField key={key} label={LABELS[key]} className={fullWidth ? "sm:col-span-2" : ""}>
                {["date", "dateEnd"].includes(key) ? (
                  <input
                    type="date"
                    disabled={processing}
                    className="input-base"
                    value={toDateInput(form[key])}
                    onChange={(e) => set(key, e.target.value)}
                  />
                ) : ["content", "description", "summary"].includes(key) ? (
                  <textarea
                    rows={key === "summary" ? 2 : 5}
                    disabled={processing}
                    className="input-base"
                    value={form[key] || ""}
                    onChange={(e) => set(key, e.target.value)}
                  />
                ) : (
                  <input
                    disabled={processing}
                    className="input-base"
                    value={form[key] || ""}
                    onChange={(e) => set(key, e.target.value)}
                  />
                )}
              </FormField>
            );
          })}
        </div>

        {/* VIDEOS (YouTube / Google Drive) */}
        {fields.includes("videos") && (
          <FormField label={LABELS.videos}>
            <VideoLinksInput
              value={form.videos || []}
              onChange={(videos) => set("videos", videos)}
              disabled={processing}
            />
          </FormField>
        )}
      </Modal>
    </>
  );
}
