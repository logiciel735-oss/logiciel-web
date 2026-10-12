import Modal from "../../shared/ui/Modal";
import FormField from "../../shared/ui/FormField";
import { useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../features/auth/model/useAuth";
import { useAliadoInstitucionales } from "../../entities/universidad/model/useAliadosInstitucionales";
import AliadosInstitucionalesCard from "../../entities/universidad/ui/AliadosInstitucionalesCard";
import ConfirmModal from "../../shared/ui/ConfirmModal";
import ImageUploader from "../../shared/uploadFile/ui/ImageUploader";
import { useCircularHorizontalScroll } from "../../shared/hooks/design/useCircularHorizontalScroll";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Loader from "../../shared/components/Loader";
import SectionHeader from "../../shared/ui/SectionHeader";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  createAliadoInstitucional,
  updateAliadoInstitucional,
  deleteAliadoInstitucional,
} from "../../entities/universidad/api/aliadosInstitucionales";

export default function AliadosInstitucionalesWidget() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { aliadosInstitucionales, loading, refresh } = useAliadoInstitucionales();

  const { ref, hasOverflow, scrollLeft, scrollRight } =
    useCircularHorizontalScroll(aliadosInstitucionales?.length);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = async () => {
    try {
      if (editData?.id) {
        await updateAliadoInstitucional(editData.id, editData);
        toast.success("Universidad actualizada correctamente");
      } else {
        await createAliadoInstitucional(editData);
        toast.success("Universidad creada correctamente");
      }
      await refresh();
      setOpenModal(false);
      setEditData(null);
    } catch {
      toast.error("Error guardando universidad");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAliadoInstitucional(confirmDelete.id);
      toast.success("Universidad eliminada correctamente");
      await refresh();
      setConfirmDelete(null);
    } catch {
      toast.error("Error eliminando universidad");
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

        {/* SLIDER */}
        <div className="relative">
          {hasOverflow && (
            <button
              onClick={scrollLeft}
              className="absolute -left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-[#64ffda] hover:text-[#0a192f] p-3 rounded-full transition-all border border-white/20"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
          )}

          <div
            ref={ref}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth px-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >

            {loading ? (
              <div className="w-full flex justify-center py-10">
                <Loader text="Cargando aliados..." />
              </div>
            ) : aliadosInstitucionales?.length === 0 ? (
              <div className="w-full rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
                No hay aliados institucionales registrados.
              </div>
            ) : (
              aliadosInstitucionales.map((uni) => (
                <div key={uni.id} className="flex-shrink-0">
                  <AliadosInstitucionalesCard
                    aliado={uni}
                    isAdmin={isAdmin}
                    onEdit={(item) => {
                      setEditData(item);
                      setOpenModal(true);
                    }}
                    onDelete={(item) => setConfirmDelete(item)}
                  />
                </div>
              ))
            )}

          </div>

          {hasOverflow && (
            <button
              onClick={scrollRight}
              className="absolute -right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-[#64ffda] hover:text-[#0a192f] p-3 rounded-full transition-all border border-white/20"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
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
        message={`¿Seguro que deseas eliminar "${confirmDelete?.nombre}"?`}
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
