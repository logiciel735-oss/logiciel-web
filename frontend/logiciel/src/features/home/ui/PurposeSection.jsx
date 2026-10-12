import { Link } from "react-router-dom";
import {
  BeakerIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const SECCIONES = [
  {
    to: "/projects",
    icon: BeakerIcon,
    title: "Proyectos",
    text: "Iniciativas de investigación activas y finalizadas del grupo.",
  },
  {
    to: "/publications",
    icon: DocumentTextIcon,
    title: "Publicaciones",
    text: "Producción científica de nuestros investigadores.",
  },
  {
    to: "/about",
    icon: UserGroupIcon,
    title: "Comunidad",
    text: "Miembros, líneas de investigación, semilleros y aliados.",
  },
];

const PurposeSection = () => {
  return (
    <section className="bg-slate-50 px-4 pb-4 pt-20 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Quiénes somos</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            Nuestro propósito
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Somos un grupo de investigación enfocado en promover el
            avance científico y tecnológico, mediante proyectos
            innovadores que generan impacto académico y social en la región.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {SECCIONES.map(({ to, icon, title, text }) => {
            const Icon = icon;
            return (
            <Link
              key={to}
              to={to}
              className="card group p-6 hover:-translate-y-1 hover:border-brand-teal/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-teal-light text-brand-teal transition-colors group-hover:bg-brand-teal group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-brand-navy">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-teal">
                Explorar
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link to="/projects" className="btn-primary px-6 py-3">
            Explorar proyectos
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PurposeSection;
