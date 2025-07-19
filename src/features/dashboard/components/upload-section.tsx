"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FileUploadZone } from "@/features/file-upload/components/file-upload-zone";
import { ParsedReceiptCard } from "@/features/transactions/components/parsed-receipt-card";
import { useFileUpload } from "@/features/file-upload/hooks/use-file-upload";

export function UploadSection() {
  const {
    uploadedImages,
    isUploading,
    uploadFiles,
    removeImage,
    saveTransaction,
  } = useFileUpload();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Receipts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileUploadZone onFilesSelected={uploadFiles} disabled={isUploading} />

        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedImages.map((image) => (
              <ParsedReceiptCard
                key={image.id}
                image={image}
                onSave={saveTransaction}
                onDiscard={removeImage}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
