import { Link, NavLink } from "react-router-dom";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../../../shared/ui/Logo";
import { useNavbar } from "../model/useNavbar";

const NAV_ITEMS = [
  { to: "/", label: "Inicio", end: true },
  { to: "/about", label: "Nosotros" },
  { to: "/projects", label: "Proyectos" },
  { to: "/publications", label: "Publicaciones" },
  { to: "/news", label: "Noticias" },
  { to: "/contact", label: "Contacto" },
];

const navLinkClass = ({ isActive }) =>
  `relative block rounded-md px-3 py-2 text-sm font-medium transition-colors
   md:after:absolute md:after:inset-x-3 md:after:-bottom-[1px] md:after:h-0.5 md:after:rounded-full md:after:transition-all
   ${isActive
     ? "text-white bg-white/10 md:bg-transparent md:after:bg-brand-teal"
     : "text-slate-300 hover:text-white hover:bg-white/5 md:hover:bg-transparent md:after:bg-transparent"}`;

const dropdownItem =
  "block w-full text-left rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-brand-navy transition-colors";

const Navbar = () => {
  const {
    open,
    setOpen,
    dropdown,
    setDropdown,
    user,
    handleDropdownToggle,
    handleCloseMenu,
    handleLogout,
  } = useNavbar();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-navy text-white shadow-lg shadow-black/10">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* LOGO */}
        <Link
          to="/"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            handleCloseMenu();
          }}
          className="rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          <Logo variant="light" />
        </Link>

        {/* BOTÓN HAMBURGUESA (MOBILE) */}
        <button
          className="rounded-md p-2 text-slate-200 hover:bg-white/10 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>

        {/* MENÚ PRINCIPAL */}
        <ul
          className={`
            ${open ? "flex" : "hidden"} md:flex
            absolute md:static top-full left-0 right-0
            flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-1
            border-b border-white/10 md:border-0
            bg-brand-navy md:bg-transparent
            px-4 py-4 md:p-0
            max-h-[80vh] md:max-h-none overflow-y-auto md:overflow-visible
            shadow-xl md:shadow-none
          `}
        >
          {NAV_ITEMS.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} onClick={handleCloseMenu} className={navLinkClass}>
                {label}
              </NavLink>
            </li>
          ))}

          {/* NO LOGUEADO */}
          {!user && (
            <li className="mt-2 md:ml-3 md:mt-0">
              <Link
                to="/login"
                onClick={handleCloseMenu}
                className="btn-primary w-full px-4 py-2 text-sm md:w-auto"
              >
                Iniciar sesión
              </Link>
            </li>
          )}

          {/* LOGUEADO */}
          {user && (
            <li
              className="relative mt-2 md:ml-3 md:mt-0"
              onMouseEnter={() =>
                window.innerWidth >= 768 && setDropdown(true)
              }
              onMouseLeave={() =>
                window.innerWidth >= 768 && setDropdown(false)
              }
            >
              <button
                onClick={handleDropdownToggle}
                className="flex w-full items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1 pl-1 pr-3 text-sm font-medium transition hover:border-brand-teal/60 hover:bg-white/10 md:w-auto"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-teal font-display text-sm font-semibold text-white">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[10rem] truncate">{user?.name || "Mi Perfil"}</span>
                <ChevronDownIcon
                  className={`ml-auto h-4 w-4 text-slate-300 transition-transform ${dropdown ? "rotate-180" : ""}`}
                />
              </button>

              {/* DROPDOWN */}
              <div
                className={`
                  relative md:absolute md:right-0 top-full pt-2 w-full md:w-60
                  ${dropdown
                    ? "block opacity-100"
                    : "hidden md:block md:opacity-0 md:pointer-events-none"
                  }
                  transition-all duration-200
                `}
                onMouseLeave={() =>
                  window.innerWidth >= 768 && setDropdown(false)
                }
              >
                <ul
                  className={`
                    rounded-xl border border-slate-200 bg-white p-2 shadow-xl
                    transition-all duration-200
                    ${dropdown
                      ? "opacity-100 translate-y-0 block"
                      : "opacity-0 pointer-events-none translate-y-2"
                    }
                  `}
                >
                  <li className="mb-1 border-b border-slate-100 px-3 pb-2 pt-1">
                    <p className="truncate text-sm font-semibold text-brand-navy">{user?.name}</p>
                    <p className="truncate text-xs text-slate-500">{user?.email}</p>
                    {user.role === "admin" && (
                      <span className="mt-1 inline-block rounded-full bg-brand-teal-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-teal-dark">
                        Administrador
                      </span>
                    )}
                  </li>

                  <li>
                    <Link to={`/members/${user.id}`} onClick={handleCloseMenu} className={dropdownItem}>
                      Mi perfil
                    </Link>
                  </li>

                  <li>
                    <Link to="/profile" onClick={handleCloseMenu} className={dropdownItem}>
                      Editar perfil
                    </Link>
                  </li>

                  {user.role !== "user" && (
                    <li>
                      <Link to="/admin/users" onClick={handleCloseMenu} className={dropdownItem}>
                        Gestionar usuarios
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link
                      to="/publications"
                      state={{ filterByUser: user?.name }}
                      onClick={handleCloseMenu}
                      className={dropdownItem}
                    >
                      Publicaciones científicas
                    </Link>
                  </li>

                  <li>
                    <Link to="/my-proyects" onClick={handleCloseMenu} className={dropdownItem}>
                      Mis proyectos
                    </Link>
                  </li>

                  <li className="mt-1 border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
