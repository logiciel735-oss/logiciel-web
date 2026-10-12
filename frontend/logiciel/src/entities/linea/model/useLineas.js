import { useCMSData } from "../../../shared/lib/useCMSData";
import { getLineas } from "../api/lineaApi";

export const useLineas = () => {
  const fetcher = async () => {
    return await getLineas();
  };

  const {
    data: lineas,
    loading,
    refresh,
  } = useCMSData("lineas_investigacion", fetcher);

  return {
    lineas: lineas || [],
    loading,
    refresh,
  };
};