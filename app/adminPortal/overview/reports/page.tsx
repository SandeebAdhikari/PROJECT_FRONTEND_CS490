"use client";

import React, { useState, useEffect } from "react";
import ChartCard from "@/components/Admin/ChartCard";
import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  getAdminReports,
  getSalonRevenues,
  exportAdminReports,
  AdminReport,
  SalonRevenue,
} from "@/libs/api/admins";

export default function ReportsPage() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [revenues, setRevenues] = useState<SalonRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [exporting, setExporting] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const [reportsResult, revenuesResult] = await Promise.all([
        getAdminReports(startDate || undefined, endDate || undefined),
        getSalonRevenues(startDate || undefined, endDate || undefined),
      ]);

      if (reportsResult.error) {
        setError(reportsResult.error);
      } else {
        setReports(reportsResult.reports || []);
      }

      if (revenuesResult.error) {
        console.error("Failed to load revenues:", revenuesResult.error);
      } else {
        setRevenues(revenuesResult.revenues || []);
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
  }, [startDate, endDate]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await exportAdminReports(
        startDate || undefined,
        endDate || undefined
      );
      if (result.error) {
        setError(`Failed to export: ${result.error}`);
      } else {
        // CSV file will be automatically downloaded
        console.log("Reports exported successfully");
      }
    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export reports");
    } finally {
      setExporting(false);
    }
  };

  // Calculate KPIs
  const totalSales = reports.reduce((sum, r) => sum + Number(r.total_sales || 0), 0);
  const totalSalons = reports.length;
  const averageSales = totalSalons > 0 ? totalSales / totalSalons : 0;

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
        <div className="flex flex-col sm:flex-row gap-2">
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
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
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

