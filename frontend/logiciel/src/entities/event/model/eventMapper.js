export function mapEventFromApi(item) {
  return {
    id: item.id || "",

    title: item.titulo || "",
    summary: item.resumen || "",
    description: item.descripcion || "",

    image: item.image || "",

    gallery: Array.isArray(item.gallery)
      ? item.gallery
      : [],

    date:
      item.fecha_inicio?.toDate
        ? item.fecha_inicio.toDate()
        : item.fecha_inicio || null,

    dateEnd:
      item.fecha_fin?.toDate
        ? item.fecha_fin.toDate()
        : item.fecha_fin || null,

    location: item.ubicacion || "",

    type: "evento",
  };
}
//
// ==============================
// FRONTEND → API
// ==============================
export function mapEventToApi(form, gallery) {
  return {
    titulo: form.title,
    resumen: form.summary,
    descripcion: form.description || form.summary,

    fecha_inicio: form.date,
    fecha_fin: form.dateEnd,

    ubicacion: form.location || "",

    image: form.image || "",

    gallery: gallery || [],
  };
}