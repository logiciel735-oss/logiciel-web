import { useEffect, useState } from "react";
import { getPublicUser } from "../../../features/adminUsers/api/adminUsersApi";
import { getMiembroByUserId } from "../api/miembroApi";
import { getProjects } from "../../project/api/projectApi";
import { getPublicaciones } from "../../publication/api/publicationApi";
import { getNoticias } from "../../news/api/newsApi";
import { mapNewsFromApi } from "../../news/model/newsMapper";

// Perfil de un miembro: null si el usuario no está en la tabla miembros
const cargarMiembro = async (uid) => {
  const miembro = await getMiembroByUserId(uid);
  if (!miembro) return null;

  // Datos de perfil (foto, descripción, CvLAC...) desde users
  const user = await getPublicUser(uid).catch(() => null);

  return {
    ...user,
    id: uid,
    miembro_id: miembro.id,
    name: user?.name || miembro.name,
    role: miembro.role,                       // rol en el grupo, no el de la plataforma
    avatar: user?.avatar || miembro.image,
  };
};

const participa = (lista, memberId) =>
  (Array.isArray(lista) ? lista : []).some(
    (x) => x.miembro_id === memberId || x.uid === memberId
  );

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
  const [reloadKey, setReloadKey]         = useState(0);

  useEffect(() => {
    if (!uid) return;
    let active = true;

    const run = async () => {
      try {
        const data = await cargarMiembro(uid);
        if (!active) return;
        setMember(data);
        setNotFound(!data);
        setError(null);
      } catch (err) {
        if (!active) return;
        console.error("Error cargando miembro:", err);
        setMember(null);
        setError("No se pudo cargar el perfil del miembro. Revisa tu conexión e inténtalo de nuevo.");
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => { active = false; };
  }, [uid, reloadKey]);

  // Proyectos, publicaciones y noticias en las que participa el miembro
  const memberId = member?.id;

  useEffect(() => {
    if (!memberId) return;
    let active = true;

    const run = async () => {
      try {
        const [proyectos, pubs, newsRaw] = await Promise.all([
          getProjects(),
          getPublicaciones(),
          getNoticias(),
        ]);
        if (!active) return;

        const misProyectos = (proyectos || []).filter((p) => participa(p.integrantes, memberId));

        setActivos(misProyectos.filter((p) => p.estado === "activo"));
        setFinalizados(misProyectos.filter((p) => p.estado === "finalizado"));
        setPublicaciones((pubs || []).filter((p) => participa(p.autores, memberId)));
        setNoticias(
          (newsRaw || [])
            .filter((n) => participa(n.autores, memberId))
            .map(mapNewsFromApi)
        );
      } catch (err) {
        console.error("Error cargando relaciones:", err);
      } finally {
        if (active) setLoadingRelated(false);
      }
    };

    run();
    return () => { active = false; };
  }, [memberId]);

  const refresh = () => {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  };

  return {
    member, error, notFound, activos, finalizados,
    publicaciones, noticias, loading, loadingRelated,
    refresh,
  };
};
