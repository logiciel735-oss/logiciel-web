import { useAuth } from "../features/auth/model/useAuth";
import { useProjects } from "../entities/project/model/useProjects";
import ProjectCard from "../entities/project/ui/ProjectCard";
import Loader from "../shared/components/Loader";
import { getMiembros } from "../entities/member/api/miembroApi";
import { useState, useEffect } from "react";

export default function MyProjects() {

  const { user } = useAuth();

  const [miembros, setMiembros] = useState([]);

  useEffect(() => {
    getMiembros().then(setMiembros).catch(() => { });
  }, []);

  const {
    projects: activos,
    loading: loadingActivos,
    refresh: refreshActivos
  } = useProjects("activo");

  const {
    projects: finalizados,
    loading: loadingFinalizados,
    refresh: refreshFinalizados
  } = useProjects("finalizado");
  console.log("USER:", user);
  useEffect(() => {
    if (user) {
      refreshActivos();
      refreshFinalizados();
    }
  }, [user]);

  /* filtro  */
  const filtrarMisProyectos = (projects = []) => {
    return projects.filter((p) =>
      (p.integrantes || []).some((i) => {

        return (
          String(i.miembro_id).trim() ===
          String(user?.id).trim()
        );
      })
    );
  };

  const misActivos = filtrarMisProyectos(activos);
  const misFinalizados = filtrarMisProyectos(finalizados);


  /* 🧠 normalizador (igual que ya usas) */
  const normalizeAutores = (integrantes = []) => {
    return integrantes.map((i) => {
      const miembro = miembros.find(
        (m) => String(m.user_id) === String(i.miembro_id)
      );

      return {
        nombre:
          miembro?.name ||
          i.nombre_externo ||
          "Sin nombre",
      };
    });
  };
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-10 text-center">
        Mis Proyectos
      </h1>

      {/* ───── ACTIVOS ───── */}
      <Section
        title="Proyectos Activos"
        projects={misActivos}
        loading={loadingActivos}
        normalizeAutores={normalizeAutores}
      />

      {/* ───── FINALIZADOS ───── */}
      <Section
        title="Proyectos Finalizados"
        projects={misFinalizados}
        loading={loadingFinalizados}
        normalizeAutores={normalizeAutores}
      />

    </div>
  );
}

/* ───────────────────────────── */

function Section({ title, projects, loading, normalizeAutores }) {

  return (
    <div className="mb-12">

      <h2 className="text-2xl font-bold mb-6 text-[#0a192f]">
        {title}
      </h2>

      {loading && <Loader text="Cargando proyectos..." />}

      {!loading && projects.length === 0 && (
        <p className="text-gray-500">
          No tienes proyectos
        </p>
      )}

      {!loading && projects.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              baseUrl="/projects"
              isAdmin={false}
              normalizeAutores={normalizeAutores}
            />
          ))}

        </div>
      )}

    </div>
  );
}