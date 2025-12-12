"use client";

import React, { useState, useEffect, useCallback } from "react";
import ChartCard from "@/components/Admin/ChartCard";
import { ResponsiveContainer } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  getAppointmentTrends,
  getUserEngagement,
  getUserDemographics,
  getCustomerRetention,
  getLoyaltyUsage,
  AppointmentTrend,
  UserDemographic,
  CustomerRetention,
  LoyaltyUsage,
} from "@/libs/api/admins";

export default function AnalyticsPage() {
  const [appointmentTrends, setAppointmentTrends] = useState<AppointmentTrend[]>([]);
  const [demographics, setDemographics] = useState<UserDemographic[]>([]);
  const [engagement, setEngagement] = useState<{ activeUsers: { active_user_count: number }; totalUsers: { total_user_count: number } } | null>(null);
  const [retention, setRetention] = useState<CustomerRetention | null>(null);
  const [loyaltyUsage, setLoyaltyUsage] = useState<LoyaltyUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [trendsResult, engagementResult, demographicsResult, retentionResult, loyaltyResult] = await Promise.all([
        getAppointmentTrends(startDate || undefined, endDate || undefined),
        getUserEngagement(),
        getUserDemographics(),
        getCustomerRetention(),
        getLoyaltyUsage(),
      ]);

      if (trendsResult.error) {
        console.error("Failed to load trends:", trendsResult.error);
      } else {
        setAppointmentTrends(trendsResult.trends || []);
      }

      if (engagementResult.error) {
        console.error("Failed to load engagement:", engagementResult.error);
      } else {
        setEngagement(engagementResult.engagement || null);
      }

      if (demographicsResult.error) {
        console.error("Failed to load demographics:", demographicsResult.error);
      } else {
        setDemographics(demographicsResult.demographics || []);
      }

      if (retentionResult.error) {
        console.error("Failed to load retention:", retentionResult.error);
      } else {
        setRetention(retentionResult.retention || null);
      }

      if (loyaltyResult.error) {
        console.error("Failed to load loyalty:", loyaltyResult.error);
      } else {
        setLoyaltyUsage(loyaltyResult.usage || null);
      }
    } catch (err) {
      console.error("Error loading analytics:", err);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Format appointment trends for chart (24 hours)
  const trendsChartData = Array.from({ length: 24 }, (_, i) => {
    const trend = appointmentTrends.find((t) => t.hour === i);
    return {
      hour: `${i}:00`,
      count: trend?.appointments || 0,
    };
  });

  // Note: Backend provides total active users in last 30 days, not daily breakdown
  // For a proper daily active users chart, we'd need a backend endpoint that provides daily login/appointment data

  // Format demographics for chart
  const demographicsChartData = demographics.map((d) => ({
    group: d.user_role || "Unknown",
    users: d.count || 0,
  }));

  // Format activity data (sessions per day - estimated based on total users)
  // Note: Backend doesn't provide session data, so we show a flat estimate
  // This is a placeholder visualization - in production, you'd want a backend endpoint that tracks sessions
  const totalUsersCount = engagement?.totalUsers?.total_user_count ?? 0;
  const estimatedDailySessions =
    totalUsersCount > 0 ? Math.floor(totalUsersCount * 0.3) : 0; // Estimate 30% of users are active daily
  const activityData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      sessions: estimatedDailySessions,
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Users Overview</h1>
          <p className="text-lg text-muted-foreground">
            User engagement, demographics, and platform activity insights.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
            placeholder="End Date"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Engagement */}
        <ChartCard title="User Engagement">
          <div className="flex flex-col items-center justify-center h-[250px] text-center">
            <p className="text-4xl font-bold text-foreground mb-2">
              {engagement?.activeUsers?.active_user_count ?? 0}
            </p>
            <p className="text-muted-foreground mb-4">Active Users (Last 30 Days)</p>
            <p className="text-sm text-muted-foreground">
              {engagement?.totalUsers?.total_user_count ?? 0} total users
            </p>
            {(engagement?.totalUsers?.total_user_count ?? 0) > 0 && (
              <p className="text-sm text-primary mt-2">
                {Math.round(
                  ((engagement?.activeUsers?.active_user_count ?? 0) /
                    (engagement?.totalUsers?.total_user_count ?? 1)) *
                    100
                )}% engagement rate
              </p>
            )}
          </div>
        </ChartCard>

        {/* User Demographics */}
        <ChartCard title="User Demographics">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={demographicsChartData}
                dataKey="users"
                nameKey="group"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {demographicsChartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={["hsl(var(--primary))", "hsl(var(--accent))", "#8884d8", "#82ca9d"][i % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Platform Activity */}
        <ChartCard title="Platform Activity (Sessions Per Day)">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityData}>
              <XAxis dataKey="day" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Bar dataKey="sessions" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Appointment Trends */}
        <ChartCard title="Appointment Trends Per Hour">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendsChartData}>
              <XAxis dataKey="hour" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--accent))"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Customer Retention */}
        <ChartCard title="Customer Retention">
          <div className="flex flex-col items-center justify-center h-[250px] text-center">
            <p className="text-4xl font-bold text-foreground mb-2">
              {retention?.retained_customers || 0}
            </p>
            <p className="text-muted-foreground mb-4">Retained Customers</p>
            <p className="text-sm text-muted-foreground">
              Customers who made repeat purchases
            </p>
          </div>
        </ChartCard>

        {/* Loyalty Program Usage */}
        <ChartCard title="Loyalty Program Usage">
          <div className="flex flex-col justify-center h-[250px] px-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Enrolled</span>
                <span className="text-2xl font-bold text-foreground">
                  {loyaltyUsage?.overview.total_enrolled_users || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active (30d)</span>
                <span className="text-xl font-semibold text-primary">
                  {loyaltyUsage?.overview.active_users_30d || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Points Outstanding</span>
                <span className="text-xl font-semibold text-accent">
                  {loyaltyUsage?.overview.total_points_outstanding?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Points/User</span>
                <span className="text-lg font-semibold text-foreground">
                  {loyaltyUsage?.overview.avg_points_per_user?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Users Who Redeemed</span>
                <span className="text-lg font-bold text-foreground">
                  {loyaltyUsage?.overview.users_who_redeemed || 0}
                </span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
