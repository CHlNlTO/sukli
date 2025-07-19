"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight-new";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { Plus, Sparkles, Zap, Shield } from "lucide-react";
import { useFileUpload } from "@/features/file-upload/hooks/use-file-upload";
import { ParsedReceiptCard } from "@/features/transactions/components/parsed-receipt-card";

export function ModernLandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    uploadedImages,
    isUploading,
    uploadFiles,
    removeImage,
    saveTransaction,
  } = useFileUpload();

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "About", link: "#about" },
  ];

  const handleFileUpload = (files: File[]) => {
    uploadFiles(files);
  };

  return (
    <div className="dark:bg-zinc-950 relative overflow-hidden">
      {/* Modern Navbar */}
      <Navbar>
        <NavBody>
          <NavbarLogo>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 hover:-translate-y-0.5 transition duration-200 bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl text-black font-semibold ">Sukli</span>
            </div>
          </NavbarLogo>

          <NavItems items={navItems} className="hidden md:flex space-x-8" />

          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <NavbarButton variant="gradient">Sign In</NavbarButton>
            </SignInButton>
            <SignUpButton mode="modal">
              <NavbarButton variant="primary">Get Started</NavbarButton>
            </SignUpButton>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            {/* <NavbarLogo> */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-semibold text-black">Sukli</span>
            </div>
            {/* </NavbarLogo> */}
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-black dark:text-gray-300 hover:text-white transition-colors py-2 block"
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-6">
              <SignInButton mode="modal">
                <NavbarButton variant="dark" className="w-full text-xs">
                  <span className="text-xs">Sign In</span>
                </NavbarButton>
              </SignInButton>
              {/* <SignUpButton mode="modal">
                <NavbarButton variant="gradient" className="w-full text-xs">
                  <span className="text-xs">Get Started</span>
                </NavbarButton>
              </SignUpButton> */}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Hero Section with Spotlight */}
      <div className="relative min-h-screen flex items-center justify-center px-1">
        <Spotlight />

        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-noise" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40">
          <div className="text-center space-y-8">
            {/* Parsed Results Section */}
            {uploadedImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-7xl mx-auto px-4 pb-20"
              >
                <div className="text-center mb-12">
                  <h2 className="text-5xl font-bold text-black dark:text-white mb-4">
                    Your Parsed Receipts
                  </h2>
                  <p className="text-gray-400">
                    Review and save your extracted transaction data
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uploadedImages.map((image) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ParsedReceiptCard
                        image={image}
                        onSave={saveTransaction}
                        onDiscard={removeImage}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-blue-500 to-blue-700 dark:from-neutral-50 dark:to-neutral-400">
                Capture. Upload.
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-600 to-blue-800 dark:from-neutral-50 dark:to-neutral-400">
                  Track.
                </span>
              </h1>

              <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Transform your receipts into organized transactions instantly
                with AI. No signup required to try it out.
              </p>
            </motion.div>

            {/* Upload Zone */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <ModernUploadZone
                onFileUpload={handleFileUpload}
                isUploading={isUploading}
              />
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
            >
              <FeatureCard
                icon={<Sparkles className="w-6 h-6" />}
                title="AI-Powered"
                description="Advanced AI extracts transaction details automatically"
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Lightning Fast"
                description="Process multiple receipts in seconds"
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="Secure & Private"
                description="Your data is encrypted and never shared"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modern Upload Zone Component
function ModernUploadZone({
  onFileUpload,
  isUploading,
}: {
  onFileUpload: (files: File[]) => void;
  isUploading: boolean;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  return (
    <div className="relative group">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative overflow-hidden rounded-2xl  transition-all duration-300 ${
          isDragOver
            ? "border-blue-400 bg-blue-500/10"
            : "border-gray-600 hover:border-gray-500"
        } ${isUploading ? "pointer-events-none opacity-70" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="glass-card p-8 text-center space-y-4">
          <motion.div
            animate={isUploading ? { rotate: 360 } : {}}
            transition={{
              duration: 2,
              repeat: isUploading ? Infinity : 0,
              ease: "linear",
            }}
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              isUploading
                ? "bg-blue-500/20"
                : "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500"
            } transition-all duration-300`}
          >
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="w-8 h-8 text-white" />
            )}
          </motion.div>

          {/* <div className="space-y-2">
            <h3 className="text-xl font-semibold text-black/70 dark:text-white">
              {isUploading ? "Processing..." : "Upload Receipt"}
            </h3>
            <p className="text-gray-400 text-sm">
              {isUploading
                ? "AI is extracting transaction data"
                : "Drag & drop or click to select images"}
            </p>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card p-6 border rounded-xl text-center space-y-4 group hover:bg-white/10 transition-all duration-300"
    >
      <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-b from-blue-500 to-blue-700 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-black dark:text-white">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
