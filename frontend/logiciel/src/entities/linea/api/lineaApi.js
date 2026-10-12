import {
  fetchCollection,
  fetchDoc,
  insertDoc,
  updateDoc,
  deleteDoc,
} from "../../../shared/firebaseEntities/firebaseEntities";

const COL = "lineas_investigacion";
const FIELDS = ["nombre", "descripcion", "coordinador", "imagen_url"];

/* ================= GET ================= */

// Obtener todas las líneas
export const getLineas = () => {
  return fetchCollection(COL);
};

// Obtener línea por ID
export const getLinea = (id) => {
  return fetchDoc(COL, id);
};

/* ================= ADMIN ================= */

export const createLinea = (data) => insertDoc(COL, data, FIELDS);

export const updateLinea = (id, data) => updateDoc(COL, id, data, FIELDS);

export const deleteLinea = (id) => deleteDoc(COL, id);
