import { useAuth } from "../../features/auth/model/useAuth";
import { usePublications } from "../../entities/publication/model/usePublications";
import PublicationCard from "../../entities/publication/ui/PublicationCard";
import { useManagePublication } from "../../features/manage-publication/model/useManagePublication";
import PublicationFormModal from "../../features/manage-publication/ui/PublicationFormModal";
import Loader from "../../shared/components/Loader";

import ConfirmModal from "../../shared/ui/ConfirmModal";
import PageHeader from "../../shared/ui/PageHeader";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function PublicationList() {
  const { canEditContent: isAdmin } = useAuth();

  const {
    publicacionesFiltradas,
    loading,
    refresh,
    searchTerm,
    setSearchTerm,
    normalizeAutores,
  } = usePublications();

  const manage = useManagePublication(refresh);
  return (
    <div className="flex min-h-screen w-full flex-col">
      {manage.processing && (
        <Loader
          text="Procesando publicación..."
          fullscreen={true}
          bg="bg-black/40 backdrop-blur-sm"
          color="#14B8A6"
          size={90}
        />
      )}
      {/* ENCABEZADO */}
      <PageHeader
        eyebrow="Producción científica"
        title="Publicaciones científicas"
        description="Resultados de investigación publicados por los miembros del grupo."
        action={isAdmin && (
            <button
              onClick={() => {
                manage.setEditing(null);
                manage.setForm({
                  titulo: "",
                  autores: [],
                  id_revista: "",
                  año: "",
                  link_revista: "",
                  enlace_pdf: "",
                });
                manage.setOpenModal(true);
              }}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5" />
              Nueva publicación
            </button>
          )}
      />

      {/* BUSCADOR */}
      <section className="mx-auto -mt-7 w-full max-w-3xl px-4 relative z-10">
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título, autores, revista o año..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-base h-14 rounded-xl pl-12 text-base shadow-lg"
          />
        </div>
      </section>

      {/* LISTADO */}
      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        {loading && <Loader text="Cargando publicaciones..." />}

        {!loading && (
          publicacionesFiltradas.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publicacionesFiltradas.map((p) => (
                <PublicationCard
                  key={p.id}
                  publication={p}
                  isAdmin={isAdmin}
                  normalizeAutores={normalizeAutores}
                  onEdit={(pub) => manage.handleEdit(pub, normalizeAutores)}
                  onDelete={manage.handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
              {searchTerm
                ? `No hay publicaciones de "${searchTerm}"`
                : "Aún no hay publicaciones registradas"}
            </div>
          )
        )}
      </section>

      <PublicationFormModal {...manage} isAdmin={isAdmin} />

      <ConfirmModal
        open={manage.confirmDeleteOpen}
        title="Eliminar publicación"
        message={`Esta acción no se puede deshacer. ¿Deseas eliminar la publicación "${manage.publicationToDelete?.titulo}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={manage.confirmDelete}
        onCancel={manage.cancelDelete}
      />
    </div>
  );
}