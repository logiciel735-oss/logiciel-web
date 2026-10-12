import { useCMSData } from "../../../shared/lib/useCMSData";
import { getEventos } from "../api/eventApi";

import { mapEventFromApi } from "./eventMapper";


export function useEvents() {
  const { data, loading, refresh } = useCMSData(
    "eventos",
    getEventos
  );

  const eventos = Array.isArray(data)
    ? data.map(mapEventFromApi)
    : [];

  return {
    eventos,
    loading,
    refresh,
  };
}