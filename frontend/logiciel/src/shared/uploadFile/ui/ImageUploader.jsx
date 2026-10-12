import { useState } from "react";
import toast from "react-hot-toast";
import { uploadFile } from "../api/uploadApi";
import ImageUploadField from "../../ui/ImageUploadField";

export default function ImageUploader({ value, onChange, showPreview = true, contain = false }) {

  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadFile(file);
      onChange(result.url);
      toast.success("Imagen subida correctamente");
    } catch (err) {
      console.error(err);
      toast.error(err?.uploadMessage || "Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ImageUploadField
      value={showPreview ? value : null}
      onFileChange={handleFile}
      uploading={uploading}
      contain={contain}
    />
  );
}
