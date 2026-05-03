'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Frame,
  FolderKanban,
  Sparkles,
  LayoutDashboard,
  Rocket,
  Gift,
  Wallet,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Star,
  X,
  Bot,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Frames", href: "/dashboard/frames", icon: Frame },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Templates", href: "/dashboard/templates", icon: Sparkles },
  { name: "AI Prompts", href: "/dashboard/prompts", icon: Bot },
  { name: "Tools", href: "/dashboard/tools", icon: Rocket },
];

const workspace = [
  { name: "Airdrop", href: "#", icon: Gift },
  { name: "Monitor", href: "#", icon: Wallet },
  { name: "Track PNL", href: "#", icon: TrendingUp },
  { name: "Admin Panel", href: "/admin", icon: ShieldCheck },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col
          w-sidebar min-w-sidebar
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          background: "linear-gradient(180deg, #100e1f 0%, #14112a 100%)",
          borderRight: "1px solid #2d2560",
        }}
        aria-label="Sidebar navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2.5 group" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-DEFAULT to-purple-light flex items-center justify-center shadow-soft glow-purple">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-textPrimary tracking-tight">AiFarcaster</span>
          </Link>
          <button
            className="lg:hidden text-textSecondary hover:text-textPrimary transition-colors"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-textMuted">
            Main
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`sidebar-item group ${isActive ? "sidebar-active text-textPrimary" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon
                  className={`w-4.5 h-4.5 flex-shrink-0 transition-colors ${
                    isActive ? "text-purple-light" : "text-textMuted group-hover:text-textSecondary"
                  }`}
                  style={{ width: "18px", height: "18px" }}
                />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-purple-light opacity-70" />}
              </Link>
            );
          })}

          <p className="px-3 mt-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-textMuted">
            Workspace
          </p>
          {workspace.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="sidebar-item group"
            >
              <item.icon
                className="text-textMuted group-hover:text-textSecondary transition-colors flex-shrink-0"
                style={{ width: "18px", height: "18px" }}
              />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User panel */}
        <div className="px-3 py-3 border-t border-border/50">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-DEFAULT to-blue-DEFAULT flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-textPrimary truncate">User</p>
              <p className="text-[10px] text-textMuted truncate">Free plan</p>
            </div>
          </div>
        </div>

        {/* Upgrade card */}
        <div className="mx-3 mb-4 p-3.5 rounded-xl bg-gradient-to-br from-purple-DEFAULT/20 to-blue-DEFAULT/10 border border-purple-DEFAULT/20">
          <div className="flex items-center gap-2 mb-1.5">
            <Star className="w-3.5 h-3.5 text-purple-light" />
            <span className="text-xs font-semibold text-textPrimary">Upgrade to Pro</span>
          </div>
          <p className="text-[10px] text-textSecondary leading-relaxed mb-2.5">
            Unlock advanced AI features, unlimited frames, and priority support.
          </p>
          <button className="w-full text-xs font-semibold text-white bg-gradient-to-r from-purple-DEFAULT to-purple-light py-1.5 rounded-lg transition-opacity hover:opacity-90">
            Upgrade Now
          </button>
        </div>
      </aside>
    </>
  );
}
