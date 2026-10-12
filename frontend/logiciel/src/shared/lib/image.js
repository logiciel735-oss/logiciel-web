// Optimiza imágenes de Cloudinary al mostrarlas: formato automático (WebP/AVIF),
// calidad automática y ancho máximo. Cualquier otra URL se devuelve sin cambios.
const MARKER = "/image/upload/";

export const optimizeImage = (url, width = 1200) => {
  if (typeof url !== "string" || !url.includes("res.cloudinary.com")) return url;

  const i = url.indexOf(MARKER);
  if (i === -1 || /\.pdf($|\?)/i.test(url)) return url;

  const rest = url.slice(i + MARKER.length);
  // Ya trae transformaciones (p. ej. "w_400,c_fill/..."): no tocar
  if (/^[a-z]{1,3}_[^/]*\//.test(rest)) return url;

  return `${url.slice(0, i + MARKER.length)}f_auto,q_auto,c_limit,w_${width}/${rest}`;
};
