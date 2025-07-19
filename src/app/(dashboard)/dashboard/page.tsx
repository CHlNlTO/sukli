import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/shared/lib/supabase/server";
// import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
// import { RecentTransactions } from "@/features/dashboard/components/recent-transactions";
import { UploadSection } from "@/features/dashboard/components/upload-section";

export default async function DashboardPage() {
  const { userId } = await auth();
  const supabase = await createClient();

  if (!userId) {
    return null; // This shouldn't happen due to layout protection
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  // Get recent transactions
  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userProfile?.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Get transaction stats
  const { data: stats } = await supabase.rpc("get_transaction_stats", {
    user_uuid: userProfile?.id,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {userProfile?.first_name || "there"}!
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here&apos;s what&apos;s happening with your finances today.
        </p>
      </div>

      {/* Upload Section */}
      <UploadSection />

      {/* Stats */}
      {/* <DashboardStats stats={stats} /> */}

      {/* Recent Transactions */}
      {/* <RecentTransactions transactions={recentTransactions || []} /> */}
    </div>
  );
}
