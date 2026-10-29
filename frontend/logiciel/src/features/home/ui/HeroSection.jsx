import SanJose from "../../../shared/assets/images/san_jose.webp";
import placeholderImg from "../../../shared/assets/images/placeholder.svg";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useHomeSlides } from "../model/useHomeSlides";
import { useAutoCarousel } from "../model/useAutoCarousel";
import { LogoIcon } from "../../../shared/ui/Logo";
import { optimizeImage } from "../../../shared/lib/image";
import { formatCalendarDate } from "../../../shared/utils/formatDateInput";
import { buildDetailPath } from "../../../shared/lib/slug";
import EventStatusBadge from "../../../entities/event/ui/EventStatusBadge";

const formatFecha = (value) =>
  formatCalendarDate(value, { day: "numeric", month: "short", year: "numeric" }) || null;

const HeroSection = () => {
  const slides = useHomeSlides();
  const hasSlides = slides.length > 0;
  const {
    trackProps,
    cardProps,
    active,
    paused,
    goTo,
    next,
    prev,
    interval,
  } = useAutoCarousel(slides.length);

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
              role="region"
              aria-roledescription="carrusel"
              aria-label="Noticias y eventos recientes"
            >
              <div
                {...trackProps}
                className="hide-scrollbar relative flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 py-3"
              >
                {slides.map((item, index) => {
                  const isActive = index === active;
                  const fecha = formatFecha(item.__type === "event" ? item.fecha_inicio : item.fecha_creacion || item.created_at);
                  return (
                    <Link
                      key={`${item.__type}-${item.id}`}
                      {...cardProps}
                      to={buildDetailPath(item.__type, item.id, item.titulo || item.title)}
                      aria-current={isActive ? "true" : undefined}
                      className={`group/card relative flex w-[270px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white text-slate-800 shadow-lg transition-all duration-500 sm:w-[300px] ${
                        isActive
                          ? "-translate-y-1 shadow-2xl ring-2 ring-brand-teal ring-offset-2 ring-offset-brand-navy"
                          : "opacity-80 hover:-translate-y-1 hover:opacity-100 hover:shadow-xl"
                      }`}
                    >
                      <div className="relative h-36 overflow-hidden">
                        {item.__status && (
                          <EventStatusBadge status={item.__status} className="absolute left-3 top-3 z-10" />
                        )}
                        <img
                          src={optimizeImage(item.image || item.imagen, 600) || placeholderImg}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wider">
                          <span className="text-brand-teal">
                            {item.__type === "event" ? "Evento" : "Noticia"}
                          </span>
                          {fecha && <span className="font-medium normal-case tracking-normal text-slate-400">{fecha}</span>}
                        </div>
                        <h3 className="mt-1 line-clamp-2 font-semibold leading-snug text-brand-navy">
                          {item.title || item.titulo}
                        </h3>
                        {(item.resumen || item.summary) && (
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">
                            {item.resumen || item.summary}
                          </p>
                        )}
                      </div>

                      {/* Tiempo hasta la siguiente noticia */}
                      {isActive && slides.length > 1 && (
                        <span className="absolute inset-x-0 bottom-0 h-1 bg-brand-teal/15">
                          {!paused && (
                            <span
                              key={`${active}-${paused}`}
                              className="carousel-progress block h-full bg-brand-teal"
                              style={{ animationDuration: `${interval}ms` }}
                            />
                          )}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Indicadores */}
              {slides.length > 1 && (
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    onClick={prev}
                    aria-label="Anterior"
                    className="rounded-full border border-white/30 p-2 text-white transition hover:border-brand-teal hover:bg-brand-teal"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-2">
                  {slides.length <= 12 ? (
                    slides.map((item, index) => (
                      <button
                        key={`dot-${item.__type}-${item.id}`}
                        onClick={() => goTo(index)}
                        aria-label={`Ir a ${item.__type === "event" ? "el evento" : "la noticia"} ${index + 1}`}
                        aria-current={index === active ? "true" : undefined}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === active ? "w-6 bg-brand-teal" : "w-2 bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))
                  ) : (
                    <span className="text-sm font-medium text-slate-300">
                      {active + 1} / {slides.length}
                    </span>
                  )}
                  </div>

                  <button
                    onClick={next}
                    aria-label="Siguiente"
                    className="rounded-full border border-white/30 p-2 text-white transition hover:border-brand-teal hover:bg-brand-teal"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
