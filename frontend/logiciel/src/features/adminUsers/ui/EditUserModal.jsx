import { useState } from "react";
import Modal from "../../../shared/ui/Modal";
import FormField from "../../../shared/ui/FormField";
import { RoleBadge } from "./UsersTable";

// El padre le pone key={user.id}: al cambiar de usuario se vuelve a montar con sus datos
const EditUserModal = ({ user, onClose, onSave }) => {

  const [form, setForm] = useState(() => ({
    nombres: user?.nombres || user?.name || "",
    apellidos: user?.apellidos || "",
    email: user?.email || "",
    role: user?.role || "",
  }));

  if (!user) return null;

  const handleSave = () => {
    onSave(user.id, form);
    onClose();
  };

  return (
    <Modal
      title="Editar usuario"
      size="md"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSave} className="btn-primary">
            Guardar cambios
          </button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Nombres">
          <input
            className="input-base"
            value={form.nombres}
            onChange={(e) =>
              setForm({ ...form, nombres: e.target.value })
            }
          />
        </FormField>

        <FormField label="Apellidos">
          <input
            className="input-base"
            value={form.apellidos}
            onChange={(e) =>
              setForm({ ...form, apellidos: e.target.value })
            }
          />
        </FormField>
      </div>

      <FormField label="Correo">
        <input
          className="input-base"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
      </FormField>

      <FormField
        label="Rol"
        hint="Para cambiar el rol usa el selector de la columna “Acciones” de la lista."
      >
        <div>
          <RoleBadge role={form.role} />
        </div>
      </FormField>
    </Modal>
  );
};

export default EditUserModal;
