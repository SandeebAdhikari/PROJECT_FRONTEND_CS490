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

const data = [
  { month: "Jan", revenue: 32000, customers: 180, retention: 91 },
  { month: "Feb", revenue: 29500, customers: 170, retention: 89 },
  { month: "Mar", revenue: 33000, customers: 190, retention: 90 },
  { month: "Apr", revenue: 37000, customers: 205, retention: 92 },
  { month: "May", revenue: 38000, customers: 210, retention: 91 },
  { month: "Jun", revenue: 45000, customers: 240, retention: 94 },
];

const AnalyticsGrowthOverview = () => {
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
          <LineChart data={data}>
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
          <p className="text-2xl font-semibold text-foreground">+40.6%</p>
          <p className="text-sm text-muted-foreground">
            $32k → $45k (6 months)
          </p>
        </div>

        <div className="bg-muted rounded-xl p-4 text-center">
          <p className="text-sm text-subtle-foreground">Customer Growth</p>
          <p className="text-2xl font-semibold text-foreground">+33.3%</p>
          <p className="text-sm text-muted-foreground">180 → 240 customers</p>
        </div>

        <div className="bg-muted rounded-xl p-4 text-center">
          <p className="text-sm text-subtle-foreground">
            Retention Improvement
          </p>
          <p className="text-2xl font-semibold text-foreground">+3.3%</p>
          <p className="text-sm text-muted-foreground">91% → 94% retention</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsGrowthOverview;
