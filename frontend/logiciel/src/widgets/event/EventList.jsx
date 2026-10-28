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
import { PlusIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { splitEvents } from "../../entities/event/model/eventStatus";
import { puedeEditarContenido } from "../../features/auth/model/permissions";

export default function EventList() {
  const { user } = useAuth();
  const isAdmin = puedeEditarContenido(user);

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

  // El estado se calcula con la fecha de hoy: los eventos pasan solos de "Próximo" a "Finalizado"
  // y, GRACE_DAYS días después, a "Eventos pasados".
  const { activos, pasados } = splitEvents(eventos, (e) => [e.date, e.dateEnd, e.timeStart, e.timeEnd]);

  const renderCard = (item) => (
    <EventCard
      key={item.id} item={item} isAdmin={isAdmin}
      onEdit={() => manage.handleEdit(item)}
      onDelete={() => setConfirmDelete(item)}
    />
  );

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
        ) : (
          <>
            {activos.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
                No hay eventos próximos.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activos.map(({ item }) => renderCard(item))}
              </div>
            )}

            {/* Eventos que terminaron hace más de GRACE_DAYS días: se conservan, plegados */}
            {pasados.length > 0 && (
              <details className="group mt-10 rounded-xl border border-slate-200 bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-semibold text-brand-navy [&::-webkit-details-marker]:hidden">
                  <span>
                    Eventos pasados
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                      {pasados.length}
                    </span>
                  </span>
                  <ChevronDownIcon className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="grid grid-cols-1 gap-6 border-t border-slate-200 p-5 md:grid-cols-2 lg:grid-cols-3">
                  {pasados.map(({ item }) => renderCard(item))}
                </div>
              </details>
            )}
          </>
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
          fields={["title", "summary", "description", "date", "dateEnd", "location", "eventDetails"]}
        />
      )}

      {/* CONFIRM DELETE */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Eliminar evento"
        message={`¿Eliminar "${confirmDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar" cancelText="Cancelar"
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
}