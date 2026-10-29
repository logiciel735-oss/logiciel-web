import { useParams } from "react-router-dom";
import { extractId } from "../../../shared/lib/slug";
import { useCMSData } from "../../../shared/lib/useCMSData";
import { getNoticia } from "../api/newsApi";
import { mapNewsFromApi } from "./newsMapper";

export const useNewsDetail = () => {
  // La ruta trae "titulo-en-texto-<uuid>" (o solo el uuid en enlaces viejos)
  const { id: param } = useParams();
  const id = extractId(param);

  const { data, loading, refresh } = useCMSData(
    `cms_news_${id}`,
    () => getNoticia(id)  // ← sin mapper aquí, igual que proyectos
  );

  // mapper aquí fuera, sobre el dato crudo siempre
  const item = data ? mapNewsFromApi(data) : null;

  return { item, loading, refresh, id };
};