import AuthorSelector from "../../../shared/ui/AuthorSelector";
import Modal from "../../../shared/ui/Modal";
import FormField from "../../../shared/ui/FormField";

export default function PublicationFormModal({
  openModal,
  setOpenModal,
  editing,
  form,
  setForm,
  handleSave,
  handleYearChange,
  isYearInvalid,
}) {
  if (!openModal) return null;

  return (
    <Modal
      title={editing ? "Editar publicación" : "Nueva publicación"}
      onClose={() => setOpenModal(false)}
      footer={
        <>
          <button onClick={() => setOpenModal(false)} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSave} className="btn-primary">
            Guardar
          </button>
        </>
      }
    >
      <FormField label="Título">
        <input
          className="input-base"
          placeholder="Título de la publicación"
          value={form.titulo || ""}
          onChange={(e) =>
            setForm({ ...form, titulo: e.target.value })
          }
        />
      </FormField>

      <FormField
        label="Año"
        error={isYearInvalid ? "El año debe estar entre 1970 y 2030." : null}
      >
        <input
          className={`input-base sm:max-w-[10rem] ${isYearInvalid ? "border-red-400" : ""}`}
          placeholder="Ej. 2024"
          inputMode="numeric"
          value={form.año || ""}
          onChange={handleYearChange}
        />
      </FormField>

      <FormField label="Enlace de la revista">
        <input
          className="input-base"
          placeholder="https://..."
          value={form.id_revista || ""}
          onChange={(e) =>
            setForm({ ...form, id_revista: e.target.value })
          }
        />
      </FormField>

      <FormField label="Enlace al PDF">
        <input
          className="input-base"
          placeholder="https://..."
          value={form.enlace_pdf || ""}
          onChange={(e) =>
            setForm({ ...form, enlace_pdf: e.target.value })
          }
        />
      </FormField>

      <AuthorSelector
        autores={form.autores}
        setAutores={(autores) =>
          setForm({ ...form, autores })
        }
      />
    </Modal>
  );
}
