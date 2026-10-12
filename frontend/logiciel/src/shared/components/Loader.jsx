export default function Loader({
  text = "Cargando...",
  bg = "bg-slate-50/70",
  color = "#119DA4",
  size = 48,
  fullscreen = false,
}) {
  // Texto claro solo sobre fondos oscuros
  const darkBg = /black|navy/.test(bg);

  return (
    <div
      className={`
        ${
          fullscreen
            ? "fixed inset-0 z-[70]"
            : "absolute inset-0 z-10"
        }
        flex flex-col items-center justify-center
        ${bg}
      `}
      role="status"
    >
      <span
        className="animate-spin rounded-full border-4 border-slate-200"
        style={{ width: size, height: size, borderTopColor: color }}
        aria-hidden="true"
      />

      <p className={`mt-4 text-xs font-medium uppercase tracking-widest ${darkBg ? "text-white" : "text-slate-500"}`}>
        {text}
      </p>
    </div>
  );
}
