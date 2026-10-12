import {
  insertDoc,
  updateDoc,
  deleteDoc,
} from "../../../shared/firebaseEntities/firebaseEntities";

const COL = "publicaciones_cientificas";
const FIELDS = ["id_revista", "titulo", "autores", "año", "link_revista", "enlace_pdf"];

// Igual que el serializer de Django: descarta autores vacíos
const normalizeAutores = (data) =>
  data.autores
    ? {
        ...data,
        autores: data.autores
          .filter((a) => a.miembro_id || a.nombre_externo)
          .map((a) => ({
            miembro_id: a.miembro_id || "",
            nombre_externo: a.nombre_externo || "",
            rol: a.rol || "Autor",
          })),
      }
    : data;

// =============================
// ADMIN CRUD PUBLICACIONES
// =============================

export const createPublicacion = (data) =>
  insertDoc(COL, { autores: [], ...normalizeAutores(data) }, FIELDS);

export const updatePublicacion = (id, data) =>
  updateDoc(COL, id, normalizeAutores(data), FIELDS);

export const deletePublicacion = (id) => deleteDoc(COL, id);
