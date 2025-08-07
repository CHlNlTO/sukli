import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ModernLandingPage } from "@/features/landing/components/modern-landing-page";

export default async function HomePage() {
  const { userId } = await auth();

  // If user is authenticated, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="relative">
      <ModernLandingPage />
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent pointer-events-none z-50" />
    </div>
  );
}