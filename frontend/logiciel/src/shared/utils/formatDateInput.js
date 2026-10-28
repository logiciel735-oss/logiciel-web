const pad = (n) => String(n).padStart(2, "0");

// Fecha → "YYYY-MM-DD" para <input type="date"> y para mostrarla.
// Las fechas elegidas en el formulario se guardan a medianoche UTC: de esas se toma
// el día UTC (en Colombia, UTC-5, new Date() daría el día anterior).
// Las que traen otra hora (p. ej. el default now() de la BD) se leen en hora local.
export function formatDateInput(value) {
  if (!value) return "";

  // Ya es solo fecha
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  // Firebase Timestamp, Date o string ISO
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (isNaN(date)) return "";

  const isUtcMidnight =
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0;

  return isUtcMidnight
    ? `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
    : `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Fecha de calendario (sin hora) como Date local, con el mismo día que muestra el formulario.
export function toCalendarDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(formatDateInput(value));
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function formatCalendarDate(value, options, locale = "es-CO") {
  const date = toCalendarDate(value);
  return date ? date.toLocaleDateString(locale, options) : "";
}
