import {
  fetchCollection,
  fetchDoc,
  insertDoc,
  updateDoc,
  deleteDoc,
} from "../../../shared/firebaseEntities/firebaseEntities";

const COL = "semilleros";
const FIELDS = ["nombre", "slogan", "link", "imagen_url"];

/* ================= GET ================= */

// Obtener todos los semilleros
export const getSemilleros = () => {
  return fetchCollection(COL, "nombre", "asc");
};

// Obtener semillero por ID
export const getSemillero = (id) => {
  return fetchDoc(COL, id);
};

/* ================= ADMIN ================= */

export const createSemillero = (data) => insertDoc(COL, data, FIELDS);

export const updateSemillero = (id, data) => updateDoc(COL, id, data, FIELDS);

export const deleteSemillero = (id) => deleteDoc(COL, id);
