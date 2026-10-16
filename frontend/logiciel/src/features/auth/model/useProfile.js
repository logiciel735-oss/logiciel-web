import { useEffect, useMemo, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api/profileApi";
import toast from "react-hot-toast";
import { validateImageFile } from "../../../shared/uploadFile/api/uploadApi";
import { formatPersonName, isValidLinkedIn, validatePersonName } from "../../../shared/lib/validators";
import { cmsCache } from "../../../shared/utils/cmsCache";

const MAX_DESCRIPTION_CHARS = 600;

// ======================
// HELPERS
// ======================

const normalize = (value) => {
  if (typeof value !== "string") return value;

  return value
    .trim()
    .replace(/\s+/g, " ");
};

const hasChanged = (current, original) => {
  return normalize(current) !== normalize(original);
};

export const useProfile = () => {

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    cvlac_url: "",
    linkedin_url: "",
    descripcion: "",
    universidad: "",
    avatar: null,
    removeAvatar: false,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);

  // ======================
  // CARGAR PERFIL
  // ======================

  const applyProfile = (data) => {
    const profileData = {
      nombres: data.nombres || "",
      apellidos: data.apellidos || "",
      email: data.email || "",
      cvlac_url: data.cvlac_url || "",
      linkedin_url: data.linkedin_url || "",
      descripcion: data.descripcion || "",
      universidad: data.universidad || "",
    };

    setForm({
      ...profileData,
      avatar: null,
      removeAvatar: false,
    });

    setOriginalProfile({ ...profileData, hadAvatar: !!data.avatar });

    setAvatarPreview(data.avatar || null);
  };

  // Recarga tras guardar
  const loadProfile = async () => {
    try {
      const data = await getMyProfile();
      if (data) applyProfile(data);
    } catch (err) {
      console.error("Error cargando perfil:", err);
      toast.error("No se pudo cargar tu perfil");
    }
  };

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const data = await getMyProfile();
        if (active && data) applyProfile(data);
      } catch (err) {
        console.error("Error cargando perfil:", err);
        if (active) toast.error("No se pudo cargar tu perfil");
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => { active = false; };
  }, []);

  // ======================
  // VALIDACIONES
  // ======================

  const cvlacIsValid = useMemo(() => {
    if (!form.cvlac_url) return true; // opcional

    return /^https:\/\/scienti\.minciencias\.gov\.co\/cvlac\/.+/.test(
      form.cvlac_url
    );
  }, [form.cvlac_url]);

  const descriptionLength = useMemo(
    () => form.descripcion.length,
    [form.descripcion]
  );

  const descriptionIsValid =
    descriptionLength <= MAX_DESCRIPTION_CHARS;

  // Nombres y apellidos: obligatorios, solo letras (sin números)
  const nombresError = validatePersonName(form.nombres, { label: "Nombres" });
  const apellidosError = validatePersonName(form.apellidos, { label: "Apellidos" });
  const namesAreValid = !nombresError && !apellidosError;

  const linkedinIsValid = isValidLinkedIn(form.linkedin_url);

  const formIsValid = cvlacIsValid && linkedinIsValid && descriptionIsValid && namesAreValid;

  // ======================
  // DETECTAR CAMBIOS
  // ======================

  const hasChanges = useMemo(() => {

    if (!originalProfile) return false;

    const fields = [
      "nombres",
      "apellidos",
      "email",
      "cvlac_url",
      "linkedin_url",
      "descripcion",
      "universidad"
    ];

    const textChanged = fields.some(field =>
      hasChanged(form[field], originalProfile[field])
    );

    const avatarChanged =
      form.avatar instanceof File ||
      (form.removeAvatar && originalProfile.hadAvatar);

    return textChanged || avatarChanged;

  }, [form, originalProfile]);

  // ======================
  // AVATAR
  // ======================

  const handleAvatarChange = (file) => {

    if (!file) return;

    const invalid = validateImageFile(file);
    if (invalid) {
      toast.error(invalid);
      return;
    }

    setForm(prev => ({
      ...prev,
      avatar: file,
      removeAvatar: false
    }));

    setAvatarPreview(URL.createObjectURL(file));

  };

  // Quita la foto (se aplica al guardar): vuelve la inicial del nombre
  const removeAvatar = () => {
    setForm(prev => ({
      ...prev,
      avatar: null,
      removeAvatar: true
    }));

    setAvatarPreview(null);
  };

  // ======================
  // GUARDAR PERFIL
  // ======================

  const saveProfile = async () => {

    if (!formIsValid) {
      toast("Revisa los campos antes de guardar", { icon: "ℹ️" });
      return;
    }

    if (!originalProfile) {
      toast.error("Perfil no cargado aún");
      return;
    }

    if (!hasChanges) {
      toast("No hay cambios para guardar", { icon: "ℹ️" });
      return;
    }

    setSaving(true);

    try {

      const formData = new FormData();

      const fields = [
        "nombres",
        "apellidos",
        "email",
        "cvlac_url",
        "linkedin_url",
        "descripcion",
        "universidad"
      ];

      fields.forEach(field => {

        if (hasChanged(form[field], originalProfile[field])) {

          const value = field === "nombres" || field === "apellidos"
            ? formatPersonName(form[field])
            : normalize(form[field]);

          formData.append(field, value);

        }

      });

      if (form.avatar instanceof File) {
        formData.append("avatar", form.avatar);
      } else if (form.removeAvatar && originalProfile.hadAvatar) {
        formData.append("remove_avatar", "1");
      }


      if ([...formData.keys()].length === 0) {
        toast("No hay cambios para guardar", { icon: "ℹ️" });
        setSaving(false);
        return;
      }

      await updateMyProfile(formData);

      // La ficha de miembro se sincroniza en la BD (nombre / foto): que "Miembros" no muestre la versión en caché
      cmsCache.invalidate("miembros");

      toast.success("Perfil actualizado");

      await loadProfile();

    } catch (err) {

      console.error("Error actualizando perfil:", err);
      toast.error(err?.uploadMessage || "Error actualizando perfil");

    } finally {

      setSaving(false);

    }

  };

  return {
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
    nombresError,
    apellidosError,
    saveProfile,
    descriptionLength,
    MAX_DESCRIPTION_CHARS,
  };

};