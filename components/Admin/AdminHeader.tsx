"use client";

import NextImage from "next/image";
import Link from "next/link";
import { User, Bell } from "lucide-react";
import Icon9 from "@/public/icons/9.png";

type AdminHeaderProps = {
  adminName: string;
  notificationCount?: number;
};

export default function AdminHeader({ adminName, notificationCount = 3 }: AdminHeaderProps) {
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
      {/* stygo logo */}
      <div className="flex items-center gap-3">
        <NextImage src={Icon9} alt="logo" width={40} height={40} />
        <h1 className="text-2xl font-bold text-primary">StyGo Admin</h1>
      </div>

     
      <div className="flex items-center gap-5">

        {/* notif bell */}
        <Link href="/sidra/overview/pending-approvals" className="relative">
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

        {/* admin prof */}
        <Link
          href="/sidra/overview/admin"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold hover:bg-accent transition shadow-sm"
        >
          <User size={18} />
          Admin Profile 
        </Link>

        {/* logout */}
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
