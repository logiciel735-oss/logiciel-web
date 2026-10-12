import {
  fetchCollection,
  fetchDoc,
} from "../../../shared/firebaseEntities/firebaseEntities";

const COL = "publicaciones_cientificas";

/* ================= GET ================= */

// Obtener todas las publicaciones científicas
export const getPublicaciones = () => {
  return fetchCollection(COL, "año", "desc");
};

// Obtener publicación por ID
export const getPublicacion = (id) => {
  return fetchDoc(COL, id);
};
