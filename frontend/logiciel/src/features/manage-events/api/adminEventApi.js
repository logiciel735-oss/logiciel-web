import {
  insertDoc,
  updateDoc,
  deleteDoc,
} from "../../../shared/firebaseEntities/firebaseEntities";
import { cmsCache } from "../../../shared/utils/cmsCache";

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

// El listado público está en caché (eventos): se invalida tras cada cambio
const invalidarLista = (result) => {
  cmsCache.invalidate("eventos");
  return result;
};

// — Eventos —
export const createEvento = (data) => insertDoc(COL, data, FIELDS).then(invalidarLista);

export const updateEvento = (id, data) => updateDoc(COL, id, data, FIELDS).then(invalidarLista);

export const deleteEvento = (id) => deleteDoc(COL, id).then(invalidarLista);
