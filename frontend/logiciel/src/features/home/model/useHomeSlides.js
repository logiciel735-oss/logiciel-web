import { useEffect, useState } from "react";
import { getNoticias } from "../../../entities/news/api/newsApi";
import { getEventos } from "../../../entities/event/api/eventApi"

export const useHomeSlides = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const [noticias, eventos] = await Promise.all([
          getNoticias(),
          getEventos(),
        ]);

        const noticiasConTipo = (noticias || []).map((n) => ({
          ...n,
          __type: "news",
        }));

        const eventosConTipo = (eventos || []).map((e) => ({
          ...e,
          __type: "event",
        }));

        const ordenados = [...noticiasConTipo, ...eventosConTipo].sort(
          (a, b) =>
            new Date(b.date || b.fecha) -
            new Date(a.date || a.fecha)
        );

        setSlides(ordenados);
      } catch (err) {
        console.error("Error cargando slides:", err);
      }
    };

    loadSlides();
  }, []);

  return slides;
};