"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  currentImage?: string;
}

export default function ImageUploader({ onUpload, currentImage }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onUpload(data.url);
      toast.success("Imagen subida");
    } catch {
      toast.error("Error al subir imagen");
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      {currentImage && (
        <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 cursor-pointer">
        {uploading ? "Subiendo..." : "Subir imagen"}
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}
