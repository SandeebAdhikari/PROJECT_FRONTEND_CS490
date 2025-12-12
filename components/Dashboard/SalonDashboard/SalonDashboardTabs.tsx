"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { icons } from "@/libs/dashboard/dashboard.icons";

// Static menu configuration - no need for external JSON
const DASHBOARD_MENU = [
  { id: 1, label: "Overview", shortLabel: "Home", icon: "BarChart3" },
  { id: 2, label: "Appointments", shortLabel: "Appts", icon: "CalendarDays" },
  { id: 3, label: "Staff", shortLabel: "Staff", icon: "Users" },
  { id: 4, label: "Customers", shortLabel: "Clients", icon: "UserCircle2" },
  { id: 5, label: "Analytics", shortLabel: "Stats", icon: "Clock" },
  { id: 6, label: "Gallery", shortLabel: "Photos", icon: "Image" },
  { id: 7, label: "Reviews", shortLabel: "Reviews", icon: "Star" },
  { id: 10, label: "Promotions", shortLabel: "Promos", icon: "Tag" },
  { id: 11, label: "Payments", shortLabel: "Payments", icon: "CreditCard" },
  { id: 8, label: "Salon Settings", shortLabel: "Salon", icon: "Building2" },
  { id: 9, label: "Account Settings", shortLabel: "Account", icon: "Settings" },
];

const SalonDashboardTabs = ({ activeTab }: { activeTab?: string }) => {
  const pathname = usePathname();

  return (
    <div className="p-4 sm:p-8">
      <div className="flex w-full bg-secondary rounded-2xl p-1 sm:p-2 scrollbar-hide overflow-x-auto">
        {DASHBOARD_MENU.map((tab) => {
          const Icon = icons[tab.icon];
          const urlPath = tab.label.toLowerCase().replace(/\s+/g, "-");
          const isActive =
            pathname.endsWith(urlPath) ||
            activeTab === tab.label;

          return (
            <Link
              key={tab.id}
              href={`/salonPortal/salon-dashboard/${urlPath}`}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl font-inter text-xs sm:text-sm font-medium transition-smooth cursor-pointer flex-1 min-w-fit whitespace-nowrap ${
                isActive
                  ? "bg-white text-black shadow-soft-br"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                  isActive ? "text-black" : "text-muted-foreground"
                }`}
              />
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SalonDashboardTabs;
