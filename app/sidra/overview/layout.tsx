"use client";

import Sidebar from "@/components/Admin/Sidebar";

export default function SidraLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0f1220] text-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
