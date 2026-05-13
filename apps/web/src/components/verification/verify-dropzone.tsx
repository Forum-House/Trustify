"use client";

import { useCallback, useState } from "react";
import { Upload, FileUp, Shield, MousePointer2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifyDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function VerifyDropzone({ onFileSelected, disabled }: VerifyDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
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
      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileSelected(files[0]);
      }
    },
    [onFileSelected, disabled]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files?.length && !disabled) {
      onFileSelected(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative group rounded-3xl border-2 border-dashed transition-all duration-500 overflow-hidden",
        isDragging
          ? "border-sky-400/50 bg-sky-500/10 scale-[1.01] shadow-2xl shadow-sky-500/10"
          : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60",
        disabled ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <input
        type="file"
        id="verify-file"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={disabled}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />
      <label 
        htmlFor="verify-file" 
        className={cn(
          "flex flex-col items-center justify-center gap-6 p-12 md:p-16 text-center",
          disabled ? "pointer-events-none" : "cursor-pointer"
        )}
      >
        <div className="relative">
          <div className={cn(
            "h-24 w-24 rounded-3xl flex items-center justify-center border transition-all duration-500",
            isDragging 
              ? "bg-sky-500 border-sky-400 scale-110 shadow-lg shadow-sky-500/50" 
              : "bg-slate-950/80 border-slate-800 group-hover:border-slate-700 group-hover:bg-slate-900"
          )}>
            {disabled ? (
              <Loader2 className="h-10 w-10 text-sky-400 animate-spin" />
            ) : isDragging ? (
              <FileUp className="h-10 w-10 text-white animate-bounce" />
            ) : (
              <Upload className="h-10 w-10 text-sky-400 group-hover:text-sky-300 transition-colors" />
            )}
          </div>
          
          {/* Subtle decoration icons */}
          {!disabled && !isDragging && (
            <>
              <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:-translate-y-1 transition-all duration-300">
                <Shield className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="absolute -bottom-2 -left-6 h-10 w-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:-translate-x-1 transition-all duration-500">
                <MousePointer2 className="h-5 w-5 text-sky-400" />
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-2xl font-black tracking-tight text-white">
            {isDragging ? "Drop to Scan" : "Authenticity Scanner"}
          </p>
          <p className="text-slate-400 text-base max-w-xs mx-auto leading-relaxed">
            Drag and drop your document here to verify its <span className="text-sky-400 font-bold">cryptographic proof</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {["PDF", "DOCX", "JPG", "PNG"].map(ext => (
            <span key={ext} className="px-3 py-1 rounded-lg bg-slate-950/50 border border-slate-800/80 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              {ext}
            </span>
          ))}
        </div>
      </label>
      
      {/* Background patterns */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(56,189,248,0.1),transparent)] pointer-events-none" />
    </div>
  );
}
