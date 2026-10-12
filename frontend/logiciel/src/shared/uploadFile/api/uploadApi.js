const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Solo se suben imágenes (los PDF y videos se enlazan, no se suben)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MAX_IMAGE_MB = 5;

// Error con mensaje apto para mostrar al usuario (err.uploadMessage)
const uploadError = (message) => Object.assign(new Error(message), { uploadMessage: message });

export const validateImageFile = (file) => {
  if (!file) return "No se seleccionó ningún archivo.";
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Formato no permitido. Usa una imagen JPG, PNG, WEBP o GIF.";
  }
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    return `La imagen supera el máximo de ${MAX_IMAGE_MB} MB.`;
  }
  return null;
};

// Subir imágenes directamente a Cloudinary con un upload preset unsigned
export const uploadFile = async (file, folder = "cms") => {
  const invalid = validateImageFile(file);
  if (invalid) throw uploadError(invalid);

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Faltan VITE_CLOUDINARY_CLOUD_NAME y/o VITE_CLOUDINARY_UPLOAD_PRESET en las variables de entorno."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Error subiendo archivo");
  }

  return { url: data.secure_url };
};
