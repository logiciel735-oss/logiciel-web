import {
  insertDoc,
  updateDoc,
  deleteDoc,
} from "../../../shared/firebaseEntities/firebaseEntities";

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

export const createProject = (data) =>
  insertDoc(COL, { integrantes: [], ...normalizeIntegrantes(data) }, FIELDS);

export const updateProject = (id, data) =>
  updateDoc(COL, id, normalizeIntegrantes(data), FIELDS);

export const deleteProject = async (id) => {
  await deleteDoc(COL, id);
  return true;
};
