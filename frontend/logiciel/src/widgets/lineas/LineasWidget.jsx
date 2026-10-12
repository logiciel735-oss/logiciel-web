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

export default function LineasWidget() {
  const { user, token } = useAuth();
  const isAdmin = user?.role === "admin";

  const { lineas, loading, refresh } = useLineas();

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ================= CREATE / UPDATE ================= */
  const handleSave = async () => {
    try {
      if (editData?.id) {
        await updateLinea(editData.id, editData, token);
        toast.success("Línea actualizada correctamente");
      } else {
        await createLinea(editData, token);
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
      await deleteLinea(confirmDelete.id, token);
      toast.success("Línea eliminada correctamente");

      await refresh();
      setConfirmDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Error eliminando línea");
    }
  };



  return (
    <section className="relative py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">
            Líneas de Investigación
          </h2>

          {isAdmin && (
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
              className="bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              + Nueva Línea
            </button>
          )}
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-8">

          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader text="Cargando líneas..." />
            </div>
          ) : lineas.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No hay líneas disponibles
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
          message={`Vas a eliminar "${confirmDelete?.nombre}"`}
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

const LineaModal = ({ data, onChange, onSave, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

      <h3 className="text-xl font-bold mb-4">
        {data?.id ? "Editar Línea" : "Nueva Línea"}
      </h3>

      <div className="space-y-4">

        <div>
          <label className="block mb-1 font-semibold">
            Nombre
          </label>
          <input
            className="w-full border rounded-lg p-2"
            value={data?.nombre || ""}
            onChange={(e) =>
              onChange("nombre", e.target.value)
            }
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Descripción
          </label>
          <textarea
            rows={4}
            className="w-full border rounded-lg p-2"
            value={data?.descripcion || ""}
            onChange={(e) =>
              onChange("descripcion", e.target.value)
            }
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Coordinador
          </label>
          <input
            className="w-full border rounded-lg p-2"
            value={data?.coordinador || ""}
            onChange={(e) =>
              onChange("coordinador", e.target.value)
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">
            Imagen
          </label>

          <ImageUploader
            value={data?.imagen_url}
            onChange={(url) => onChange("imagen_url", url)}
          />

        </div>

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border"
        >
          Cancelar
        </button>

        <button
          onClick={onSave}
          className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
        >
          Guardar
        </button>

      </div>
    </div>
  </div>
);

