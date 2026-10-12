import ImageUploader from "../../../shared/uploadFile/ui/ImageUploader";

export default function ContentFormModal({
  openModal,
  setOpenModal,
  editing,
  form,
  setForm,
  error,
  handleSave,
}) {
  if (!openModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">

        <h3 className="text-xl font-bold mb-4">
          {editing ? "Editar" : "Nueva"} noticia / evento
        </h3>

        {/* ERROR */}
        {error && (
          <p className="text-red-600 mb-3 font-semibold">
            {error}
          </p>
        )}

        {/* 🔥 TIPO (CLAVE) */}
        {editing ? (
          <div className="mb-3">
            <label className="font-semibold">Tipo</label>
            <input
              disabled
              value={
                form.type === "noticia"
                  ? "Noticia"
                  : form.type === "evento"
                    ? "Evento"
                    : "—"
              }
              className="w-full border p-2 bg-gray-100"
            />
          </div>
        ) : (
          <div className="mb-3">
            <label className="font-semibold">Tipo</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  type: e.target.value,
                }))
              }
              className="w-full border p-2"
            >
              <option value="noticia">Noticia</option>
              <option value="evento">Evento</option>
            </select>
          </div>
        )}

        {/* TÍTULO */}
        <label>Título</label>
        <input
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full border p-2 mb-3"
        />

        {/* FECHA */}
        <label>Fecha</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, date: e.target.value }))
          }
          className="w-full border p-2 mb-3"
        />

        {/* RESUMEN */}
        <label>Resumen</label>
        <textarea
          value={form.summary}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, summary: e.target.value }))
          }
          className="w-full border p-2 mb-3"
        />

        {/* IMAGEN PRINCIPAL */}
        <label className="block mb-2 font-semibold">
          Imagen principal
        </label>

        <ImageUploader
          value={form.image}
          onChange={(url) =>
            setForm((prev) => ({ ...prev, image: url }))
          }
        />




        {/* BOTONES */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setOpenModal(false)}
            className="px-4 py-2 border rounded"
          >
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