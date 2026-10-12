import { useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeftIcon, ChevronRightIcon, UserGroupIcon } from "@heroicons/react/24/outline";

import { useAuth } from "../../features/auth/model/useAuth";
import { useMiembros } from "../../entities/member/model/useMiembros";
import MiembroCard from "../../entities/member/ui/MiembroCard";
import MiembroModal from "../../entities/member/ui/MiembroModal";
import ConfirmModal from "../../shared/ui/ConfirmModal";
import Loader from "../../shared/components/Loader";
import { useCircularHorizontalScroll } from "../../shared/hooks/design/useCircularHorizontalScroll";

import {
  createMiembro,
  updateMiembro,
  deleteMiembro,
} from "../../features/adminUsers/api/adminUsersApi";

export default function MiembrosWidget() {
  const { user, token } = useAuth();
  const isAdmin = user?.role === "admin";

  const { miembros, loading, error, refresh } = useMiembros();

  const { ref, hasOverflow, scrollLeft, scrollRight } =
    useCircularHorizontalScroll([miembros]);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = async () => {
    try {
      if (editData?.id) {
        await updateMiembro(editData.id, editData, token);
        toast.success("Miembro actualizado correctamente");
      } else {
        await createMiembro(editData, token);
        toast.success("Miembro creado correctamente");
      }
      await refresh();
      setOpenModal(false);
      setEditData(null);
    } catch {
      toast.error("Error guardando miembro");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMiembro(confirmDelete.id, token);
      toast.success("Miembro eliminado correctamente");
      await refresh();
      setConfirmDelete(null);
    } catch {
      toast.error("Error eliminando miembro");
    }
  };

  const openNew = () => {
    setEditData({ user_id: "", role: "" });
    setOpenModal(true);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <Loader text="Cargando miembros..." />
        </div>
      );
    }

    if (error && miembros.length === 0) {
      return (
        <div className="text-center py-12 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={refresh}
            className="bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Reintentar
          </button>
        </div>
      );
    }

    if (miembros.length === 0) {
      return (
        <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <UserGroupIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">Aún no hay miembros registrados</p>
          {isAdmin && (
            <p className="text-slate-500 text-sm mt-1">
              Usa "+ Nuevo Miembro" para vincular usuarios registrados al grupo.
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="relative">
        {hasOverflow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-[#64ffda] hover:text-[#0a192f] p-3 rounded-full transition-all border border-white/20"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        )}

        <div
          ref={ref}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth px-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {miembros.map((miembro) => (
            <div key={miembro.id} className="flex-shrink-0">
              <MiembroCard
                miembro={miembro}
                isAdmin={isAdmin}
                onEdit={(item) => { setEditData(item); setOpenModal(true); }}
                onDelete={(item) => setConfirmDelete(item)}
              />
            </div>
          ))}
        </div>

        {hasOverflow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-[#64ffda] hover:text-[#0a192f] p-3 rounded-full transition-all border border-white/20"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Miembros</h2>
          {!loading && !error && (
            <p className="text-slate-500 text-sm mt-1">
              <span className="text-teal-600 font-bold">{miembros.length}</span>{" "}
              {miembros.length === 1 ? "miembro" : "miembros"} en el grupo
            </p>
          )}
          {isAdmin && (
            <button
              onClick={openNew}
              className="bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              + Nuevo Miembro
            </button>
          )}
        </div>

        {renderContent()}
      </div>

      {openModal && (
        <MiembroModal
          data={editData}
          onChange={(k, v) => setEditData((prev) => ({ ...prev, [k]: v }))}
          onSave={handleSave}
          onClose={() => { setOpenModal(false); setEditData(null); }}
        />
      )}

      <ConfirmModal
        open={!!confirmDelete}
        title="Eliminar Miembro"
        message={`¿Seguro que deseas eliminar "${confirmDelete?.name}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </section>
  );
}
