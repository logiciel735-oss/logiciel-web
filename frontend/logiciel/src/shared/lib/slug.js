// Enlaces legibles para noticias y eventos: /news/<titulo-en-texto>-<uuid>
// El uuid va al final y es lo único que se usa para buscar el registro, así que
// los enlaces viejos (solo uuid) y los de títulos anteriores siguen funcionando.
// También lo importa la función de Vercel api/share.js: sin dependencias del navegador.

const UUID_AT_END = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
const MAX_WORDS = 8;

// "De lo clásico a lo cuántico: ¡ICEFUTURES 2025!" → "de-lo-clasico-a-lo-cuantico-icefutures-2025"
export const slugify = (text = "") =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // tildes y diéresis
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_WORDS)
    .join("-");

// Parámetro de la ruta → uuid (o el parámetro tal cual si no termina en uuid)
export const extractId = (param = "") => param.match(UUID_AT_END)?.[1].toLowerCase() ?? param;

const BASE = { news: "/news", event: "/events" };

// buildDetailPath("news", id, titulo) → "/news/titulo-en-texto-<uuid>"
export const buildDetailPath = (type, id, title) => {
  const slug = slugify(title);
  return `${BASE[type]}/${slug ? `${slug}-` : ""}${id}`;
};
