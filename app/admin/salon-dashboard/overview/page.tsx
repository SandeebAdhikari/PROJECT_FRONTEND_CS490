import React from "react";
import OverviewRevenueAnalytics from "@/components/Dashboard/Overview/OverviewRevenueAnalytics";
import OverviewServiceDistChar from "@/components/Dashboard/Service/ServiceDistChart";
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
      <div className="flex flex-col gap-6 sm:gap-4 sm:flex-col lg:flex-row">
        <div className="w-full lg:w-3/5 xl:w-2/3">
          <OverviewRevenueAnalytics />
        </div>
        <div className="w-full lg:flex-1">
          <OverviewServiceDistChar />
        </div>
      </div>
      <TodaySchedule />
    </div>
  );
};

export default page;
