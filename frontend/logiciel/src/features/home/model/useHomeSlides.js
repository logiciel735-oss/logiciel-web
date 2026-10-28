import { useEffect, useState } from "react";
import { getNoticias } from "../../../entities/news/api/newsApi";
import { getEventos } from "../../../entities/event/api/eventApi"
import { splitEvents } from "../../../entities/event/model/eventStatus";
import { toCalendarDate } from "../../../shared/utils/formatDateInput";

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

        // Los eventos pasados (más de GRACE_DAYS días) no salen en la portada
        const { activos } = splitEvents(eventos || [], (e) => [e.fecha_inicio, e.fecha_fin, e.hora_inicio, e.hora_fin]);
        const eventosConTipo = activos.map(({ item, status }) => ({
          ...item,
          __type: "event",
          __status: status,
        }));

        // Primero los eventos de hoy, en curso y próximos (el más cercano primero)
        const destacados = eventosConTipo.filter((e) =>
          ["today", "ongoing", "upcoming"].includes(e.__status?.key)
        );

        // Después noticias y eventos recién finalizados, del más reciente al más antiguo
        const fecha = (item) =>
          toCalendarDate(item.__type === "event" ? item.fecha_inicio : item.fecha_creacion || item.created_at)
            ?.getTime() ?? 0;

        const resto = [
          ...noticiasConTipo,
          ...eventosConTipo.filter((e) => !destacados.includes(e)),
        ].sort((a, b) => fecha(b) - fecha(a));

        setSlides([...destacados, ...resto]);
      } catch (err) {
        console.error("Error cargando slides:", err);
      }
    };

    loadSlides();
  }, []);

  return slides;
};
