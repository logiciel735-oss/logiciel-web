export function mapNewsFromApi(item) {
 

  return {
    id: item.id || "",

    title: item.titulo || "",

    summary: item.resumen || "",

    content: item.contenido || "",

    image: item.image || item.imagen || "",

    gallery: Array.isArray(item.gallery)
      ? item.gallery
      : [],

    date:
      item.fecha_creacion?.toDate
        ? item.fecha_creacion.toDate()
        : item.fecha_creacion || null,

    autores: Array.isArray(item.autores)
      ? item.autores.map((a) => ({
          miembro_id: a.miembro_id || "",
          nombre_externo: a.nombre_externo || "",
          rol: a.rol || "Autor",
        }))
      : [],

    videos: Array.isArray(item.videos) ? item.videos : [],
  };
}
export function mapNewsToApi(form, gallery) {
  return {
    titulo:         form.title,
    contenido:      form.content,
    resumen:        form.summary,
    fecha_creacion: form.date,
    image:          form.image,
    gallery,
    autores: (form.autores || []).map((a) => ({
      miembro_id:     a.miembro_id     || "",   
      nombre_externo: a.nombre_externo || "",   
      rol:            a.rol            || "Autor",
    })),
    videos: form.videos || [],
  };
}