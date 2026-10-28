import {
  insertDoc,
  updateDoc,
  deleteDoc,
} from "../../../shared/firebaseEntities/firebaseEntities";
import { cmsCache } from "../../../shared/utils/cmsCache";

const COL = "proyectos";
const FIELDS = [
  "titulo",
  "descripcion",
  "min_descripcion",
  "objetivos",
  "estado",
  "fecha_inicio",
  "fecha_fin",
  "image",
  "gallery",
  "integrantes",
  "videos",
];

const normalizeIntegrantes = (data) =>
  data.integrantes
    ? {
        ...data,
        integrantes: data.integrantes.map((i) => ({
          miembro_id: i.miembro_id || "",
          nombre_externo: i.nombre_externo || "",
          rol: i.rol || "Integrante",
        })),
      }
    : data;

// El listado público está en caché (cms_proyectos): se invalida tras cada cambio
const invalidarLista = (result) => {
  cmsCache.invalidate("cms_proyectos");
  return result;
};

export const createProject = (data) =>
  insertDoc(COL, { integrantes: [], ...normalizeIntegrantes(data) }, FIELDS).then(invalidarLista);

export const updateProject = (id, data) =>
  updateDoc(COL, id, normalizeIntegrantes(data), FIELDS).then(invalidarLista);

export const deleteProject = async (id) => {
  await deleteDoc(COL, id);
  invalidarLista();
  return true;
};
