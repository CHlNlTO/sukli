// src/features/dashboard/components/balance-cards.tsx
"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface BalanceCardsProps {
  income: number;
  expenses: number;
  total: number;
}

export function BalanceCards({ income, expenses, total }: BalanceCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const cards = [
    {
      title: "Income",
      amount: income,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600",
    },
    {
      title: "Expenses",
      amount: expenses,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600",
    },
    {
      title: "Total",
      amount: total,
      icon: Wallet,
      color: total >= 0 ? "text-blue-600" : "text-red-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-card border border-border rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.iconColor}`} />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">
              {card.title}
            </p>
            <p className={`text-lg font-bold ${card.color}`}>
              {formatCurrency(card.amount)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
