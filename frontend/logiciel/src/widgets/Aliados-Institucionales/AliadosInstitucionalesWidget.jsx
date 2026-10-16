import Modal from "../../shared/ui/Modal";
import FormField from "../../shared/ui/FormField";
import { useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../features/auth/model/useAuth";
import { useAliadoInstitucionales } from "../../entities/universidad/model/useAliadosInstitucionales";
import AliadosInstitucionalesCard from "../../entities/universidad/ui/AliadosInstitucionalesCard";
import ConfirmModal from "../../shared/ui/ConfirmModal";
import ImageUploader from "../../shared/uploadFile/ui/ImageUploader";
import Loader from "../../shared/components/Loader";
import SectionHeader from "../../shared/ui/SectionHeader";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  createAliadoInstitucional,
  updateAliadoInstitucional,
  deleteAliadoInstitucional,
} from "../../entities/universidad/api/aliadosInstitucionales";
import { puedeEditarContenido } from "../../features/auth/model/permissions";

export default function AliadosInstitucionalesWidget() {
  const { user } = useAuth();
  const isAdmin = puedeEditarContenido(user);

  const { aliadosInstitucionales, loading, refresh } = useAliadoInstitucionales();

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = async () => {
    if (!editData?.nombre?.trim()) {
      toast.error("Escribe el nombre del aliado");
      return;
    }

    try {
      if (editData?.id) {
        await updateAliadoInstitucional(editData.id, editData);
        toast.success("Aliado actualizado correctamente");
      } else {
        await createAliadoInstitucional(editData);
        toast.success("Aliado creado correctamente");
      }
      await refresh();
      setOpenModal(false);
      setEditData(null);
    } catch {
      toast.error("Error guardando aliado");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAliadoInstitucional(confirmDelete.id);
      toast.success("Aliado eliminado correctamente");
      await refresh();
      setConfirmDelete(null);
    } catch {
      toast.error("Error eliminando aliado");
    }
  };



  return (
    <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <SectionHeader
          eyebrow="Cooperación"
          title="Aliados institucionales"
          description="Universidades, empresas e instituciones con las que colaboramos."
          action={isAdmin && (
            <button
              onClick={() => { setEditData({ nombre: "", logo_url: "" }); setOpenModal(true); }}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5" />
              Nuevo aliado
            </button>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader text="Cargando aliados..." />
            </div>
          ) : !aliadosInstitucionales?.length ? (
            <p className="col-span-full rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
              No hay aliados institucionales registrados.
            </p>
          ) : (
            aliadosInstitucionales.map((uni) => (
              <AliadosInstitucionalesCard
                key={uni.id}
                aliado={uni}
                isAdmin={isAdmin}
                onEdit={(item) => {
                  setEditData(item);
                  setOpenModal(true);
                }}
                onDelete={(item) => setConfirmDelete(item)}
              />
            ))
          )}
        </div>
      </div>

      {openModal && (
        <AliadosModal
          data={editData}
          onChange={(k, v) => setEditData((prev) => ({ ...prev, [k]: v }))}
          onSave={handleSave}
          onClose={() => { setOpenModal(false); setEditData(null); }}
        />
      )}

      <ConfirmModal
        open={!!confirmDelete}
        title="Eliminar aliado institucional"
        message={`¿Seguro que deseas eliminar "${confirmDelete?.nombre || confirmDelete?.tipo || "este aliado"}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </section>
  );
}

const AliadosModal = ({ data, onChange, onSave, onClose }) => (
  <Modal
    title={data?.id ? "Editar aliado" : "Nuevo aliado"}
    onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={onSave} className="btn-primary">
            Guardar
          </button>
        </>
      }
  >
    <div className="grid gap-5 sm:grid-cols-2">
      {[
        { key: "nombre", label: "Nombre", placeholder: "Nombre de la organización", full: true },
        {
          key: "tipo",
          label: "Tipo",
          placeholder: "Ej. Universidad",
          help: "Especifica el tipo de organización: Universidad, Empresa, Institución Pública, ONG, Centro de Investigación, etc.",
          full: true,
        },
        { key: "pais", label: "País", placeholder: "País" },
        { key: "sitio_web", label: "Sitio web", placeholder: "https://..." },
      ].map(({ key, label, placeholder, help, full }) => (
        <FormField key={key} label={label} hint={help} className={full ? "sm:col-span-2" : ""}>
          <input
            className="input-base"
            placeholder={placeholder}
            value={data?.[key] || ""}
            onChange={(e) => onChange(key, e.target.value)}
          />
        </FormField>
      ))}
    </div>

    <FormField label="Descripción">
      <textarea
        className="input-base"
        rows={3}
        value={data?.descripcion || ""}
        onChange={(e) => onChange("descripcion", e.target.value)}
      />
    </FormField>

    <FormField label="Logo">
      <ImageUploader
        value={data?.logo_url}
        onChange={(url) => onChange("logo_url", url)}
        contain
      />
    </FormField>
  </Modal>
);
