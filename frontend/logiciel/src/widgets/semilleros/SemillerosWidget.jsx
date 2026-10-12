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
    <section className="relative py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">
            Semilleros de Investigación
          </h2>

          {isAdmin && (
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
              className="bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              + Nuevo Semillero
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader text="Cargando semilleros..." />
            </div>
          ) : semilleros.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No hay semilleros disponibles
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
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

      <h3 className="text-xl font-bold mb-4">
        {data?.id ? "Editar Semillero" : "Nuevo Semillero"}
      </h3>

      <div className="space-y-4">

        <input
          className="w-full border rounded-lg p-2"
          placeholder="Nombre"
          value={data?.nombre || ""}
          onChange={(e) => onChange("nombre", e.target.value)}
        />

        <input
          className="w-full border rounded-lg p-2"
          placeholder="Slogan"
          value={data?.slogan || ""}
          onChange={(e) => onChange("slogan", e.target.value)}
        />

        <div>
          <input
            type="url"
            className={`w-full border rounded-lg p-2 ${linkError ? "border-red-500" : ""}`}
            placeholder="Link del semillero (https://...)"
            value={data?.link || ""}
            onChange={(e) => onChange("link", e.target.value)}
          />
          {linkError && (
            <p className="text-sm text-red-600 mt-1">{linkError}</p>
          )}
        </div>

        <ImageUploader
          value={data?.imagen_url}
          onChange={(url) => onChange("imagen_url", url)}
        />

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-lg"
        >
          Cancelar
        </button>

        <button
          onClick={onSave}
          disabled={!!linkError}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Guardar
        </button>

      </div>

    </div>
  </div>
  );
};


