import FormField from "../../../shared/ui/FormField";
import { MODALIDADES } from "../model/eventDetails";

// Campos de hora, modalidad y enlaces del formulario de eventos (crear y editar).
export default function EventDetailsFields({ form, set, disabled = false }) {
  const modality = form.modality || "";
  const showMeeting = modality === "virtual" || modality === "hibrida";

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FormField label="Hora inicio" hint="Opcional. Hora de Colombia.">
        <input
          type="time"
          disabled={disabled}
          className="input-base"
          value={form.timeStart || ""}
          onChange={(e) => set("timeStart", e.target.value)}
        />
      </FormField>

      <FormField label="Hora fin" hint="Opcional.">
        <input
          type="time"
          disabled={disabled}
          className="input-base"
          value={form.timeEnd || ""}
          onChange={(e) => set("timeEnd", e.target.value)}
        />
      </FormField>

      <FormField label="Modalidad" className="sm:col-span-2">
        <select
          disabled={disabled}
          className="input-base"
          value={modality}
          onChange={(e) => set("modality", e.target.value)}
        >
          <option value="">Sin especificar</option>
          {Object.entries(MODALIDADES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Enlace de inscripción"
        hint="Opcional. Formulario de Google, Microsoft Forms, etc."
        className="sm:col-span-2"
      >
        <input
          type="url"
          inputMode="url"
          placeholder="https://"
          disabled={disabled}
          className="input-base"
          value={form.registrationUrl || ""}
          onChange={(e) => set("registrationUrl", e.target.value)}
        />
      </FormField>

      {(showMeeting || form.meetingUrl) && (
        <FormField
          label="Enlace de la transmisión"
          hint="Meet, Teams, Zoom o YouTube. Se muestra mientras el evento no haya terminado."
          className="sm:col-span-2"
        >
          <input
            type="url"
            inputMode="url"
            placeholder="https://"
            disabled={disabled}
            className="input-base"
            value={form.meetingUrl || ""}
            onChange={(e) => set("meetingUrl", e.target.value)}
          />
        </FormField>
      )}
    </div>
  );
}
