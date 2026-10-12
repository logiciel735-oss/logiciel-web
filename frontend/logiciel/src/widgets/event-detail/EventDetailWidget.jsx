import { useAuth } from "../../features/auth/model/useAuth";
import { useEventDetail } from "../../entities/event/model/useEventDetail";
import EventDetailView from "../../entities/event/ui/EventDetailView";

export default function EventDetailWidget() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { item, loading, refresh } = useEventDetail();

  return (
    <EventDetailView
      item={item}
      loading={loading}
      refresh={refresh}
      isAdmin={isAdmin}
    />
  );
}