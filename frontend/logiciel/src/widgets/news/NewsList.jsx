import { useState } from "react";
import { useAuth } from "../../features/auth/model/useAuth";
import { useNews } from "../../entities/news/model/useNews";
import { useManageNews } from "../../features/manage-news/model/useManageNews";
import { uploadFile } from "../../shared/uploadFile/api/uploadApi";

import NewsCard from "../../entities/news/ui/NewsCard";
import Loader from "../../shared/components/Loader";
import ConfirmModal from "../../shared/ui/ConfirmModal";
import CMSFormModal from "../../features/manage-news/ui/CMSFormModel";
import toast from "react-hot-toast";
import { PlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../shared/ui/PageHeader";
import SectionHeader from "../../shared/ui/SectionHeader";

export default function NewsList() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { noticias, loading, refresh } = useNews();
  const manage = useManageNews(refresh);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadFile(file);
      manage.setForm((prev) => ({ ...prev, image: result.url }));
    } catch (error) {
      toast.error(error?.uploadMessage || "Error subiendo imagen");
      console.error("Error uploading image", error);
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
      {/* ENCABEZADO */}
      <PageHeader
        eyebrow="Actualidad"
        title="Noticias y eventos"
        description="Información, novedades y actividades académicas del grupo de investigación."
      />

      {/* NOTICIAS */}
      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeader
          eyebrow="Noticias"
          title="Últimas noticias"
          action={isAdmin && (
            <button
              onClick={() => { manage.setForm({}); manage.setOpenModal(true); }}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5" />
              Nueva noticia
            </button>
          )}
        />
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader text="Cargando noticias..." />
          </div>
        ) : noticias.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500">No hay noticias aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                isAdmin={isAdmin}
                onEdit={() => manage.handleEdit(item)}
                onDelete={() => setConfirmDelete(item)}
              />
            ))}
          </div>
        )}
      </section>

      {/* MODAL EDITAR/CREAR */}
      {manage.openModal && (
        <CMSFormModal
          title={manage.editing ? "Editar Noticia" : "Nueva Noticia"}
          form={manage.form}
          setForm={manage.setForm}
          onSave={manage.handleSave}
          onClose={() => manage.setOpenModal(false)}
          uploading={uploading}
          onImageUpload={handleImageUpload}
          fields={["title", "summary", "content", "date", "videos"]}
        />
      )}

      {/* CONFIRM DELETE */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Eliminar noticia"
        message={`¿Eliminar "${confirmDelete?.title}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
}