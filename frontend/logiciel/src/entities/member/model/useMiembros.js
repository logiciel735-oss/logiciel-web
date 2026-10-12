import { useState } from "react";
import { useCMSData } from "../../../shared/lib/useCMSData";
import { getMiembros } from "../api/miembroApi";

export const useMiembros = () => {
  const [error, setError] = useState(null);

  const fetcher = async () => {
    try {
      const data = await getMiembros();
      setError(null);
      return data;
    } catch (err) {
      setError("No se pudieron cargar los miembros.");
      throw err;
    }
  };

  const {
    data: miembros,
    loading,
    refresh,
  } = useCMSData("miembros", fetcher);

  return {
    miembros: miembros || [],
    loading,
    error,
    refresh,
  };
};
