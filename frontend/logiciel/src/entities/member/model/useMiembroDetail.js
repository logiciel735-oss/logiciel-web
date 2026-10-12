import { useEffect, useState } from "react";
import { getPublicUser } from "../../../features/adminUsers/api/adminUsersApi";
import { getProjects } from "../../project/api/projectApi";
import { getPublicaciones } from "../../publication/api/publicationApi";
import { getNoticias } from "../../news/api/newsApi";
import { mapNewsFromApi } from "../../news/model/newsMapper";

export const useMiembroDetail = (uid) => {
  const [member, setMember]               = useState(null);
  const [error, setError]                 = useState(null);
  const [activos, setActivos]             = useState([]);
  const [finalizados, setFinalizados]     = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [noticias, setNoticias]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const loadMember = async () => {
      try {
        setLoading(true);
        // ✅ ahora va directo a Firestore sin pasar por Django
        const found = await getPublicUser(uid);
        if (!found) { setError("Usuario no encontrado"); return; }
        setMember(found);
      } catch {
        setError("Error cargando usuario");
      } finally {
        setLoading(false);
      }
    };
    loadMember();
  }, [uid]);

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
    member, error, activos, finalizados,
    publicaciones, noticias, loading, loadingRelated,
  };
};