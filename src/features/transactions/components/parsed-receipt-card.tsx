"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { UploadedImage } from "@/types/database";
import { Check, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { ImageZoom } from "@/components/ui/kibo-ui/image-zoom";
import { Spinner } from "@/components/ui/kibo-ui/spinner";
import { Status, StatusIndicator } from "@/components/ui/kibo-ui/status";

interface ParsedReceiptCardProps {
  image: UploadedImage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (imageId: string, data: any) => void;
  onDiscard: (imageId: string) => void;
}

export function ParsedReceiptCard({
  image,
  onSave,
  onDiscard,
}: ParsedReceiptCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    currency: "PHP",
    merchant_name: "",
    category: "",
    transaction_date: new Date().toISOString().split("T")[0],
    description: "",
    notes: "",
  });

  // Update form data when parsed data becomes available
  useEffect(() => {
    if (image.parsed_data) {
      console.log("Updating form data with parsed data:", image.parsed_data);
      setFormData({
        amount: image.parsed_data.amount?.toString() || "",
        currency: image.parsed_data.currency || "PHP",
        merchant_name: image.parsed_data.merchant_name || "",
        category: image.parsed_data.category || "",
        transaction_date:
          image.parsed_data.transaction_date ||
          new Date().toISOString().split("T")[0],
        description: image.parsed_data.description || "",
        notes: "",
      });
    }
  }, [image.parsed_data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(image.id, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = () => {
    switch (image.status) {
      case "uploading":
        return (
          <Status status="maintenance" className="text-blue-500">
            <StatusIndicator />
            Uploading
          </Status>
        );
      case "parsing":
        return (
          <Status status="maintenance" className="text-blue-500">
            <StatusIndicator />
            Parsing
          </Status>
        );
      case "completed":
        return (
          <Status status="online" className="text-green-500">
            <StatusIndicator />
            Ready
          </Status>
        );
      case "error":
        return (
          <Status status="offline" className="text-red-500">
            <StatusIndicator />
            Error
          </Status>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md bg-transparent backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Receipt</CardTitle>
          {getStatusBadge()}
        </div>

        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-100">
          <ImageZoom>
            <Image
              src={image.preview_url}
              alt="Receipt"
              width={1080}
              height={1080}
              quality={100}
              className="object-cover"
            />
          </ImageZoom>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {image.status === "parsing" && (
          <div className="flex items-center justify-center py-8">
            <Spinner className="text-blue-500" />
            <span className="ml-2 text-blue-500">Extracting data...</span>
          </div>
        )}

        {image.status === "error" && (
          <div className="text-center py-4">
            <p className="text-red-500 text-sm">{image.error_message}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDiscard(image.id)}
            >
              Remove
            </Button>
          </div>
        )}

        {image.status === "completed" && image.parsed_data && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="amount" className="mb-2">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="currency" className="mb-2">
                    Currency
                  </Label>
                  <Input
                    id="currency"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        currency: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="merchant" className="mb-2">
                  Merchant
                </Label>
                <Input
                  id="merchant"
                  value={formData.merchant_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      merchant_name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="category" className="mb-2">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="date" className="mb-2">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.transaction_date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        transaction_date: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="mb-2">
                  Description
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="notes" className="mb-2">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 hover:-translate-y-0.5 transition duration-200 bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => onDiscard(image.id)}
                disabled={isSaving}
                className="hover:-translate-y-0.5 transition duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
