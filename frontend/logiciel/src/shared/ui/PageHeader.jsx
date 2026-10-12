import SanJose from "../assets/images/san_jose.webp";

// Encabezado institucional de página: banda navy con la foto del campus atenuada.
// `action` permite ubicar botones (p. ej. "+ Nueva noticia" para administradores).
export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <section className="relative overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${SanJose})` }}
      />
      <div className="absolute inset-0 bg-brand-navy/90" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-20">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-200 sm:text-sm">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-brand-teal" />
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {description}
          </p>
        )}
        {action && <div className="mt-8 flex flex-wrap justify-center gap-3">{action}</div>}
      </div>
    </section>
  );
}
