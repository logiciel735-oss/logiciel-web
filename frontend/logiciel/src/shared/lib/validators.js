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

/**
 * Perfil de LinkedIn: https://…linkedin.com/in/usuario (o /pub/…).
 * Mismo patrón que el CHECK users_linkedin_valido de la base de datos.
 */
export const LINKEDIN_REGEX =
  /^https:\/\/([a-z]{2,3}\.)?linkedin\.com\/(in\/[^\s/?#]+\/?|pub\/[^\s?#]+)([?#]\S*)?$/i;

export const isValidLinkedIn = (value) => !value || LINKEDIN_REGEX.test(value.trim());

/**
 * Nombre de persona: letras (con tildes, ñ, ü), espacios, guiones, puntos y apóstrofos.
 * Acepta "María José", "De la Cruz", "O'Neill", "J. Pérez". Rechaza números y símbolos.
 * Devuelve un mensaje de error o null si es válido.
 */
const PERSON_NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M} '’.-]*$/u;

// Partículas que van en minúscula dentro de un nombre ("María de los Ángeles")
const NAME_PARTICLES = new Set(["de", "del", "la", "las", "los", "y", "e", "da", "das", "do", "dos", "van", "von"]);

// Formato único para nombres de personas: "JUAN carlos DE LA cruz" → "Juan Carlos de la Cruz".
// Debe coincidir con public.formatear_nombre (supabase/nombres_formato.sql).
export const formatPersonName = (value) => {
  const clean = (value || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("es");
  if (!clean) return "";
  return clean
    .split(" ")
    .map((word, i) =>
      i > 0 && NAME_PARTICLES.has(word)
        ? word
        : word.replace(/(^|[-'’.])(\p{L})/gu, (_, sep, letter) => sep + letter.toLocaleUpperCase("es"))
    )
    .join(" ");
};

export const validatePersonName = (value, { label = "Nombre", required = true, max = 80 } = {}) => {
  const v = (value || "").trim();
  if (!v) return required ? `${label}: este campo es obligatorio.` : null;
  if (/\d/.test(v)) return `${label}: no puede contener números.`;
  if (!PERSON_NAME_REGEX.test(v)) {
    return `${label}: solo se permiten letras, espacios, guiones, puntos y apóstrofos.`;
  }
  if (v.replace(/[^\p{L}]/gu, "").length < 2) return `${label}: es demasiado corto.`;
  if (v.length > max) return `${label}: máximo ${max} caracteres.`;
  return null;
};
