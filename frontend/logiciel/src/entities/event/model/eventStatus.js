import { toCalendarDate } from "../../../shared/utils/formatDateInput";
import { formatTime } from "./eventDetails";

// Días que un evento terminado sigue visible (como "Finalizado") antes de pasar a "Eventos pasados".
export const GRACE_DAYS = 2;

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Diferencia en días de calendario (Math.round absorbe el cambio de horario de verano)
const diffDays = (a, b) => Math.round((a - b) / DAY_MS);

// "15:30" → minutos desde medianoche (null si no hay hora)
const toMinutes = (time) => {
  const match = /^(\d{2}):(\d{2})/.exec(time || "");
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
};

/**
 * Estado de un evento según sus fechas y horas (se calcula al mostrarlo, sin tocar la BD):
 *   upcoming  → todavía no empieza        ("Mañana" / "En N días")
 *   today     → es hoy y no ha empezado (o no tiene hora) ("Hoy" / "Hoy · 3:00 p. m.")
 *   ongoing   → ya empezó y no ha terminado ("En curso")
 *   finished  → terminó hace GRACE_DAYS días o menos ("Finalizado")
 *   archived  → terminó hace más tiempo (va a "Eventos pasados")
 * Sin fecha de fin se toma la de inicio; la hora de fin aplica al último día.
 * Sin fecha de inicio devuelve null.
 */
export function getEventStatus(date, dateEnd, timeStart, timeEnd) {
  const start = toCalendarDate(date);
  if (!start) return null;

  const end = toCalendarDate(dateEnd) || start;
  const today = startOfToday();
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = toMinutes(timeStart);
  const endMinutes = toMinutes(timeEnd);

  const untilStart = diffDays(start, today);
  if (untilStart > 0) {
    return {
      key: "upcoming",
      label: untilStart === 1 ? "Mañana" : `En ${untilStart} días`,
      days: untilStart,
    };
  }

  const sinceEnd = diffDays(today, end);

  // Último día y ya pasó la hora de fin
  if (sinceEnd === 0 && endMinutes !== null && nowMinutes >= endMinutes) {
    return { key: "finished", label: "Finalizado", days: 0 };
  }

  if (sinceEnd <= 0) {
    if (untilStart < 0) return { key: "ongoing", label: "En curso", days: 0 };
    // Primer día
    if (startMinutes === null) return { key: "today", label: "Hoy", days: 0 };
    if (nowMinutes < startMinutes) {
      return { key: "today", label: `Hoy · ${formatTime(timeStart)}`, days: 0 };
    }
    return { key: "ongoing", label: "En curso", days: 0 };
  }

  return {
    key: sinceEnd <= GRACE_DAYS ? "finished" : "archived",
    label: "Finalizado",
    days: sinceEnd,
  };
}

export const isArchived = (status) => status?.key === "archived";

// En curso y hoy primero; luego próximos (el más cercano primero); luego finalizados recientes.
const RANK = { ongoing: 0, today: 0, upcoming: 1, finished: 2, archived: 3 };

/**
 * Separa eventos en activos (ordenados para mostrar) y pasados (el más reciente primero).
 * getDates(item) → [fechaInicio, fechaFin, horaInicio, horaFin]. Devuelve los items con `status`.
 */
export function splitEvents(items, getDates) {
  const withStatus = items.map((item) => ({ item, status: getEventStatus(...getDates(item)) }));
  const time = ({ item }) => {
    const [date, , timeStart] = getDates(item);
    const day = toCalendarDate(date)?.getTime() ?? 0;
    return day + (toMinutes(timeStart) ?? 0) * 60 * 1000;
  };

  const activos = withStatus
    .filter(({ status }) => !isArchived(status))
    .sort((a, b) => {
      const rank = (RANK[a.status?.key] ?? 4) - (RANK[b.status?.key] ?? 4);
      if (rank) return rank;
      // Finalizados y sin fecha: el más reciente primero; el resto, el más cercano primero
      return a.status?.key === "finished" || !a.status ? time(b) - time(a) : time(a) - time(b);
    });

  const pasados = withStatus.filter(({ status }) => isArchived(status)).sort((a, b) => time(b) - time(a));

  return { activos, pasados };
}

/* ── Agregar al calendario ──
 * Sin hora: evento de día completo (fin exclusivo: se suma un día).
 * Con hora: hora de Colombia (UTC-5 todo el año, sin horario de verano).
 * Sin hora de fin se asumen 2 horas de duración.
 */
const COLOMBIA_UTC_OFFSET_H = 5;
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

const calendarRange = ({ date, dateEnd, timeStart, timeEnd }) => {
  const start = toCalendarDate(date);
  if (!start) return null;
  const end = toCalendarDate(dateEnd) || start;

  const startMinutes = toMinutes(timeStart);
  if (startMinutes === null) {
    const endExclusive = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);
    return { allDay: true, start: ymd(start), end: ymd(endExclusive) };
  }

  // Instantes en UTC a partir de la hora de Colombia
  const utc = (day, minutes) =>
    new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), COLOMBIA_UTC_OFFSET_H, minutes));
  const startUtc = utc(start, startMinutes);
  const endMinutes = toMinutes(timeEnd);
  const endUtc = endMinutes !== null ? utc(end, endMinutes) : utc(end, startMinutes + 120);

  const stamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return { allDay: false, start: stamp(startUtc), end: stamp(endUtc) };
};

const eventDescription = (item) =>
  [item.summary, item.meetingUrl && `Transmisión: ${item.meetingUrl}`, window.location.href]
    .filter(Boolean)
    .join("\n\n");

export function googleCalendarUrl(item) {
  const range = calendarRange(item);
  if (!range) return null;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: item.title || "Evento LOGICIEL",
    dates: `${range.start}/${range.end}`,
    details: eventDescription(item),
    location: item.location || item.meetingUrl || "",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// Archivo .ics (Outlook, Apple Calendar y otros)
export function icsFileUrl(item) {
  const range = calendarRange(item);
  if (!range) return null;
  const escape = (text = "") => text.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\r?\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const when = range.allDay
    ? [`DTSTART;VALUE=DATE:${range.start}`, `DTEND;VALUE=DATE:${range.end}`]
    : [`DTSTART:${range.start}`, `DTEND:${range.end}`];
  const location = item.location || item.meetingUrl;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LOGICIEL//Eventos//ES",
    "BEGIN:VEVENT",
    `UID:evento-${item.id}@logiciel`,
    `DTSTAMP:${stamp}`,
    ...when,
    `SUMMARY:${escape(item.title || "Evento LOGICIEL")}`,
    `DESCRIPTION:${escape(eventDescription(item))}`,
    location ? `LOCATION:${escape(location)}` : null,
    item.meetingUrl ? `URL:${item.meetingUrl}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
