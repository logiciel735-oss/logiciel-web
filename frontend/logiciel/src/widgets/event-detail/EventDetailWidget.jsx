import { useAuth } from "../../features/auth/model/useAuth";
import { useEventDetail } from "../../entities/event/model/useEventDetail";
import EventDetailView from "../../entities/event/ui/EventDetailView";
import { puedeEditarContenido } from "../../features/auth/model/permissions";
import { buildDetailPath } from "../../shared/lib/slug";
import { useCanonicalPath } from "../../shared/lib/useCanonicalPath";

export default function EventDetailWidget() {
  const { user } = useAuth();
  const isAdmin = puedeEditarContenido(user);

  const { item, loading, refresh, id } = useEventDetail();
  // Solo con el registro de esta URL (al cambiar de noticia, item puede ser aún el anterior)
  useCanonicalPath(item?.id === id ? buildDetailPath("event", item.id, item.title) : null);

  return (
    <EventDetailView
      item={item}
      loading={loading}
      refresh={refresh}
      isAdmin={isAdmin}
    />
  );
}