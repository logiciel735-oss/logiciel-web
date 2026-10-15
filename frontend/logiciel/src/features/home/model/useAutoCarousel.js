import { useCallback, useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Carrusel que avanza solo, vuelve al inicio al llegar al final y se pausa mientras
// el usuario está sobre una tarjeta, la toca, navega con teclado o la pestaña está oculta.
export const useAutoCarousel = (count, interval = 5000) => {
  const trackRef = useRef(null);
  const programmatic = useRef(false);   // scroll hecho por el carrusel (no por el usuario)
  const scrollTimer = useRef(null);
  const touchTimer = useRef(null);

  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0); // reinicia el temporizador tras una acción manual
  const [hovering, setHovering] = useState(false);
  const [touching, setTouching] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(() => typeof document !== "undefined" && document.hidden);
  const [reducedMotion] = useState(prefersReducedMotion);

  const paused = hovering || touching || focused || hidden || reducedMotion || count < 2;
  const current = count > 0 ? Math.min(active, count - 1) : 0;
  const currentRef = useRef(current);
  useEffect(() => { currentRef.current = current; }, [current]);

  // Desplaza el carril (solo horizontalmente, sin mover la página) hasta la tarjeta activa
  useEffect(() => {
    const el = trackRef.current;
    const card = el?.children[current];
    if (!el || !card) return;

    const target = Math.min(Math.max(0, card.offsetLeft - 4), el.scrollWidth - el.clientWidth);
    programmatic.current = true;

    // Sin animación (o si el usuario prefiere menos movimiento)
    if (reducedMotion) {
      el.scrollLeft = target;
      const t = setTimeout(() => { programmatic.current = false; }, 100);
      return () => clearTimeout(t);
    }

    // Animación propia: scrollTo({behavior:"smooth"}) choca con scroll-snap en algunos navegadores
    const start = el.scrollLeft;
    const distance = target - start;
    const duration = 600;
    const startTime = performance.now();
    el.style.scrollSnapType = "none";
    let timer;

    // Pasos de ~60 fps con temporizador (también avanza donde requestAnimationFrame se limita)
    const step = () => {
      const p = Math.min(1, Math.max(0, (performance.now() - startTime) / duration));
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      el.scrollLeft = start + distance * ease;
      if (p < 1) {
        timer = setTimeout(step, 16);
      } else {
        el.style.scrollSnapType = "";
        timer = setTimeout(() => { programmatic.current = false; }, 300);
      }
    };
    step();

    return () => {
      clearTimeout(timer);
      el.style.scrollSnapType = "";
    };
  }, [current, reducedMotion]);

  // Avance automático
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % count), interval);
    return () => clearTimeout(t);
  }, [paused, current, cycle, count, interval]);

  // Pausa con la pestaña oculta
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => () => {
    clearTimeout(scrollTimer.current);
    clearTimeout(touchTimer.current);
  }, []);

  const goTo = useCallback((index) => {
    if (count === 0) return;
    setActive(((index % count) + count) % count);
    setCycle((c) => c + 1);
  }, [count]);

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  // Si el usuario desliza el carril (móvil / trackpad), la tarjeta más cercana pasa a ser la activa
  const onScroll = () => {
    if (programmatic.current) return;
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const el = trackRef.current;
      if (!el) return;
      let nearest = 0;
      let best = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const d = Math.abs(child.offsetLeft - 4 - el.scrollLeft);
        if (d < best) { best = d; nearest = i; }
      });
      // Solo cuenta como gesto del usuario si cambió la tarjeta visible
      // (el ajuste de scroll-snap tras la animación no debe reiniciar el temporizador)
      if (nearest !== currentRef.current) {
        setActive(nearest);
        setCycle((c) => c + 1);
      }
    }, 150);
  };

  const trackProps = {
    ref: trackRef,
    onScroll,
    onTouchStart: () => {
      clearTimeout(touchTimer.current);
      setTouching(true);
    },
    onTouchEnd: () => {
      clearTimeout(touchTimer.current);
      touchTimer.current = setTimeout(() => setTouching(false), 4000);
    },
    // Solo el foco de teclado pausa (un clic con el ratón no debe dejarlo detenido)
    onFocus: (e) => {
      if (e.target.matches?.(":focus-visible")) setFocused(true);
    },
    onBlur: (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
    },
  };

  const cardProps = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
  };

  return { trackProps, cardProps, active: current, paused, goTo, next, prev, interval };
};
