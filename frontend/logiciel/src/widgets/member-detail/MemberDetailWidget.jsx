import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../features/auth/model/useAuth";
import { useMiembroDetail } from "../../entities/member/model/useMiembroDetail";
import MemberDetailView from "../../entities/member/ui/MemberDetailView";
import ConfirmModal from "../../shared/ui/ConfirmModal";

import {
  updateMiembro,
  deleteMiembro,
} from "../../features/adminUsers/api/adminUsersApi";

export default function MemberDetailWidget() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const {
    member, activos, finalizados, publicaciones,
    noticias,       
    loading, loadingRelated, error, notFound, refresh,
  } = useMiembroDetail(uid);

  const [openEdit, setOpenEdit]               = useState(false);
  const [editData, setEditData]               = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting]               = useState(false);

  useEffect(() => {
    if (member) setEditData({ ...member });
  }, [member]);

  const handleSave = async () => {
    try {
      await updateMiembro(member.miembro_id, editData);
      await refresh();
      setOpenEdit(false);
      toast.success("Miembro actualizado correctamente");
    } catch {
      toast.error("Error al guardar los cambios");
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteMiembro(member.miembro_id);
      toast.success("Miembro eliminado correctamente");
      navigate("/about");
    } catch {
      toast.error("Error al eliminar el miembro");
    } finally {
      setDeleting(false);
      setConfirmDeleteOpen(false);
    }
  };

  if (notFound) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 gap-4">
      <h2 className="text-2xl font-bold text-[#0a192f]">Miembro no encontrado</h2>
      <p className="text-gray-600 max-w-md">
        Este perfil no corresponde a ningún miembro registrado del grupo LOGICIEL.
      </p>
      <Link
        to="/about"
        className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
      >
        Ver miembros del grupo
      </Link>
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 gap-4">
      <h2 className="text-2xl font-bold text-red-600">No se pudo cargar el perfil</h2>
      <p className="text-gray-600 max-w-md">{error}</p>
      <button
        onClick={refresh}
        className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <>
      <MemberDetailView
        member={member}
        activos={activos}
        finalizados={finalizados}
        publicaciones={publicaciones}
        noticias={noticias}           
        loading={loading}
        loadingRelated={loadingRelated}
        isAdmin={isAdmin}
        onEdit={() => setOpenEdit(true)}
        onDeleteClick={() => setConfirmDeleteOpen(true)}
      />

      {/* EDIT MODAL */}
      {openEdit && editData && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0a192f]">Editar Miembro</h3>
              <button onClick={() => setOpenEdit(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {[
                { label: "Nombre",      key: "name" },
                { label: "Rol",         key: "rol" },
                { label: "Universidad", key: "universidad" },
                { label: "Carrera",     key: "carrera" },
                { label: "Email",       key: "email" },
                { label: "CVLAC", key: "cvlac_url" },
                // { label: "Número",      key: "numero" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-1">{label}</label>
                  <input
                    className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                    value={editData[key] || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold mb-1">Descripción</label>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                  value={editData.descripcion || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, descripcion: e.target.value }))}
                />
              </div>
            </div>

            <div className="p-5 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => setOpenEdit(false)}
                className="px-6 py-2.5 text-gray-600 hover:bg-gray-200 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-green-700 shadow-md transition"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmDeleteOpen}
        title="Eliminar miembro"
        message={`¿Estás seguro de eliminar "${member?.name}"? Esta acción es permanente.`}
        confirmText={deleting ? "Borrando..." : "Eliminar"}
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </>
  );
}