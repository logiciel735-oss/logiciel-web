import { useState } from "react";
import Modal from "../../../shared/ui/Modal";
import FormField from "../../../shared/ui/FormField";
import { RoleBadge } from "./UsersTable";

// El padre le pone key={user.id}: al cambiar de usuario se vuelve a montar con sus datos
const EditUserModal = ({ user, onClose, onSave }) => {

  const [form, setForm] = useState(() => ({
    name: user?.name || "",
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
      <FormField label="Nombre">
        <input
          className="input-base"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </FormField>

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
        hint={form.role === "admin"
          ? "Los administradores no se pueden degradar desde aquí."
          : "Para dar permisos de administrador usa el botón “Promover” de la lista."}
      >
        <div>
          <RoleBadge role={form.role} />
        </div>
      </FormField>
    </Modal>
  );
};

export default EditUserModal;
