'use client';

import { Suspense, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DashboardRouteLoadingSkeleton } from "./components/loading-skeletons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#0d0d1a" }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="lg:pl-sidebar flex flex-col min-h-screen">
        {/* Header */}
        <Header onMenuOpen={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <Suspense fallback={<DashboardRouteLoadingSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}

