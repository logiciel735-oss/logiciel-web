// Vista previa al compartir noticias y eventos (Facebook, WhatsApp, LinkedIn, X…).
// Los robots de redes sociales no ejecutan JavaScript: vercel.json les envía /news/* y
// /events/* aquí, y se responde el mismo index.html con las etiquetas Open Graph del
// registro ya incluidas. Las personas no pasan por esta función.
//
// Variables de entorno (Vercel → Settings → Environment Variables): usa
// SUPABASE_URL / SUPABASE_ANON_KEY o, si no existen, las VITE_… del frontend.

import { buildDetailPath, extractId } from "../src/shared/lib/slug.js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const SITE_NAME = "LOGICIEL";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const TABLES = {
  news: { table: "noticias", select: "id,titulo,resumen,contenido,image,gallery", body: "contenido" },
  event: { table: "eventos", select: "id,titulo,resumen,descripcion,image,gallery", body: "descripcion" },
};

const escapeHtml = (text = "") =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const truncate = (text = "", max = 200) => {
  const clean = String(text).replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : clean;
};

// Imagen de Cloudinary recortada a 1200×630 (tamaño recomendado por Facebook) en JPG
const shareImage = (url) => {
  const marker = "/image/upload/";
  const i = typeof url === "string" ? url.indexOf(marker) : -1;
  if (i === -1 || !url.includes("res.cloudinary.com")) return url || null;
  const rest = url.slice(i + marker.length).replace(/^[a-z]{1,3}_[^/]*\//, "");
  return `${url.slice(0, i + marker.length)}c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/${rest}`;
};

const fetchRecord = async (type, id) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !UUID.test(id)) return null;
  const { table, select } = TABLES[type];
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=${select}&id=eq.${id}&limit=1`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] || null;
};

const ogBlock = ({ title, description, url, image, type }) => {
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="es_CO" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
  ];
  return `<!-- og:inicio -->\n    ${tags.join("\n    ")}\n    <!-- og:fin -->`;
};

export default async function handler(req, res) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const origin = `${proto}://${req.headers.host}`;
  const params = new URL(req.url, origin).searchParams;
  const type = params.get("type") === "event" ? "event" : "news";
  const id = extractId(params.get("slug") || "");

  let record = null;
  try {
    record = await fetchRecord(type, id);
  } catch (err) {
    console.error("share: error consultando Supabase", err);
  }

  let html = null;
  try {
    const page = await fetch(`${origin}/index.html`);
    if (page.ok) html = await page.text();
  } catch (err) {
    console.error("share: error leyendo index.html", err);
  }

  if (record && html) {
    const { body } = TABLES[type];
    const meta = ogBlock({
      title: `${record.titulo} · ${SITE_NAME}`,
      description: truncate(record.resumen || record[body] || "Grupo de Investigación LOGICIEL"),
      url: `${origin}${buildDetailPath(type, record.id, record.titulo)}`,
      image: shareImage(record.image || record.gallery?.[0]) || `${origin}/og-default.png`,
      type: "article",
    });
    html = html.replace(/<!-- og:inicio[\s\S]*?<!-- og:fin -->/, meta);
  }

  if (!html) {
    // Sin index.html no hay página que servir: al menos el robot recibe una respuesta válida
    res.statusCode = 502;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.end("No se pudo cargar la página.");
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  // Caché en el CDN de Vercel: 10 min; luego sirve la copia mientras la renueva
  res.setHeader("Cache-Control", record ? "public, s-maxage=600, stale-while-revalidate=86400" : "public, s-maxage=60");
  res.end(html);
}
