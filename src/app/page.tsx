import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ModernLandingPage } from "@/features/landing/components/modern-landing-page";

export default async function HomePage() {
  const { userId } = await auth();

  // If user is authenticated, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return <ModernLandingPage />;
}
