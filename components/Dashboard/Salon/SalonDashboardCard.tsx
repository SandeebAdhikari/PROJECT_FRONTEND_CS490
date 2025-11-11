import React from "react";
import { DashboardCardProps } from "@/libs/dashboard/dashboard.types";

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtext,
  change,
  icon: Icon,
  trendIcon: TrendIcon,
}) => {
  const isNegative = change.startsWith("-");
  const trendColor = isNegative
    ? "text-red-500 bg-red-100"
    : "text-green-600 bg-green-100";

  return (
    <div className="mt-4 border border-border bg-secondary rounded-lg p-6 hover:shadow-soft-br transition-smooth">
      <div className="flex justify-between items-center">
        <div className="relative w-11 h-11 sm:w-[48px] sm:h-[48px] bg-primary-light rounded-2xl flex items-center justify-center">
          <Icon className="text-white w-5 h-5" />
        </div>
        <div
          className={`flex ${trendColor} p-1.5 rounded-full items-center font-inter border border-border`}
        >
          <TrendIcon className="w-3 h-3 mr-1" />
          <h1 className="text-sm">{change}</h1>
        </div>
      </div>
      <h1 className="mt-4 font-inter font-semibold text-sm sm:text-base text-muted-foreground">
        {title}
      </h1>
      <h1 className="mt-1 text-3xl font-extrabold font-stretch-50% text-foreground">
        {value}
      </h1>
      <p className="font-inter text-xs sm:font-sm mt-2 text-muted-foreground">
        {subtext}
      </p>
    </div>
  );
};

export default DashboardCard;
