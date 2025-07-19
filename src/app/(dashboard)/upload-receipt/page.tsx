// src/app/(dashboard)/upload-receipt/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { UploadSection } from "@/features/dashboard/components/upload-section";

export default function UploadReceiptPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background pb-20 max-w-2xl mx-auto px-2 sm:px-4 lg:px-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Upload Receipt</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </header>

      <div className="px-4 py-6">
        <UploadSection />
      </div>
    </div>
  );
}
