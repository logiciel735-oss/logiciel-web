// Reconocer autores a partir de una lista pegada (p. ej. copiada de un artículo):
// separa los nombres y los compara con los miembros registrados, sin importar
// tildes, mayúsculas, guiones ni el orden de las palabras.

// "Gómez-Ramírez, Á." → "gomez ramirez a"
export const normalizeName = (text = "") =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const PARTICLES = new Set(["de", "del", "la", "las", "los", "y", "e", "da", "das", "do", "dos", "van", "von"]);
const tokens = (text) => normalizeName(text).split(" ").filter((t) => t && !PARTICLES.has(t));

/**
 * Separa el texto pegado en nombres.
 * - Con saltos de línea o punto y coma, solo se separa por ellos (así "López, Óscar" queda junto).
 * - Si no, se separa por comas, "y", "and" y "&".
 * Quita números de afiliación (Ana Torres1,2), asteriscos, correos y paréntesis.
 */
export function splitNames(text = "") {
  const clean = text
    .replace(/\S+@\S+/g, " ")         // correos
    .replace(/\([^)]*\)/g, " ")       // (Universidad X)
    .replace(/[\d*†‡§¹²³⁴⁵⁶⁷⁸⁹⁰]+/g, " ");

  const parts = /[\n;]/.test(clean)
    // "Antonelli, Leandro" → "Leandro Antonelli"
    ? clean.split(/[\n;]+/).map((p) => (p.split(",").length === 2 ? p.split(",").reverse().join(" ") : p))
    : clean.split(/,|\s+(?:y|and|e)\s+|&/i);

  const seen = new Set();
  return parts
    .map((p) => p.replace(/\s+/g, " ").replace(/^[\s,.-]+|[\s,.-]+$/g, "").trim())
    .filter((p) => {
      const key = normalizeName(p);
      if (key.replace(/\s/g, "").length < 2 || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/**
 * ¿Qué tanto se parece un nombre pegado al nombre de un miembro?
 *   2 → seguro (mismas palabras, en cualquier orden)
 *   1 → probable (todas las palabras pegadas están en el miembro, con al menos dos
 *       palabras completas, o iniciales + apellido: "O. S. López" ~ "Óscar Santiago López")
 *   0 → no coincide
 */
export function matchScore(pasted, memberName) {
  const a = tokens(pasted);
  const b = tokens(memberName);
  if (!a.length || !b.length) return 0;

  if (a.length === b.length && [...a].sort().join(" ") === [...b].sort().join(" ")) return 2;

  const full = a.filter((t) => t.length > 1);
  const initials = a.filter((t) => t.length === 1);
  const fullOk = full.every((t) => b.includes(t));
  const initialsOk = initials.every((i) => b.some((t) => t.startsWith(i)));

  if (fullOk && initialsOk && (full.length >= 2 || (full.length === 1 && initials.length >= 1))) return 1;
  return 0;
}

/**
 * Analiza la lista pegada.
 * Devuelve una fila por nombre: { name, status, candidates, choice }
 *   status: "member" (coincidencia segura) · "review" (aproximada, revisar) ·
 *           "external" (no es miembro) · "duplicate" (ya está en la lista)
 *   choice: user_id del miembro elegido, o "" para agregarlo como externo.
 */
export function analyzePastedAuthors(text, miembros = [], current = []) {
  const currentMembers = new Set(current.map((a) => a.miembro_id).filter(Boolean));
  const currentExternal = new Set(current.filter((a) => !a.miembro_id).map((a) => normalizeName(a.nombre_externo)));
  const chosen = new Set();

  return splitNames(text).map((name) => {
    const scored = miembros
      .map((m) => ({ m, score: matchScore(name, m.name) }))
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score);

    const best = scored[0];
    const candidates = scored.map((x) => x.m);

    if (best && (currentMembers.has(best.m.user_id) || chosen.has(best.m.user_id))) {
      return { name, status: "duplicate", candidates, choice: best.m.user_id };
    }
    if (!best && currentExternal.has(normalizeName(name))) {
      return { name, status: "duplicate", candidates, choice: "" };
    }
    if (best) {
      chosen.add(best.m.user_id);
      const sure = best.score === 2 && scored.filter((x) => x.score === 2).length === 1;
      return { name, status: sure ? "member" : "review", candidates, choice: best.m.user_id };
    }
    return { name, status: "external", candidates, choice: "" };
  });
}
