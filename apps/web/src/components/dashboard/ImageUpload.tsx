"use client";

import { useState, useRef } from "react";
import { Upload, X, FileImage, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  label: string;
  description: string;
  onUpload: (url: string) => void;
  maxSizeMB?: number;
}

export function ImageUpload({ label, description, onUpload, maxSizeMB = 2 }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // 1. Validation: Size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB.`);
      return;
    }

    // 2. Validation: Type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Solo se permiten imágenes (JPG, PNG, WebP).");
      return;
    }

    // 3. Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // 4. Upload Simulation (Connect to Supabase in Production)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // In a real scenario, we would upload to Supabase storage and get a URL
      onUpload("https://via.placeholder.com/512"); 
    }, 1500);
  };

  const clearFile = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-2">
        <FileImage className="text-accent" size={24} />
        <h3 className="font-black uppercase italic">{label}</h3>
      </div>

      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-4 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center space-y-4 transition-all cursor-pointer group ${
            error ? "border-red-400 bg-red-50" : "border-muted hover:border-accent/40"
          }`}
        >
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            {loading ? <Loader2 className="animate-spin text-primary" /> : <Upload className="text-muted-foreground" />}
          </div>
          <div className="text-center">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{description}</p>
            <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 italic">Máx. {maxSizeMB}MB · JPG, PNG o WebP</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
        </div>
      ) : (
        <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-muted aspect-video bg-muted/20 group">
          <Image src={preview} alt="Preview" fill className="object-contain p-4" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={clearFile}
              className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"
            >
              <X size={20} />
            </button>
          </div>
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <Loader2 className="animate-spin text-primary w-10 h-10" />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-2xl border border-red-100 animate-fade-in">
          <AlertCircle size={18} />
          <p className="text-xs font-black uppercase tracking-tightest">{error}</p>
        </div>
      )}
    </div>
  );
}
