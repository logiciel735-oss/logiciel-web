import { useCMSData } from "../../../shared/lib/useCMSData";
import  {getAliadosInstitucionales } from "../api/aliadosInstitucionales";
export const useAliadoInstitucionales = () => {

  const fetcher = async () => {
    return await getAliadosInstitucionales();
  };

  const {
    data: aliadosInstitucionales,
    loading,
    refresh,
  } = useCMSData("aliados_institucionales", fetcher);

  return {
    aliadosInstitucionales: aliadosInstitucionales || [],
    loading,
    refresh,
  };
};