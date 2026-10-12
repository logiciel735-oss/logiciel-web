import { useEffect, useState } from "react";
import Loader from "../../../shared/components/Loader";
import MemberProfileCard from "./MemberProfileCard";
import { Link } from "react-router-dom";

import PublicationCard from "../../publication/ui/PublicationCard";
import { getMiembros } from "../../member/api/miembroApi";

export default function MemberDetailView({
  member,
  activos,
  finalizados,
  publicaciones,
  noticias,
  loading,
  loadingRelated,
  isAdmin,
  onEdit,
  onDeleteClick,
}) {
  const [miembros, setMiembros] = useState([]);

  useEffect(() => {
    getMiembros()
      .then((data) => setMiembros(Array.isArray(data) ? data : []))
      .catch(() => setMiembros([]));
  }, []);

  if (loading) return <Loader text="Cargando perfil..." />;

  if (!member)
    return (
      <div className="py-20 text-center text-gray-500">
        Miembro no encontrado
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="relative h-[40vh] bg-[rgba(10,25,47,1)] flex flex-col items-center justify-center text-white">
        <div className="relative z-10 flex flex-col items-center gap-3">

          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-teal-600 border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {member.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <h1 className="text-3xl font-bold">{member.name}</h1>
          {member.role && (
            <span className="px-4 py-1 bg-teal-500 text-white text-sm font-semibold rounded-full">
              {member.role}
            </span>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* PERFIL */}
        <MemberProfileCard
          member={member}
          noticias={noticias}
          loadingRelated={loadingRelated}
        />

        {/* PROYECTOS ACTIVOS */}
        {!loadingRelated && activos.length > 0 && (
          <Section title="Proyectos Activos">
            {activos.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </Section>
        )}

        {/* PROYECTOS FINALIZADOS */}
        {!loadingRelated && finalizados.length > 0 && (
          <Section title="Proyectos Finalizados">
            {finalizados.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </Section>
        )}

        {/* PUBLICACIONES */}
        {!loadingRelated && publicaciones.length > 0 && (
          <Section title="Publicaciones Científicas">
            {publicaciones.map((p) => {
              const pub = {
                ...p,
                revista: p.id_revista,
                anio: p.año,
                pdf_url: p.enlace_pdf,
              };

              return (
                <PublicationCard
                  key={p.id}
                  publication={pub}
                  isAdmin={false}
                  normalizeAutores={(autores = []) => {
                    const listaMiembros = Array.isArray(miembros) ? miembros : [];
                    return autores.map((a) => {
                      const miembro = listaMiembros.find(
                        (m) => String(m.user_id) === String(a.miembro_id)
                      );
                      return {
                        nombre:
                          a.nombre_externo ||
                          miembro?.name ||
                          "Sin nombre",
                        miembro_id: a.miembro_id || "",
                      };
                    });
                  }}
                />
              );
            })}
          </Section>
        )}

        {loadingRelated && (
          <p className="text-center text-gray-400 text-sm">
            Cargando información relacionada...
          </p>
        )}
      </div>
    </div>
  );
}

/* ── helpers de sección ── */
function Section({ title, children }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-8">
      <h3 className="text-xl font-bold text-gray-800 mb-5">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.estado}/${project.id}`}
      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-teal-50 hover:border-teal-200 transition group"
    >
      {project.gallery?.[0] && (
        <img
          src={project.gallery[0]}
          alt={project.titulo}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 group-hover:text-teal-700 transition truncate">
          {project.titulo}
        </p>
        {project.descripcion && (
          <p className="text-sm text-gray-500 truncate mt-1">
            {project.descripcion}
          </p>
        )}
      </div>
      <span className="text-teal-500 text-sm font-medium flex-shrink-0 group-hover:translate-x-1 transition-transform">
        Ver →
      </span>
    </Link>
  );
}