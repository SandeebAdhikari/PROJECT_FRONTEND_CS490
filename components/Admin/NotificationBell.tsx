"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

export default function NotificationBell({ count }: { count: number }) {
  return (
    <div className="relative">
      <Link
        href="/sidra/overview/pending-approvals"
        className="relative p-2 rounded-lg hover:bg-accent transition shadow-sm"
      >
        <Bell size={22} />

        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {count}
          </span>
        )}
      </Link>
    </div>
  );
}
