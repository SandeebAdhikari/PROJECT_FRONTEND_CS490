"use client";

import {
  LayoutDashboard,
  Calendar,
  BarChart2,
  Settings,
  Download,
  Activity,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/sidra/overview", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { href: "/sidra/overview/appointments", icon: <Calendar size={18} />, label: "Appointments" },
  { href: "/sidra/overview/analytics", icon: <BarChart2 size={18} />, label: "Analytics" },
  { href: "/sidra/overview/reports", icon: <Download size={18} />, label: "Reports" },
  { href: "/sidra/overview/reliability", icon: <Activity size={18} />, label: "Reliability" },
  { href: "/sidra/overview/settings", icon: <Settings size={18} />, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1a1f2b] flex flex-col p-5">
      <h1 className="text-2xl font-bold text-indigo-400 mb-8">Admin Panel</h1>
      <nav className="flex flex-col space-y-2">
        {navItems.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
              pathname === href
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-indigo-700"
            }`}
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
