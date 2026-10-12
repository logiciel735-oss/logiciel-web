import { fetchCollection, fetchDoc } from "../../../shared/firebaseEntities/firebaseEntities";

const COL = "proyectos";

/**
 * Obtener todos los proyectos ordenados por fecha de creación
 */
export const getProjects = () => {
  return fetchCollection(COL, "fecha_creacion", "desc");
};

/**
 * Obtener un proyecto específico por ID
 */
export const getProject = (id) => {
  return fetchDoc(COL, id);
};