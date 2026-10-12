
import { useState, useEffect } from "react";
import { cmsCache } from "../utils/cmsCache";
import { useAuth } from "../../features/auth/model/useAuth";

export function useCMSData(key, fetcher) {
  const { logout } = useAuth();

  const [data, setData] = useState(() => cmsCache.load(key));
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    const load = async () => {
      try {
        const remote = await fetcher();
        setData(remote);
        cmsCache.save(key, remote);
      } catch (err) {
        if (err?.message?.includes("No autenticado")) {
          logout(); // 🔐 sesión inválida → cerrar sesión
        }
        console.error("Error cargando CMS:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!data) load();
  }, []);

  const refresh = async () => {
    try {
      cmsCache.invalidate(key);
      const fresh = await fetcher();
      cmsCache.save(key, fresh);
      setData(fresh);
    } catch (err) {
      if (err?.message?.includes("No autenticado")) {
        logout();
      }
      console.error("Error refrescando CMS:", err);
    }
  };

  return { data, loading, refresh };
}