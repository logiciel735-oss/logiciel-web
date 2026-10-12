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

        // Noticias por fecha de creación, eventos por fecha de inicio (más recientes primero)
        const fecha = (item) =>
          new Date(item.fecha_creacion || item.fecha_inicio || item.created_at || 0);

        const ordenados = [...noticiasConTipo, ...eventosConTipo].sort(
          (a, b) => fecha(b) - fecha(a)
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