"use client";

import React, { useState, useEffect } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { User, Bell, Download } from "lucide-react";
import Icon9 from "@/public/icons/9.png";
import { getPendingSalons } from "@/libs/api/admins";

type AdminHeaderProps = {
  adminName: string;
  notificationCount?: number;
  onExport?: () => void;
  exporting?: boolean;
};

export default function AdminHeader({
  adminName: _adminName,
  notificationCount: propNotificationCount,
  onExport,
  exporting,
}: AdminHeaderProps) {
  const [notificationCount, setNotificationCount] = useState(propNotificationCount || 0);

  useEffect(() => {
    // Fetch real pending salons count
    const fetchPendingCount = async () => {
      try {
        const result = await getPendingSalons();
        if (!result.error && result.salons) {
          setNotificationCount(result.salons.length);
        }
      } catch (error) {
        console.error("Failed to fetch pending salons count:", error);
        // Keep default if fetch fails
      }
    };

    // Only fetch if prop wasn't provided
    if (propNotificationCount === undefined) {
      fetchPendingCount();
    }
  }, [propNotificationCount]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tempToken");
    window.location.href = "/sign-in";
  };

  return (
    <div
      className="
        flex items-center justify-between 
        w-full px-8 py-4 rounded-3xl mb-6
        bg-white 
        border-b border-border 
        shadow-sm
      "
    >
      {/* LEFT: LOGO + STYGO */}
      <div className="flex items-center gap-3">
        <NextImage src={Icon9} alt="logo" width={40} height={40} />
        <h1 className="text-2xl font-bold text-primary">StyGo Admin</h1>
      </div>

      {/* RIGHT: BELL + EXPORT + LOGOUT */}
      <div className="flex items-center gap-5">

        {/* NOTIFICATION BELL */}
        <Link href="/adminPortal/overview/pending-approvals" className="relative">
          <Bell size={22} className="hover:text-primary transition" />

          {notificationCount > 0 && (
            <span
              className="
                absolute -top-1 -right-2 
                bg-red-500 text-white 
                text-[10px] 
                w-4 h-4 
                flex items-center justify-center 
                rounded-full
              "
            >
              {notificationCount}
            </span>
          )}
        </Link>

        {/* EXPORT CSV */}
        {onExport && (
          <button
            onClick={onExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            <Download size={16} />
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        )}

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 rounded-lg border border-border text-base font-semibold hover:bg-accent transition shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
