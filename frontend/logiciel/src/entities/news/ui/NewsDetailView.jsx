import CMSDetailView from "../../../shared/ui/CMSDetailView";
import { updateNoticia } from "../../../features/manage-news/api/adminNewsApi";

export default function NewsDetailView({ item, loading, refresh, isAdmin }) {
  return (
    <CMSDetailView
      item={item}
      loading={loading}
      refresh={refresh}
      isAdmin={isAdmin}
      backPath="/news"
      backLabel="Volver a noticias"
      notFoundLabel="Noticia no encontrada"
      loaderLabel="Cargando noticia..."
      editTitle="Editar Noticia"
      extraFields={[
        { label: "Fecha", value: item?.date },
      ]}
      showAutores={true}
      showVideos={true}
      toApiPayload={(form) => ({
        titulo: form.title,
        resumen: form.summary,
        contenido: form.content,
        fecha_creacion: form.date,
        image: form.image,
        gallery: form.gallery,
        autores: (form.autores || []).map((a) => ({
          miembro_id: a.miembro_id || "",
          nombre_externo: a.nombre_externo || "",
          rol: a.rol || "",
        })),
      })}
      onUpdate={updateNoticia}
    />
  );
}