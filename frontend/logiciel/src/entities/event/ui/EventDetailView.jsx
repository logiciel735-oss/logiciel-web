import CMSDetailView from "../../../shared/ui/CMSDetailView";
import { updateEvento } from "../../../features/manage-events/api/adminEventApi";
import { validateDateRange } from "../../../shared/lib/validators";
import { formatDateInput } from "../../../shared/utils/formatDateInput";

export default function EventDetailView({ item, loading, refresh, isAdmin }) {
  return (
    <CMSDetailView
      item={item}
      loading={loading}
      refresh={refresh}
      isAdmin={isAdmin}
      backPath="/news"
      backLabel="Volver a eventos"
      notFoundLabel="Evento no encontrado"
      loaderLabel="Cargando evento..."
      editTitle="Editar Evento"
      extraFields={[
        { label: "Fecha inicio", value: item?.date },
        { label: "Fecha fin", value: item?.dateEnd },
        { label: "Ubicación", value: item?.location },
      ]}
      toApiPayload={(form) => ({
        titulo: form.title || "",
        resumen: form.summary || "",
        descripcion: form.description || "",

        fecha_inicio: form.date
          ? new Date(form.date).toISOString()
          : null,

        fecha_fin: form.dateEnd
          ? new Date(form.dateEnd).toISOString()
          : null,

        ubicacion: form.location || "",

        image: form.image || "",

        gallery: Array.isArray(form.gallery)
          ? form.gallery
          : [],
      })}
      validate={(form) =>
        validateDateRange(formatDateInput(form.date), formatDateInput(form.dateEnd))
      }
      onUpdate={updateEvento}
    />
  );
}