import Loader from "../../../shared/components/Loader";

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
  saveProfile,
  descriptionLength,
  MAX_DESCRIPTION_CHARS,
}) => {


  if (loading) {
    return <Loader text="Cargando perfil..." />;
  }

  return (
    <div className="min-h-screen bg-[#eaf3f1] p-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">

          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#0a192f] text-white flex items-center justify-center text-3xl font-bold">

              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                form.name.charAt(0).toUpperCase()
              )}

            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleAvatarChange(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Haz clic para cambiar tu foto
          </p>

          <h2 className="text-3xl font-bold text-[#0a192f] mt-3">
            Mi Perfil
          </h2>

          <p className="text-gray-600 mt-1">
            Rol: <span className="font-semibold">{user.role}</span>
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveProfile();
          }}
          className="space-y-6"
        >

          {/* NOMBRE */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              Nombre completo
            </label>

            <input
              type="text"
              className="w-full p-3 border rounded-md"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              Correo electrónico
            </label>

            <input
              type="email"
              className="w-full p-3 border rounded-md"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* CVLAC */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              Enlace CVLAC
            </label>

            <input
              type="url"
              className={`w-full p-3 border rounded-md ${form.cvlac_url &&
                  !/^https:\/\/scienti\.minciencias\.gov\.co\/cvlac\/.+/.test(form.cvlac_url)
                  ? "border-red-500"
                  : ""
                }`}
              value={form.cvlac_url}
              onChange={(e) =>
                setForm({
                  ...form,
                  cvlac_url: e.target.value,
                })
              }
            />

            {form.cvlac_url &&
              !/^https:\/\/scienti\.minciencias\.gov\.co\/cvlac\/.+/.test(form.cvlac_url) && (
                <p className="text-red-500 text-sm mt-1">
                  Debe ser un enlace válido de CVLAC
                </p>
              )}
          </div>

          {/* UNIVERSIDAD */}
          <div>

            <label className="block mb-1 text-gray-700 font-semibold">
              Universidad
            </label>

            <input
              type="text"
              className="w-full p-3 border rounded-md"
              value={form.universidad}
              onChange={(e) =>
                setForm({
                  ...form,
                  universidad: e.target.value,
                })
              }
            />

          </div>

          {/* DESCRIPCIÓN */}
          <div>

            <label className="block mb-1 text-gray-700 font-semibold">
              Descripción
            </label>

            <textarea
              rows={4}
              className="w-full p-3 border rounded-md"
              value={form.descripcion}
              onChange={(e) =>
                setForm({
                  ...form,
                  descripcion: e.target.value,
                })
              }
            />

            <p className="text-sm text-gray-600 mt-1">
              Caracteres: {descriptionLength} / {MAX_DESCRIPTION_CHARS}
            </p>

          </div>

          {/* BOTÓN */}
          {!hasChanges && (
            <p className="text-sm text-gray-500 text-center">
              No has realizado cambios en tu perfil
            </p>
          )}
          <button
            type="submit"
            disabled={!formIsValid || saving || !hasChanges}
            className="w-full bg-[#64ffda] text-[#0a192f] font-bold py-3 rounded-md hover:bg-teal-300 transition disabled:bg-gray-300"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default ProfileForm;