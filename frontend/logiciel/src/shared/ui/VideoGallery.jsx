import { parseVideoUrl } from "../lib/video";

// Reproductores incrustados (16:9) para enlaces de YouTube o Google Drive.
// Los enlaces que no son válidos se ignoran.
export default function VideoGallery({ videos = [] }) {
  const validos = (Array.isArray(videos) ? videos : [])
    .map(parseVideoUrl)
    .filter(Boolean);

  if (validos.length === 0) return null;

  return (
    <div className="grid gap-6">
      {validos.map(({ embedUrl, provider }) => (
        <div
          key={embedUrl}
          className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm"
          style={{ aspectRatio: "16 / 9" }}
        >
          <iframe
            src={embedUrl}
            title={provider === "youtube" ? "Video de YouTube" : "Video de Google Drive"}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  );
}
