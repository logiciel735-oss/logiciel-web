import { isValidUrl } from "../../../shared/lib/validators";

// Modalidad del evento (CHECK eventos_modalidad_valida en supabase/eventos_hora_modalidad.sql)
export const MODALIDADES = {
  presencial: "Presencial",
  virtual: "Virtual",
  hibrida: "Híbrida",
};

// "15:00" o "15:00:00" (columna time) → "3:00 p. m."
export const formatTime = (value) => {
  const match = /^(\d{2}):(\d{2})/.exec(value || "");
  if (!match) return "";
  const date = new Date(2000, 0, 1, Number(match[1]), Number(match[2]));
  return date.toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" });
};

// "3:00 p. m. – 5:00 p. m." / "3:00 p. m." / ""
export const formatTimeRange = (start, end) =>
  [formatTime(start), formatTime(end)].filter(Boolean).join(" – ");

/**
 * Valida hora, modalidad y enlaces del formulario de eventos.
 * Devuelve un mensaje de error o null.
 */
export const validateEventDetails = (form) => {
  const { timeStart, timeEnd, date, dateEnd, modality, registrationUrl, meetingUrl } = form;

  if (timeEnd && !timeStart) return "Indica la hora de inicio si pones una hora de fin.";

  // Mismo día: la hora de fin debe ser posterior a la de inicio
  const sameDay = !dateEnd || String(dateEnd).slice(0, 10) === String(date || "").slice(0, 10);
  if (sameDay && timeStart && timeEnd && timeEnd <= timeStart) {
    return "La hora de fin debe ser posterior a la hora de inicio.";
  }

  if (modality && !MODALIDADES[modality]) return "Modalidad no válida.";

  if (registrationUrl?.trim() && !isValidUrl(registrationUrl.trim())) {
    return "El enlace de inscripción debe empezar por https:// (o http://).";
  }
  if (meetingUrl?.trim() && !isValidUrl(meetingUrl.trim())) {
    return "El enlace de la transmisión debe empezar por https:// (o http://).";
  }
  if ([registrationUrl, meetingUrl].some((url) => url && /\s/.test(url.trim()))) {
    return "Los enlaces no pueden tener espacios.";
  }

  return null;
};
