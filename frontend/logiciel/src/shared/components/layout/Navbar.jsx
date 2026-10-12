// import { useState } from 'react'
// import { Link } from "react-router-dom"; 
// import logo from '../../assets/logo/logo-logiciel.png'

// const Navbar = () => {
//  const [open, setOpen] = useState(false);

//   return (
//     <header className="bg-[#0a192f] text-white py-4 px-6 sticky top-0 z-50">
//       <nav className="max-w-6xl mx-auto flex justify-between items-center">

//         {/* LOGO */}
//         <div className="flex items-center gap-3">
//           <img
//             src={logo}
//             alt="Logo LOGICIEL"
//             className="w-32"
//           />
//         </div>

//         {/* BOTON MOVIL */}
//         <button
//           className="md:hidden flex flex-col gap-1"
//           onClick={() => setOpen(!open)}
//         >
//           <span className="w-6 h-[3px] bg-white"></span>
//           <span className="w-6 h-[3px] bg-white"></span>
//           <span className="w-6 h-[3px] bg-white"></span>
//         </button>

//         {/* LINKS */}
//         <ul
//           className={`md:flex gap-6 font-medium transition-all ${
//             open ? "block" : "hidden"
//           } md:block absolute md:static left-0 right-0 bg-[#0a192f] md:bg-transparent px-6 py-4 md:p-0`}
//         >
//           <li><Link to="/" className="hover:text-[#64ffda]">Inicio</Link></li>
//           <li><Link to="/about">Nosotros</Link></li>
//           <li><Link to="/projects">Proyectos</Link></li>
//           <li><Link to="/publications">Publicaciones</Link></li>
//           <li><Link to="/news">Noticias</Link></li>
//           <li><Link to="/contact">Contacto</Link></li>
//           <li><Link to="/login">Iniciar Sesión</Link></li>
//         </ul>
//       </nav>
//     </header>
//   );
// }

// export default Navbar


// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import logo from "../../assets/logo/logo-logiciel.png";

// const Navbar = () => {
//   const [open, setOpen] = useState(false);
//   const [dropdown, setDropdown] = useState(false);
//   const { user, logout } = useAuth();

//   return (
//     <header className="bg-[#0a192f] text-white py-4 px-6 sticky top-0 z-50">
//       <nav className="max-w-6xl mx-auto flex justify-between items-center">

//         {/* LOGO */}
//         <div className="flex items-center gap-3">
//           <img src={logo} alt="Logo LOGICIEL" className="w-32" />
//         </div>

//         {/* Botón móvil */}
//         <button
//           className="md:hidden flex flex-col gap-1"
//           onClick={() => setOpen(!open)}
//         >
//           <span className="w-6 h-[3px] bg-white"></span>
//           <span className="w-6 h-[3px] bg-white"></span>
//           <span className="w-6 h-[3px] bg-white"></span>
//         </button>

//         {/* Menú principal */}
//         <ul
//           className={`md:flex gap-6 ${open ? "block" : "hidden"
//             } md:block absolute md:static left-0 right-0 bg-[#0a192f] md:bg-transparent px-6 py-4 md:p-0`}
//         >
//           <li><Link to="/" className="hover:text-[#64ffda]">Inicio</Link></li>
//           <li><Link to="/about" className="hover:text-[#64ffda]">Nosotros</Link></li>
//           <li><Link to="/projects" className="hover:text-[#64ffda]">Proyectos</Link></li>
//           <li><Link to="/publications" className="hover:text-[#64ffda]">Publicaciones</Link></li>
//           <li><Link to="/news" className="hover:text-[#64ffda]">Noticias</Link></li>
//           <li><Link to="/contact" className="hover:text-[#64ffda]">Contacto</Link></li>

//           {/* SI NO ESTÁ LOGUEADO */}
//           {!user && (
//             <li>
//               <Link to="/login" className="hover:text-[#64ffda]">
//                 Iniciar Sesión
//               </Link>
//             </li>
//           )}

//           {/* SI ESTÁ LOGUEADO → MENÚ DESPLEGABLE */}
//           {user && (
//             <li className="relative">
//               <button
//                 onClick={() => setDropdown(!dropdown)}
//                 className="hover:text-[#64ffda] font-semibold flex items-center gap-2"
//               >
//                 {/* {user.role === "admin" ? user?.name: "Usuario"} */}
//                 {user?.name || "Mi Perfil"}
//                 <span>▼</span>
//               </button>

//               {/* Contenido del dropdown */}
//               {dropdown && (
//                 <ul className="absolute right-0 mt-2 bg-[#112240] border border-[#233554] rounded-md p-2 w-48 shadow-lg">

//                   <li>
//                     <Link
//                       to="/profile"
//                       className="block px-3 py-2 hover:bg-[#233554] rounded"
//                     >
//                       Ver perfil
//                     </Link>
//                   </li>

//                   {/* Opciones según el rol */}
//                   {user.role === "user" ? (
//                     <>

//                       <li>
//                         <Link
//                           to="/proyectos-activos"
//                           className="block px-3 py-2 hover:bg-[#233554] rounded"
//                         >
//                           Proyectos activos
//                         </Link>
//                       </li>
//                     </>
//                   ) : (
//                     <>
//                       <li>
//                         <Link
//                           to="/admin/users"
//                           className="block px-3 py-2 hover:bg-[#233554] rounded"
//                         >
//                           Gestionar Usuarios
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/proyectos-activos"
//                           className="block px-3 py-2 hover:bg-[#233554] rounded"
//                         >
//                           Proyectos activos
//                         </Link>
//                       </li>
//                     </>
//                   )}

//                   <li>
//                     <button
//                       onClick={logout}
//                       className="block w-full text-left px-3 py-2 hover:bg-[#233554] rounded"
//                     >
//                       Cerrar sesión
//                     </button>
//                   </li>
//                 </ul>
//               )}
//             </li>
//           )}
//         </ul>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;







import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/model/useAuth";
import logo from "../../assets/logo/logo-logiciel.png";

import { useNavigate } from "react-router-dom";

import{ getMiembros } from "../../entities/member/api/miembroApi"
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const [miLider, setMiLider] = useState(null);
  const [checkedLider, setCheckedLider] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadLider = async () => {
      try {
        const lideres = await getMiembros();

        const encontrado = lideres.find(
          (l) => String(l.user_id) === String(user.uid)
        );


        setMiLider(encontrado || null);
        setCheckedLider(true);

      } catch (e) {
        console.error("Error cargando líderes", e);
      }
    };

    loadLider();
  }, [user]);

  // Función para manejar el click en el nombre (solo útil en móvil)
  const handleDropdownToggle = () => {
    if (window.innerWidth < 768) {
      setDropdown(!dropdown);
    }
  };


  // 👉 Cierra el menú mobile
  const handleCloseMenu = () => {
    setOpen(false);
  };

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

    /* 📱 SOLO PARA MÓVIL (< 768px) */
    max-h-[80vh] md:max-h-none    /* Límite en móvil, sin límite en PC */
    overflow-y-auto md:overflow-visible /* Scroll en móvil, visible en PC */
    scrollbar-thin md:scrollbar-none
  `}
        >
          <li>
            <Link to="/" onClick={handleCloseMenu} className="hover:text-[#64ffda] ">
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
                className="hover:text-[#64ffda"
              >
                Iniciar Sesión
              </Link>
            </li>
          )}

          {/* LOGUEADO */}
          {user && (
            <li
              className="relative flex items-center h-full"
              // Solo activa el hover si la pantalla NO es táctil/móvil (mayor a 768px)
              onMouseEnter={() => window.innerWidth >= 768 && setDropdown(true)}
              onMouseLeave={() => window.innerWidth >= 768 && setDropdown(false)}
            >
              <button
                onClick={handleDropdownToggle} // En móvil esto abrirá/cerrará al tocar
                className="hover:text-[#64ffda] font-semibold flex items-center gap-1 py-1"
              // No ponemos MouseLeave aquí porque si no, no podrías bajar al menú
              >
                {user?.name || "Mi Perfil"}
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${dropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN */}
              <div
                className={`
relative md:absolute md:right-0 top-full pt-2 w-full md:w-48
    ${dropdown ? "block opacity-100" : "hidden md:block md:opacity-0 md:pointer-events-none"}
    transition-all duration-200
  `}
                onMouseLeave={() => window.innerWidth >= 768 && setDropdown(false)}
              >
                <ul
                  className={`
        bg-[#112240] border border-[#233554]
        rounded-md p-2 w-48 shadow-lg
        transition-all duration-200
        ${dropdown
                      ? "opacity-100 translate-y-1 block" // Añadimos block para asegurar
                      : "opacity-0 pointer-events-none translate-y-3"}
      `}
                >
                  {checkedLider && miLider && (
                    <li>
                      <button
                        onClick={() => {
                          navigate(`/members/${miLider.user_id}`);
                          handleCloseMenu();
                        }}
                        className="block w-full text-left px-3 py-2 hover:bg-[#233554] rounded text-green-400"
                      >
                        Mi perfil
                      </button>
                    </li>
                  )}


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

                    </>
                  )}

                  <li>
                    <button
                      onClick={() => {
                        logout();
                        handleCloseMenu();
                      }}
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
