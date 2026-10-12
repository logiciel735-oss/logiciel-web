import { fetchCollection, fetchDoc } from "../../../shared/firebaseEntities/firebaseEntities";

const COL = "noticias";

// Obtener todas las noticias
export const getNoticias = () => {
  return fetchCollection(COL, "fecha_creacion", "desc");
};

// Obtener una noticia por ID
export const getNoticia = (id) => {
  return fetchDoc(COL, id);
};