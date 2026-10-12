import LineasWidget from "../widgets/lineas/LineasWidget";
import SemillerosWidget from "../widgets/semilleros/SemillerosWidget";
import MiembrosWidget from "../widgets/members/MiembrosWidget";
import AliadosInstitucionalesWidget from "../widgets/Aliados-Institucionales/AliadosInstitucionalesWidget";
import PageHeader from "../shared/ui/PageHeader";
import SectionHeader from "../shared/ui/SectionHeader";

import { CheckIcon, FlagIcon, EyeIcon } from "@heroicons/react/24/outline";

const OBJETIVOS = [
  "Mejorar los criterios para el desarrollo de software regional mediante últimas tendencias.",
  "Aplicar resultados de investigación en proyectos académicos y empresariales.",
  "Desarrollar soluciones tecnológicas bajo estándares de sostenibilidad.",
  "Fortalecer el currículo académico con hallazgos de investigación vigentes.",
];

const AboutPage = () => {
  return (
    <div className="flex w-full flex-col">

      <PageHeader
        eyebrow="Quiénes somos"
        title="Sobre nosotros"
        description="Investigación, innovación y desarrollo tecnológico."
      />

      {/* MISIÓN / VISIÓN */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2">

          <article className="card border-t-4 border-t-brand-navy p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy text-white">
              <FlagIcon className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-brand-navy">Misión</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Contribuir en la investigación del desarrollo y los procesos software aplicando los mejores criterios de calidad que redunden en el mejoramiento de la calidad de vida de las personas, el desarrollo sostenible de la región y del país.
            </p>
          </article>

          <article className="card border-t-4 border-t-brand-teal p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-teal text-white">
              <EyeIcon className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-brand-navy">Visión</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              El Grupo de Investigación <span className="font-semibold text-brand-navy">LOGICIEL</span>, se convertirá en una organización líder a nivel nacional e internacional por sus logros y reconocimientos en los campos de la investigación y la proyección social.
            </p>
          </article>
        </div>
      </section>

      {/* OBJETIVOS */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader eyebrow="Hacia dónde vamos" title="Objetivos estratégicos" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {OBJETIVOS.map((obj, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-teal text-white">
                  <CheckIcon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-medium leading-snug text-slate-700">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LineasWidget />
      <SemillerosWidget />
      <MiembrosWidget />
      <AliadosInstitucionalesWidget />
    </div>
  );
};

export default AboutPage;
