import LineasWidget from "../widgets/lineas/LineasWidget";
import SemillerosWidget from "../widgets/semilleros/SemillerosWidget";
import MiembrosWidget from "../widgets/members/MiembrosWidget";
import AliadosInstitucionalesWidget from "../widgets/Aliados-Institucionales/AliadosInstitucionalesWidget";

import { CheckCircleIcon, RocketLaunchIcon, EyeIcon, LightBulbIcon } from "@heroicons/react/24/outline";

const AboutPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col font-sans">

      {/* HERO - Más estilizado */}
     <section
        className="relative h-[60vh] flex items-center justify-center text-white text-center bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-[rgba(10,25,47,0.75)]"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-2">Sobre Nosotros</h2>
          <p>Investigación, innovación y desarrollo tecnológico</p>
        </div>
      </section>

      {/* MISIÓN / VISIÓN - Diseño de Tarjetas Modernas */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          
          {/* Misión */}
          <div className="relative group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="absolute -top-5 left-8 bg-blue-600 p-3 rounded-lg shadow-lg">
              <RocketLaunchIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4 mt-4">Misión</h3>
            <p className="text-slate-600 leading-relaxed">
              Contribuir en la investigación del desarrollo y los procesos software aplicando los mejores criterios de calidad que redunden en el mejoramiento de la calidad de vida de las personas, el desarrollo sostenible de la región y del país.
            </p>
          </div>

          {/* Visión */}
          <div className="relative group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="absolute -top-5 left-8 bg-green-600 p-3 rounded-lg shadow-lg">
              <EyeIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4 mt-4">Visión</h3>
            <p className="text-slate-600 leading-relaxed">
              El Grupo de Investigación <span className="font-semibold text-slate-900">LOGICIEL</span>, se convertirá en una organización líder a nivel nacional e internacional por sus logros y reconocimientos en los campos de la investigación y la proyección social.
            </p>
          </div>
        </div>
      </section>

      {/* OBJETIVOS - Grid de alto impacto */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <LightBulbIcon className="w-10 h-10 text-yellow-500" />
            <h2 className="text-3xl font-bold text-slate-900">Objetivos Estratégicos</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Mejorar los criterios para el desarrollo de software regional mediante últimas tendencias.",
              "Aplicar resultados de investigación en proyectos académicos y empresariales.",
              "Desarrollar soluciones tecnológicas bajo estándares de sostenibilidad.",
              "Fortalecer el currículo académico con hallazgos de investigación vigentes."
            ].map((obj, i) => (
              <div key={i} className="flex flex-col p-6 bg-slate-50 rounded-xl border-l-4 border-green-500 hover:bg-slate-100 transition-colors">
                <CheckCircleIcon className="w-8 h-8 text-green-600 mb-4" />
                <p className="text-slate-700 font-medium leading-snug">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WIDGETS RESTANTES */}
      <div className="space-y-0">
        <LineasWidget />
        <SemillerosWidget />
        <MiembrosWidget />
        <AliadosInstitucionalesWidget />
      </div>
    </div>
  );
};

export default AboutPage;