// Texto comparable: sin tildes, en minúscula y sin espacios sobrantes ("Andrés" → "andres")
export const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

// true si todas las palabras de la búsqueda aparecen en alguno de los campos
export const matchesSearch = (query, fields) => {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = fields.map(normalizeText).join(" ");
  return words.every((w) => haystack.includes(w));
};
