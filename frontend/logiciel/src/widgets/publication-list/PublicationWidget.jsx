import { useAuth } from "../../features/auth/model/useAuth";
import { usePublications } from "../../entities/publication/model/usePublications";
import PublicationCard from "../../entities/publication/ui/PublicationCard";
import { useManagePublication } from "../../features/manage-publication/model/useManagePublication";
import PublicationFormModal from "../../features/manage-publication/ui/PublicationFormModal";
import Loader from "../../shared/components/Loader";

import ConfirmModal from "../../shared/ui/ConfirmModal";

export default function PublicationList() {
  const { isAdmin } = useAuth();

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
    <div className="w-full min-h-screen flex flex-col">
      {manage.processing && (
        <Loader
          text="Procesando publicación..."
          fullscreen={true}
          bg="bg-black/40 backdrop-blur-sm"
          color="#14B8A6"
          size={90}
        />
      )}
      {/* HERO */}
      <section className="h-[45vh] bg-[rgba(10,25,47,0.75)] flex items-center justify-center text-white text-center">
        <div>
          <h2 className="text-3xl font-bold">Publicaciones Científicas</h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg">
            Resultados científicos publicados por el grupo.
          </p>

          {isAdmin && (
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
              className="mt-6 bg-teal-300 text-[#0a192f] px-5 py-2 rounded font-semibold"
            >
              + Nueva publicación
            </button>
          )}
        </div>
      </section>

      {/* BUSCADOR */}
      <section className="max-w-4xl mx-auto mt-8 px-4">
        <input
          type="text"
          placeholder="Buscar por título, autores, revista o año..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-3 rounded-lg shadow"
        />
      </section>

      {/* LISTADO */}
      <section className="max-w-6xl mx-auto py-12 px-4 relative">
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
            <div className="text-center py-16 text-gray-500">
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