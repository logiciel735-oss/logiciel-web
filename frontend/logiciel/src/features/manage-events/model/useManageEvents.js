import { useState } from "react";
import toast from "react-hot-toast";

import { mapEventToApi } from "../../../entities/event/model/eventMapper";
import {
  createEvento,
  updateEvento,
  deleteEvento,
} from "../../manage-events/api/adminEventApi.js";
import { validateDateRange } from "../../../shared/lib/validators";
import { formatDateInput } from "../../../shared/utils/formatDateInput";

export function useManageEvents(refresh) {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const handleEdit = (item) => {
    setEditing(item);
    setForm(item);
    setOpenModal(true);
  };

  const handleSave = async () => {
    const dateError = validateDateRange(
      formatDateInput(form.date),
      formatDateInput(form.dateEnd)
    );
    if (dateError) {
      toast.error(dateError);
      return;
    }

    try {
      const payload = mapEventToApi(form, form.gallery || []);

      if (editing) {
        await updateEvento(editing.id, payload);
      } else {
        await createEvento(payload);
      }

      await refresh();
      setOpenModal(false);
      toast.success("Guardado correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvento(id);
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
    handleEdit,
    handleSave,
    handleDelete,
  };
}