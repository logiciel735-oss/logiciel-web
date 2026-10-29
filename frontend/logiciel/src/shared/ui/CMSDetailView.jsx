import placeholderImg from "../assets/images/placeholder.svg";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { formatDateInput, formatCalendarDate } from "../utils/formatDateInput";
import {
  PencilSquareIcon,
  XMarkIcon,
  TrashIcon,
  ArrowLeftIcon,
  PhotoIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";

import ConfirmModal from "../ui/ConfirmModal";
import Loader from "../components/Loader";
import Modal from "./Modal";
import FormField from "./FormField";
import VideoGallery from "./VideoGallery";
import VideoLinksInput from "./VideoLinksInput";
import { uploadFile } from "../uploadFile/api/uploadApi";
import { useMiembros } from "../../entities/member/model/useMiembros";

import AuthorSelector from "./AuthorSelector";
import { optimizeImage } from "../lib/image";

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
  showVideos = false, // videos de YouTube / Google Drive
  asideTop = null,    // contenido opcional al inicio de la columna lateral (p. ej. estado del evento)
  asideAfterInfo = null, // contenido opcional bajo la tarjeta "Información" (p. ej. botones de compartir)
  extraFormFields = null, // (form, setField) => campos adicionales del formulario de edición
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(item || {});
  const [imgToDelete, setImgToDelete] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { miembros } = useMiembros();

  if (loading) return <div className="relative min-h-[60vh]"><Loader text={loaderLabel} /></div>;

  if (!item) return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-lg font-semibold text-brand-navy">{notFoundLabel}</p>
      <Link to={backPath} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-teal hover:text-brand-teal-dark">
        <ArrowLeftIcon className="h-4 w-4" /> {backLabel}
      </Link>
    </div>
  );

  const mainImage =
    item.image ||
    item.gallery?.[0] ||
    placeholderImg;

  const formatDate = (raw) => {
    if (!raw) return "Sin fecha";
    return formatCalendarDate(raw, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) || "Sin fecha";
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
    } catch (err) {
      toast.error(err?.uploadMessage || "Error subiendo imagen");
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

  /* ── agregar / quitar videos ── */
  const handleVideosChange = async (videos) => {
    try {
      setProcessing(true);
      await onUpdate(item.id, { videos });
      toast.success("Videos actualizados");
      await refresh();
    } catch {
      toast.error("Error actualizando los videos");
    } finally {
      setProcessing(false);
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
  // Quita exactamente ese autor (no todos los que compartan nombre)
  const handleRemoveAutor = async (autor) => {
    try {
      setProcessing(true);
      const newAutores = (item.autores || []).filter((a) => a !== autor);
      await onUpdate(item.id, { [autoresKey]: newAutores });
      toast.success("Eliminado");
      await refresh();
    } catch {
      toast.error("Error eliminando");
    } finally {
      setProcessing(false);
    }
  };

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
      return { ...a, name, user_id: a.miembro_id, esExterno, original: a };
    });

  const datos = (extraFields || []).filter(({ value }) => value);
  const videos = Array.isArray(item.videos) ? item.videos : [];

  return (
    <>
      {/* ENCABEZADO */}
      <section className="relative overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${optimizeImage(mainImage, 1600)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 to-brand-navy/95" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <Link
            to={backPath}
            className="inline-flex items-center gap-1 text-sm font-medium text-teal-200 transition hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" /> {backLabel}
          </Link>

          <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {item.title}
          </h1>
          <div className="mt-5 h-1 w-14 rounded-full bg-brand-teal" />

          {isAdmin && (
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => { setForm(item); setEditing(true); }}
                className="btn-primary"
              >
                <PencilSquareIcon className="h-5 w-5" />
                Editar
              </button>

              {showDeleteButton && onDeleteClick && (
                <button
                  onClick={onDeleteClick}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-300/60 px-5 py-2.5 font-semibold text-red-100 transition hover:bg-red-600 hover:text-white"
                >
                  <TrashIcon className="h-5 w-5" />
                  Eliminar
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CONTENIDO */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3">

        {/* COLUMNA PRINCIPAL */}
        <div className="space-y-10 lg:col-span-2">

          {item.summary && (
            <p className="text-lg leading-relaxed text-slate-700">
              {item.summary}
            </p>
          )}

          {item.content && (
            <section>
              <h2 className="text-xl font-semibold text-brand-navy">Contenido</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">
                {item.content}
              </p>
            </section>
          )}

          {item.description && (
            <section>
              <h2 className="text-xl font-semibold text-brand-navy">Descripción</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">
                {item.description}
              </p>
            </section>
          )}

          {/* ── VIDEOS ── */}
          {showVideos && (videos.length > 0 || isAdmin) && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-brand-navy">
                <PlayCircleIcon className="h-6 w-6 text-brand-teal" />
                Videos
              </h2>

              {videos.length > 0 && (
                <div className="mt-4">
                  <VideoGallery videos={videos} />
                </div>
              )}

              {isAdmin && (
                <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
                  <p className="mb-3 text-sm font-semibold text-brand-navy">Gestionar videos</p>
                  <VideoLinksInput
                    value={videos}
                    onChange={handleVideosChange}
                    disabled={processing}
                  />
                </div>
              )}
            </section>
          )}

          {/* ── AUTORES / INTEGRANTES ── */}
          {showAutores && autoresConDatos.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-brand-navy">{autoresLabel}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {autoresConDatos.map((a, i) => (
                  <div
                    key={a.miembro_id || a.nombre_externo || i}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-teal-light text-xs font-semibold text-brand-teal-dark">
                      {(a.name || "?").charAt(0).toUpperCase()}
                    </span>
                    {!a.esExterno ? (
                      a.name ? (
                        <Link
                          to={`/members/${a.user_id}`}
                          className="text-sm font-semibold text-brand-navy hover:text-brand-teal"
                        >
                          {a.name}
                        </Link>
                      ) : (
                        <span className="inline-block h-3 w-20 animate-pulse rounded-full bg-slate-200" />
                      )
                    ) : (
                      <span className="text-sm font-semibold text-slate-700">
                        {a.name}
                      </span>
                    )}

                    {a.rol && (
                      <span className="text-xs text-slate-500">· {a.rol}</span>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleRemoveAutor(a.original)}
                        className="ml-1 rounded-full p-0.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Quitar"
                      >
                        <XMarkIcon className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── AGREGAR AUTORES (solo admin) ── */}
          {showAutores && isAdmin && (
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-brand-navy">
                Agregar {autoresLabel.toLowerCase()}
              </h2>
              <div className="mt-3">
                <AuthorSelector
                  autores={item.autores || []}
                  label=""
                  setAutores={async (newAutores) => {
                    await onUpdate(item.id, { [autoresKey]: newAutores });
                    await refresh();
                  }}
                />
              </div>
            </section>
          )}
        </div>

        {/* COLUMNA LATERAL */}
        <aside className="space-y-6">
          {asideTop}

          {datos.length > 0 && (
            <div className="card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Información</h2>
              <dl className="mt-4 space-y-3">
                {datos.map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-xs font-medium text-slate-500">{label}</dt>
                    <dd className="mt-0.5 font-medium text-brand-navy first-letter:uppercase">
                      {label.toLowerCase().includes("fecha") ? formatDate(value) : value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {asideAfterInfo}

          {isAdmin && (
            <div className="rounded-xl border border-dashed border-brand-teal/50 bg-brand-teal-light/60 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-teal-dark">
                <PhotoIcon className="h-5 w-5" />
                Agregar imagen a la galería
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAddImage}
                disabled={uploading}
                className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-teal file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-brand-teal-dark disabled:opacity-50"
              />
              {uploading && (
                <p className="mt-2 animate-pulse text-xs text-brand-teal">
                  Subiendo imagen...
                </p>
              )}
            </div>
          )}

          {item.image && (
            <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <span className="absolute left-2 top-2 z-10 rounded-full bg-brand-teal px-2.5 py-0.5 text-xs font-semibold text-white">
                Principal
              </span>
              <img
                src={optimizeImage(item.image, 1200)}
                className="w-full object-cover"
                alt="Imagen principal"
              />
            </div>
          )}

          {item.gallery?.map((img, i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              {isAdmin && (
                <button
                  onClick={() => setImgToDelete(img)}
                  className="absolute right-2 top-2 z-10 rounded-full bg-red-600 p-1 text-white opacity-0 shadow transition hover:bg-red-700 group-hover:opacity-100"
                  aria-label="Eliminar imagen"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
              <img
                src={optimizeImage(img, 1200)}
                className="w-full object-cover"
                alt={`Imagen ${i + 1} de la galería`}
              />
            </div>
          ))}
        </aside>
      </div>

      {/* EDITAR */}
      {editing && (
        <Modal
          title={editTitle}
          onClose={() => setEditing(false)}
          footer={
            <>
              <button onClick={() => setEditing(false)} className="btn-secondary">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={processing} className="btn-primary">
                Guardar cambios
              </button>
            </>
          }
        >
          <EditForm
            form={form}
            setField={setField}
            showAutores={showAutores}
            autoresLabel={autoresLabel}
            extraFormFields={extraFormFields}
          />
        </Modal>
      )}

      {/* CONFIRMAR ELIMINAR IMAGEN */}
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
        />
      )}
    </>
  );
}

function EditForm({ form, setField, showAutores = false, autoresLabel = "Autores", extraFormFields = null }) {
  return (
    <div className="space-y-5">

      <FormField label="Título">
        <input className="input-base" value={form.title || ""} onChange={(e) => setField("title", e.target.value)} />
      </FormField>

      <FormField label="Resumen">
        <textarea rows={2} className="input-base" value={form.summary || ""} onChange={(e) => setField("summary", e.target.value)} />
      </FormField>

      {form.content !== undefined && (
        <FormField label="Contenido">
          <textarea rows={5} className="input-base" value={form.content || ""} onChange={(e) => setField("content", e.target.value)} />
        </FormField>
      )}

      {form.description !== undefined && (
        <FormField label="Descripción">
          <textarea rows={5} className="input-base" value={form.description || ""} onChange={(e) => setField("description", e.target.value)} />
        </FormField>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Fecha inicio">
          <input
            type="date"
            className="input-base"
            value={formatDateInput(form.date)}
            onChange={(e) => setField("date", e.target.value)}
          />
        </FormField>

        {form.dateEnd !== undefined && (
          <FormField label="Fecha fin">
            <input
              type="date"
              className="input-base"
              value={formatDateInput(form.dateEnd)}
              onChange={(e) => setField("dateEnd", e.target.value)}
            />
          </FormField>
        )}
      </div>

      {form.location !== undefined && (
        <FormField label="Ubicación">
          <input className="input-base" value={form.location || ""} onChange={(e) => setField("location", e.target.value)} />
        </FormField>
      )}

      {extraFormFields?.(form, setField)}

      {form.image && (
        <FormField label="Imagen principal">
          <img src={form.image} className="h-40 w-full rounded-lg object-cover" alt="Vista previa" />
        </FormField>
      )}

      {showAutores && (
        <FormField label={autoresLabel}>
          <AuthorSelector
            autores={form.autores || []}
            label=""
            setAutores={(newAutores) => setField("autores", newAutores)}
          />
        </FormField>
      )}

    </div>
  );
}
