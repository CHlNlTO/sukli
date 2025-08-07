"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/shared/components/ui/button";
import { FileUploadZone } from "@/features/file-upload/components/file-upload-zone";
import { ParsedReceiptCard } from "@/features/transactions/components/parsed-receipt-card";
import { useFileUpload } from "@/features/file-upload/hooks/use-file-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Transaction } from "@/types/database";

export function GuestLandingPage() {
  const router = useRouter();
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [_pendingTransactions, setPendingTransactions] = useState<any[]>([]);

  const { uploadedImages, isUploading, uploadFiles, removeImage } =
    useFileUpload();

  const handleFilesSelected = (files: File[]) => {
    uploadFiles(files);
  };

  const handleSaveTransaction = (
    imageId: string,
    transactionData: Transaction
  ) => {
    // Store in temporary state and show signup modal
    setPendingTransactions((prev) => [...prev, { imageId, transactionData }]);
    setShowSignUpModal(true);
  };

  const handleSignUpComplete = () => {
    // After signup, save all pending transactions
    setShowSignUpModal(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-blue-600 p-2">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <span className="text-xl font-bold">Sukli</span>
          </div>

          <div className="flex items-center space-x-4">
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
              <Button>Get Started</Button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Smart Money Management
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your receipts into organized transactions instantly with
            AI. No signup required to try it out.
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-4xl mx-auto space-y-8">
          <FileUploadZone
            onFilesSelected={handleFilesSelected}
            disabled={isUploading}
            className="mx-auto max-w-2xl"
          />

          {/* Parsed Results */}
          {uploadedImages.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center">
                Your Parsed Receipts
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedImages.map((image) => (
                  <ParsedReceiptCard
                    key={image.id}
                    image={image}
                    onSave={handleSaveTransaction}
                    onDiscard={removeImage}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Sukli?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced AI extracts transaction details from your receipts
                automatically
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Process multiple receipts in seconds, not minutes
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold">Customizable</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tailor AI prompts and themes to match your workflow
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sign Up Modal */}
      <Dialog open={showSignUpModal} onOpenChange={setShowSignUpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Your Transactions</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-gray-600">
              Sign up to save your parsed transactions and access your
              dashboard.
            </p>

            <div className="flex flex-col space-y-3">
              <SignUpButton
                mode="modal"
                forceRedirectUrl="/dashboard"
                signInFallbackRedirectUrl="/dashboard"
              >
                <Button className="w-full" onClick={handleSignUpComplete}>
                  Create Free Account
                </Button>
              </SignUpButton>

              <SignInButton
                mode="modal"
                forceRedirectUrl="/dashboard"
                signUpFallbackRedirectUrl="/dashboard"
              >
                <Button variant="outline" className="w-full">
                  Already have an account? Sign In
                </Button>
              </SignInButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
