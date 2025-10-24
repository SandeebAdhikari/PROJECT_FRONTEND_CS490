"use client";

import React, { useState } from "react";
import data from "@/data/data.json" assert { type: "json" };
import { DashboardData } from "@/libs/dashboard/dashboard.types";
import { icons } from "@/libs/dashboard/dashboard.icons";

import Overview from "./SalonDashBoardTabs/Overview";
import Appointments from "./SalonDashBoardTabs/Appointments";
import Staff from "./SalonDashBoardTabs/Staff";
import Customers from "./SalonDashBoardTabs/Customers";
import Analytics from "./SalonDashBoardTabs/Analytics";
import Settings from "./SalonDashBoardTabs/Settings";

const SalonDashboardTabs = () => {
  const typedData = data as DashboardData;
  const [active, setActive] = useState("Overview");

  const renderActiveTab = () => {
    switch (active) {
      case "Overview":
        return <Overview />;
      case "Appointments":
        return <Appointments />;
      case "Staff":
        return <Staff />;
      case "Customers":
        return <Customers />;
      case "Analytics":
        return <Analytics />;
      case "Settings":
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="grid w-full grid-cols-3 sm:grid-cols-6 bg-secondary rounded-2xl p-1 sm:p-2 scrollbar-hide">
        {typedData.menu.map((tab) => {
          const Icon = icons[tab.icon];
          const isActive = active === tab.label;

          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.label)}
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
            </button>
          );
        })}
      </div>

      <div className="mt-6">{renderActiveTab()}</div>
    </div>
  );
};

export default SalonDashboardTabs;
