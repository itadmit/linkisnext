"use client";

import { useState, useRef } from "react";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "שגיאה בהעלאה");
      }

      const data = await res.json();
      onChange(data.url);
      toast.success("התמונה הועלתה בהצלחה!");
    } catch (error: any) {
      toast.error(error.message);
      setPreview(value);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2 text-right">
          {label}
        </label>
      )}
      
      <div className="relative">
        {preview ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-white/5 border border-white/10">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 left-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-white/5 transition-all duration-200">
            <div className="flex flex-col items-center justify-center p-6">
              {isUploading ? (
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiImage className="w-10 h-10 text-white/40 mb-3" />
                  <p className="text-sm text-white/60 text-center">
                    לחץ או גרור תמונה להעלאה
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    JPG, PNG, GIF, WebP • מקסימום 5MB
                  </p>
                </>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}

