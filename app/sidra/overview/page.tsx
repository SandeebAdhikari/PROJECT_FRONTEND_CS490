"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import DashboardCards from "@/components/Admin/DashboardCards";
import ChartCard from "@/components/Admin/ChartCard";
import AdminHeader from "@/components/Admin/AdminHeader";
import {
  getAppointmentTrends,
  getSalonRevenues,
  getUserEngagement,
  getUserDemographics,
  AppointmentTrend,
  SalonRevenue,
  UserDemographic,
} from "@/libs/api/admins";

export default function SidraDashboard() {
  const ADMIN_NAME = "Admin";
  const [appointmentTrends, setAppointmentTrends] = useState<AppointmentTrend[]>([]);
  const [revenues, setRevenues] = useState<SalonRevenue[]>([]);
  const [demographics, setDemographics] = useState<UserDemographic[]>([]);
  const [engagement, setEngagement] = useState<{ activeUsers: { active_user_count: number }; totalUsers: { total_user_count: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [trendsResult, revenuesResult, engagementResult, demographicsResult] = await Promise.all([
        getAppointmentTrends(),
        getSalonRevenues(),
        getUserEngagement(),
        getUserDemographics(),
      ]);

      if (trendsResult.error) {
        console.error("Failed to load trends:", trendsResult.error);
      } else {
        setAppointmentTrends(trendsResult.trends || []);
      }

      if (revenuesResult.error) {
        console.error("Failed to load revenues:", revenuesResult.error);
      } else {
        setRevenues(revenuesResult.revenues || []);
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
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Format appointment trends for chart (24 hours)
  const trendsChartData = Array.from({ length: 24 }, (_, i) => {
    const trend = appointmentTrends.find((t) => t.hour === i);
    return {
      hour: `${i}:00`,
      count: trend?.appointments || 0,
    };
  });

  // Format revenue data for chart
  const revenueChartData = revenues.slice(0, 12).map((r) => ({
    month: r.salon_name || `Salon ${r.salon_id}`,
    revenue: Number(r.total_revenue || 0),
  }));

  // Format demographics for chart
  const demographicsChartData = demographics.map((d) => ({
    group: d.user_role || "Unknown",
    users: d.count || 0,
  }));

  // Calculate stats
  const totalRevenue = revenues.reduce((sum, r) => sum + Number(r.total_revenue || 0), 0);
  const peakHour = appointmentTrends.length > 0
    ? appointmentTrends.reduce(
        (max, trend) => (trend.appointments > max.appointments ? trend : max),
        appointmentTrends[0]
      )
    : { hour: 0, appointments: 0 };
  const engagementPercent = engagement && engagement.totalUsers.total_user_count > 0
    ? Math.round(
        (engagement.activeUsers.active_user_count /
          engagement.totalUsers.total_user_count) *
          100
      )
    : 0;

  const stats = {
    engagement: engagementPercent,
    peakHours: peakHour.appointments > 0 ? `${peakHour.hour}:00` : "N/A",
    revenue: totalRevenue,
  };

  if (loading) {
    return (
      <div className="pb-10">
        <AdminHeader adminName={ADMIN_NAME} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <AdminHeader adminName={ADMIN_NAME} />
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <DashboardCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                stroke="hsl(var(--primary))"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Salon Revenue */}
        <ChartCard title="Revenue by Salon">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueChartData}>
              <XAxis
                dataKey="month"
                stroke="#999"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#999" />
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
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

        {/* Customer Retention Placeholder */}
        <ChartCard title="Platform Overview">
          <div className="flex flex-col items-center justify-center h-[250px] text-center">
            <p className="text-2xl font-bold text-foreground mb-2">
              {engagement?.totalUsers.total_user_count || 0}
            </p>
            <p className="text-muted-foreground">Total Users</p>
            <p className="text-sm text-muted-foreground mt-4">
              {engagement?.activeUsers.active_user_count || 0} active in last 30 days
            </p>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

