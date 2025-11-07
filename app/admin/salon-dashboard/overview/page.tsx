import React from "react";
import OverviewRevenueAnalytics from "@/components/Dashboard/Overview/OverviewRevenueAnalytics";
import OverviewServiceDistChar from "@/components/Dashboard/Overview/OverviewServiceDistChart";
const page = () => {
  return (
    <div className="space-y-6 p-6 sm:p-8">
      <OverviewRevenueAnalytics />
      <OverviewServiceDistChar />
    </div>
  );
};

export default page;
