import { useCMSData } from "../../../shared/lib/useCMSData";
import { getSemilleros } from "../api/semilleroApi";

export const useSemilleros = () => {
  const fetcher = async () => {
    return await getSemilleros();
  };

  const {
    data: semilleros,
    loading,
    refresh,
  } = useCMSData("semilleros", fetcher);

  return {
    semilleros: semilleros || [],
    loading,
    refresh,
  };
};