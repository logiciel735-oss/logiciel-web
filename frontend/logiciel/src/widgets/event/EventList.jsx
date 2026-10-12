import { useState } from "react";
import { useAuth } from "../../features/auth/model/useAuth";
import { useEvents } from "../../entities/event/model/useEvents";
import { useManageEvents } from "../../features/manage-events/model/useManageEvents";
import { uploadFile } from "../../shared/uploadFile/api/uploadApi";

import EventCard from "../../entities/event/ui/EventCard";
import Loader from "../../shared/components/Loader";
import ConfirmModal from "../../shared/ui/ConfirmModal";
import CMSFormModal from "../../features/manage-news/ui/CMSFormModel";

export default function EventList() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { eventos, loading, refresh } = useEvents();
  const manage = useManageEvents(refresh);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadFile(file);
      manage.setForm((prev) => ({ ...prev, image: result.url }));
    } catch {
      alert("Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  const onConfirmDelete = async () => {
    await manage.handleDelete(confirmDelete.id);
    setConfirmDelete(null);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative h-[45vh] bg-[rgba(10,25,47,0.75)] flex items-center justify-center text-white text-center px-4">
        <div>
          <h2 className="text-3xl font-bold">Eventos</h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg">
            Actividades académicas y eventos del grupo.
          </p>
          {isAdmin && (
            <button
              onClick={() => { manage.setForm({}); manage.setOpenModal(true); }}
              className="mt-6 bg-teal-300 text-[#0a192f] px-5 py-2 rounded font-semibold"
            >
              + Nuevo Evento
            </button>
          )}
        </div>
      </section>

      {/* GRID */}
      <section className="relative max-w-7xl mx-auto px-6 py-14">
        {loading ? (
          <div className="flex justify-center items-center py-16 col-span-full">
            <Loader text="Cargando eventos..." />
          </div>
        ) : eventos.length === 0 ? (
          <p className="text-center text-gray-400">No hay eventos aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((item) => (
              <EventCard
                key={item.id} item={item} isAdmin={isAdmin}
                onEdit={() => manage.handleEdit(item)}
                onDelete={() => setConfirmDelete(item)}
              />
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}
      {manage.openModal && (
        <CMSFormModal
          title={manage.editing ? "Editar Evento" : "Nuevo Evento"}
          form={manage.form} setForm={manage.setForm}
          onSave={manage.handleSave}
          onClose={() => manage.setOpenModal(false)}
          uploading={uploading}
          onImageUpload={handleImageUpload}
          fields={["title", "summary", "description", "date", "dateEnd", "location"]}
        />
      )}

      {/* CONFIRM DELETE */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Eliminar evento"
        message={`¿Eliminar "${confirmDelete?.title}"?`}
        confirmText="Eliminar" cancelText="Cancelar"
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
}