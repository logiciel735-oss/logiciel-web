import AuthorSelector from "../../../shared/ui/AuthorSelector";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <h3 className="font-bold text-xl mb-4">
          {editing ? "Editar publicación" : "Nueva publicación"}
        </h3>

        {/* 🔹 INPUTS */}
        <input
          className="w-full border p-2 mb-2"
          placeholder="Título"
          value={form.titulo || ""}
          onChange={(e) =>
            setForm({ ...form, titulo: e.target.value })
          }
        />



        <input
          className={`w-full border p-2 mb-2 ${isYearInvalid ? "border-red-500" : ""
            }`}
          placeholder="Año"
          value={form.año || ""}
          onChange={handleYearChange}
        />
        <input
          className="w-full border p-2 mb-2"
          placeholder="Link revista"
          value={form.id_revista || ""}
          onChange={(e) =>
            setForm({ ...form, id_revista: e.target.value })
          }
        />

        <input
          className="w-full border p-2 mb-4"
          placeholder="Link PDF"
          value={form.enlace_pdf || ""}
          onChange={(e) =>
            setForm({ ...form, enlace_pdf: e.target.value })
          }
        />


        <AuthorSelector
          autores={form.autores}
          setAutores={(autores) =>
            setForm({ ...form, autores })
          }
        />


        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setOpenModal(false)}>
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}