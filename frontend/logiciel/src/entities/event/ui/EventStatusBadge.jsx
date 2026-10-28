import { CalendarDaysIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

// Colores sobrios: ámbar para próximos, teal de la marca para hoy/en curso, gris para finalizados.
const STYLES = {
  upcoming: { className: "bg-amber-100 text-amber-800 ring-amber-200", icon: CalendarDaysIcon },
  today:    { className: "bg-brand-teal text-white ring-brand-teal-dark/30", icon: ClockIcon },
  ongoing:  { className: "bg-brand-teal text-white ring-brand-teal-dark/30", icon: ClockIcon },
  finished: { className: "bg-slate-200 text-slate-600 ring-slate-300", icon: CheckCircleIcon },
  archived: { className: "bg-slate-200 text-slate-600 ring-slate-300", icon: CheckCircleIcon },
};

export default function EventStatusBadge({ status, className = "" }) {
  if (!status) return null;
  const { className: color, icon: Icon } = STYLES[status.key];
  const label =
    status.key !== "upcoming" ? status.label
    : status.days === 1 ? "Próximo · mañana"
    : `Próximo · en ${status.days} días`;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ring-1 ${color} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
