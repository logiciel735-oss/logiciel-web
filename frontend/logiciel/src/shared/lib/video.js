// Videos: solo se aceptan enlaces de YouTube o Google Drive.
// Se devuelven listos para incrustar en un <iframe>.

const YOUTUBE_ID = /^[\w-]{11}$/;
const DRIVE_ID = /^[\w-]{20,}$/;

const youtubeId = (url) => {
  const host = url.hostname.replace(/^(www\.|m\.)/, "");

  if (host === "youtu.be") return url.pathname.slice(1).split("/")[0];

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") return url.searchParams.get("v");
    const [, tipo, id] = url.pathname.split("/");
    if (["embed", "shorts", "live", "v"].includes(tipo)) return id;
  }

  return null;
};

const driveId = (url) => {
  if (url.hostname !== "drive.google.com") return null;

  // drive.google.com/file/d/ID/view
  const match = url.pathname.match(/^\/file\/d\/([^/]+)/);
  if (match) return match[1];

  // drive.google.com/open?id=ID  ·  drive.google.com/uc?id=ID
  return url.searchParams.get("id");
};

/**
 * Analiza un enlace de video.
 * Devuelve { provider, url, embedUrl } o null si no es un enlace válido
 * de YouTube o Google Drive.
 */
export const parseVideoUrl = (value) => {
  let url;
  try {
    url = new URL(String(value || "").trim());
  } catch {
    return null;
  }

  const yt = youtubeId(url);
  if (yt && YOUTUBE_ID.test(yt)) {
    return {
      provider: "youtube",
      url: `https://www.youtube.com/watch?v=${yt}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt}`,
    };
  }

  const drive = driveId(url);
  if (drive && DRIVE_ID.test(drive)) {
    return {
      provider: "drive",
      url: `https://drive.google.com/file/d/${drive}/view`,
      embedUrl: `https://drive.google.com/file/d/${drive}/preview`,
    };
  }

  return null;
};

export const VIDEO_URL_ERROR =
  "Solo se aceptan enlaces de YouTube (youtube.com / youtu.be) o Google Drive (drive.google.com/file/d/...).";
