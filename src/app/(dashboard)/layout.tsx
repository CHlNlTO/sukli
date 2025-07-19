// src/app/(dashboard)/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MobileBottomNav } from "@/features/dashboard/components/mobile-bottom-nav";
import { MobileHeader } from "@/features/dashboard/components/mobile-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content */}
      <main className="py-6">{children}</main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
