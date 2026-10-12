import { useState } from "react";
import toast from "react-hot-toast";
import {
  createProject,
  updateProject,
  deleteProject,
} from "../api/adminProjectApi";
import { validateDateRange } from "../../../shared/lib/validators";

export function useManageProject(refreshActivos, refreshFinalizados) {
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (form) => {
    const dateError = validateDateRange(form.fecha_inicio, form.fecha_fin);
    if (dateError) {
      toast.error(dateError);
      return;
    }

    try {
      const data = {
        titulo: form.titulo,
        min_descripcion: form.min_descripcion,
        descripcion: form.descripcion,
        objetivos: form.objetivos,
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin,
        estado: form.estado,
        image: form.image || "",
        gallery: form.gallery || [],
        videos: form.videos || [],
      };

      await createProject(data);
      toast.success("Proyecto creado");
      await refreshActivos();
      await refreshFinalizados();
      setOpenNew(false);
    } catch (error) {
      console.error(error);
      toast.error("Error creando proyecto");
    }
  };
  const handleEdit = (project) => {
    setEditData(project);
    setOpenEdit(true);
  };

  const handleUpdate = async (id, payload, estado) => {
    const dateError = validateDateRange(payload.fecha_inicio, payload.fecha_fin);
    if (dateError) {
      toast.error(dateError);
      return;
    }

    try {
      setLoading(true);
      await updateProject(id, payload);

      if (estado === "activo") {
        refreshActivos();
      } else {
        refreshFinalizados();
      }

      toast.success("Proyecto actualizado");
      setOpenEdit(false);
    } catch (err) {
      console.error(err);
      toast.error("Error actualizando proyecto");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, estado) => {
    try {
      await deleteProject(id);

      if (estado === "activo") {
        refreshActivos();
      } else {
        refreshFinalizados();
      }

      toast.success("Proyecto eliminado");
    } catch (err) {
      console.error(err);
      toast.error("Error eliminando proyecto");
    }
  };

  return {
    openNew,
    setOpenNew,
    openEdit,
    setOpenEdit,
    editData,
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDelete,
    loading,
  };
}