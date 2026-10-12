import { Link } from "react-router-dom";
import { ArrowLeftIcon, BeakerIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Loader from "../../../shared/components/Loader";
import SanJose from "../../../shared/assets/images/san_jose.webp";
import MemberProfileCard from "./MemberProfileCard";
import RelatedItem from "./RelatedItem";

import PublicationCard from "../../publication/ui/PublicationCard";
import { useMiembros } from "../model/useMiembros";
import { optimizeImage } from "../../../shared/lib/image";

export default function MemberDetailView({
  member,
  activos,
  finalizados,
  publicaciones,
  noticias,
  loading,
  loadingRelated,
}) {
  const { miembros } = useMiembros();

  if (loading) return <div className="relative min-h-[60vh]"><Loader text="Cargando perfil..." /></div>;

  if (!member)
    return (
      <div className="py-24 text-center text-slate-500">
        Miembro no encontrado
      </div>
    );

  const normalizeAutores = (autores = []) => {
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
  };

  return (
    <div className="min-h-screen">

      {/* ENCABEZADO */}
      <section className="relative overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${SanJose})` }}
        />
        <div className="absolute inset-0 bg-brand-navy/90" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <Link
            to="/about"
            className="inline-flex items-center gap-1 text-sm font-medium text-teal-200 transition hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Miembros del grupo
          </Link>

          <div className="mt-6 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            {member.avatar ? (
              <img
                src={optimizeImage(member.avatar, 300)}
                alt={member.name}
                className="h-28 w-28 shrink-0 rounded-full border-4 border-white/90 object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-white/90 bg-brand-teal shadow-lg">
                <span className="text-4xl font-semibold text-white">
                  {member.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold tracking-tight">{member.name}</h1>
              {member.role && (
                <span className="mt-3 inline-block rounded-full bg-brand-teal px-3 py-1 text-sm font-semibold capitalize text-white">
                  {member.role}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6">

        <MemberProfileCard
          member={member}
          noticias={noticias}
          loadingRelated={loadingRelated}
        />

        {!loadingRelated && activos.length > 0 && (
          <Section icon={BeakerIcon} title="Proyectos activos">
            {activos.map((p) => <ProjectItem key={p.id} project={p} />)}
          </Section>
        )}

        {!loadingRelated && finalizados.length > 0 && (
          <Section icon={BeakerIcon} title="Proyectos finalizados">
            {finalizados.map((p) => <ProjectItem key={p.id} project={p} />)}
          </Section>
        )}

        {!loadingRelated && publicaciones.length > 0 && (
          <Section icon={DocumentTextIcon} title="Publicaciones científicas" grid>
            {publicaciones.map((p) => (
              <PublicationCard
                key={p.id}
                publication={{
                  ...p,
                  revista: p.id_revista,
                  anio: p.año,
                  pdf_url: p.enlace_pdf,
                }}
                isAdmin={false}
                normalizeAutores={normalizeAutores}
              />
            ))}
          </Section>
        )}

        {loadingRelated && (
          <p className="text-center text-sm text-slate-400">
            Cargando información relacionada...
          </p>
        )}
      </div>
    </div>
  );
}

function Section({ icon, title, grid = false, children }) {
  const Icon = icon;
  return (
    <section className="card p-6 sm:p-8 hover:shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-navy">
        <Icon className="h-5 w-5 text-brand-teal" />
        {title}
      </h2>
      <div className={`mt-5 ${grid ? "grid gap-4 sm:grid-cols-2" : "space-y-3"}`}>{children}</div>
    </section>
  );
}

function ProjectItem({ project }) {
  return (
    <RelatedItem
      to={`/projects/${project.estado}/${project.id}`}
      image={project.image || project.gallery?.[0]}
      title={project.titulo}
      subtitle={project.min_descripcion || project.descripcion}
    />
  );
}
