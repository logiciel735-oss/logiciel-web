import { useState } from "react";
import { useAuth } from "../../features/auth/model/useAuth";
import { useEvents } from "../../entities/event/model/useEvents";
import { useManageEvents } from "../../features/manage-events/model/useManageEvents";
import { uploadFile } from "../../shared/uploadFile/api/uploadApi";

import EventCard from "../../entities/event/ui/EventCard";
import Loader from "../../shared/components/Loader";
import ConfirmModal from "../../shared/ui/ConfirmModal";
import CMSFormModal from "../../features/manage-news/ui/CMSFormModel";
import SectionHeader from "../../shared/ui/SectionHeader";
import { PlusIcon } from "@heroicons/react/24/outline";

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
    } catch (err) {
      alert(err?.uploadMessage || "Error subiendo imagen");
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
      {/* EVENTOS */}
      <section className="relative mx-auto max-w-7xl border-t border-slate-200 px-4 py-14 sm:px-6">
        <SectionHeader
          eyebrow="Eventos"
          title="Actividades académicas"
          action={isAdmin && (
            <button
              onClick={() => { manage.setForm({}); manage.setOpenModal(true); }}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5" />
              Nuevo evento
            </button>
          )}
        />
        {loading ? (
          <div className="flex justify-center items-center py-16 col-span-full">
            <Loader text="Cargando eventos..." />
          </div>
        ) : eventos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500">No hay eventos aún.</p>
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