import placeholderImg from "../assets/images/placeholder.svg";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { formatDateInput }
  from "../utils/formatDateInput";
import { PencilSquareIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";

import ConfirmModal from "../ui/ConfirmModal";
import Loader from "../components/Loader";
import { uploadFile } from "../uploadFile/api/uploadApi";
import { useMiembros } from "../../entities/member/model/useMiembros";

import AuthorSelector from "./AuthorSelector";

export default function CMSDetailView({
  item,
  loading,
  refresh,
  isAdmin,
  backPath,
  backLabel,
  notFoundLabel,
  loaderLabel,
  editTitle,
  extraFields,
  toApiPayload,
  onUpdate,
  validate,          // (form) => mensaje de error | null
  showAutores = false,
  autoresLabel = "Autores",
  showDeleteButton = false,
  onDeleteClick = null,
  autoresKey = "autores",
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(item || {});
  const [imgToDelete, setImgToDelete] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { miembros } = useMiembros();

  // Si llega un item nuevo (recarga), el formulario se sincroniza durante el render
  const [prevItem, setPrevItem] = useState(item);
  if (item !== prevItem) {
    setPrevItem(item);
    setForm(item || {});
  }

  if (loading) return <Loader text={loaderLabel} />;

  if (!item) return (
    <div className="py-20 text-center text-gray-500">{notFoundLabel}</div>
  );

  const mainImage =
    item.image ||
    item.gallery?.[0] ||
    placeholderImg;

  const formatDate = (raw) => {
    if (!raw) return "Sin fecha";
    return new Date(raw).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  /* ── subir imagen ── */
  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    try {
      setUploading(true);
      const result = await uploadFile(file);
      const newGallery = [...(item.gallery || []), result.url];
      await onUpdate(item.id, { gallery: newGallery });
      toast.success("Imagen añadida");
      await refresh();
    } catch {
      toast.error("Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  /* ── eliminar imagen ── */
  const handleDeleteImage = async () => {
    try {
      const newGallery = item.gallery.filter((img) => img !== imgToDelete);
      await onUpdate(item.id, { gallery: newGallery });
      toast.success("Imagen eliminada");
      setImgToDelete(null);
      await refresh();
    } catch {
      toast.error("Error eliminando imagen");
    }
  };

  /* ── guardar edición ── */
  const handleSave = async () => {
    const validationError = validate?.(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setProcessing(true);

      await onUpdate(item.id, toApiPayload(form));

      toast.success("Guardado correctamente");

      await refresh();

      setEditing(false);

    } catch {
      toast.error("Error guardando cambios");
    } finally {
      setProcessing(false);
    }
  };

  /* ── eliminar autor ── */
  const handleRemoveAutor = async (miembro_id, nombre_externo) => {
    try {
      setProcessing(true);
      const newAutores = (item.autores || []).filter((a) => {
        if (miembro_id) return a.miembro_id !== miembro_id;
        return a.nombre_externo !== nombre_externo;
      });
      await onUpdate(item.id, { [autoresKey]: newAutores });
      toast.success("Eliminado");
      await refresh();
    } catch {
      toast.error("Error eliminando");
    } finally {
      setProcessing(false);
    }
  };

  // ── FIX: ahora miembros siempre es un array válido ──
  const autoresConDatos = (item.autores || [])
    .filter((a) => {
      const tieneInterno = a.miembro_id && a.miembro_id !== "";
      const tieneExterno = a.nombre_externo != null && a.nombre_externo.trim() !== "";
      return tieneInterno || tieneExterno;
    })
    .map((a) => {
      const found = (miembros || []).find((m) => m.user_id === a.miembro_id);
      const esExterno = !a.miembro_id || a.miembro_id === "";
      const name = esExterno
        ? (a.nombre_externo || "")
        : (found?.name || null);
      return { ...a, name, user_id: a.miembro_id, esExterno };
    });
  return (
    <>
      {/* HERO */}
      <section
        className="relative h-[55vh] bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: `url(${mainImage})` }}
      >
        <div className="absolute inset-0 bg-[rgba(10,25,47,0.75)]" />
        <h1 className="relative z-10 text-4xl font-bold text-center px-6">
          {item.title}
        </h1>

        {isAdmin && (
          <div className="relative z-10 mt-6 flex gap-3">
            <button
              onClick={() => { setForm(item); setEditing(true); }}
              className="flex items-center gap-2 bg-yellow-400 px-5 py-2 rounded-lg font-bold text-black hover:bg-yellow-500 transition shadow"
            >
              <PencilSquareIcon className="w-5 h-5" />
              Editar
            </button>

            {showDeleteButton && onDeleteClick && (
              <button
                onClick={onDeleteClick}
                className="flex items-center gap-2 bg-red-600 px-5 py-2 rounded-lg font-bold text-white hover:bg-red-700 transition shadow"
              >
                <TrashIcon className="w-5 h-5" />
                Eliminar
              </button>
            )}
          </div>
        )}
      </section>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">

        {/* TEXTO */}
        <div className="lg:col-span-2 space-y-6">

          {item.summary && (
            <p className="text-gray-700 text-lg leading-relaxed">
              {item.summary}
            </p>
          )}

          {item.content && (
            <div>
              <h3 className="font-bold text-lg mb-2">Contenido</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {item.content}
              </p>
            </div>
          )}

          {item.description && (
            <div>
              <h3 className="font-bold text-lg mb-2">Descripción</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {extraFields?.map(({ label, value }) =>
            value ? (
              <p key={label} className="text-gray-500 text-sm">
                <strong>{label}:</strong>{" "}
                {label.toLowerCase().includes("fecha")
                  ? formatDate(value)
                  : value}
              </p>
            ) : null
          )}

          {/* ── AUTORES / INTEGRANTES ── */}
          {showAutores && autoresConDatos.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">{autoresLabel}</h3>
              <div className="flex flex-wrap gap-3">
                {autoresConDatos.map((a, i) => (
                  <div
                    key={a.miembro_id || a.nombre_externo || i}
                    className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-2"
                  >
                    {!a.esExterno ? (
                      a.name ? (
                        <Link
                          to={`/members/${a.user_id}`}
                          className="text-teal-700 font-semibold hover:underline text-sm"
                        >
                          {a.name}
                        </Link>
                      ) : (
                        <span className="inline-block h-3 w-20 bg-teal-200 animate-pulse rounded-full" />
                      )
                    ) : (
                      <span className="text-gray-700 font-semibold text-sm">
                        {a.name}
                      </span>
                    )}

                    {a.rol && (
                      <span className="text-xs text-gray-500">· {a.rol}</span>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleRemoveAutor(a.miembro_id, a.nombre_externo)}
                        className="text-red-400 hover:text-red-600 ml-1"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BUSCADOR + EXTERNO (solo admin) ── */}
          {showAutores && isAdmin && (
            <div className="space-y-3">
              <h3 className="font-bold text-lg">
                Agregar {autoresLabel.toLowerCase()}
              </h3>
              <AuthorSelector
                autores={item.autores || []}
                label=""
                setAutores={async (newAutores) => {
                  await onUpdate(item.id, { [autoresKey]: newAutores });
                  await refresh();
                }}
              />
            </div>
          )}

          <Link to={backPath} className="text-teal-600 hover:underline block mt-6">
            ← {backLabel}
          </Link>
        </div>

        {/* GALERÍA */}
        <div className="space-y-4">
          {isAdmin && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-teal-700 mb-2">
                Agregar imagen a la galería
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleAddImage}
                disabled={uploading}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer disabled:opacity-50"
              />
              {uploading && (
                <p className="text-xs text-teal-600 mt-2 animate-pulse">
                  Subiendo imagen...
                </p>
              )}
            </div>
          )}

          {item.image && (
            <div className="relative">
              <span className="absolute top-2 left-2 bg-teal-600 text-white text-xs px-2 py-1 rounded z-10">
                Principal
              </span>
              <img
                src={item.image}
                className="rounded-xl w-full object-cover"
                alt="imagen-principal"
              />
            </div>
          )}

          {item.gallery?.map((img, i) => (
            <div key={i} className="relative group">
              {isAdmin && (
                <button
                  onClick={() => setImgToDelete(img)}
                  className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
              <img
                src={img}
                className="rounded-xl w-full object-cover"
                alt={`imagen-${i}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {editTitle}
            </h3>

            <EditForm
              form={form}
              setField={setField}
              showAutores={showAutores}
              autoresLabel={autoresLabel}
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={processing}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE IMAGEN */}
      <ConfirmModal
        open={!!imgToDelete}
        title="Eliminar imagen"
        message="¿Estás seguro de que quieres eliminar esta imagen?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteImage}
        onCancel={() => setImgToDelete(null)}
      />
      {processing && (
        <Loader
          text="Procesando..."
          fullscreen={true}
          bg="bg-black/40 backdrop-blur-sm"
          color="#14B8A6"
          size={90}
        />
      )}
    </>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        {label}
      </label>
      {children}
    </div>
  );
}

function EditForm({ form, setField, showAutores = false, autoresLabel = "Autores" }) {
  return (
    <div className="space-y-4">

      <Field label="Título">
        <input className="input-base" value={form.title || ""} onChange={(e) => setField("title", e.target.value)} />
      </Field>

      <Field label="Resumen">
        <textarea rows={2} className="input-base" value={form.summary || ""} onChange={(e) => setField("summary", e.target.value)} />
      </Field>

      {form.content !== undefined && (
        <Field label="Contenido">
          <textarea rows={4} className="input-base" value={form.content || ""} onChange={(e) => setField("content", e.target.value)} />
        </Field>
      )}

      {form.description !== undefined && (
        <Field label="Descripción">
          <textarea rows={4} className="input-base" value={form.description || ""} onChange={(e) => setField("description", e.target.value)} />
        </Field>
      )}

      <Field label="Fecha inicio">
        <input
          type="date"
          className="input-base"
          value={formatDateInput(form.date)}
          onChange={(e) => setField("date", e.target.value)}
        />
      </Field>

      {form.dateEnd !== undefined && (
        <Field label="Fecha fin">
          <input
            type="date"
            className="input-base"
            value={formatDateInput(form.dateEnd)}
            onChange={(e) => setField("dateEnd", e.target.value)}
          />
        </Field>
      )}

      {form.location !== undefined && (
        <Field label="Ubicación">
          <input className="input-base" value={form.location || ""} onChange={(e) => setField("location", e.target.value)} />
        </Field>
      )}

      <Field label="Imagen principal (URL)">

        {form.image && (
          <img src={form.image} className="mt-2 rounded-lg w-full h-40 object-cover" alt="preview" />
        )}
      </Field>

      {showAutores && (
        <Field label={autoresLabel}>
          <AuthorSelector
            autores={form.autores || []}
            label=""
            setAutores={(newAutores) => setField("autores", newAutores)}
          />
        </Field>
      )}
      
    </div>
  );
}