import { uploadFile } from "../../../shared/uploadFile/api/uploadApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { validateDateRange } from "../../../shared/lib/validators";
import { formatDateInput } from "../../../shared/utils/formatDateInput";
import Modal from "../../../shared/ui/Modal";
import FormField from "../../../shared/ui/FormField";
import ImageUploadField from "../../../shared/ui/ImageUploadField";
import VideoLinksInput from "../../../shared/ui/VideoLinksInput";

export default function ProjectEditModal({ data, onChange, onSave, onClose }) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadFile(file);
      onChange("image", result.url);
    } catch (err) {
      toast.error(err?.uploadMessage || "Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  const mainImage = data.image || data.gallery?.[0];

  const fechaInicio = formatDateInput(data.fecha_inicio);
  const fechaFin = formatDateInput(data.fecha_fin);
  const dateError = validateDateRange(fechaInicio, fechaFin);

  return (
    <Modal
      title="Editar proyecto"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!!dateError || uploading}
            className="btn-primary"
          >
            Guardar
          </button>
        </>
      }
    >
      <FormField label="Imagen principal">
        <ImageUploadField
          value={mainImage}
          onFileChange={handleImageUpload}
          uploading={uploading}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Estado" className="sm:col-span-2">
          <select
            className="input-base"
            value={data.estado || "activo"}
            onChange={(e) => onChange("estado", e.target.value)}
          >
            <option value="activo">Proyecto activo</option>
            <option value="finalizado">Proyecto finalizado</option>
          </select>
        </FormField>

        <FormField label="Título" className="sm:col-span-2">
          <input
            className="input-base"
            value={data.titulo || ""}
            onChange={(e) => onChange("titulo", e.target.value)}
          />
        </FormField>

        <FormField label="Mini descripción" className="sm:col-span-2">
          <textarea
            rows={2}
            className="input-base"
            value={data.min_descripcion || ""}
            onChange={(e) => onChange("min_descripcion", e.target.value)}
          />
        </FormField>

        <FormField label="Fecha inicio">
          <input
            type="date"
            max={fechaFin || undefined}
            className={`input-base ${dateError ? "border-red-400" : ""}`}
            value={fechaInicio}
            onChange={(e) => onChange("fecha_inicio", e.target.value)}
          />
        </FormField>

        <FormField label="Fecha fin" error={dateError}>
          <input
            type="date"
            min={fechaInicio || undefined}
            className={`input-base ${dateError ? "border-red-400" : ""}`}
            value={fechaFin}
            onChange={(e) => onChange("fecha_fin", e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Videos">
        <VideoLinksInput
          value={data.videos || []}
          onChange={(videos) => onChange("videos", videos)}
        />
      </FormField>
    </Modal>
  );
}
