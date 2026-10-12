import Modal from "../../shared/ui/Modal";
import FormField from "../../shared/ui/FormField";
import SectionHeader from "../../shared/ui/SectionHeader";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../features/auth/model/useAuth";
import { useSemilleros } from "../../entities/semillero/model/useSemilleros";
import SemilleroCard from "../../entities/semillero/ui/SemilleroCard";
import ImageUploader from "../../shared/uploadFile/ui/ImageUploader";
import ConfirmModal from "../../shared/ui/ConfirmModal";
import Loader from "../../shared/components/Loader";
import { isValidUrl } from "../../shared/lib/validators";

const LINK_ERROR = "Ingresa una URL válida que empiece por http:// o https:// (ej. https://semillero.edu.co).";

// El link es opcional, pero si se escribe debe ser una URL válida
const getLinkError = (link) =>
  link?.trim() && !isValidUrl(link.trim()) ? LINK_ERROR : null;

import {
  createSemillero,
  updateSemillero,
  deleteSemillero,
} from "../../entities/semillero/api/semilleroApi";

export default function SemillerosWidget() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { semilleros, loading, refresh } = useSemilleros();

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = async () => {
    if (getLinkError(editData?.link)) {
      toast.error("El link del semillero no es una URL válida");
      return;
    }

    try {
      const data = { ...editData, link: editData?.link?.trim() || "" };

      if (editData?.id) {
        await updateSemillero(editData.id, data);
        toast.success("Semillero actualizado correctamente");
      } else {
        await createSemillero(data);
        toast.success("Semillero creado correctamente");
      }

      await refresh();
      setOpenModal(false);
      setEditData(null);
    } catch (error) {
      console.error(error);
      toast.error("Error guardando semillero");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSemillero(confirmDelete.id);
      toast.success("Semillero eliminado correctamente");

      await refresh();
      setConfirmDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Error eliminando semillero");
    }
  };


  return (
    <section className="relative border-t border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <SectionHeader
          eyebrow="Formación"
          title="Semilleros de investigación"
          description="Espacios donde estudiantes se forman como investigadores."
          action={isAdmin && (
            <button
              onClick={() => {
                setEditData({
                  nombre: "",
                  slogan: "",
                  link: "",
                  imagen_url: "",
                });
                setOpenModal(true);
              }}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5" />
              Nuevo semillero
            </button>
          )}
        />

        <div className="grid md:grid-cols-3 gap-8">

          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader text="Cargando semilleros..." />
            </div>
          ) : semilleros.length === 0 ? (
            <p className="col-span-full rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
              No hay semilleros registrados.
            </p>
          ) : (
            semilleros.map((semillero) => (
              <SemilleroCard
                key={semillero.id}
                semillero={semillero}
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
        <SemilleroModal
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

      <ConfirmModal
        open={!!confirmDelete}
        title="Eliminar semillero"
        message={`¿Seguro que deseas eliminar "${confirmDelete?.nombre}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </section>
  );
}

/* ================= MODAL ================= */

const SemilleroModal = ({ data, onChange, onSave, onClose }) => {
  const linkError = getLinkError(data?.link);

  return (
    <Modal
      title={data?.id ? "Editar semillero" : "Nuevo semillero"}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={onSave} disabled={!!linkError} className="btn-primary">
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

      <FormField label="Slogan">
        <input
          className="input-base"
          value={data?.slogan || ""}
          onChange={(e) => onChange("slogan", e.target.value)}
        />
      </FormField>

      <FormField label="Enlace del semillero" hint="Opcional. Debe empezar por http:// o https://" error={linkError}>
        <input
          type="url"
          className={`input-base ${linkError ? "border-red-400" : ""}`}
          placeholder="https://..."
          value={data?.link || ""}
          onChange={(e) => onChange("link", e.target.value)}
        />
      </FormField>

      <FormField label="Logo o imagen">
        <ImageUploader
          value={data?.imagen_url}
          onChange={(url) => onChange("imagen_url", url)}
          contain
        />
      </FormField>
    </Modal>
  );
};
