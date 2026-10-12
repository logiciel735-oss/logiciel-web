/**
 * URL válida con protocolo http o https
 */
export const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Valida que la fecha de inicio no sea posterior a la de fin.
 * Devuelve un mensaje de error o null si el rango es válido
 * (si falta alguna de las dos fechas no hay nada que comparar).
 */
export const validateDateRange = (start, end) => {
  if (!start || !end) return null;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate) || isNaN(endDate)) return "Las fechas no son válidas.";

  if (startDate > endDate) {
    return "La fecha de inicio no puede ser posterior a la fecha de fin.";
  }

  return null;
};
