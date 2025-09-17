"use client";

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface DropImageProps {
  onFileSelect?: (file: File | null) => void;
}

export default function DropImage({ onFileSelect }: DropImageProps) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
  });

  const previewUrl = files[0]?.preview ?? null;
  const fileName = files[0]?.file.name ?? null;
  const selectedFile = files[0]?.file ?? null;

  // Natural size for intrinsic rendering (no extra container space)
  const [naturalSize, setNaturalSize] = useState<{
    w: number;
    h: number;
  } | null>(null);
  useEffect(() => {
    if (!previewUrl) {
      setNaturalSize(null);
      return;
    }
    const img = new window.Image();
    img.src = previewUrl;
    img.onload = () => {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    };
    return () => {
      setNaturalSize(null);
    };
  }, [previewUrl]);

  // Compute display size: if portrait, limit to within 500x500; landscape remains natural
  const displaySize = useMemo(() => {
    if (!naturalSize) return null;
    const { w, h } = naturalSize;
    // Portrait (or square) handling: fit within 500x500 without upscaling
    if (h >= w) {
      const maxSide = Math.max(w, h);
      if (maxSide > 500) {
        const scale = 500 / maxSide;
        return { w: Math.round(w * scale), h: Math.round(h * scale) };
      }
    }
    // Landscape or already small portrait: keep natural size
    return { w, h };
  }, [naturalSize]);

  // Call onFileSelect whenever the selected file changes
  useEffect(() => {
    onFileSelect?.(selectedFile instanceof File ? selectedFile : null);
  }, [selectedFile, onFileSelect]);

  const handleRemoveFile = () => {
    if (files[0]?.id) {
      removeFile(files[0].id);
      onFileSelect?.(null);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="relative">
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
        />

        {/* Preview or Dropzone */}
        {previewUrl && displaySize ? (
          <div
            className="relative mx-auto w-fit"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Image
              src={previewUrl}
              alt={files[0]?.file?.name ?? "Uploaded image"}
              width={displaySize.w}
              height={displaySize.h}
              sizes="100vw"
              className="h-auto max-w-full rounded-xl object-contain transition-transform duration-300 hover:scale-105"
              priority
            />
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 absolute top-2 right-2 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={handleRemoveFile}
              aria-label="Remove image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-dragging={isDragging || undefined}
            className="data-[dragging=true]:bg-accent/50 relative flex min-h-80 w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 has-[input:focus]:ring-2 has-[input:focus]:ring-blue-500"
          >
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div
                className="bg-background mb-4 flex size-12 shrink-0 items-center justify-center rounded-full border shadow-sm"
                aria-hidden="true"
              >
                <ImageIcon className="size-6 opacity-60" />
              </div>
              <p className="mb-2 text-lg font-medium">Drop your image here</p>
              <p className="text-muted-foreground mb-4 text-sm">
                Any image file (max. {maxSizeMB}MB)
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={openFileDialog}
              >
                <UploadIcon
                  className="-ms-1 size-4 opacity-60"
                  aria-hidden="true"
                />
                Select image
              </Button>
            </div>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm"
          role="alert"
        >
          <AlertCircleIcon className="size-4 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {fileName && (
        <div className="text-center">
          <p className="text-muted-foreground text-sm break-all">
            Uploaded: {fileName}
          </p>
        </div>
      )}
    </div>
  );
}
