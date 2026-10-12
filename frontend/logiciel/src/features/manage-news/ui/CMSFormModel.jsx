import { useState } from "react";
import Loader from "../../../shared/components/Loader";

const LABELS = {
  title: "Título",
  summary: "Resumen",
  content: "Contenido",
  description: "Descripción",
  date: "Fecha inicio",
  dateEnd: "Fecha fin",
  location: "Ubicación",
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

  return (
    <>
      {processing && (
        <Loader
          text="Procesando..."
          fullscreen={true}
          bg="bg-black/40 backdrop-blur-sm"
          color="#14B8A6"
          size={90}
        />
      )}

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

        <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">

          <h3 className="text-xl font-bold mb-4 text-gray-800">
            {title}
          </h3>

          <div className="space-y-4">

            {/* Imagen principal */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Imagen principal
              </label>

              {form.image && (
                <img
                  src={form.image}
                  alt="preview"
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                disabled={uploading || processing}
                className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:bg-teal-600 file:text-white
                  hover:file:bg-teal-700
                  cursor-pointer disabled:opacity-50"
              />

              {uploading && (
                <p className="text-xs text-teal-600 mt-1 animate-pulse">
                  Subiendo...
                </p>
              )}
            </div>

            {/* Campos dinámicos */}
            {fields.map((key) => (
              <div key={key}>

                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  {LABELS[key]}
                </label>

                {["date", "dateEnd"].includes(key) ? (

                  <input
                    type="date"
                    disabled={processing}
                    className="w-full border border-gray-300 rounded-lg p-2
                      focus:outline-none focus:ring-2 focus:ring-teal-400
                      disabled:opacity-50"
                    value={
                      form[key]
                        ? typeof form[key] === "string"
                          ? form[key].split("T")[0]
                          : form[key] instanceof Date
                            ? form[key].toISOString().split("T")[0]
                            : form[key]?.toDate
                              ? form[key].toDate().toISOString().split("T")[0]
                              : ""
                        : ""
                    }
                    onChange={(e) => set(key, e.target.value)}
                  />

                ) : ["content", "description", "summary"].includes(key) ? (

                  <textarea
                    rows={key === "summary" ? 2 : 4}
                    disabled={processing}
                    className="w-full border border-gray-300 rounded-lg p-2
                      focus:outline-none focus:ring-2 focus:ring-teal-400
                      disabled:opacity-50"
                    value={form[key] || ""}
                    onChange={(e) => set(key, e.target.value)}
                  />

                ) : (

                  <input
                    disabled={processing}
                    className="w-full border border-gray-300 rounded-lg p-2
                      focus:outline-none focus:ring-2 focus:ring-teal-400
                      disabled:opacity-50"
                    value={form[key] || ""}
                    onChange={(e) => set(key, e.target.value)}
                  />

                )}

              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6">

            <button
              onClick={onClose}
              disabled={processing}
              className="px-4 py-2 border border-gray-300 rounded-lg
                text-gray-600 hover:bg-gray-100 transition
                disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={processing}
              className="px-6 py-2 bg-green-600 hover:bg-green-700
                text-white font-semibold rounded-lg transition shadow
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "Guardando..." : "Guardar"}
            </button>

          </div>
        </div>
      </div>
    </>
  );
}