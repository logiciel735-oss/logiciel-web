import { uploadFile } from "../../../shared/uploadFile/api/uploadApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { validateDateRange } from "../../../shared/lib/validators";
import { formatDateInput } from "../../../shared/utils/formatDateInput";

export default function ProjectEditModal({ data, onChange, onSave, onClose }) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadFile(file);
      onChange("image", result.url);
    } catch {
      toast.error("Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  const mainImage = data.image || data.gallery?.[0];

  const fechaInicio = formatDateInput(data.fecha_inicio);
  const fechaFin = formatDateInput(data.fecha_fin);
  const dateError = validateDateRange(fechaInicio, fechaFin);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">

        <h3 className="text-xl font-bold mb-4 text-gray-800">Editar Proyecto</h3>

        <div className="space-y-4">

          {/* IMAGEN */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Imagen principal
            </label>
            {mainImage && (
              <img
                src={mainImage}
                alt="preview"
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer disabled:opacity-50"
            />
            {uploading && (
              <p className="text-xs text-teal-600 mt-1 animate-pulse">Subiendo...</p>
            )}
          </div>

          {/* ✅ ESTADO */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Estado
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={data.estado || "activo"}
              onChange={(e) => onChange("estado", e.target.value)}
            >
              <option value="activo">Proyecto Activo</option>
              <option value="finalizado">Proyecto Finalizado</option>
            </select>
          </div>

          {/* TÍTULO */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Título</label>
            <input
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={data.titulo || ""}
              onChange={(e) => onChange("titulo", e.target.value)}
            />
          </div>

          {/* MINI DESCRIPCIÓN */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Mini descripción</label>
            <textarea
              rows={2}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={data.min_descripcion || ""}
              onChange={(e) => onChange("min_descripcion", e.target.value)}
            />
          </div>

          {/* FECHAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Fecha inicio</label>
              <input
                type="date"
                max={fechaFin || undefined}
                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400 ${dateError ? "border-red-500" : "border-gray-300"}`}
                value={fechaInicio}
                onChange={(e) => onChange("fecha_inicio", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Fecha fin</label>
              <input
                type="date"
                min={fechaInicio || undefined}
                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400 ${dateError ? "border-red-500" : "border-gray-300"}`}
                value={fechaFin}
                onChange={(e) => onChange("fecha_fin", e.target.value)}
              />
            </div>
          </div>
          {dateError && (
            <p className="text-sm text-red-600 -mt-2">{dateError}</p>
          )}

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!!dateError || uploading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}