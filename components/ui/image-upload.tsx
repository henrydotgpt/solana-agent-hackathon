"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, ImageIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  compact?: boolean;
}

export function ImageUpload({
  onUpload,
  label = "Upload image",
  accept = "image/*",
  maxSizeMB = 5,
  className = "",
  compact = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Image must be under ${maxSizeMB}MB`);
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Upload
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Upload failed");
        }

        setUploaded(true);
        onUpload(data.data.url);
      } catch (err: any) {
        setError(err.message || "Upload failed");
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [maxSizeMB, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const reset = () => {
    setPreview(null);
    setUploaded(false);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        {preview && uploaded ? (
          <div className="flex items-center gap-2">
            <img src={preview} alt="Upload" className="h-8 w-8 rounded-lg object-cover" />
            <Check className="h-4 w-4 text-emerald-400" />
            <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground">
              Change
            </button>
          </div>
        ) : uploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-3 w-3" />
            {label}
          </Button>
        )}
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    );
  }

  return (
    <div className={className}>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-xl overflow-hidden border border-border/50"
          >
            <img src={preview} alt="Preview" className="w-full h-32 object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : uploaded ? (
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <Check className="h-5 w-5 text-emerald-400" />
                  Uploaded
                </div>
              ) : null}
            </div>
            {!uploading && (
              <button
                onClick={reset}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
              dragOver
                ? "border-solana-purple bg-solana-purple/5"
                : "border-border/50 hover:border-border hover:bg-muted/30"
            }`}
          >
            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Drag & drop or click · Max {maxSizeMB}MB
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-xs text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}
