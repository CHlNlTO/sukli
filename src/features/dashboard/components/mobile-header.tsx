// src/features/dashboard/components/mobile-header.tsx
"use client";

import { UserButton } from "@clerk/nextjs";
import { Search, Bell } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-semibold text-foreground">Sukli</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="w-5 h-5" />
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
