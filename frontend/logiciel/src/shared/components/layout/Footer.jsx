import { Link } from "react-router-dom";
import Logo from "../../ui/Logo";

const LINKS = [
  { to: "/about", label: "Nosotros" },
  { to: "/projects", label: "Proyectos" },
  { to: "/publications", label: "Publicaciones" },
  { to: "/news", label: "Noticias" },
  { to: "/contact", label: "Contacto" },
];

const Footer = () => {
  return (
    <footer className="mt-16 border-t-4 border-brand-teal bg-brand-navy text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo variant="light" showTagline />
          <p className="mt-3 max-w-sm text-sm text-slate-400">
            Grupo de investigación de la Fundación Universitaria de Popayán.
          </p>
        </div>

        <nav>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-slate-400 sm:px-6 md:text-left">
          &copy; {new Date().getFullYear()} LOGICIEL · Fundación Universitaria de Popayán
        </p>
      </div>
    </footer>
  );
};

export default Footer;
