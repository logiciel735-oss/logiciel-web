import { useState } from "react";
import { optimizeImage } from "../lib/image";

// Cabecera de tarjeta con logo (semilleros, aliados): franja con la misma imagen
// difuminada (toma sus colores) y el logo en un marco que se adapta a la imagen.
// Altura fija en todos los casos:
//   casi cuadrada → círculo lleno · ancha → óvalo horizontal · alta → círculo sin recortar
export default function CardLogoHeader({ src, alt = "", fallbackIcon: FallbackIcon }) {
  const logo = src ? optimizeImage(src, 400) : null;
  const [shape, setShape] = useState("square");

  const handleLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (!w || !h) return;
    const ratio = w / h;
    setShape(ratio > 1.25 ? "wide" : ratio < 0.8 ? "tall" : "square");
  };

  const frameClass = shape === "wide" ? "w-44 rounded-[2rem]" : "w-24 rounded-full";
  const imgClass = shape === "square"
    ? "h-full w-full object-cover"
    : "max-h-full max-w-full object-contain p-2.5";

  return (
    <>
      <div className="relative h-20 w-full overflow-hidden bg-gradient-to-br from-brand-teal-light to-slate-100">
        {logo && (
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-150 object-cover opacity-70 blur-2xl saturate-150"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60" />
      </div>

      <div className={`relative -mt-12 flex h-24 ${frameClass} shrink-0 items-center justify-center overflow-hidden bg-white shadow-md ring-4 ring-white transition-transform duration-300 group-hover:scale-105`}>
        {logo ? (
          <img src={logo} alt={alt} onLoad={handleLoad} className={imgClass} />
        ) : (
          FallbackIcon && <FallbackIcon className="h-10 w-10 text-slate-300" />
        )}
      </div>
    </>
  );
}
