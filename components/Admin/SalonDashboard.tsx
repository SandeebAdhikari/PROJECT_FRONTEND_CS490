import { Download, Plus } from "lucide-react";

import React from "react";
import DashboardCard from "./DashboardCard";
import data from "@/data/data.json" assert { type: "json" };
import { DashboardItem } from "@/libs/dashboard/dashboard.types";
import { icons } from "@/libs/dashboard/dashboard.icons";

const typedData = data as DashboardItem[];

const SalonDashboard = () => {
  return (
    <div className="p-4 sm:px-8 ">
      <div className="sm:flex sm:justify-between w-full ">
        <div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold">
            Good morning, Sandeeb!
          </h1>
          <p className="text-secondary-foreground font-inter text-base mt-2 sm:text-lg">
            Your salon is performing excellently today. Here&apos;s your
            overview.
          </p>
        </div>
        <div className="flex mt-3 gap-2">
          <div className="relative">
            <Download className="absolute w-4 h-4 top-3 left-3 sm:top-4 sm:left-4" />
            <button className="border border-border rounded-lg py-3 px-4 text-xs sm:text-sm font-inter font-semibold hover:cursor-pointer hover:bg-accent">
              <span className="sm:hidden ml-6">Export</span>
              <span className="hidden sm:flex ml-6">Export Report</span>
            </button>
          </div>
          <div className="relative  transition-smooth hover:scale-108">
            <Plus className="absolute w-4 h-4 top-3 left-3 text-white sm:top-4 sm:left-4" />
            <button className="border border-border rounded-lg py-3 px-4 text-xs sm:text-sm font-inter font-semibold bg-primary-light text-white hover:cursor-pointer ">
              <span className="sm:hidden ml-6">Actions</span>
              <span className="hidden sm:flex ml-6">Quick Actions</span>
            </button>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-6">
        {typedData.map((item: DashboardItem) => {
          const Icon = icons[item.icon];
          const TrendIcon = icons[item.trendIcon];
          return (
            <DashboardCard
              key={item.id}
              title={item.title}
              value={item.value}
              subtext={item.subtext}
              change={item.change}
              icon={Icon}
              trendIcon={TrendIcon}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SalonDashboard;
