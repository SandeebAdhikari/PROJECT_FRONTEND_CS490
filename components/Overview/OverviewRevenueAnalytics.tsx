"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const data = [
  { day: "Mon", value: 2500 },
  { day: "Tue", value: 1500 },
  { day: "Wed", value: 9800 },
  { day: "Thu", value: 4200 },
  { day: "Fri", value: 5000 },
  { day: "Sat", value: 3800 },
  { day: "Sun", value: 4300 },
];

const OverviewRevenueAnalytics = () => {
  return (
    <div className="rounded-2xl bg-secondary border border-border p-4 shadow-soft-br font-inter transition-smooth">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-color-primary-dark">
            $
          </span>
          <h2 className="text-lg font-bold text-color-foreground">
            Revenue Analytics
          </h2>
        </div>
        <span className="px-3 py-1 rounded-full text-xs bg-color-muted text-color-subtle-foreground">
          Last 7 days
        </span>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--color-primary))"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--color-primary))"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--color-border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="day"
              tick={{
                fontSize: 10,
                fill: "hsl(var(--color-subtle-foreground))",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontSize: 9,
                fill: "hsl(var(--color-subtle-foreground))",
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--color-card))",
                border: "1px solid hsl(var(--color-border))",
                borderRadius: "var(--radius)",
                boxShadow: "var(--shadow-soft)",
                fontSize: "0.75rem",
              }}
              labelStyle={{ color: "hsl(var(--color-primary-dark))" }}
              itemStyle={{ color: "hsl(var(--color-foreground))" }}
            />
            <ReferenceLine
              y={3000}
              stroke="hsl(var(--color-destructive))"
              strokeDasharray="6 6"
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--color-primary))"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewRevenueAnalytics;
