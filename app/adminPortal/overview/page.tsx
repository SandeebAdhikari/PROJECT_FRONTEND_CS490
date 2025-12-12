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
  getLoyaltySummary,
  AppointmentTrend,
  SalonRevenue,
  EngagementResponse,
  DemographicsResponse,
  LoyaltySummary,
} from "@/libs/api/admins";

export default function AdminDashboard() {
  const ADMIN_NAME = "Admin";
  const [appointmentTrends, setAppointmentTrends] = useState<AppointmentTrend[]>([]);
  const [revenues, setRevenues] = useState<SalonRevenue[]>([]);
  const [demographics, setDemographics] = useState<DemographicsResponse | null>(null);
  const [loyaltySummary, setLoyaltySummary] = useState<LoyaltySummary | null>(null);
  const [engagement, setEngagement] = useState<EngagementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [trendsResult, revenuesResult, engagementResult, demographicsResult, loyaltyResult] = await Promise.all([
        getAppointmentTrends(),
        getSalonRevenues(),
        getUserEngagement(),
        getUserDemographics(),
        getLoyaltySummary(),
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
        setDemographics(demographicsResult.demographics || null);
      }

      if (loyaltyResult.error) {
        console.error("Failed to load loyalty summary:", loyaltyResult.error);
      } else {
        setLoyaltySummary(loyaltyResult.summary || null);
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
  const topRevenueSalons = revenues
    .slice()
    .sort((a, b) => Number(b.total_revenue || 0) - Number(a.total_revenue || 0))
    .slice(0, 3);

  // Format demographics for chart (guard against missing data)
  const genderChartData = (demographics?.gender ?? []).map((d) => ({
    group: d.bucket || "Unknown",
    users: d.count || 0,
  }));

  const ageChartData = (demographics?.age ?? []).map((d) => ({
    group: d.bucket || "Unknown",
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
  const topHours = appointmentTrends
    .slice()
    .sort((a, b) => b.appointments - a.appointments)
    .slice(0, 3);
  const activeCount = engagement?.customers?.mau_30d ?? 0;
  const totalCount = engagement?.customers?.total_users ?? 0;
  const engagementPercent =
    totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const dau7d = engagement?.customers?.dau_7d ?? 0;
  const bookings7d = engagement?.customers?.bookings_7d ?? 0;
  const bookings30d = engagement?.customers?.bookings_30d ?? 0;
  const completionRate = engagement?.customers?.completion_rate_30d ?? 0;
  const repeat90d = engagement?.customers?.repeat_customers_90d ?? 0;
  const reviews30d = engagement?.customers?.reviews_30d ?? 0;
  const messages30d = engagement?.customers?.messages_30d ?? 0;
  const inactive60d = engagement?.customers?.inactive_60d ?? 0;
  const activeOwners30d = engagement?.owners?.active_owners_30d ?? 0;
  const activeSalons30d = engagement?.owners?.active_salons_30d ?? 0;
  const totalSalons = engagement?.owners?.total_salons ?? 0;
  const ownerAppts30d = engagement?.owners?.owner_created_appointments_30d ?? 0;
  const staffLogins30d = engagement?.owners?.staff_logins_30d ?? 0;

  const stats = {
    engagement: engagementPercent,
    peakHours: peakHour.appointments > 0 ? `${peakHour.hour}:00` : "N/A",
    revenue: totalRevenue,
  };

  const loyaltyTotalPoints = loyaltySummary?.total_points ?? 0;
  const loyaltyActiveSalons = loyaltySummary?.active_salons ?? 0;
  const loyaltyActiveMembers = loyaltySummary?.active_members ?? 0;
  const topLoyaltySalons =
    loyaltySummary?.by_salon
      ?.slice()
      .sort((a, b) => Number(b.total_points || 0) - Number(a.total_points || 0))
      .slice(0, 5) || [];
  const topLoyaltySalon = loyaltySummary?.top_salon || topLoyaltySalons[0];

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

  const customerMetrics: Array<{ label: string; value: string | number }> = [
    { label: "Active (30d)", value: activeCount },
    { label: "DAU (7d)", value: dau7d },
    { label: "Bookings (7d)", value: bookings7d },
    { label: "Bookings (30d)", value: bookings30d },
    { label: "Completion (30d)", value: `${(completionRate || 0).toFixed(2)}%` },
    { label: "Repeat (90d)", value: repeat90d },
    { label: "Reviews (30d)", value: reviews30d },
    { label: "Messages (30d)", value: messages30d },
    { label: "Inactive (60d+)", value: inactive60d },
  ];

  const ownerMetrics: Array<{ label: string; value: string | number }> = [
    { label: "Active owners (30d)", value: activeOwners30d },
    { label: "Active salons (30d)", value: `${activeSalons30d}/${totalSalons}` },
    { label: "Owner appts (30d)", value: ownerAppts30d },
    { label: "Staff logins (30d)", value: staffLogins30d },
  ];

  const bookingMetrics: Array<{ label: string; value: string | number }> = [
    { label: "Bookings (7d)", value: bookings7d },
    { label: "Bookings (30d)", value: bookings30d },
    { label: "Completion", value: `${(completionRate || 0).toFixed(2)}%` },
    { label: "Revenue (total)", value: formatCurrency(totalRevenue) },
  ];

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ChartCard title="Customer Engagement">
          <div className="grid grid-cols-2 gap-3">
            {customerMetrics.map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-lg border border-border bg-muted/40"
              >
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold text-foreground">
                  {typeof item.value === "number"
                    ? item.value.toLocaleString()
                    : item.value}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Engagement rate: {engagementPercent}% of {totalCount.toLocaleString()} total users. Inactive (60d+): {inactive60d.toLocaleString()}
          </p>
        </ChartCard>

        <ChartCard title="Salon/Owner Engagement">
          <div className="grid grid-cols-2 gap-3">
            {ownerMetrics.map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-lg border border-border bg-muted/40"
              >
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Bookings Snapshot">
          <div className="grid grid-cols-2 gap-3">
            {bookingMetrics.map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-lg border border-border bg-muted/40"
              >
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointment Trends */}
        <ChartCard title="Appointment Trends Per Hour">
          {topHours.length > 0 && (
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
              {topHours.map((h) => (
                <div key={h.hour} className="px-3 py-2 rounded-lg border border-border">
                  Peak {String(h.hour).padStart(2, "0")}:00 — {h.appointments} bookings
                </div>
              ))}
            </div>
          )}
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
          {topRevenueSalons.length > 0 && (
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
              {topRevenueSalons.map((s) => (
                <div key={s.salon_id} className="px-3 py-2 rounded-lg border border-border">
                  {s.salon_name || `Salon ${s.salon_id}`}: ${Number(s.total_revenue || 0).toLocaleString()}
                </div>
              ))}
            </div>
          )}
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

      </div>

      <div className="mt-8">
        <ChartCard title="Loyalty Program Effectiveness (last 30 days)">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-background">
              <p className="text-sm text-muted-foreground">Total points earned</p>
              <p className="text-3xl font-semibold text-foreground">
                {loyaltyTotalPoints.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-background">
              <p className="text-sm text-muted-foreground">Active loyalty salons</p>
              <p className="text-3xl font-semibold text-foreground">
                {loyaltyActiveSalons}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-background">
              <p className="text-sm text-muted-foreground">Top salon</p>
              <p className="text-xl font-semibold text-foreground truncate">
                {topLoyaltySalon
                  ? `${topLoyaltySalon.salon_name || `Salon ${topLoyaltySalon.salon_id}`}`
                  : "—"}
              </p>
              <p className="text-sm text-muted-foreground">
                {topLoyaltySalon
                  ? `${Number(topLoyaltySalon.total_points || 0).toLocaleString()} pts`
                  : "No data"}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-background">
              <p className="text-sm text-muted-foreground">Active loyalty members</p>
              <p className="text-3xl font-semibold text-foreground">
                {loyaltyActiveMembers}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Top salons by points</p>
              <div className="space-y-2">
                {topLoyaltySalons.length === 0 && (
                  <p className="text-muted-foreground text-sm">No loyalty activity in the last 30 days.</p>
                )}
                {topLoyaltySalons.map((s) => (
                  <div
                    key={s.salon_id}
                    className="p-3 rounded-lg border border-border bg-muted/30 flex items-center justify-between"
                  >
                    <div className="truncate">
                      <p className="font-semibold text-foreground truncate">
                        {s.salon_name || `Salon ${s.salon_id}`}
                      </p>
                      <p className="text-xs text-muted-foreground">ID: {s.salon_id}</p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {Number(s.total_points || 0).toLocaleString()} pts
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Points by top salons</p>
              <div className="p-3 rounded-lg border border-border bg-muted/30">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={topLoyaltySalons.map((s) => ({
                      name: s.salon_name || `Salon ${s.salon_id}`,
                      points: Number(s.total_points || 0),
                    }))}
                  >
                    <XAxis dataKey="name" stroke="#999" angle={-30} textAnchor="end" height={80} />
                    <YAxis stroke="#999" />
                    <Tooltip formatter={(v: number) => `${v.toLocaleString()} pts`} />
                    <Bar dataKey="points" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
                {topLoyaltySalons.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm mt-2">No loyalty activity to chart.</p>
                )}
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="User Demographics — Gender (customers)">
          <ResponsiveContainer width="100%" height={260}>
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

        <ChartCard title="User Demographics — Age (customers)">
          <ResponsiveContainer width="100%" height={260}>
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
      </div>
    </div>
  );
}
