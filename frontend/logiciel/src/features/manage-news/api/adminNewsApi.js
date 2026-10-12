import {
  insertDoc,
  updateDoc,
  deleteDoc,
} from "../../../shared/firebaseEntities/firebaseEntities";

const COL = "noticias";
const FIELDS = [
  "titulo",
  "contenido",
  "resumen",
  "image",
  "gallery",
  "fecha_creacion",
  "autores",
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

export const createNoticia = (data) =>
  insertDoc(COL, { autores: [], ...normalizeAutores(data) }, FIELDS);

export const updateNoticia = (id, data) =>
  updateDoc(COL, id, normalizeAutores(data), FIELDS);

export const deleteNoticia = (id) => deleteDoc(COL, id);
