"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import AdminHeader from "@/components/Admin/AdminHeader";
import ChartCard from "@/components/Admin/ChartCard";
import DashboardCards from "@/components/Admin/DashboardCards";
import {
  getUserEngagement,
  getUserDemographics,
  EngagementResponse,
  DemographicsResponse,
} from "@/libs/api/admins";

const AdminUsersPage = () => {
  const [engagement, setEngagement] = useState<EngagementResponse | null>(null);
  const [demographics, setDemographics] = useState<DemographicsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [engagementRes, demographicsRes] = await Promise.all([
          getUserEngagement(),
          getUserDemographics(),
        ]);

        if (engagementRes.error) {
          setError(engagementRes.error);
        } else {
          setEngagement(engagementRes.engagement || null);
        }

        if (demographicsRes.error) {
          setError((prev) => prev || demographicsRes.error || null);
        } else {
          setDemographics(demographicsRes.demographics || null);
        }
      } catch (err) {
        console.error("Failed to load user overview:", err);
        setError("Failed to load user overview");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

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
    peakHours: "N/A",
    revenue: 0,
  };

  const customerMetrics = [
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

  const ownerMetrics = [
    { label: "Active owners (30d)", value: activeOwners30d },
    { label: "Active salons (30d)", value: `${activeSalons30d}/${totalSalons}` },
    { label: "Owner appts (30d)", value: ownerAppts30d },
    { label: "Staff logins (30d)", value: staffLogins30d },
  ];

  const genderChartData = (demographics?.gender ?? []).map((d) => ({
    group: d.bucket || "Unknown",
    users: d.count || 0,
  }));

  const ageChartData = (demographics?.age ?? []).map((d) => ({
    group: d.bucket || "Unknown",
    users: d.count || 0,
  }));

  if (loading) {
    return (
      <div className="pb-10">
        <AdminHeader adminName="Admin" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading user overview...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <AdminHeader adminName="Admin" />

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
            {[
              { label: "Bookings (7d)", value: bookings7d },
              { label: "Bookings (30d)", value: bookings30d },
              { label: "Completion", value: `${(completionRate || 0).toFixed(2)}%` },
              { label: "Active users (30d)", value: activeCount },
            ].map((item) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
};

export default AdminUsersPage;
