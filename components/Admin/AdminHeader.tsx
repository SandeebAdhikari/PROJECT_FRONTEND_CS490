"use client";

import { Bell, LogOut, User } from "lucide-react";
import Image from "next/image";

export default function AdminHeader({ adminName }: { adminName: string }) {
  return (
    <header className="flex items-center justify-between mb-10 pb-4 border-b border-border">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, <span className="text-primary">{adminName}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here’s your analytics overview.</p>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-xl hover:bg-secondary transition-smooth">
          <Bell className="text-muted-foreground" size={22} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-secondary hover:bg-muted transition-smooth">
          <User size={20} className="text-primary" />
          <span className="text-foreground text-sm font-medium">{adminName}</span>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-smooth">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </header>
  );
}
