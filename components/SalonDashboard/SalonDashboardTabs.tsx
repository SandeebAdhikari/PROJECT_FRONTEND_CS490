"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import data from "@/data/data.json" assert { type: "json" };
import { DashboardData } from "@/libs/dashboard/dashboard.types";
import { icons } from "@/libs/dashboard/dashboard.icons";

const SalonDashboardTabs = ({ activeTab }: { activeTab?: string }) => {
  const typedData = data as DashboardData;
  const pathname = usePathname();

  return (
    <div className="p-4 sm:p-8">
      <div className="grid w-full grid-cols-3 sm:grid-cols-6 bg-secondary rounded-2xl p-1 sm:p-2 scrollbar-hide">
        {typedData.menu.map((tab) => {
          const Icon = icons[tab.icon];
          const isActive =
            pathname.endsWith(tab.label.toLowerCase()) ||
            activeTab === tab.label;

          return (
            <Link
              key={tab.id}
              href={`/admin/salon-dashboard/${tab.label.toLowerCase()}`}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 rounded-xl font-inter text-sm sm:text-base font-medium transition-smooth cursor-pointer ${
                isActive
                  ? "bg-white text-black shadow-soft-br"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
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
