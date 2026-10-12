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
      toast.error("Error subiendo imagen");
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
      {/* HERO */}
      <section className="relative h-[45vh] bg-[rgba(10,25,47,0.75)] flex items-center justify-center text-white text-center px-4">
        <div>
          <h2 className="text-3xl font-bold">Noticias</h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg">
            Información y novedades del grupo de investigación.
          </p>
          {isAdmin && (
            <button
              onClick={() => { manage.setForm({}); manage.setOpenModal(true); }}
              className="mt-6 bg-teal-300 text-[#0a192f] px-5 py-2 rounded font-semibold"
            >
              + Nueva Noticia
            </button>
          )}
        </div>
      </section>

      {/* GRID */}
      <section className="relative max-w-7xl mx-auto px-6 py-14">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader text="Cargando noticias..." />
          </div>
        ) : noticias.length === 0 ? (
          <p className="text-center text-gray-400">No hay noticias aún.</p>
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
          fields={["title", "summary", "content", "date"]}
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