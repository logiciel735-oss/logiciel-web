import {
  fetchCollection,
  fetchDoc,
  insertDoc,
  updateDoc,
  deleteDoc,
} from "../../../shared/firebaseEntities/firebaseEntities";

const COL = "aliados_institucionales";
const FIELDS = ["nombre", "tipo", "descripcion", "logo_url", "sitio_web", "pais"];

/* ================= GET ================= */

// Obtener todos los aliados institucionales
export const getAliadosInstitucionales = () => {
  return fetchCollection(COL, "nombre", "asc");
};

// Obtener aliado institucional por ID
export const getAliadoInstitucional = (id) => {
  return fetchDoc(COL, id);
};

/* ================= ADMIN ================= */

export const createAliadoInstitucional = (data) => insertDoc(COL, data, FIELDS);

export const updateAliadoInstitucional = (id, data) => updateDoc(COL, id, data, FIELDS);

export const deleteAliadoInstitucional = (id) => deleteDoc(COL, id);
