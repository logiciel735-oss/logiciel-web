import { useState } from "react";
import toast from "react-hot-toast";

import { mapNewsToApi } from "../../../entities/news/model/newsMapper";
import { mapEventToApi } from "../../../entities/event/model/eventMapper";

import {
  createNoticia,
  updateNoticia,
  deleteNoticia,
  createEvento,
  updateEvento,
  deleteEvento,
} from "../api/adminContentApi";

export function useManageContent(refresh) {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState("");

  // 🔥 DELETE MODAL STATE
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [form, setForm] = useState({
    type: "noticia",
    title: "",
    date: "",
    image: "",
    summary: "",
  });

  // =========================
  // RESET
  // =========================
  const resetForm = () => {
    setForm({
      type: "noticia",
      title: "",
      date: "",
      image: "",
      summary: "",
    });
    setGallery([]);
    setEditing(null);
    setError("");
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (item) => {
    setEditing(item);

    setForm({
      title: item.title || item.titulo || "",
      date: item.date || item.fecha_inicio || "",
      image: item.image || "",
      summary: item.summary || item.resumen || "",
      type: item.type || "noticia",
    });

    setGallery(item.gallery || []);
    setOpenModal(true);
  };

  // =========================
  // DELETE (OPEN MODAL)
  // =========================
  const handleDeleteClick = (item, type) => {
    setItemToDelete({ ...item, type });
    setConfirmDeleteOpen(true);
  };

  // =========================
  // DELETE (CONFIRM)
  // =========================
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setLoadingDelete(true);

    try {
      if (itemToDelete.type === "noticia") {
        await deleteNoticia(itemToDelete.id);
      } else {
        await deleteEvento(itemToDelete.id);
      }

      await refresh();

      toast.success("Eliminado correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar");
    } finally {
      setLoadingDelete(false);
      cancelDelete();
    }
  };

  // =========================
  // CANCEL DELETE
  // =========================
  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setItemToDelete(null);
  };

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {
    try {
      if (!form.title.trim()) {
        setError("El título es obligatorio.");
        return;
      }

      if (!form.date) {
        setError("La fecha es obligatoria.");
        return;
      }

      setError("");

      const payload =
        form.type === "noticia"
          ? mapNewsToApi(form, gallery)
          : mapEventToApi(form, gallery);

      if (editing) {
        if (form.type === "noticia") {
          await updateNoticia(editing.id, payload);
        } else {
          await updateEvento(editing.id, payload);
        }
      } else {
        if (form.type === "noticia") {
          await createNoticia(payload);
        } else {
          await createEvento(payload);
        }
      }

      await refresh();

      resetForm();
      setOpenModal(false);

      toast.success("Guardado correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar");
    }
  };

  return {
    openModal,
    setOpenModal,
    editing,
    form,
    setForm,
    gallery,
    setGallery,
    error,
    handleEdit,

    // DELETE
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    confirmDeleteOpen,
    itemToDelete,
    loadingDelete,

    handleSave,
  };
}