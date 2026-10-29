import { useParams } from "react-router-dom";
import { extractId } from "../../../shared/lib/slug";
import { useCMSData } from "../../../shared/lib/useCMSData";
import { getEvento } from "../api/eventApi";
import { mapEventFromApi } from "./eventMapper";

export const useEventDetail = () => {
  // La ruta trae "titulo-en-texto-<uuid>" (o solo el uuid en enlaces viejos)
  const { id: param } = useParams();
  const id = extractId(param);

  const { data, loading, refresh } = useCMSData(
    id ? `cms_event_${id}` : null,
    id ? () => getEvento(id) : null
  );

  const item = data ? mapEventFromApi(data) : null;

  return { item, loading, refresh, id };
};