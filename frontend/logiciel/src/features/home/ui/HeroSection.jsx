import { useState, useEffect } from "react";
import SanJose from "../../../shared/assets/images/san_jose.png";
import placeholderImg from "../../../shared/assets/images/placeholder.svg";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useCircularHorizontalScroll } from "../../../shared/hooks/design/useCircularHorizontalScroll";
import { useHomeSlides } from "../model/useHomeSlides";
import { LogoIcon } from "../../../shared/ui/Logo";

const HeroSection = () => {
  const slides = useHomeSlides();
  const {
    ref: newsRef,
    hasOverflow,
    scrollLeft,
    scrollRight,
  } = useCircularHorizontalScroll(slides.length);
  const hasSlides = slides.length > 0;

  // Estados para el control del scroll
  const [isAutoPlaying, setIsAutoPlaying] = useState(true); // Controla si el modo auto está activo
  const [isHovering, setIsHovering] = useState(false);     // Pausa temporal por hover

  // 1. Función para manejo de clicks (Pasa a modo manual definitivo)
  const handleManualClick = (direction) => {
    setIsAutoPlaying(false); // Detiene el auto-scroll permanentemente
    if (direction === "left") {
      scrollLeft();
    } else {
      scrollRight();
    }
  };

  // 2. Efecto del Auto-Scroll
  useEffect(() => {
    let interval;

    // Solo corre si está en auto-play Y no hay un hover activo
    if (isAutoPlaying && !isHovering && hasSlides && hasOverflow) {
      interval = setInterval(() => {
        scrollRight();
      }, 3000); // Velocidad: 3 segundos para que sea más dinámico
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, isHovering, hasSlides, hasOverflow, scrollRight]);

  return (
    <section className="relative overflow-hidden text-white">
      {/* FONDO: foto del campus San José con capa institucional navy */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${SanJose})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/85 via-brand-navy/80 to-brand-navy/95" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6">

        {/* PRESENTACIÓN */}
        <div className="mx-auto max-w-3xl text-center">
          <LogoIcon
            variant="light"
            className="mx-auto mb-7 h-20 w-auto drop-shadow-2xl sm:h-24"
          />

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-200">
            Fundación Universitaria de Popayán
          </p>

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Grupo de Investigación LOGICIEL
          </h1>

          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-brand-teal" />

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">
            Investigación y desarrollo en software para generar impacto académico
            y social en la región.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/about" className="btn-primary px-7 py-3 text-base">
              Conócenos
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 px-7 py-3 text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Ver proyectos
            </Link>
          </div>
        </div>

        {/* NOVEDADES (noticias y eventos) */}
        {hasSlides && (
          <div className="mt-16">
            <div className="mb-4 flex items-center justify-between px-1">
              <h2 className="text-lg font-semibold text-white">
                Noticias y eventos recientes
              </h2>
              <Link
                to="/news"
                className="inline-flex items-center gap-1 text-sm font-medium text-teal-200 transition hover:text-white"
              >
                Ver todo <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setIsHovering(true)}  // Pausa al entrar
              onMouseLeave={() => setIsHovering(false)} // Reanuda al salir
            >
              {hasOverflow && (
                <>
                  <button
                    onClick={() => handleManualClick("left")}
                    aria-label="Anterior"
                    className="absolute -left-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white p-2.5 text-brand-navy shadow-lg transition hover:bg-brand-teal hover:text-white sm:-left-4"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => handleManualClick("right")}
                    aria-label="Siguiente"
                    className="absolute -right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white p-2.5 text-brand-navy shadow-lg transition hover:bg-brand-teal hover:text-white sm:-right-4"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </>
              )}

              <div
                ref={newsRef}
                className="hide-scrollbar flex gap-5 overflow-x-auto scroll-smooth py-2"
              >
                {slides.map((item) => (
                  <Link
                    key={item.id}
                    to={item.__type === "event" ? `/events/${item.id}` : `/news/${item.id}`}
                    className="group/card w-[270px] flex-shrink-0 overflow-hidden rounded-xl bg-white text-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[300px]"
                  >
                    <div className="h-36 overflow-hidden">
                      <img
                        src={item.image || item.imagen || placeholderImg}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-teal">
                        {item.__type === "event" ? "Evento" : "Noticia"}
                      </span>
                      <h3 className="mt-1 line-clamp-2 font-semibold leading-snug text-brand-navy">
                        {item.title || item.titulo}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
