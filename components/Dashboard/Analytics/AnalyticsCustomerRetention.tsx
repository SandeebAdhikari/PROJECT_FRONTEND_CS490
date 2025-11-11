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
import { Users } from "lucide-react";
import { RetentionPoint } from "@/libs/types/analytics";

interface RetentionProps {
  data: {
    chart: RetentionPoint[];
    retentionRate: number;
    newCustomers: number;
  };
}

const AnalyticsCustomerRetention: React.FC<RetentionProps> = ({ data }) => {
  const chartData =
    data.chart.length > 0
      ? data.chart.map((point) => ({
          month: point.month,
          retention: point.retention,
          customers: point.customers,
        }))
      : [{ month: "—", retention: 0, customers: 0 }];

  return (
    <div className=" bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-soft-br transition-smooth font-inter">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">
          Customer Retention & Growth
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted p-4 rounded-xl text-center">
          <p className="text-sm text-subtle-foreground">Retention Rate</p>
          <p className="text-3xl font-bold text-foreground">
            {data.retentionRate.toFixed(0)}%
          </p>
          <p className="text-primary text-sm">Current period</p>
        </div>
        <div className="bg-muted p-4 rounded-xl text-center">
          <p className="text-sm text-subtle-foreground">New Customers</p>
          <p className="text-3xl font-bold text-foreground">
            {data.newCustomers}
          </p>
          <p className="text-primary text-sm">Last 7 days</p>
        </div>
      </div>

      <div className="h-[250px] sm:h-[300px] flex justify-center items-center">
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
            <Line
              type="monotone"
              dataKey="retention"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#22c55e" }}
            />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3, fill: "#10b981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsCustomerRetention;
