import { useState } from "react";
import { uploadFile } from "../../../shared/uploadFile/api/uploadApi";
import toast from "react-hot-toast";
import { validateDateRange } from "../../../shared/lib/validators";

export default function ProjectFormModal({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    titulo:          "",
    min_descripcion: "",
    descripcion:     "",
    objetivos:       "",
    fecha_inicio:    "",
    fecha_fin:       "",
    estado:          "activo",
    integrantes:     [],
    image:           "",   // ✅ campo separado
    gallery:         [],
  });

  const [uploading, setUploading] = useState(false);

  if (!open) return null;

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const dateError = validateDateRange(form.fecha_inicio, form.fecha_fin);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadFile(file);
      set("image", result.url); 
    } catch {
      toast.error("Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">

        <h3 className="text-xl font-bold mb-4 text-gray-800">Nuevo Proyecto</h3>

        <div className="space-y-4">

          <Field label="Imagen principal">
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
            {form.image && ( 
              <img
                src={form.image}
                className="mt-2 rounded-lg w-full h-40 object-cover"
                alt="preview"
              />
            )}
          </Field>

          <Field label="Estado">
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.estado}
              onChange={(e) => set("estado", e.target.value)}
            >
              <option value="activo">Proyecto Activo</option>
              <option value="finalizado">Proyecto Finalizado</option>
            </select>
          </Field>

          <Field label="Título">
            <input
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.titulo}
              onChange={(e) => set("titulo", e.target.value)}
            />
          </Field>

          <Field label="Descripción corta">
            <textarea
              rows={2}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.min_descripcion}
              onChange={(e) => set("min_descripcion", e.target.value)}
            />
          </Field>

          <Field label="Descripción">
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
            />
          </Field>

          <Field label="Objetivos">
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.objetivos}
              onChange={(e) => set("objetivos", e.target.value)}
            />
          </Field>

          <Field label="Fecha inicio">
            <input
              type="date"
              max={form.fecha_fin || undefined}
              className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400 ${dateError ? "border-red-500" : "border-gray-300"}`}
              value={form.fecha_inicio}
              onChange={(e) => set("fecha_inicio", e.target.value)}
            />
          </Field>

          <Field label="Fecha fin">
            <input
              type="date"
              min={form.fecha_inicio || undefined}
              className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400 ${dateError ? "border-red-500" : "border-gray-300"}`}
              value={form.fecha_fin}
              onChange={(e) => set("fecha_fin", e.target.value)}
            />
            {dateError && (
              <p className="text-sm text-red-600 mt-1">{dateError}</p>
            )}
          </Field>

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSubmit(form)}
            disabled={loading || uploading || !!dateError}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition shadow disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1 block">{label}</label>
      {children}
    </div>
  );
}