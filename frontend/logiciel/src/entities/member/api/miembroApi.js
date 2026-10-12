/* ================= GET ================= */

import { fetchCollection, fetchDoc } from "../../../shared/firebaseEntities/firebaseEntities";

const COL = "miembros";

/* ================= GET ================= */

// Obtener todos los miembros
export const getMiembros = () => {
  return fetchCollection(COL, "name", "asc");
};

// Obtener miembro por ID
export const getMiembro = (id) => {
  return fetchDoc(COL, id);
};

