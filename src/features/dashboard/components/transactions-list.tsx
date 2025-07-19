// src/features/dashboard/components/transactions-list.tsx
"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Car,
  Utensils,
  Home,
  CreditCard,
  MoreHorizontal,
  Briefcase,
  TrendingUp,
  Gift,
} from "lucide-react";
import { Transaction } from "@/types/database";
import { format, isToday, isYesterday, parseISO } from "date-fns";

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const getCategoryIcon = (category?: string, transactionType?: string) => {
    if (transactionType === "income") {
      switch (category?.toLowerCase()) {
        case "salary":
        case "business":
          return Briefcase;
        case "investment":
        case "freelance":
          return TrendingUp;
        case "gift":
        case "refund":
          return Gift;
        default:
          return TrendingUp;
      }
    }

    // Expense icons
    switch (category?.toLowerCase()) {
      case "food":
      case "restaurant":
        return Utensils;
      case "shopping":
      case "retail":
        return ShoppingBag;
      case "transportation":
      case "car":
        return Car;
      case "utilities":
      case "home":
        return Home;
      case "subscription":
      case "transfer":
        return CreditCard;
      default:
        return MoreHorizontal;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM dd");
  };

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const grouped = transactions.reduce((acc, transaction) => {
      const date = transaction.transaction_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);

    return Object.entries(grouped).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  };

  const groupedTransactions = groupTransactionsByDate(
    transactions.slice(0, 10)
  );

  if (transactions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Recent Transactions
          </h2>
        </div>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No transactions yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start by adding your first transaction
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Recent</h2>
        <button className="text-xs text-blue-600 font-medium">See all</button>
      </div>

      <div className="space-y-1">
        {groupedTransactions.map(([date, dayTransactions], dateIndex) => (
          <div key={date} className="space-y-1">
            {/* Date Header - only show for first group or if different from previous */}
            {dateIndex === 0 && (
              <div className="px-1 py-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {formatDate(date)}
                </p>
              </div>
            )}

            {/* Transactions for this date */}
            {dayTransactions.map((transaction, index) => {
              const Icon = getCategoryIcon(
                transaction.category,
                transaction.transaction_type
              );
              const isIncome = transaction.transaction_type === "income";

              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center justify-between py-3 px-3 bg-card/50 rounded-xl hover:bg-card transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isIncome
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isIncome ? "text-green-600" : "text-muted-foreground"
                        }`}
                      />
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground leading-none truncate">
                        {transaction.merchant_name ||
                          transaction.description ||
                          "Transaction"}
                      </p>
                      <div className="flex items-center space-x-1">
                        {transaction.category && (
                          <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                            {transaction.category}
                          </span>
                        )}
                        {transaction.is_ai_parsed && (
                          <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded">
                            AI
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        isIncome ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
