import { useState } from "react";
import toast from "react-hot-toast";

import { mapNewsToApi } from "../../../entities/news/model/newsMapper";
import {
  createNoticia,
  updateNoticia,
  deleteNoticia,
} from "../api/adminNewsApi";

export function useManageNews(refresh) {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const handleEdit = (item) => {
    setEditing(item);
    setForm(item);
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = mapNewsToApi(form, form.gallery || []);

      if (editing) {
        await updateNoticia(editing.id, payload);
      } else {
        await createNoticia(payload);
      }

      await refresh();
      setOpenModal(false);
      toast.success("Guardado correctamente");
    } catch (err) {
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNoticia(id);
      await refresh();
      toast.success("Eliminado correctamente");
    } catch {
      toast.error("Error eliminando");
    }
  };

  return {
    openModal,
    setOpenModal,
    editing,
    form,
    setForm,
    error,
    handleEdit,
    handleSave,
    handleDelete,
  };
}