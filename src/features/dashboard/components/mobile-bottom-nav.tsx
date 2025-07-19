// src/features/dashboard/components/mobile-bottom-nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Receipt, BarChart3, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Stats", href: "/stats", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAddPressed, setIsAddPressed] = useState(false);

  const handleAddTransaction = () => {
    router.push("/add-transaction");
  };

  return (
    <>
      {/* Floating Add Button */}
      <motion.button
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onTouchStart={() => setIsAddPressed(true)}
        onTouchEnd={() => setIsAddPressed(false)}
        onMouseDown={() => setIsAddPressed(true)}
        onMouseUp={() => setIsAddPressed(false)}
        onMouseLeave={() => setIsAddPressed(false)}
        onClick={handleAddTransaction}
        animate={{
          boxShadow: isAddPressed
            ? "0 4px 12px rgba(0, 0, 0, 0.15)"
            : "0 8px 25px rgba(0, 0, 0, 0.15)",
        }}
        transition={{ duration: 0.2 }}
      >
        <Plus className="w-7 h-7 text-white" />
      </motion.button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-x border-border max-w-2xl mx-auto">
        <div className="flex items-center justify-around py-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className="relative p-3">
                <motion.div
                  className="flex flex-col items-center space-y-1"
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    <item.icon
                      className={cn(
                        "w-6 h-6 transition-colors",
                        isActive ? "text-blue-600" : "text-muted-foreground"
                      )}
                    />
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 -left-1 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full -z-10"
                        layoutId="activeTab"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isActive ? "text-blue-600" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
