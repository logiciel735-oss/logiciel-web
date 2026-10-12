import { useEffect, useMemo, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api/profileApi";
import toast from "react-hot-toast";

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
    name: "",
    email: "",
    cvlac_url: "",
    descripcion: "",
    universidad: "",
    avatar: null,
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
      name: data.name || "",
      email: data.email || "",
      cvlac_url: data.cvlac_url || "",
      descripcion: data.descripcion || "",
      universidad: data.universidad || "",
    };

    setForm({
      ...profileData,
      avatar: null,
    });

    setOriginalProfile(profileData);

    if (data.avatar) {
      setAvatarPreview(data.avatar);
    }
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

  const formIsValid = cvlacIsValid && descriptionIsValid;

  // ======================
  // DETECTAR CAMBIOS
  // ======================

  const hasChanges = useMemo(() => {

    if (!originalProfile) return false;

    const fields = [
      "name",
      "email",
      "cvlac_url",
      "descripcion",
      "universidad"
    ];

    const textChanged = fields.some(field =>
      hasChanged(form[field], originalProfile[field])
    );

    const avatarChanged = form.avatar instanceof File;

    return textChanged || avatarChanged;

  }, [form, originalProfile]);

  // ======================
  // AVATAR
  // ======================

  const handleAvatarChange = (file) => {

    if (!file) return;

    setForm(prev => ({
      ...prev,
      avatar: file
    }));

    setAvatarPreview(URL.createObjectURL(file));

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
        "name",
        "email",
        "cvlac_url",
        "descripcion",
        "universidad"
      ];

      fields.forEach(field => {

        if (hasChanged(form[field], originalProfile[field])) {

          formData.append(
            field,
            normalize(form[field])
          );

        }

      });

      if (form.avatar instanceof File) {
        formData.append("avatar", form.avatar);
      }


      if ([...formData.keys()].length === 0) {
        toast("No hay cambios para guardar", { icon: "ℹ️" });
        setSaving(false);
        return;
      }

      await updateMyProfile(formData);

      toast.success("Perfil actualizado");

      await loadProfile();

    } catch (err) {

      console.error("Error actualizando perfil:", err);
      toast.error("Error actualizando perfil");

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
    saveProfile,
    descriptionLength,
    MAX_DESCRIPTION_CHARS,
  };

};