import { useState } from "react";
import { uploadFile } from "../../../shared/uploadFile/api/uploadApi";
import toast from "react-hot-toast";
import { validateDateRange } from "../../../shared/lib/validators";
import Modal from "../../../shared/ui/Modal";
import FormField from "../../../shared/ui/FormField";
import ImageUploadField from "../../../shared/ui/ImageUploadField";
import VideoLinksInput from "../../../shared/ui/VideoLinksInput";

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
    image:           "",
    gallery:         [],
    videos:          [],
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
    } catch (err) {
      toast.error(err?.uploadMessage || "Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title="Nuevo proyecto"
      description="Los campos de fechas son opcionales."
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button
            onClick={() => onSubmit(form)}
            disabled={loading || uploading || !!dateError}
            className="btn-primary"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </>
      }
    >
      <FormField label="Imagen principal">
        <ImageUploadField
          value={form.image}
          onFileChange={handleImageUpload}
          uploading={uploading}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Título" className="sm:col-span-2">
          <input
            className="input-base"
            value={form.titulo}
            onChange={(e) => set("titulo", e.target.value)}
          />
        </FormField>

        <FormField label="Estado" className="sm:col-span-2">
          <select
            className="input-base"
            value={form.estado}
            onChange={(e) => set("estado", e.target.value)}
          >
            <option value="activo">Proyecto activo</option>
            <option value="finalizado">Proyecto finalizado</option>
          </select>
        </FormField>

        <FormField label="Descripción corta" hint="Se muestra en la tarjeta del proyecto." className="sm:col-span-2">
          <textarea
            rows={2}
            className="input-base"
            value={form.min_descripcion}
            onChange={(e) => set("min_descripcion", e.target.value)}
          />
        </FormField>

        <FormField label="Descripción" className="sm:col-span-2">
          <textarea
            rows={4}
            className="input-base"
            value={form.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
          />
        </FormField>

        <FormField label="Objetivos" className="sm:col-span-2">
          <textarea
            rows={3}
            className="input-base"
            value={form.objetivos}
            onChange={(e) => set("objetivos", e.target.value)}
          />
        </FormField>

        <FormField label="Fecha inicio">
          <input
            type="date"
            max={form.fecha_fin || undefined}
            className={`input-base ${dateError ? "border-red-400" : ""}`}
            value={form.fecha_inicio}
            onChange={(e) => set("fecha_inicio", e.target.value)}
          />
        </FormField>

        <FormField label="Fecha fin" error={dateError}>
          <input
            type="date"
            min={form.fecha_inicio || undefined}
            className={`input-base ${dateError ? "border-red-400" : ""}`}
            value={form.fecha_fin}
            onChange={(e) => set("fecha_fin", e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Videos">
        <VideoLinksInput
          value={form.videos}
          onChange={(videos) => set("videos", videos)}
        />
      </FormField>
    </Modal>
  );
}
