import { useCallback, useEffect, useState } from "react";
import { getPublicUser } from "../../../features/adminUsers/api/adminUsersApi";
import { getMiembroByUserId } from "../api/miembroApi";
import { getProjects } from "../../project/api/projectApi";
import { getPublicaciones } from "../../publication/api/publicationApi";
import { getNoticias } from "../../news/api/newsApi";
import { mapNewsFromApi } from "../../news/model/newsMapper";

export const useMiembroDetail = (uid) => {
  const [member, setMember]               = useState(null);
  const [error, setError]                 = useState(null);
  const [notFound, setNotFound]           = useState(false);
  const [activos, setActivos]             = useState([]);
  const [finalizados, setFinalizados]     = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [noticias, setNoticias]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const loadMember = useCallback(async () => {
    if (!uid) return;

    try {
      setLoading(true);
      setError(null);
      setNotFound(false);

      // 1. El perfil solo existe si el usuario está en la tabla miembros
      const miembro = await getMiembroByUserId(uid);

      if (!miembro) {
        setMember(null);
        setNotFound(true);
        return;
      }

      // 2. Datos de perfil (foto, descripción, CvLAC...) desde users
      const user = await getPublicUser(uid).catch(() => null);

      setMember({
        ...user,
        id: uid,
        miembro_id: miembro.id,
        name: user?.name || miembro.name,
        role: miembro.role,                       // rol en el grupo, no el de la plataforma
        avatar: user?.avatar || miembro.image,
      });
    } catch (err) {
      console.error("Error cargando miembro:", err);
      setMember(null);
      setError("No se pudo cargar el perfil del miembro. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadMember();
  }, [loadMember]);

  useEffect(() => {
    if (!member) return;

    const loadRelated = async () => {
      try {
        setLoadingRelated(true);

        const [proyectos, pubs, newsRaw] = await Promise.all([
          getProjects(),
          getPublicaciones(),
          getNoticias(),
        ]);

        const memberId = member.id;

        setActivos(
          (proyectos || []).filter(
            (p) =>
              p.estado === "activo" &&
              Array.isArray(p.integrantes) &&
              p.integrantes.some(
                (i) => i.miembro_id === memberId || i.uid === memberId
              )
          )
        );

        setFinalizados(
          (proyectos || []).filter(
            (p) =>
              p.estado === "finalizado" &&
              Array.isArray(p.integrantes) &&
              p.integrantes.some(
                (i) => i.miembro_id === memberId || i.uid === memberId
              )
          )
        );

        setPublicaciones(
          (pubs || []).filter((p) =>
            (Array.isArray(p.autores) ? p.autores : []).some(
              (a) => a.miembro_id === memberId || a.uid === memberId
            )
          )
        );

        const noticiasFiltered = (newsRaw || []).filter((n) =>
          (Array.isArray(n.autores) ? n.autores : []).some(
            (a) => a.miembro_id === memberId
          )
        );
        setNoticias(noticiasFiltered.map(mapNewsFromApi));

      } catch (e) {
        console.error("Error cargando relaciones:", e);
      } finally {
        setLoadingRelated(false);
      }
    };

    loadRelated();
  }, [member]);

  return {
    member, error, notFound, activos, finalizados,
    publicaciones, noticias, loading, loadingRelated,
    refresh: loadMember,
  };
};