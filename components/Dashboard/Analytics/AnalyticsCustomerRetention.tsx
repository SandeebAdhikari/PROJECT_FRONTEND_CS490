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

const data = [
  { month: "Jan", retention: 180, customers: 90 },
  { month: "Feb", retention: 170, customers: 85 },
  { month: "Mar", retention: 200, customers: 95 },
  { month: "Apr", retention: 220, customers: 100 },
  { month: "May", retention: 210, customers: 98 },
  { month: "Jun", retention: 240, customers: 105 },
];

const AnalyticsCustomerRetention = () => {
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
          <p className="text-3xl font-bold text-foreground">94%</p>
          <p className="text-primary text-sm">+2.1% vs last month</p>
        </div>
        <div className="bg-muted p-4 rounded-xl text-center">
          <p className="text-sm text-subtle-foreground">New Customers</p>
          <p className="text-3xl font-bold text-foreground">67</p>
          <p className="text-primary text-sm">+34.1% vs last month</p>
        </div>
      </div>

      <div className="h-[250px] sm:h-[300px] flex justify-center items-center">
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
