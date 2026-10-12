// Logotipo oficial de LOGICIEL reconstruido en SVG:
// ventana de terminal con el prompt ">", la "L" y el cursor.
//   variant="light" → para fondos oscuros (texto blanco)
//   variant="dark"  → para fondos claros (texto navy)

export function LogoIcon({ className = "h-9 w-auto", variant = "dark" }) {
  return (
    <svg
      viewBox="0 0 120 104"
      className={className}
      role="img"
      aria-label="LOGICIEL"
    >
      <rect
        width="120"
        height="104"
        rx="14"
        fill="#17295A"
        stroke={variant === "light" ? "rgba(255,255,255,0.18)" : "none"}
        strokeWidth="2"
      />
      <circle cx="15" cy="14" r="3.4" fill="#fff" />
      <circle cx="26" cy="14" r="3.4" fill="#fff" />
      <circle cx="37" cy="14" r="3.4" fill="#119DA4" />
      <path
        d="M21 39 L36 53.5 L21 68"
        fill="none"
        stroke="#119DA4"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M55 33 V77 H75"
        fill="none"
        stroke="#fff"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="84" y="70" width="17" height="11" fill="#119DA4" />
    </svg>
  );
}

export default function Logo({ variant = "dark", showTagline = false, className = "" }) {
  const light = variant === "light";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoIcon variant={variant} className="h-9 w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-brand text-2xl font-medium tracking-tight ${
            light ? "text-white" : "text-brand-navy"
          }`}
        >
          Logiciel
        </span>
        {showTagline && (
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-brand-teal">
            Investigación y Desarrollo en Software
          </span>
        )}
      </span>
    </span>
  );
}
