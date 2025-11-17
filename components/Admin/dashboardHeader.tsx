"use client";

import React from "react";
import { Bell } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="w-full flex justify-between items-center p-4 border-b border-gray-800 bg-[#111827]">
      {/* Left: dashboard title */}
      <h2 className="text-xl font-semibold text-white">Admin Dashboard</h2>

      {/* Right: actions (notifications, logout, etc.) */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <Bell className="text-gray-300 w-5 h-5 cursor-pointer hover:text-indigo-400" />

        {/* Logout button */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/sign-in";
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
