import React from "react";
import OverviewRevenueAnalytics from "@/components/Dashboard/Overview/OverviewRevenueAnalytics";
import OverviewServiceDistChar from "@/components/Dashboard/Overview/OverviewServiceDistChart";
import Header from "@/components/Dashboard/Header";
import TodaySchedule from "@/components/Dashboard/Overview/OverviewTodaySchedule";
const page = () => {
  return (
    <div className="space-y-6 p-6 sm:p-8 font-inter">
      <Header
        title="Overview"
        subtitle="Track salon performance and activity overview"
        showActions={false}
      />
      <div className="sm:flex gap-4 space-y-6">
        <div className="sm:w-2/3">
          <OverviewRevenueAnalytics />
        </div>
        <div className="sm:w-1/3 ">
          <OverviewServiceDistChar />
        </div>
      </div>
      <TodaySchedule />
    </div>
  );
};

export default page;
