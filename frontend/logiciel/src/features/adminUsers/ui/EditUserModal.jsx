import { useState } from "react";
import Modal from "../../../shared/ui/Modal";
import FormField from "../../../shared/ui/FormField";
import { RoleBadge } from "./UsersTable";
import { validatePersonName } from "../../../shared/lib/validators";

// El padre le pone key={user.id}: al cambiar de usuario se vuelve a montar con sus datos
const EditUserModal = ({ user, onClose, onSave }) => {

  const [form, setForm] = useState(() => ({
    nombres: user?.nombres || user?.name || "",
    apellidos: user?.apellidos || "",
    email: user?.email || "",
    role: user?.role || "",
  }));

  if (!user) return null;

  const nombresError = validatePersonName(form.nombres, { label: "Nombres" });
  const apellidosError = validatePersonName(form.apellidos, { label: "Apellidos", required: false });
  const invalid = !!(nombresError || apellidosError);

  const handleSave = () => {
    if (invalid) return;
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
          <button onClick={handleSave} disabled={invalid} className="btn-primary">
            Guardar cambios
          </button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Nombres" error={nombresError}>
          <input
            className="input-base"
            value={form.nombres}
            onChange={(e) =>
              setForm({ ...form, nombres: e.target.value })
            }
          />
        </FormField>

        <FormField label="Apellidos" error={apellidosError}>
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
