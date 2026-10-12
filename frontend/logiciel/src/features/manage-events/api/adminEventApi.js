import {
  insertDoc,
  updateDoc,
  deleteDoc,
} from "../../../shared/firebaseEntities/firebaseEntities";

const COL = "eventos";
const FIELDS = [
  "titulo",
  "resumen",
  "descripcion",
  "fecha_inicio",
  "fecha_fin",
  "ubicacion",
  "image",
  "gallery",
];

// — Eventos —
export const createEvento = (data) => insertDoc(COL, data, FIELDS);

export const updateEvento = (id, data) => updateDoc(COL, id, data, FIELDS);

export const deleteEvento = (id) => deleteDoc(COL, id);
