import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { clerkConfig } from "@/shared/lib/clerk/config";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sukli - Smart Money Management",
  description: "AI-powered receipt parsing and expense tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider {...clerkConfig}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
