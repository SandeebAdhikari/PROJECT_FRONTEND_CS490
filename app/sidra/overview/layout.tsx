"use client";

import Sidebar from "@/components/Admin/Sidebar";

export default function SidraLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
