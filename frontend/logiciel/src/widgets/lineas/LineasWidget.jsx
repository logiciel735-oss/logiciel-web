import Modal from "../../shared/ui/Modal";
import FormField from "../../shared/ui/FormField";
import SectionHeader from "../../shared/ui/SectionHeader";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../features/auth/model/useAuth";
import { useLineas } from "../../entities/linea/model/useLineas";
import LineaCard from "../../entities/linea/ui/LineaCard";
import ImageUploader from "../../shared/uploadFile/ui/ImageUploader";
import ConfirmModal from "../../shared/ui/ConfirmModal";
import Loader from "../../shared/components/Loader";

import {
  createLinea,
  updateLinea,
  deleteLinea,
} from "../../entities/linea/api/lineaApi";
import { puedeEditarContenido } from "../../features/auth/model/permissions";
import { validatePersonName } from "../../shared/lib/validators";

export default function LineasWidget() {
  const { user } = useAuth();
  const isAdmin = puedeEditarContenido(user);

  const { lineas, loading, refresh } = useLineas();

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ================= CREATE / UPDATE ================= */
  const handleSave = async () => {
    try {
      if (editData?.id) {
        await updateLinea(editData.id, editData);
        toast.success("Línea actualizada correctamente");
      } else {
        await createLinea(editData);
        toast.success("Línea creada correctamente");
      }

      await refresh();
      setOpenModal(false);
      setEditData(null);
    } catch (error) {
      console.error(error);
      toast.error("Error guardando línea");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      await deleteLinea(confirmDelete.id);
      toast.success("Línea eliminada correctamente");

      await refresh();
      setConfirmDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Error eliminando línea");
    }
  };



  return (
    <section className="relative border-t border-slate-200 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <SectionHeader
          eyebrow="Investigación"
          title="Líneas de investigación"
          description="Áreas temáticas en las que el grupo desarrolla su trabajo."
          action={isAdmin && (
            <button
              onClick={() => {
                setEditData({
                  nombre: "",
                  descripcion: "",
                  coordinador: "",
                  imagen_url: "",
                });
                setOpenModal(true);
              }}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5" />
              Nueva línea
            </button>
          )}
        />

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-8">

          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader text="Cargando líneas..." />
            </div>
          ) : lineas.length === 0 ? (
            <p className="col-span-full rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
              No hay líneas de investigación registradas.
            </p>
          ) : (
            lineas.map((linea) => (
              <LineaCard
                key={linea.id}
                linea={linea}
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

      {/* MODAL CREATE / EDIT */}
      {openModal && (
        <LineaModal
          data={editData}
          onChange={(k, v) =>
            setEditData((prev) => ({ ...prev, [k]: v }))
          }
          onSave={handleSave}
          onClose={() => {
            setOpenModal(false);
            setEditData(null);
          }}
        />
      )}

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <ConfirmModal
          open={!!confirmDelete}
          title="Eliminar línea"
          message={`Vas a eliminar "${confirmDelete?.nombre}". Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          type="danger"
        />
      )}
    </section>
  );
}

/* ================= MODAL ================= */

const LineaModal = ({ data, onChange, onSave, onClose }) => {
  const coordinadorError = validatePersonName(data?.coordinador, { label: "Coordinador", required: false });
  return (
  <Modal
    title={data?.id ? "Editar línea de investigación" : "Nueva línea de investigación"}
    onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={onSave} disabled={!!coordinadorError} className="btn-primary">
            Guardar
          </button>
        </>
      }
  >
    <FormField label="Nombre">
      <input
        className="input-base"
        value={data?.nombre || ""}
        onChange={(e) => onChange("nombre", e.target.value)}
      />
    </FormField>

    <FormField label="Descripción">
      <textarea
        rows={4}
        className="input-base"
        value={data?.descripcion || ""}
        onChange={(e) => onChange("descripcion", e.target.value)}
      />
    </FormField>

    <FormField label="Coordinador" error={coordinadorError}>
      <input
        className="input-base"
        value={data?.coordinador || ""}
        onChange={(e) => onChange("coordinador", e.target.value)}
      />
    </FormField>

    <FormField label="Imagen">
      <ImageUploader
        value={data?.imagen_url}
        onChange={(url) => onChange("imagen_url", url)}
      />
    </FormField>
  </Modal>
  );
};
