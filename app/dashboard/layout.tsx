'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { 
  Zap, 
  Frame, 
  FolderKanban, 
  Sparkles, 
  Layout,
  Rocket,
  Gift,
  Wallet,
  TrendingUp,
  Menu,
  X,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: Layout },
    { name: "Frames", href: "/dashboard/frames", icon: Frame },
    { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    { name: "Templates", href: "/dashboard/templates", icon: Sparkles },
    { name: "AI Prompts", href: "/dashboard/prompts", icon: Sparkles },
    { name: "Tools", href: "/dashboard/tools", icon: Rocket },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg"
          aria-expanded={sidebarOpen}
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        id="mobile-menu"
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!sidebarOpen && "true"}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">AiFarcaster</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick Actions</div>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2">
                <Gift className="w-4 h-4" />
                <span>Airdrop</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span>Monitor</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Track PNL</span>
              </button>
              <Link
                href="/admin"
                className="w-full text-left px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2"
                onClick={() => setSidebarOpen(false)}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="lg:hidden w-12"></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
            </h1>
            <ConnectButton />
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
