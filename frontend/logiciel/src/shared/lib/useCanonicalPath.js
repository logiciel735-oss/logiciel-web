import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Si la URL no coincide con el enlace actual del registro (enlace viejo con solo el id
// o con un título anterior), la corrige en la barra de direcciones sin recargar.
export function useCanonicalPath(path) {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (path && decodeURIComponent(pathname) !== path) {
      navigate(`${path}${search}${hash}`, { replace: true });
    }
  }, [path, pathname, search, hash, navigate]);
}
