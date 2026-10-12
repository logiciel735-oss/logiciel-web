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
import {
  createAliadoInstitucional,
  updateAliadoInstitucional,
  deleteAliadoInstitucional,
} from "../../entities/universidad/api/aliadosInstitucionales";

export default function AliadosInstitucionalesWidget() {
  const { user, token } = useAuth();
  const isAdmin = user?.role === "admin";

  const { aliadosInstitucionales, loading, refresh } = useAliadoInstitucionales();

  const { ref, hasOverflow, scrollLeft, scrollRight } =
    useCircularHorizontalScroll([aliadosInstitucionales]);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = async () => {
    try {
      if (editData?.id) {
        await updateAliadoInstitucional(editData.id, editData, token);
        toast.success("Universidad actualizada correctamente");
      } else {
        await createAliadoInstitucional(editData, token);
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
      await deleteAliadoInstitucional(confirmDelete.id, token);
      toast.success("Universidad eliminada correctamente");
      await refresh();
      setConfirmDelete(null);
    } catch {
      toast.error("Error eliminando universidad");
    }
  };



  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Aliados</h2>
          {isAdmin && (
            <button
              onClick={() => { setEditData({ nombre: "", logo_url: "" }); setOpenModal(true); }}
              className="bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              + Nueva Universidad
            </button>
          )}
        </div>

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
              <div className="w-full text-center text-gray-500 py-10">
                No hay aliados institucionales
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
  <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-bold mb-4">
        {data?.id ? "Editar Aliado" : "Nuevo Aliado"}
      </h3>

      <div className="space-y-4">
        {[
          { key: "nombre", label: "Nombre", placeholder: "Nombre" },
          {
            key: "tipo",
            label: "Tipo",
            placeholder: "Ej. Universidad",
            help: "Especifica el tipo de organización: Universidad, Empresa, Institución Pública, ONG, Centro de Investigación, etc.",
          },
          { key: "pais", label: "País", placeholder: "País" },
          { key: "sitio_web", label: "Sitio web", placeholder: "Sitio web" },
        ].map(({ key, label, placeholder, help }) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-600 mb-1 block">{label}</label>
            <input
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder={placeholder}
              value={data?.[key] || ""}
              onChange={(e) => onChange(key, e.target.value)}
            />
            {help && <p className="text-xs text-gray-500 mt-1">{help}</p>}
          </div>
        ))}

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">Descripción</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Descripción"
            rows={3}
            value={data?.descripcion || ""}
            onChange={(e) => onChange("descripcion", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">Logo</label>
          <ImageUploader
            value={data?.logo_url}
            onChange={(url) => onChange("logo_url", url)}
          />
        </div>
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
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition shadow"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
);