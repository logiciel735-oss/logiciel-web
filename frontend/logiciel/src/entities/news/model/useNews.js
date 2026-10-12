import { useCMSData } from "../../../shared/lib/useCMSData";
import { getNoticias } from "../api/newsApi";
import { mapNewsFromApi } from "./newsMapper";

export function useNews() {
  const { data, loading, refresh } = useCMSData(
    "cms_noticias",
    getNoticias
  );

  const noticias = Array.isArray(data)
    ? data.map(mapNewsFromApi)
    : [];

  return { noticias, loading, refresh };
}