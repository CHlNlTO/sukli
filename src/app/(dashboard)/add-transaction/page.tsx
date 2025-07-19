// src/app/(dashboard)/add-transaction/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  Upload,
  Check,
  Loader2,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { TransactionType } from "@/types/database";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categories = {
  income: [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
    "Gift",
    "Refund",
    "Other",
  ],
  expense: [
    "Food",
    "Transportation",
    "Shopping",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Education",
    "Subscription",
    "Transfer",
    "Other",
  ],
};

const currencies = ["PHP", "USD", "EUR", "JPY", "GBP"];

export default function AddTransactionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    currency: "PHP",
    transaction_type: "expense" as TransactionType,
    merchant_name: "",
    category: "",
    transaction_date: new Date().toISOString().split("T")[0],
    description: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.merchant_name) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          is_ai_parsed: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save transaction");
      }

      toast.success("Transaction saved successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Save transaction error:", error);
      toast.error("Failed to save transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (type: TransactionType) => {
    setFormData((prev) => ({
      ...prev,
      transaction_type: type,
      category: "", // Reset category when type changes
    }));
  };

  return (
    <div className="min-h-screen bg-background pb-20 max-w-2xl mx-auto px-2 sm:px-4 lg:px-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Add Transaction</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Add Options */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/scan-receipt")}
            className="p-4 border-2 border-dashed border-border rounded-xl flex flex-col items-center space-y-2 hover:border-blue-500 transition-colors"
          >
            <Camera className="w-8 h-8 text-muted-foreground" />
            <span className="text-sm font-medium">Scan Receipt</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/upload-receipt")}
            className="p-4 border-2 border-dashed border-border rounded-xl flex flex-col items-center space-y-2 hover:border-blue-500 transition-colors"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <span className="text-sm font-medium">Upload Image</span>
          </motion.button>
        </div>

        {/* Manual Entry Form */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="h-px bg-border flex-1" />
            <span className="text-sm text-muted-foreground px-3">
              Or enter manually
            </span>
            <div className="h-px bg-border flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Transaction Type Toggle */}
            <div>
              <Label className="mb-2">Transaction Type</Label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg mt-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange("expense")}
                  className={cn(
                    "flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    formData.transaction_type === "expense"
                      ? "bg-red-500 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Minus className="w-4 h-4 mr-1" />
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("income")}
                  className={cn(
                    "flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    formData.transaction_type === "income"
                      ? "bg-green-500 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Income
                </button>
              </div>
            </div>

            {/* Amount & Currency */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label className="mb-2" htmlFor="amount">
                  Amount *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  className="text-lg"
                  required
                />
              </div>
              <div>
                <Label className="mb-2" htmlFor="currency">
                  Currency
                </Label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currency: e.target.value,
                    }))
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Merchant/Source Name */}
            <div>
              <Label className="mb-2" htmlFor="merchant">
                {formData.transaction_type === "income"
                  ? "Source *"
                  : "Merchant *"}
              </Label>
              <Input
                id="merchant"
                value={formData.merchant_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    merchant_name: e.target.value,
                  }))
                }
                placeholder={
                  formData.transaction_type === "income"
                    ? "Where did you receive this from?"
                    : "Where did you spend this?"
                }
                required
              />
            </div>

            {/* Category & Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-2" htmlFor="category">
                  Category
                </Label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select category</option>
                  {categories[formData.transaction_type].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="mb-2" htmlFor="date">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.transaction_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      transaction_date: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label className="mb-2" htmlFor="description">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief description of the transaction"
              />
            </div>

            {/* Notes */}
            <div>
              <Label className="mb-2" htmlFor="notes">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Any additional notes..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                isLoading || !formData.amount || !formData.merchant_name
              }
              className={cn(
                "w-full mt-6 h-12 text-base",
                formData.transaction_type === "income"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save{" "}
                  {formData.transaction_type === "income"
                    ? "Income"
                    : "Expense"}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
