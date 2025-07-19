"use client";

import { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/shared/lib/supabase/client";
import {
  UploadedImage,
  ParsedReceiptData,
  Transaction,
} from "@/types/database";
import { toast } from "sonner";

export function useFileUpload() {
  const { user } = useUser();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      setIsUploading(true);
      const newImages: UploadedImage[] = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview_url: URL.createObjectURL(file),
        status: "uploading",
      }));

      setUploadedImages((prev) => [...prev, ...newImages]);

      try {
        // Process each file
        for (const image of newImages) {
          await processImage(image);
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Some files failed to upload. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [user]
  );

  const processImage = async (image: UploadedImage) => {
    try {
      // Update status to parsing
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, status: "parsing" } : img
        )
      );

      // Upload to storage with proper error handling
      const bucket = user ? "receipt-images" : "temp-receipts";
      const timestamp = Date.now();
      const filePath = user
        ? `${user.id}/${timestamp}-${image.file.name}`
        : `guest/${timestamp}-${image.file.name}`;

      console.log(`Uploading to bucket: ${bucket}, path: ${filePath}`);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, image.file, {
          cacheControl: "3600",
          upsert: false,
        });

      console.log("Upload result:", { uploadData, uploadError });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get the public URL for the uploaded image
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      console.log("Public URL:", publicUrl);

      // Parse with AI
      const formData = new FormData();
      formData.append("file", image.file);

      const response = await fetch("/api/parse-receipt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Parsing failed: ${errorText}`);
      }

      const parsedData: ParsedReceiptData = await response.json();

      // Update with parsed data
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? {
                ...img,
                status: "completed",
                parsed_data: parsedData,
                image_url: publicUrl, // Use the public URL instead of path
              }
            : img
        )
      );
    } catch (error) {
      console.error("Processing error:", error);
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? {
                ...img,
                status: "error",
                error_message:
                  error instanceof Error ? error.message : "Unknown error",
              }
            : img
        )
      );
    }
  };

  const removeImage = useCallback((imageId: string) => {
    setUploadedImages((prev) => {
      const image = prev.find((img) => img.id === imageId);
      if (image) {
        URL.revokeObjectURL(image.preview_url);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  }, []);

  const saveTransaction = useCallback(
    async (imageId: string, transactionData: Partial<Transaction>) => {
      const image = uploadedImages.find((img) => img.id === imageId);
      if (!image || !image.parsed_data) return;

      try {
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...image.parsed_data,
            ...transactionData,
            image_url: image.image_url,
            is_ai_parsed: true,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to save transaction: ${errorText}`);
        }

        toast.success("Transaction saved successfully!");
        removeImage(imageId);
      } catch (error) {
        console.error("Save transaction error:", error);
        toast.error(
          `Failed to save transaction: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    [uploadedImages, removeImage]
  );

  return {
    uploadedImages,
    isUploading,
    uploadFiles,
    removeImage,
    saveTransaction,
  };
}
