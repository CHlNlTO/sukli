// src/features/dashboard/components/quick-actions.tsx
"use client";

import { motion } from "framer-motion";
import { Camera, Upload, PenTool, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: "Scan Receipt",
      description: "Take a photo",
      icon: Camera,
      color: "bg-blue-500",
      action: () => router.push("/scan-receipt"),
    },
    {
      title: "Upload Image",
      description: "From gallery",
      icon: Upload,
      color: "bg-green-500",
      action: () => router.push("/upload-receipt"),
    },
    {
      title: "Add Manually",
      description: "Enter details",
      icon: PenTool,
      color: "bg-purple-500",
      action: () => router.push("/add-transaction"),
    },
    {
      title: "View Stats",
      description: "Analytics",
      icon: BarChart3,
      color: "bg-orange-500",
      action: () => router.push("/stats"),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            className="p-4 bg-card border border-border rounded-xl text-left hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-3">
              <div
                className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}
              >
                <action.icon className="w-5 h-5 text-white" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {action.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
