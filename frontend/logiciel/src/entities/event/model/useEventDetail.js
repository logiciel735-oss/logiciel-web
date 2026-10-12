import { useParams } from "react-router-dom";
import { useCMSData } from "../../../shared/lib/useCMSData";
import { getEvento } from "../api/eventApi";
import { mapEventFromApi } from "./eventMapper";

export const useEventDetail = () => {
  const { id } = useParams();

  const { data, loading, refresh } = useCMSData(
    id ? `cms_event_${id}` : null,
    id ? () => getEvento(id) : null
  );

  const item = data ? mapEventFromApi(data) : null;

  return { item, loading, refresh, id };
};