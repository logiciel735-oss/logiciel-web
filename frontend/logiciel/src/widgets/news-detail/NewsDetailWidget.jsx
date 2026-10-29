import { useAuth } from "../../features/auth/model/useAuth";
import { useNewsDetail } from "../../entities/news/model/useNewsDetail";
import NewsDetailView from "../../entities/news/ui/NewsDetailView";
import { puedeEditarContenido } from "../../features/auth/model/permissions";
import { buildDetailPath } from "../../shared/lib/slug";
import { useCanonicalPath } from "../../shared/lib/useCanonicalPath";

export default function NewsDetailWidget() {
  const { user } = useAuth();
  const isAdmin = puedeEditarContenido(user);

  const { item, loading, refresh, id } = useNewsDetail();
  // Solo con el registro de esta URL (al cambiar de noticia, item puede ser aún el anterior)
  useCanonicalPath(item?.id === id ? buildDetailPath("news", item.id, item.title) : null);

  return (
    <NewsDetailView
      item={item}
      loading={loading}
      refresh={refresh}
      isAdmin={isAdmin}
    />
  );
}