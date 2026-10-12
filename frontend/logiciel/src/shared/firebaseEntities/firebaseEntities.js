// Acceso a datos con Supabase.
// Se mantiene el nombre del archivo y de fetchCollection / fetchDoc
// para no romper los imports existentes.

import { supabase } from "../config/supabase";

// Columnas de fecha: un "" del formulario se guarda como null
const DATE_FIELDS = ["fecha_inicio", "fecha_fin", "fecha_creacion"];

/**
 * Obtener lista ordenada
 */
export const fetchCollection = async (table, orderField = null, direction = "desc") => {
  try {
    let query = supabase.from(table).select("*");

    if (orderField) {
      query = query.order(orderField, { ascending: direction === "asc" });
    }

    const { data, error } = await query;
    if (error) throw error;

    return data;
  } catch (error) {
    console.error(`ERROR FETCH ${table}:`, error);
    return [];
  }
};

/**
 * Obtener registro por ID
 */
export const fetchDoc = async (table, id) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error(`${table} not found`);

    return data;
  } catch (error) {
    console.error(`ERROR FETCH DOC ${table}:`, error);
    throw error;
  }
};

/**
 * Deja solo los campos permitidos (equivalente a los serializers de Django)
 */
export const pickFields = (data = {}, fields) => {
  const clean = {};

  fields.forEach((field) => {
    if (data[field] === undefined) return;

    clean[field] =
      DATE_FIELDS.includes(field) && data[field] === "" ? null : data[field];
  });

  return clean;
};

/**
 * Crear registro
 */
export const insertDoc = async (table, data, fields) => {
  const { data: created, error } = await supabase
    .from(table)
    .insert(pickFields(data, fields))
    .select()
    .single();

  if (error) throw error;
  return created;
};

/**
 * Actualizar registro
 */
export const updateDoc = async (table, id, data, fields) => {
  const { data: updated, error } = await supabase
    .from(table)
    .update(pickFields(data, fields))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return updated;
};

/**
 * Eliminar registro
 */
export const deleteDoc = async (table, id) => {
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) throw error;
  return null;
};
