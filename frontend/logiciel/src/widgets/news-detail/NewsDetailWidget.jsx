import { useAuth } from "../../features/auth/model/useAuth";
import { useNewsDetail } from "../../entities/news/model/useNewsDetail";
import NewsDetailView from "../../entities/news/ui/NewsDetailView";

export default function NewsDetailWidget() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

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