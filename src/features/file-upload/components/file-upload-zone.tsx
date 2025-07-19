"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  className?: string;
}

export function FileUploadZone({
  onFilesSelected,
  disabled = false,
  maxFiles = 10,
  className,
}: FileUploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      },
      maxFiles,
      disabled,
      multiple: true,
    });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
        "hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20",
        isDragActive && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
        isDragReject && "border-red-500 bg-red-50 dark:bg-red-950/20",
        disabled && "cursor-not-allowed opacity-50",
        "border-gray-300 dark:border-gray-700",
        className
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
          {isDragActive ? (
            <Upload className="h-8 w-8 text-blue-500" />
          ) : (
            <ImageIcon className="h-8 w-8 text-gray-500" />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-lg font-medium">
            {isDragActive
              ? "Drop your receipt images here..."
              : "Upload Receipt Images"}
          </p>

          <p className="text-sm text-gray-500">
            Drag & drop up to {maxFiles} images, or{" "}
            <span className="font-medium text-blue-500">browse files</span>
          </p>

          <p className="text-xs text-gray-400">
            Supports PNG, JPG, JPEG, WebP (max 10MB each)
          </p>
        </div>
      </div>
    </div>
  );
}
