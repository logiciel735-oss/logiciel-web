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

    // Hora (columna time "HH:MM:SS" → "HH:MM" para <input type="time">), modalidad y enlaces
    timeStart: item.hora_inicio ? item.hora_inicio.slice(0, 5) : "",
    timeEnd: item.hora_fin ? item.hora_fin.slice(0, 5) : "",
    modality: item.modalidad || "",
    registrationUrl: item.enlace_inscripcion || "",
    meetingUrl: item.enlace_virtual || "",

    type: "evento",
  };
}

// Campos de hora, modalidad y enlaces hacia la BD (vacíos → null)
export function mapEventDetailsToApi(form) {
  return {
    hora_inicio: form.timeStart || null,
    hora_fin: form.timeEnd || null,
    modalidad: form.modality || null,
    enlace_inscripcion: form.registrationUrl?.trim() || null,
    enlace_virtual: form.meetingUrl?.trim() || null,
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

    ...mapEventDetailsToApi(form),
  };
}