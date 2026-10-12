import { Link } from "react-router-dom";
import logo from "../../../shared/assets/logo/logo-logiciel.svg";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavbar } from "../model/useNavbar";

const Navbar = () => {
  const {
    open,
    setOpen,
    dropdown,
    setDropdown,
    user,
    miLider,
    checkedLider,
    handleDropdownToggle,
    handleCloseMenu,
    handleProfileNavigation,
    handleLogout,
  } = useNavbar();

  return (
    <header className="bg-[#0a192f] text-white py-4 px-6 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex justify-between items-center">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              handleCloseMenu();
            }}
          >
            <img
              src={logo}
              alt="Logo LOGICIEL"
              className="w-32 cursor-pointer"
            />
          </Link>
        </div>

        {/* BOTÓN HAMBURGUESA (MOBILE) */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setOpen(!open)}
        >
          <span className="w-6 h-[3px] bg-white"></span>
          <span className="w-6 h-[3px] bg-white"></span>
          <span className="w-6 h-[3px] bg-white"></span>
        </button>

        {/* MENÚ PRINCIPAL */}
        <ul
          className={`
            flex-col md:flex-row
            items-start md:items-center
            gap-6
            ${open ? "flex" : "hidden"}
            md:flex
            absolute md:static
            top-full left-0 right-0
            bg-[#0a192f] md:bg-transparent
            px-6 py-4 md:p-0
            max-h-[80vh] md:max-h-none
            overflow-y-auto md:overflow-visible
            scrollbar-thin md:scrollbar-none
          `}
        >
          <li>
            <Link to="/" onClick={handleCloseMenu} className="hover:text-[#64ffda]">
              Inicio
            </Link>
          </li>

          <li>
            <Link to="/about" onClick={handleCloseMenu} className="hover:text-[#64ffda]">
              Nosotros
            </Link>
          </li>

          <li>
            <Link to="/projects" onClick={handleCloseMenu} className="hover:text-[#64ffda]">
              Proyectos
            </Link>
          </li>

          <li>
            <Link to="/publications" onClick={handleCloseMenu} className="hover:text-[#64ffda]">
              Publicaciones
            </Link>
          </li>

          <li>
            <Link to="/news" onClick={handleCloseMenu} className="hover:text-[#64ffda]">
              Noticias
            </Link>
          </li>

          <li>
            <Link to="/contact" onClick={handleCloseMenu} className="hover:text-[#64ffda]">
              Contacto
            </Link>
          </li>

          {/* NO LOGUEADO */}
          {!user && (
            <li>
              <Link
                to="/login"
                onClick={handleCloseMenu}
                className="hover:text-[#64ffda]"
              >
                Iniciar Sesión
              </Link>
            </li>
          )}

          {/* LOGUEADO */}
          {user && (
            <li
              className="relative flex items-center h-full"
              onMouseEnter={() =>
                window.innerWidth >= 768 && setDropdown(true)
              }
              onMouseLeave={() =>
                window.innerWidth >= 768 && setDropdown(false)
              }
            >
              <button
                onClick={handleDropdownToggle}
                className="hover:text-[#64ffda] font-semibold flex items-center gap-1 py-1"
              >
                {user?.name || "Mi Perfil"}
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${dropdown ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* DROPDOWN */}
              <div
                className={`
                  relative md:absolute md:right-0 top-full pt-2 w-full md:w-48
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
                    bg-[#112240] border border-[#233554]
                    rounded-md p-2 w-48 shadow-lg
                    transition-all duration-200
                    ${dropdown
                      ? "opacity-100 translate-y-1 block"
                      : "opacity-0 pointer-events-none translate-y-3"
                    }
                  `}
                >
                  <li>
                    <Link
                      to={`/members/${user.id}`}   // 👈 ESTA ES LA CLAVE
                      onClick={handleCloseMenu}
                      className="block px-3 py-2 hover:bg-[#233554] rounded"
                    >
                      Mi perfil
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/profile"
                      onClick={handleCloseMenu}
                      className="block px-3 py-2 hover:bg-[#233554] rounded"
                    >
                      Editar Perfil
                    </Link>
                  </li>

                  {user.role === "user" ? (
                    <>
                      <li>
                        <Link
                          to={`/members/${user.id}`}   // 👈 ESTA ES LA CLAVE
                          onClick={handleCloseMenu}
                          className="block px-3 py-2 hover:bg-[#233554] rounded"
                        >
                          Mi perfil
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/publications"
                          state={{ filterByUser: user?.name }}
                          onClick={handleCloseMenu}
                          className="block px-3 py-2 hover:bg-[#233554] rounded"
                        >
                          Publicaciones científicas
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/my-proyects"
                          onClick={handleCloseMenu}
                          className="block px-3 py-2 hover:bg-[#233554] rounded"
                        >
                          Mis Proyectos
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>

                      <li>
                        <Link
                          to="/admin/users"
                          onClick={handleCloseMenu}
                          className="block px-3 py-2 hover:bg-[#233554] rounded"
                        >
                          Gestionar Usuarios
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/publications"
                          state={{ filterByUser: user?.name }}
                          onClick={handleCloseMenu}
                          className="block px-3 py-2 hover:bg-[#233554] rounded"
                        >
                          Publicaciones científicas
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/my-proyects"
                          onClick={handleCloseMenu}
                          className="block px-3 py-2 hover:bg-[#233554] rounded"
                        >
                          Mis Proyectos
                        </Link>
                      </li>
                    </>
                  )}

                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 hover:bg-[#233554] rounded"
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