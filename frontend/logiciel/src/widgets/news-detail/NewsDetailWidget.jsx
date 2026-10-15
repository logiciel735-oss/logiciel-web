import { useAuth } from "../../features/auth/model/useAuth";
import { useNewsDetail } from "../../entities/news/model/useNewsDetail";
import NewsDetailView from "../../entities/news/ui/NewsDetailView";
import { puedeEditarContenido } from "../../features/auth/model/permissions";

export default function NewsDetailWidget() {
  const { user } = useAuth();
  const isAdmin = puedeEditarContenido(user);

  const { item, loading, refresh } = useNewsDetail();

  return (
    <NewsDetailView
      item={item}
      loading={loading}
      refresh={refresh}
      isAdmin={isAdmin}
    />
  );
}