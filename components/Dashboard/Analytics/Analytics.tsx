import React from "react";
import Header from "../Header";
import RevenueAnalytics from "./AnalyticsRevenue";
import AnalyticsBookingTrend from "./AnalyticsBookingTrend";
import AnalyticsPeakHours from "./AnalyticsPeakHours";
import AnalyticsServiceRevenue from "./AnalyticsServiceRevenue";
import AnalyticsServiceChart from "./AnalyticsServiceChart";
import AnalyticsStaffPerformance from "./AnalyticsStaffPerformance";
import AnalyticsCustomerRetention from "./AnalyticsCustomerRetention";
import AnalyticsCustomerValue from "./AnalyticsCustomerValue";
import AnalyticsGrowthOverview from "./AnalyticsGrowthOverview";

const Analytics = () => {
  return (
    <div className="space-y-4">
      <Header
        title="Analytics Dashboard"
        subtitle="Visualize your salon performance data"
        showActions={false}
      />

      <RevenueAnalytics />
      <div className="sm:flex gap-2 w-full space-y-4">
        <div className="sm:w-1/2">
          <AnalyticsBookingTrend />
        </div>
        <div className="sm:w-1/2">
          <AnalyticsPeakHours />
        </div>
      </div>
      <div className="sm:flex gap-2 w-full space-y-4">
        <div className="sm:w-1/2">
          <AnalyticsServiceChart />
        </div>
        <div className="sm:w-1/2">
          <AnalyticsServiceRevenue />
        </div>
      </div>
      <AnalyticsStaffPerformance />
      <div className="sm:flex gap-2 w-full space-y-4">
        <div className="sm:w-1/2">
          <AnalyticsCustomerRetention />
        </div>
        <div className="sm:w-1/2">
          <AnalyticsCustomerValue />
        </div>
      </div>
      <AnalyticsGrowthOverview />
    </div>
  );
};

export default Analytics;
