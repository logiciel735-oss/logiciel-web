import { useState, useEffect } from "react";
import { cmsCache } from "../utils/cmsCache";
import { useAuth } from "../../features/auth/model/useAuth";

// Muestra al instante la copia guardada en el navegador (si hay) y SIEMPRE consulta
// la base de datos en segundo plano: así cualquier visitante ve los cambios al recargar.
export function useCMSData(key, fetcher) {
  const { logout } = useAuth();

  const [data, setData] = useState(() => cmsCache.load(key));
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const remote = await fetcher();
        if (!active) return;
        // Solo re-renderiza si algo cambió respecto a la copia guardada
        setData((prev) => (JSON.stringify(prev) === JSON.stringify(remote) ? prev : remote));
        cmsCache.save(key, remote);
      } catch (err) {
        if (err?.message?.includes("No autenticado")) {
          logout(); // 🔐 sesión inválida → cerrar sesión
        }
        console.error("Error cargando CMS:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

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
