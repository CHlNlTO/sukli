import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/shared/lib/supabase/server";
import { BalanceCards } from "@/features/dashboard/components/balance-cards";
import { TransactionsList } from "@/features/dashboard/components/transactions-list";
import { QuickActions } from "@/features/dashboard/components/quick-actions";

export default async function DashboardPage() {
  const { userId } = await auth();
  const supabase = await createClient();

  if (!userId) {
    return null;
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
    .order("transaction_date", { ascending: false })
    .limit(20);

  // Calculate balance data
  const transactions = recentTransactions || [];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.transaction_date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  // Calculate income and expenses based on transaction_type, not amount sign
  const income = monthlyTransactions
    .filter((t) => t.transaction_type === "income")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const expenses = monthlyTransactions
    .filter((t) => t.transaction_type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const total = income - expenses;

  return (
    <div className="pb-20 min-h-screen bg-background max-w-2xl mx-auto px-2 sm:px-4 lg:px-8">
      <div className="px-4 py-4 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-foreground">
            Welcome back, {userProfile?.first_name || "there"}!
          </h1>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Balance Cards */}
        <BalanceCards income={income} expenses={expenses} total={total} />

        <QuickActions />

        {/* Recent Transactions */}
        <TransactionsList transactions={transactions} />
      </div>
    </div>
  );
}
