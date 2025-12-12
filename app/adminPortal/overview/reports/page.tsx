"use client";

import React, { useState, useEffect } from "react";
import ChartCard from "@/components/Admin/ChartCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import {
  getAdminReports,
  getSalonRevenues,
  AdminReport,
  SalonRevenue,
  getRetentionSummary,
  RetentionSummary,
} from "@/libs/api/admins";

export default function ReportsPage() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [revenues, setRevenues] = useState<SalonRevenue[]>([]);
  const [reportSummary, setReportSummary] = useState<any>(null);
  const [retention, setRetention] = useState<RetentionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const [reportsResult, revenuesResult, retentionResult] = await Promise.all([
        getAdminReports(),
        getSalonRevenues(),
        getRetentionSummary(),
      ]);

      if (reportsResult.error) {
        setError(reportsResult.error);
      } else {
        setReports(reportsResult.reports || []);
        setReportSummary(reportsResult.summary || null);
      }

      if (revenuesResult.error) {
        console.error("Failed to load revenues:", revenuesResult.error);
      } else {
        setRevenues(revenuesResult.revenues || []);
      }

      if (retentionResult.error) {
        console.error("Failed to load retention:", retentionResult.error);
      } else {
        setRetention(retentionResult.retention || null);
      }
    } catch (err) {
      console.error("Error loading reports:", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate KPIs
  const totalSales = reports.reduce((sum, r) => sum + Number(r.total_sales || 0), 0);
  const totalSalons = reports.length;
  const averageSales = totalSalons > 0 ? totalSales / totalSalons : 0;
  const totalBookings = reportSummary?.total_bookings || 0;
  const completedBookings = reportSummary?.completed_bookings || 0;
  const cancelledBookings = reportSummary?.cancelled_bookings || 0;
  const completionRate =
    totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;

  const retentionRate =
    (retention?.active_customers_90d ?? 0) > 0
      ? Math.round(
          ((retention?.returning_customers_90d ?? 0) /
            (retention?.active_customers_90d ?? 1)) *
            100
        )
      : 0;
  const repeatShare =
    (retention?.total_bookings_30d ?? 0) > 0
      ? Math.round(
          ((retention?.repeat_bookings_30d ?? 0) /
            (retention?.total_bookings_30d ?? 1)) *
            100
        )
      : 0;

  const retentionTrendData =
    retention?.trend.map((t) => ({
      week: t.week_start,
      new_users: t.new_users,
      returning_users: t.returning_users,
    })) || [];

  // Format revenue data for chart
  const revenueChartData = revenues.map((r) => ({
    name: r.salon_name || `Salon ${r.salon_id}`,
    revenue: Number(r.total_revenue || 0),
  }));

  // Format sales data for chart
  const salesChartData = reports.map((r) => ({
    name: r.salon_name || `Salon ${r.salon_id}`,
    sales: Number(r.total_sales || 0),
  }));

  const StatPill: React.FC<{ label: string; value: string | number; small?: boolean }> = ({
    label,
    value,
    small = false,
  }) => (
    <div className={`p-4 rounded-lg border border-border bg-muted/40 ${small ? "text-sm" : ""}`}>
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className={`${small ? "text-lg" : "text-2xl"} font-semibold text-foreground`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sales Reports</h1>
          <p className="text-lg text-muted-foreground">
            View salon sales performance and revenue analytics
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-primary text-lg font-medium mb-2">Total Sales</h3>
          <p className="text-4xl font-bold text-foreground">
            ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-primary text-lg font-medium mb-2">Active Salons</h3>
          <p className="text-4xl font-bold text-foreground">{totalSalons}</p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-primary text-lg font-medium mb-2">Average Sales</h3>
          <p className="text-4xl font-bold text-foreground">
            ${averageSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-primary text-lg font-medium mb-2">Bookings (30d)</h3>
          <p className="text-4xl font-bold text-foreground">{totalBookings.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Completed: {completedBookings.toLocaleString()} • Cancelled: {cancelledBookings.toLocaleString()} • Completion: {completionRate}%
          </p>
        </div>
      </div>

      {/* Retention Metrics */}
      <div className="bg-card p-6 rounded-xl shadow-sm border border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">Customer Retention</h3>
            <p className="text-sm text-muted-foreground">
              New vs. returning customers and repeat behavior
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <StatPill label="Active customers (90d)" value={retention?.active_customers_90d ?? 0} />
          <StatPill label="Returning customers (90d)" value={retention?.returning_customers_90d ?? 0} />
          <StatPill label="Retention rate (90d)" value={`${retentionRate}%`} />
          <StatPill label="Churn risk (60d+)" value={retention?.churn_risk_60d ?? 0} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <h4 className="text-lg font-semibold mb-2">Repeat behavior (30d)</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Repeat bookings: {retention?.repeat_bookings_30d ?? 0} / {retention?.total_bookings_30d ?? 0}{" "}
              ({repeatShare}%)
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <StatPill label="New customers (30d)" value={retention?.new_customers_30d ?? 0} small />
              <StatPill label="New customers (90d)" value={retention?.new_customers_90d ?? 0} small />
            </div>
          </div>

          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <h4 className="text-lg font-semibold mb-3">New vs Returning (weekly)</h4>
            {retentionTrendData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data for the last 12 weeks.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={retentionTrendData}>
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="new_users" stackId="a" fill="hsl(var(--primary))" name="New" />
                  <Bar dataKey="returning_users" stackId="a" fill="hsl(var(--accent))" name="Returning" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales by Salon */}
        <ChartCard title="Total Sales by Salon">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesChartData}>
              <XAxis
                dataKey="name"
                stroke="#999"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#999" />
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Bar dataKey="sales" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue by Salon */}
        <ChartCard title="Revenue by Salon">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueChartData}>
              <XAxis
                dataKey="name"
                stroke="#999"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#999" />
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--accent))"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Reports Table */}
      {reports.length > 0 && (
        <div className="mt-8 bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold">Detailed Reports</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Salon ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Salon Name
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                    Total Sales
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report.salon_id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 text-sm">{report.salon_id}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {report.salon_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold">
                      ${Number(report.total_sales || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reports.length === 0 && !loading && (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground text-lg">
            No reports found for the selected date range.
          </p>
        </div>
      )}
    </div>
  );
}
