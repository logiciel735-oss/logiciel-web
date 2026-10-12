import { useState } from "react";
import { deleteProject } from "../api/adminProjectApi";
import toast from "react-hot-toast";

export function useManageProjectDetail(refresh) {
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    try {
      setLoading(true);

      await deleteProject(id);

      toast.success("Proyecto eliminado correctamente");

      setConfirmDeleteOpen(false);

      if (refresh) {
        await refresh();
      }

    } catch (error) {
      console.error(error);
      toast.error("Error eliminando proyecto");
    } finally {
      setLoading(false);
    }
  };

  return {
    openEdit,
    setOpenEdit,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    handleDelete,
    loading,
  };
}