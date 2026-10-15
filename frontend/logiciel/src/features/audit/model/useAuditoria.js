import { useEffect, useState } from "react";
import { getAuditoria } from "../api/auditApi";

const FILTROS_INICIALES = { tabla: "", accion: "", usuario: "" };

export const useAuditoria = () => {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      try {
        const result = await getAuditoria({ ...filtros, page });
        if (!active) return;
        setRows(result.rows);
        setTotal(result.total);
        setError(null);
      } catch (err) {
        console.error("Error cargando auditoría:", err);
        if (active) setError("No se pudo cargar la auditoría.");
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => { active = false; };
  }, [filtros, page, reloadKey]);

  // Cambiar un filtro vuelve a la primera página
  const aplicarFiltro = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
    setPage(0);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
    setPage(0);
  };

  return {
    rows,
    total,
    page,
    setPage,
    filtros,
    aplicarFiltro,
    limpiarFiltros,
    loading,
    error,
    refresh: () => setReloadKey((k) => k + 1),
  };
};
