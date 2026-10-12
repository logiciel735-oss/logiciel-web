import { useCMSData } from "../../../shared/lib/useCMSData";
import { getMiembros } from "../api/miembroApi";

export const useMiembros = () => {
  const fetcher = async () => {
    return await getMiembros();
  };

  const {
    data: miembros,
    loading,
    refresh,
  } = useCMSData("miembros", fetcher);

  return {
    miembros: miembros || [],
    loading,
    refresh,
  };
};