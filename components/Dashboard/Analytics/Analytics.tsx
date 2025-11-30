"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import useSalonId from "@/hooks/useSalonId";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";
import { API_ENDPOINTS } from "@/libs/api/config";
import { DashboardAnalytics } from "@/libs/types/analytics";

const Analytics = () => {
  const { salonId, loadingSalon } = useSalonId();
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    if (!salonId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithRefresh(
        API_ENDPOINTS.ANALYTICS.DASHBOARD(salonId),
        { credentials: "include" }
      );
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message || payload?.error || "Failed to load analytics");
      }
      setData(payload.data);
    } catch (err) {
      console.error("Analytics dashboard load error:", err);
      setError(err instanceof Error ? err.message : "Unable to load analytics");
    } finally {
      setLoading(false);
    }
  }, [salonId]);

  useEffect(() => {
    if (salonId) {
      loadAnalytics();
    }
  }, [salonId, loadAnalytics]);

  return (
    <div className="space-y-4">
      <Header
        title="Analytics Dashboard"
        subtitle="Visualize your salon performance data"
        showActions={false}
      />

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {loadingSalon || loading || !data ? (
        <p className="text-sm text-muted-foreground">Loading analytics…</p>
      ) : (
        <>
          <RevenueAnalytics data={data.revenue} />
          <div className="sm:flex gap-2 w-full space-y-4">
            <div className="sm:w-1/2">
              <AnalyticsBookingTrend data={data.bookings} />
            </div>
            <div className="sm:w-1/2">
              <AnalyticsPeakHours data={data.peakHours} />
            </div>
          </div>
          <div className="sm:flex gap-2 w-full space-y-4">
            <div className="sm:w-1/2">
              <AnalyticsServiceChart data={data.serviceDistribution} />
            </div>
            <div className="sm:w-1/2">
              <AnalyticsServiceRevenue data={data.serviceRevenue} />
            </div>
          </div>
          <AnalyticsStaffPerformance data={data.staffPerformance} />
          <div className="sm:flex gap-2 w-full space-y-4">
            <div className="sm:w-1/2">
              <AnalyticsCustomerRetention data={data.customerRetention} />
            </div>
            <div className="sm:w-1/2">
              <AnalyticsCustomerValue data={data.customerValue} />
            </div>
          </div>
          <AnalyticsGrowthOverview data={data.growthOverview} />
        </>
      )}
    </div>
  );
};

export default Analytics;
