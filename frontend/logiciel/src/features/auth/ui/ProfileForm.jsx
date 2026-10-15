import { CameraIcon, TrashIcon } from "@heroicons/react/24/outline";
import Loader from "../../../shared/components/Loader";
import PageHeader from "../../../shared/ui/PageHeader";
import FormField from "../../../shared/ui/FormField";
import LinkedInIcon from "../../../shared/ui/LinkedInIcon";
import { ROLE_LABELS } from "../model/permissions";

const CVLAC_REGEX = /^https:\/\/scienti\.minciencias\.gov\.co\/cvlac\/.+/;

const ProfileForm = ({
  user,
  form,
  setForm,
  avatarPreview,
  loading,
  saving,
  formIsValid,
  hasChanges,
  handleAvatarChange,
  removeAvatar,
  linkedinIsValid,
  saveProfile,
  descriptionLength,
  MAX_DESCRIPTION_CHARS,
}) => {

  if (loading) {
    return <div className="relative min-h-[60vh]"><Loader text="Cargando perfil..." /></div>;
  }

  const cvlacError = form.cvlac_url && !CVLAC_REGEX.test(form.cvlac_url)
    ? "Debe ser un enlace válido de CVLAC"
    : null;
  const descriptionTooLong = descriptionLength > MAX_DESCRIPTION_CHARS;
  const fullName = `${form.nombres} ${form.apellidos}`.trim();

  return (
    <div>
      <PageHeader
        eyebrow="Mi cuenta"
        title="Mi perfil"
        description="Esta información aparece en tu perfil público como miembro del grupo."
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveProfile();
          }}
          className="card grid gap-8 p-6 hover:shadow-sm sm:p-8 md:grid-cols-[220px_1fr]"
        >

          {/* AVATAR */}
          <div className="flex flex-col items-center text-center md:border-r md:border-slate-100 md:pr-8">
            <label className="group relative cursor-pointer">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-brand-navy text-4xl font-semibold text-white ring-4 ring-brand-teal-light">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  fullName.charAt(0).toUpperCase()
                )}
              </div>
              <span className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-brand-teal text-white shadow transition group-hover:bg-brand-teal-dark">
                <CameraIcon className="h-5 w-5" />
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => handleAvatarChange(e.target.files[0])}
                className="sr-only"
              />
            </label>

            <p className="mt-3 text-xs text-slate-500">Haz clic en la foto para cambiarla</p>

            {avatarPreview && (
              <button
                type="button"
                onClick={removeAvatar}
                className="mt-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Quitar foto
              </button>
            )}

            <p className="mt-5 font-semibold text-brand-navy">{fullName || "Sin nombre"}</p>
            {user?.role && (
              <span className="mt-2 inline-block rounded-full bg-brand-teal-light px-3 py-1 text-xs font-semibold capitalize text-brand-teal-dark">
                {ROLE_LABELS[user.role] || user.role}
              </span>
            )}
          </div>

          {/* CAMPOS */}
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Nombres" required error={!form.nombres.trim() ? "Escribe tus nombres" : null}>
                <input
                  type="text"
                  autoComplete="given-name"
                  className="input-base"
                  value={form.nombres}
                  onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                />
              </FormField>

              <FormField label="Apellidos" required error={!form.apellidos.trim() ? "Escribe tus apellidos" : null}>
                <input
                  type="text"
                  autoComplete="family-name"
                  className="input-base"
                  value={form.apellidos}
                  onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="Correo electrónico">
              <input
                type="email"
                className="input-base"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </FormField>

            <FormField label="Universidad">
              <input
                type="text"
                className="input-base"
                value={form.universidad}
                onChange={(e) => setForm({ ...form, universidad: e.target.value })}
              />
            </FormField>

            <FormField
              label="Enlace CvLAC"
              hint="Ej.: https://scienti.minciencias.gov.co/cvlac/visualizador/..."
              error={cvlacError}
            >
              <input
                type="url"
                className={`input-base ${cvlacError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}`}
                value={form.cvlac_url}
                onChange={(e) => setForm({ ...form, cvlac_url: e.target.value })}
              />
            </FormField>

            <FormField
              label="Perfil de LinkedIn"
              hint="Ej.: https://www.linkedin.com/in/tu-usuario"
              error={!linkedinIsValid ? "Debe ser un enlace de perfil de LinkedIn (https://www.linkedin.com/in/…)" : null}
            >
              <div className="relative">
                <LinkedInIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0A66C2]" />
                <input
                  type="url"
                  className={`input-base pl-9 ${!linkedinIsValid ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}`}
                  placeholder="https://www.linkedin.com/in/tu-usuario"
                  value={form.linkedin_url}
                  onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                />
              </div>
            </FormField>

            <FormField label="Descripción">
              <textarea
                rows={5}
                className="input-base"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
              <p className={`mt-1 text-right text-xs ${descriptionTooLong ? "font-semibold text-red-600" : "text-slate-500"}`}>
                {descriptionLength} / {MAX_DESCRIPTION_CHARS}
              </p>
            </FormField>

            <div className="flex flex-col-reverse items-center gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              {!hasChanges && (
                <p className="text-sm text-slate-500">No has realizado cambios en tu perfil</p>
              )}
              <button
                type="submit"
                disabled={!formIsValid || saving || !hasChanges}
                className="btn-primary w-full sm:w-auto"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
