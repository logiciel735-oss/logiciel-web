import { useState } from "react";
import toast from "react-hot-toast";
import {
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
} from "../api/adminPublicationApi";


const FORM_INITIAL = {
  titulo: "",
  autores: [],
  id_revista: "",
  año: "",
  link_revista: "",
  enlace_pdf: "",
};

export function useManagePublication(refresh) {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(FORM_INITIAL);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [publicationToDelete, setPublicationToDelete] = useState(null);
  const [processing, setProcessing] = useState(false);

  // ── Año ──────────────────────────────────────
  const handleYearChange = (e) => {
    const v = e.target.value;
    if (!/^\d*$/.test(v) || v.length > 4) return;
    const y = Number(v);
    if (v.length === 4 && (y < 1970 || y > 2030)) return;
    setForm((prev) => ({ ...prev, año: v }));
  };

  const isYearInvalid =
    form.año && (Number(form.año) < 1970 || Number(form.año) > 2030);

  // ── Guardar ──────────────────────────────────
  const handleSave = async () => {
    const year = Number(form.año);
    if (isNaN(year) || year < 1970 || year > 2030) {
      toast("El año debe estar entre 1970 y 2030", { icon: "ℹ️" });
      return;
    }

    const payload = {
      titulo: form.titulo,
      id_revista: form.id_revista,
      año: year,
      link_revista: form.link_revista,
      enlace_pdf: form.enlace_pdf,
      autores: (form.autores || []).map((a) => ({
        miembro_id: a.miembro_id || "",
        nombre_externo: a.miembro_id ? "" : (a.nombre_externo || ""),
        rol: a.rol || "Autor",
      })),
    };

    try {
      setProcessing(true);
      if (editing) {
        await updatePublicacion(editing.id, payload);
        toast.success("Publicación actualizada");
      } else {
        await createPublicacion(payload);
        toast.success("Publicación creada");
      }
      await refresh();
      resetForm();
      setOpenModal(false);
    } catch {
      toast.error("Error al guardar");
    } finally {
      setProcessing(false);
    }
  };

  // ── Editar ───────────────────────────────────
  const handleEdit = (publication) => {
    setEditing(publication);
    setForm({
      titulo: publication.titulo || "",
      id_revista: publication.id_revista || "",
      año: publication.año?.toString() || "",
      link_revista: publication.link_revista || "",
      enlace_pdf: publication.enlace_pdf || "",
      autores: (publication.autores || []).map((a) => ({
        miembro_id: a.miembro_id || "",
        nombre_externo: a.nombre_externo || "",
        rol: a.rol || "Autor",
      })),
    });
    setOpenModal(true);
  };

  // ── Eliminar ─────────────────────────────────
  const handleDeleteClick = (publication) => {
    setPublicationToDelete(publication);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!publicationToDelete) return;

    try {
      setProcessing(true);

      await deletePublicacion(publicationToDelete.id);

      await refresh();

      toast.success("Publicación eliminada");

    } catch {
      toast.error("Error al eliminar");
    } finally {
      setProcessing(false);
      setConfirmDeleteOpen(false);
      setPublicationToDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setPublicationToDelete(null);
  };

  const resetForm = () => {
    setEditing(null);
    setForm(FORM_INITIAL);
  };

  return {
    openModal, setOpenModal,
    editing,
    form, setForm,
    handleSave,
    handleEdit,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    confirmDeleteOpen,
    publicationToDelete,
    handleYearChange,
    isYearInvalid,
    setEditing,
    processing,
  };
}