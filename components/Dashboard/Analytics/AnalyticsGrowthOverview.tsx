"use client";

import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { GrowthPoint, GrowthSummary } from "@/libs/types/analytics";

interface GrowthOverviewProps {
  data: {
    chart: GrowthPoint[];
    summary: GrowthSummary;
  };
}

const AnalyticsGrowthOverview: React.FC<GrowthOverviewProps> = ({ data }) => {
  const chartData =
    data.chart.length > 0
      ? data.chart
      : [{ month: "—", revenue: 0, customers: 0, retention: 0 }];
  const { summary } = data;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-soft-br transition-smooth font-inter">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          6-Month Growth Overview
        </h2>
      </div>

      <div className="h-[280px] sm:h-[340px] flex justify-center items-center mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "0.8rem",
              }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />

            {/* Lines */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#8b5cf6" }}
            />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#06b6d4" }}
            />
            <Line
              type="monotone"
              dataKey="retention"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#22c55e" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-muted rounded-xl p-4 text-center">
          <p className="text-sm text-subtle-foreground">Revenue Growth</p>
          <p className="text-2xl font-semibold text-foreground">
            {summary.revenueGrowth.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">Last 6 months</p>
        </div>

        <div className="bg-muted rounded-xl p-4 text-center">
          <p className="text-sm text-subtle-foreground">Customer Growth</p>
          <p className="text-2xl font-semibold text-foreground">
            {summary.customerGrowth.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">Last 6 months</p>
        </div>

        <div className="bg-muted rounded-xl p-4 text-center">
          <p className="text-sm text-subtle-foreground">
            Retention Improvement
          </p>
          <p className="text-2xl font-semibold text-foreground">
            {summary.retentionGrowth.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">Last 6 months</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsGrowthOverview;
