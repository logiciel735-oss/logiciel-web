import { useMemo } from "react";
import { useAuth } from "../features/auth/model/useAuth";
import { useProjects } from "../entities/project/model/useProjects";
import { useMiembros } from "../entities/member/model/useMiembros";
import ProjectCard from "../entities/project/ui/ProjectCard";
import Loader from "../shared/components/Loader";

export default function MyProjects() {
  const { user } = useAuth();
  const { miembros } = useMiembros();
  const { projects, loading } = useProjects();

  // Proyectos en los que el usuario figura como integrante
  const misProyectos = useMemo(
    () =>
      projects.filter((p) =>
        (p.integrantes || []).some(
          (i) => String(i.miembro_id).trim() === String(user?.id).trim()
        )
      ),
    [projects, user?.id]
  );

  const misActivos = misProyectos.filter((p) => p.estado === "activo");
  const misFinalizados = misProyectos.filter((p) => p.estado === "finalizado");

  const normalizeAutores = (integrantes = []) =>
    integrantes.map((i) => {
      const miembro = miembros.find(
        (m) => String(m.user_id) === String(i.miembro_id)
      );

      return {
        nombre: miembro?.name || i.nombre_externo || "Sin nombre",
      };
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-10 text-center">
        Mis Proyectos
      </h1>

      <Section
        title="Proyectos Activos"
        projects={misActivos}
        loading={loading}
        normalizeAutores={normalizeAutores}
      />

      <Section
        title="Proyectos Finalizados"
        projects={misFinalizados}
        loading={loading}
        normalizeAutores={normalizeAutores}
      />

    </div>
  );
}

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
