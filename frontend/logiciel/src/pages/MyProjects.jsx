import { useMemo } from "react";
import { useAuth } from "../features/auth/model/useAuth";
import { useProjects } from "../entities/project/model/useProjects";
import { useMiembros } from "../entities/member/model/useMiembros";
import ProjectCard from "../entities/project/ui/ProjectCard";
import Loader from "../shared/components/Loader";
import PageHeader from "../shared/ui/PageHeader";
import SectionHeader from "../shared/ui/SectionHeader";

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
    <div>
      <PageHeader
        eyebrow="Mi cuenta"
        title="Mis proyectos"
        description="Proyectos de investigación en los que participas como integrante."
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">

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
    </div>
  );
}

function Section({ title, projects, loading, normalizeAutores }) {
  return (
    <section className="mb-14">
      <SectionHeader title={title} />

      {loading && <div className="relative min-h-[200px]"><Loader text="Cargando proyectos..." /></div>}

      {!loading && projects.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-500">
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
    </section>
  );
}
