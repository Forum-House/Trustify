"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";

interface VerifyDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function VerifyDropzone({ onFileSelected, disabled }: VerifyDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileSelected(files[0]);
      }
    },
    [onFileSelected]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files?.length) {
      onFileSelected(files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-xl border-2 border-dashed p-12 text-center transition-all ${
        isDragging
          ? "border-blue-500 bg-blue-500/5"
          : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <input
        type="file"
        id="verify-file"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={disabled}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />
      <label htmlFor="verify-file" className="flex cursor-pointer flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-600/20">
          <Upload className="h-8 w-8 text-blue-400" />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-100">Drag and drop your document here</p>
          <p className="text-sm text-slate-400">or click to select a file from your computer</p>
        </div>
        <p className="text-xs text-slate-500">Supports PDF, images, Word documents, and more (up to 50MB)</p>
      </label>
    </div>
  );
}
