import { useState } from "react";
import toast from "react-hot-toast";
import { uploadFile } from "../api/uploadApi";

export default function ImageUploader({ value, onChange, showPreview = true }) {

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
      toast.error("Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">

      {showPreview && value && (
        <img
          src={value}
          alt="preview"
          className="w-full h-48 object-cover rounded-lg"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-600 file:text-white hover:file:bg-teal-700 file:cursor-pointer disabled:opacity-50"
      />

      {uploading && (
        <p className="text-xs text-teal-600 animate-pulse">
          Subiendo...
        </p>
      )}

    </div>
  );
}