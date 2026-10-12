import { useState, useEffect, useRef } from "react"; 
import logo from "../../../shared/assets/logo/logo-logiciel.svg";
import SanJose from "../../../shared/assets/images/san_jose.png";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useCircularHorizontalScroll } from "../../../shared/hooks/design/useCircularHorizontalScroll";
import { useHomeSlides } from "../model/useHomeSlides";

const HeroSection = () => {
  const slides = useHomeSlides();
  const newsScroll = useCircularHorizontalScroll([slides]);
  const hasSlides = slides.length > 0;

  // Estados para el control del scroll
  const [isAutoPlaying, setIsAutoPlaying] = useState(true); // Controla si el modo auto está activo
  const [isHovering, setIsHovering] = useState(false);     // Pausa temporal por hover

  // 1. Función para manejo de clicks (Pasa a modo manual definitivo)
  const handleManualClick = (direction) => {
    setIsAutoPlaying(false); // Detiene el auto-scroll permanentemente
    if (direction === "left") {
      newsScroll.scrollLeft();
    } else {
      newsScroll.scrollRight();
    }
  };

  // 2. Efecto del Auto-Scroll
  useEffect(() => {
    let interval;
    
    // Solo corre si está en auto-play Y no hay un hover activo
    if (isAutoPlaying && !isHovering && hasSlides && newsScroll.hasOverflow) {
      interval = setInterval(() => {
        newsScroll.scrollRight();
      }, 3000); // Velocidad: 3 segundos para que sea más dinámico
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, isHovering, hasSlides, newsScroll]);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${SanJose})` }}
      />
      <div className="absolute inset-0 bg-[#0a192f]/80"></div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white pt-20 pb-10 px-4">
        
        {/* SECCIÓN LOGO Y TXT */}
        <div className="flex flex-col items-center text-center max-w-2xl mb-8">
          <img src={logo} alt="Logo LOGICIEL" className="w-48 sm:w-56 mb-4 drop-shadow-lg" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Grupo de Investigación
          </h2>
          <Link
            to="/about"
            className="bg-[#64ffda] text-[#0a192f] font-bold px-8 py-3 rounded-full hover:bg-[#48c9b0] transition-all transform hover:scale-105"
          >
            Conócenos
          </Link>
        </div>

        {/* CONTENEDOR DEL SLIDER */}
        {hasSlides && (
          <div 
            className="relative w-full max-w-7xl mt-4 group"
            onMouseEnter={() => setIsHovering(true)}  // Pausa al entrar
            onMouseLeave={() => setIsHovering(false)} // Reanuda al salir
          >
            {newsScroll.hasOverflow && (
              <>
                <button
                  onClick={() => handleManualClick("left")}
                  className="absolute -left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-[#64ffda] hover:text-[#0a192f] p-3 rounded-full transition-all border border-white/20"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>

                <button
                  onClick={() => handleManualClick("right")}
                  className="absolute -right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-[#64ffda] hover:text-[#0a192f] p-3 rounded-full transition-all border border-white/20"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}

            <div
              ref={newsScroll.ref}
              className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth px-10 py-4"
            >
              {slides.map((item) => (
                <Link
                  key={item.id}
                  to={item.__type === "event" ? `/events/${item.id}` : `/news/${item.id}`}
                  className="w-[300px] sm:w-[350px] h-60 relative rounded-2xl overflow-hidden group/card shadow-2xl flex-shrink-0 transition-transform duration-300 hover:-translate-y-2"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/card:scale-110"
                    style={{ backgroundImage: `url(${item.image || item.imagen})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-black/20 to-transparent opacity-90" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#64ffda] font-bold mb-1">
                      {item.tipo || "Actualidad"}
                    </span>
                    <h3 className="text-base font-bold leading-tight group-hover/card:text-[#64ffda] transition-colors line-clamp-2">
                      {item.title || item.titulo}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;