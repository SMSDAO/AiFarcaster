'use client';

import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Bell, Settings, Search, Menu, ChevronRight, Calendar } from "lucide-react";
import { useState } from "react";

const routeLabels: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/frames": "Frames",
  "/dashboard/projects": "Projects",
  "/dashboard/templates": "Templates",
  "/dashboard/prompts": "AI Prompts",
  "/dashboard/tools": "Tools",
};

interface HeaderProps {
  onMenuOpen: () => void;
}

export function Header({ onMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);
  const pageTitle = routeLabels[pathname] ?? "Dashboard";
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6"
      style={{
        height: "60px",
        background: "rgba(13,13,26,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #2d2560",
      }}
    >
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="lg:hidden text-textSecondary hover:text-textPrimary transition-colors"
          onClick={onMenuOpen}
          aria-label="Open navigation menu"
          aria-expanded="false"
          aria-controls="sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-textMuted">
          <span>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-textSecondary font-medium">{pageTitle}</span>
        </div>

        <h1 className="text-base font-bold text-textPrimary ml-2 hidden lg:block">
          {pageTitle}
        </h1>
      </div>

      {/* Center: search */}
      <div className={`hidden md:flex items-center gap-2 bg-card/80 border rounded-lg px-3 py-1.5 transition-all duration-200 ${
        searchFocused ? "border-purple-DEFAULT/60 shadow-[0_0_0_2px_rgba(124,58,237,0.15)]" : "border-border/60"
      }`}
        style={{ width: searchFocused ? "280px" : "220px" }}
      >
        <Search className="w-3.5 h-3.5 text-textMuted flex-shrink-0" />
        <input
          type="search"
          placeholder="Search..."
          className="bg-transparent text-sm text-textPrimary placeholder:text-textMuted outline-none w-full"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Date badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/60 border border-border/40 text-xs text-textSecondary">
          <Calendar className="w-3 h-3 text-textMuted" />
          {today}
        </div>

        {/* Notifications */}
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-lg text-textSecondary hover:text-textPrimary hover:bg-white/5 transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-light animate-pulse" />
        </button>

        {/* Settings */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg text-textSecondary hover:text-textPrimary hover:bg-white/5 transition-all duration-200"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* WalletConnect */}
        <div className="hidden sm:block">
          <ConnectButton
            accountStatus="avatar"
            chainStatus="none"
            showBalance={false}
          />
        </div>
      </div>
    </header>
  );
}
