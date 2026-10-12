import { useState } from "react";
import {
  AcademicCapIcon,
  BookOpenIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import RelatedItem from "./RelatedItem";

const InfoRow = ({ icon, label, children }) => {
  const Icon = icon;
  return (
    <div className="flex gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-teal-light text-brand-teal">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <div className="mt-0.5 break-words text-slate-700">{children}</div>
      </div>
    </div>
  );
};

export default function MemberProfileCard({
  member,
  noticias = [],
  loadingRelated = false,
}) {
  const [copiado, setCopiado] = useState(false);

  const copiarCvlac = () => {
    navigator.clipboard.writeText(member.cvlac_url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const tieneAcademico = member.universidad || member.carrera;
  const tieneContacto = member.email || member.cvlac_url;

  return (
    <div className="space-y-8">

      {/* PERFIL */}
      <div className="card grid gap-8 p-6 sm:p-8 md:grid-cols-2 hover:shadow-sm">
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-brand-navy">Información académica</h2>

          {member.universidad && (
            <InfoRow icon={AcademicCapIcon} label="Universidad">{member.universidad}</InfoRow>
          )}

          {member.carrera && (
            <InfoRow icon={BookOpenIcon} label="Carrera / Área">{member.carrera}</InfoRow>
          )}

          {!tieneAcademico && (
            <p className="text-sm text-slate-500">Sin información académica registrada.</p>
          )}

          {member.descripcion && (
            <p className="border-t border-slate-100 pt-5 leading-relaxed text-slate-600">
              {member.descripcion}
            </p>
          )}
        </div>

        <div className="space-y-5 md:border-l md:border-slate-100 md:pl-8">
          <h2 className="text-lg font-semibold text-brand-navy">Contacto</h2>

          {member.email && (
            <InfoRow icon={EnvelopeIcon} label="Correo">
              <a href={`mailto:${member.email}`} className="font-medium text-brand-teal hover:text-brand-teal-dark">
                {member.email}
              </a>
            </InfoRow>
          )}

          {member.cvlac_url && (
            <InfoRow icon={DocumentTextIcon} label="CvLAC">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={member.cvlac_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-brand-teal hover:text-brand-teal-dark"
                >
                  Ver hoja de vida
                </a>
                <button
                  onClick={copiarCvlac}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-0.5 text-xs text-slate-600 transition hover:border-brand-teal hover:text-brand-teal"
                >
                  {copiado ? <CheckIcon className="h-3.5 w-3.5" /> : <ClipboardDocumentIcon className="h-3.5 w-3.5" />}
                  {copiado ? "Copiado" : "Copiar enlace"}
                </button>
              </div>
            </InfoRow>
          )}

          {!tieneContacto && (
            <p className="text-sm text-slate-500">Sin datos de contacto públicos.</p>
          )}
        </div>
      </div>

      {/* NOTICIAS */}
      {!loadingRelated && noticias.length > 0 && (
        <div className="card p-6 sm:p-8 hover:shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-navy">
            <NewspaperIcon className="h-5 w-5 text-brand-teal" />
            Noticias relacionadas
          </h2>
          <div className="mt-5 space-y-3">
            {noticias.map((n) => (
              <RelatedItem
                key={n.id}
                to={`/news/${n.id}`}
                image={n.image || n.gallery?.[0]}
                title={n.title}
                subtitle={n.summary}
                date={n.date}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
