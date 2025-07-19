// src/app/(dashboard)/scan-receipt/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useFileUpload } from "@/features/file-upload/hooks/use-file-upload";
import { ParsedReceiptCard } from "@/features/transactions/components/parsed-receipt-card";

export default function ScanReceiptPage() {
  const router = useRouter();
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    uploadedImages,
    isUploading,
    uploadFiles,
    removeImage,
    saveTransaction,
  } = useFileUpload();

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `receipt-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          uploadFiles([file]);
          stopCamera();
        }
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 max-w-2xl mx-auto px-2 sm:px-4 lg:px-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => {
              stopCamera();
              router.back();
            }}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Scan Receipt</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {!isCapturing && uploadedImages.length === 0 && (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Ready to scan?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Take a clear photo of your receipt for automatic processing
              </p>
              <Button onClick={startCamera} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </Button>
            </div>
          </div>
        )}

        {isCapturing && (
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Overlay guidelines */}
              <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg pointer-events-none" />

              {/* Capture controls */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={stopCamera}
                  className="bg-black/50 border-white/50 hover:bg-black/70"
                >
                  <RotateCcw className="h-4 w-4 text-white" />
                </Button>

                <Button
                  onClick={capturePhoto}
                  disabled={isUploading}
                  className="w-16 h-16 rounded-full bg-white hover:bg-gray-100"
                >
                  <Camera className="h-6 w-6 text-black" />
                </Button>
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <p className="text-sm text-muted-foreground text-center">
              Position your receipt within the guidelines and tap the capture
              button
            </p>
          </div>
        )}

        {/* Parsed Results */}
        {uploadedImages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Captured Receipt</h2>

            <div className="grid gap-4">
              {uploadedImages.map((image) => (
                <ParsedReceiptCard
                  key={image.id}
                  image={image}
                  onSave={saveTransaction}
                  onDiscard={removeImage}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
