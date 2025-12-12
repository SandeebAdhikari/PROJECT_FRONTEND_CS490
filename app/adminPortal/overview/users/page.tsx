"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import AdminHeader from "@/components/Admin/AdminHeader";
import ChartCard from "@/components/Admin/ChartCard";
import DashboardCards from "@/components/Admin/DashboardCards";
import {
  getUserEngagement,
  getUserDemographics,
  getLoyaltyUsage,
  EngagementResponse,
  DemographicsResponse,
  LoyaltyUsage,
} from "@/libs/api/admins";

const AdminUsersPage = () => {
  const [engagement, setEngagement] = useState<EngagementResponse | null>(null);
  const [demographics, setDemographics] = useState<DemographicsResponse | null>(null);
  const [loyaltyUsage, setLoyaltyUsage] = useState<LoyaltyUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [engagementRes, demographicsRes, loyaltyRes] = await Promise.all([
          getUserEngagement(),
          getUserDemographics(),
          getLoyaltyUsage(),
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

        if (loyaltyRes.error) {
          setError((prev) => prev || loyaltyRes.error || null);
        } else {
          setLoyaltyUsage(loyaltyRes.usage || []);
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

  const loyaltyTotalPoints = loyaltyUsage.reduce(
    (sum, item) => sum + Number(item.total_points || 0),
    0
  );
  const topLoyaltySalons = loyaltyUsage
    .slice()
    .sort((a, b) => Number(b.total_points || 0) - Number(a.total_points || 0))
    .slice(0, 5);
  const topLoyaltySalon = topLoyaltySalons[0];

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

        <ChartCard title="Loyalty Program Usage (last 30 days)">
          <div className="flex flex-col gap-3">
            <div className="text-xl font-semibold text-foreground">
              Total points earned: {loyaltyTotalPoints.toLocaleString()}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topLoyaltySalons.map((s) => (
                <div
                  key={s.salon_id}
                  className="p-3 rounded-lg border border-border bg-muted/40 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">Salon</p>
                    <p className="font-semibold text-foreground">
                      {s.salon_name || `Salon ${s.salon_id}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Points</p>
                    <p className="font-semibold text-foreground">
                      {Number(s.total_points || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {topLoyaltySalons.length === 0 && (
                <p className="text-muted-foreground">No loyalty activity in the last 30 days.</p>
              )}
            </div>
          </div>
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

        <ChartCard title="Loyalty Program Effectiveness (last 30 days)">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="p-3 rounded-lg border border-border bg-muted/40">
              <p className="text-sm text-muted-foreground">Total points earned</p>
              <p className="text-2xl font-semibold text-foreground">
                {loyaltyTotalPoints.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-muted/40">
              <p className="text-sm text-muted-foreground">Active loyalty salons</p>
              <p className="text-2xl font-semibold text-foreground">
                {loyaltyUsage.length}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-muted/40">
              <p className="text-sm text-muted-foreground">Top salon</p>
              <p className="text-2xl font-semibold text-foreground truncate">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Top salons by points</p>
              <div className="space-y-2">
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
                {topLoyaltySalons.length === 0 && (
                  <p className="text-muted-foreground">No loyalty activity in the last 30 days.</p>
                )}
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
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminUsersPage;
