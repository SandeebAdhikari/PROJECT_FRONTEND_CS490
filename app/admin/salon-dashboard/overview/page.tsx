import React from "react";
import OverviewRevenueAnalytics from "@/components/Dashboard/Overview/OverviewRevenueAnalytics";
import OverviewServiceDistChar from "@/components/Dashboard/Overview/OverviewServiceDistChart";
import Header from "@/components/Dashboard/Header";
const page = () => {
  return (
    <div className="space-y-6 p-6 sm:p-8 font-inter">
      <Header
        title="Overview"
        subtitle="Track salon performance and activity overview"
        showActions={false}
      />

      <OverviewRevenueAnalytics />
      <OverviewServiceDistChar />
    </div>
  );
};

export default page;
