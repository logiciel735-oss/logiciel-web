import {
  insertDoc,
  updateDoc,
  deleteDoc,
} from "../../../shared/firebaseEntities/firebaseEntities";
import { cmsCache } from "../../../shared/utils/cmsCache";

const COL = "noticias";
const FIELDS = [
  "titulo",
  "contenido",
  "resumen",
  "image",
  "gallery",
  "fecha_creacion",
  "autores",
  "videos",
];

const normalizeAutores = (data) =>
  data.autores
    ? {
        ...data,
        autores: data.autores.map((a) => ({
          miembro_id: a.miembro_id || "",
          nombre_externo: a.nombre_externo || "",
          rol: a.rol || "Autor",
        })),
      }
    : data;

// El listado público está en caché (cms_noticias): se invalida tras cada cambio
// para que una fecha corregida desde el detalle reordene la lista.
const invalidarLista = (result) => {
  cmsCache.invalidate("cms_noticias");
  return result;
};

export const createNoticia = (data) =>
  insertDoc(COL, { autores: [], ...normalizeAutores(data) }, FIELDS).then(invalidarLista);

export const updateNoticia = (id, data) =>
  updateDoc(COL, id, normalizeAutores(data), FIELDS).then(invalidarLista);

export const deleteNoticia = (id) => deleteDoc(COL, id).then(invalidarLista);
