import {
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import EventStatusBadge from "./EventStatusBadge";
import { getEventStatus, googleCalendarUrl, icsFileUrl } from "../model/eventStatus";

// Tarjeta lateral del detalle: estado del evento, inscripción, transmisión y agregar al calendario.
export default function EventStatusPanel({ item }) {
  const status = getEventStatus(item?.date, item?.dateEnd, item?.timeStart, item?.timeEnd);
  if (!status) return null;

  const terminado = status.key === "finished" || status.key === "archived";
  const enCurso = status.key === "today" || status.key === "ongoing";

  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Estado</h2>
      <EventStatusBadge status={status} className="mt-3" />

      {terminado ? (
        <p className="mt-3 text-sm text-slate-500">Este evento ya se realizó.</p>
      ) : (
        <div className="mt-4 space-y-2">
          {/* La transmisión va primero el mismo día; la inscripción, antes del evento */}
          {item.meetingUrl && (
            <a
              href={item.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${enCurso ? "btn-primary" : "btn-secondary"} w-full py-2 text-sm`}
            >
              <VideoCameraIcon className="h-4 w-4" />
              {enCurso ? "Unirse a la transmisión" : "Enlace de la transmisión"}
            </a>
          )}

          {item.registrationUrl && (
            <a
              href={item.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${!enCurso || !item.meetingUrl ? "btn-primary" : "btn-secondary"} w-full py-2 text-sm`}
            >
              <ClipboardDocumentCheckIcon className="h-4 w-4" />
              Inscribirse
            </a>
          )}

          <a
            href={googleCalendarUrl(item)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full py-2 text-sm"
          >
            <CalendarDaysIcon className="h-4 w-4" />
            Agregar a Google Calendar
          </a>
          <a
            href={icsFileUrl(item)}
            download={`evento-${item.id}.ics`}
            className="btn-secondary w-full py-2 text-sm"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Descargar para Outlook / Apple
          </a>
        </div>
      )}
    </div>
  );
}
