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
  getDailyActivity,
  AppointmentTrend,
  DemographicsResponse,
  EngagementResponse,
  DailyActivityPoint,
} from "@/libs/api/admins";

export default function AnalyticsPage() {
  const [appointmentTrends, setAppointmentTrends] = useState<AppointmentTrend[]>([]);
  const [demographics, setDemographics] = useState<DemographicsResponse | null>(null);
  const [engagement, setEngagement] = useState<EngagementResponse | null>(null);
  const [activity, setActivity] = useState<DailyActivityPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [trendsResult, engagementResult, demographicsResult] = await Promise.all([
        getAppointmentTrends(startDate || undefined, endDate || undefined),
        getUserEngagement(),
        getUserDemographics(),
      ]);
      const activityResult = await getDailyActivity();

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
        setDemographics(demographicsResult.demographics || null);
      }

      if (activityResult.error) {
        console.error("Failed to load activity:", activityResult.error);
      } else {
        setActivity(activityResult.activity || []);
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

  // Format demographics for charts (customers only)
  const genderChartData = (demographics?.gender ?? []).map((d) => ({
    group: d.bucket || "Unknown",
    users: d.count || 0,
  }));

  const ageChartData = (demographics?.age ?? []).map((d) => ({
    group: d.bucket || "Unknown",
    users: d.count || 0,
  }));

  // Format activity data (sessions per day) from backend
  const activityData =
    activity.length > 0
      ? activity.map((a) => ({
          day: new Date(a.day).toLocaleDateString("en-US", { weekday: "short" }),
          sessions: a.sessions,
        }))
      : [];

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
              {engagement?.customers?.mau_30d ?? 0}
            </p>
            <p className="text-muted-foreground mb-4">Active Users (Last 30 Days)</p>
            <p className="text-sm text-muted-foreground">
              {engagement?.customers?.total_users ?? 0} total users
            </p>
            {(engagement?.customers?.total_users ?? 0) > 0 && (
              <p className="text-sm text-primary mt-2">
                {Math.round(
                  ((engagement?.customers?.mau_30d ?? 0) /
                    (engagement?.customers?.total_users ?? 1)) *
                    100
                )}% engagement rate
              </p>
            )}
          </div>
        </ChartCard>

        {/* User Demographics */}
        <ChartCard title="User Demographics — Gender (customers)">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderChartData}
                dataKey="users"
                nameKey="group"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {genderChartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={["hsl(var(--primary))", "hsl(var(--accent))", "#8884d8", "#82ca9d", "#f6ad55", "#63b3ed"][i % 6]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Demographics by Age */}
        <ChartCard title="User Demographics — Age (customers)">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ageChartData}
                dataKey="users"
                nameKey="group"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {ageChartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={["#63b3ed", "#f6ad55", "hsl(var(--primary))", "hsl(var(--accent))", "#8884d8", "#82ca9d"][i % 6]}
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
      </div>
    </div>
  );
}
