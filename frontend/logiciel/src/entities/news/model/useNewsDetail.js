import { useParams } from "react-router-dom";
import { useCMSData } from "../../../shared/lib/useCMSData";
import { getNoticia } from "../api/newsApi";
import { mapNewsFromApi } from "./newsMapper";

export const useNewsDetail = () => {
  const { id } = useParams();

  const { data, loading, refresh } = useCMSData(
    `cms_news_${id}`,
    () => getNoticia(id)  // ← sin mapper aquí, igual que proyectos
  );

  // mapper aquí fuera, sobre el dato crudo siempre
  const item = data ? mapNewsFromApi(data) : null;

  return { item, loading, refresh, id };
};