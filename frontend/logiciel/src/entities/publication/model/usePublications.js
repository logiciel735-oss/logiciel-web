import { useCMSData } from "../../../shared/lib/useCMSData";
import { getPublicaciones } from "../api/publicationApi";
import { useMiembros } from "../../member/model/useMiembros";  
import { useLocation } from "react-router-dom";
import { useState, useMemo } from "react"; 
export function usePublications() {

  const location = useLocation();
  const filterByUser = location.state?.filterByUser || "";

 
  const { miembros, loading: loadingMiembros } = useMiembros();

  const { data, loading: loadingPublicaciones, refresh } = useCMSData(
    "publicaciones_cientificas",
    async () => {
      const raw = await getPublicaciones();
      if (!Array.isArray(raw)) return [];
      return raw.map((p) => ({
        ...p,
        revista: p.id_revista,
        anio: p.año,
        pdf_url: p.enlace_pdf,
        autores: Array.isArray(p.autores) ? p.autores : [],
      }));
    }
  );

  const publicaciones = Array.isArray(data) ? data : [];

  const [searchTerm, setSearchTerm] = useState(filterByUser);

  const normalizeAutores = (autores = []) => {
    if (!Array.isArray(autores)) return [];
    return autores.map((a) => {
      const miembro = miembros.find(
        (m) => String(m.user_id) === String(a.miembro_id)
      );
      return {
        nombre: a.nombre_externo || miembro?.name || "Sin nombre",
        miembro_id: a.miembro_id || "",
      };
    });
  };

  const publicacionesFiltradas = useMemo(() => {
    if (!searchTerm) return publicaciones;
    const term = searchTerm.toLowerCase();
    return publicaciones.filter((p) => {
      const autores = normalizeAutores(p.autores)
        .map((a) => a.nombre)
        .join(" ")
        .toLowerCase();
      return (
        p.titulo?.toLowerCase().includes(term) ||
        autores.includes(term) ||
        p.revista?.toLowerCase().includes(term) ||
        p.anio?.toString().includes(term)
      );
    });
  }, [publicaciones, searchTerm, miembros]);


  const loading = loadingPublicaciones || loadingMiembros;

  return {
    publicacionesFiltradas,
    loading,
    refresh,
    searchTerm,
    setSearchTerm,
    normalizeAutores,
  };
}