import { useState } from "react";
import toast from "react-hot-toast";
import { CheckIcon, LinkIcon, ShareIcon } from "@heroicons/react/24/outline";
import LinkedInIcon from "./LinkedInIcon";

const FacebookIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z" />
  </svg>
);

const WhatsAppIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41z" />
  </svg>
);

const btn =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-brand-teal hover:bg-brand-teal-light hover:text-brand-teal-dark";

// Botones para compartir una noticia o un evento. `path` es el enlace con título (buildDetailPath).
export default function ShareButtons({ title, path }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}${path}`;
  const u = encodeURIComponent(url);
  const canShareNatively = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const links = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: <FacebookIcon className="h-5 w-5" /> },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`, icon: <WhatsAppIcon className="h-5 w-5" /> },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: <LinkedInIcon className="h-5 w-5" /> },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Enlace copiado");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  const shareNative = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // El usuario canceló el menú de compartir: no es un error
    }
  };

  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Compartir</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={btn}
            aria-label={`Compartir en ${label}`}
            title={`Compartir en ${label}`}
          >
            {icon}
          </a>
        ))}
        <button type="button" onClick={copyLink} className={btn} aria-label="Copiar enlace" title="Copiar enlace">
          {copied ? <CheckIcon className="h-5 w-5 text-brand-teal" /> : <LinkIcon className="h-5 w-5" />}
        </button>
        {canShareNatively && (
          <button type="button" onClick={shareNative} className={btn} aria-label="Más opciones" title="Más opciones">
            <ShareIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
