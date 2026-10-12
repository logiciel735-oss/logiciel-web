import { fetchCollection, fetchDoc } from "../../../shared/firebaseEntities/firebaseEntities";

const COL = "eventos";

/* ================= GET ================= */

// Obtener todos los eventos
export const getEventos = () => {
  return fetchCollection(COL, "fecha_inicio", "desc");
};

// Obtener evento por ID
export const getEvento = (id) => {
  return fetchDoc(COL, id);
};