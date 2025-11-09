"use client";
import { Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Maria", revenue: 140, rating: 80 },
  { name: "Lisa", revenue: 100, rating: 95 },
  { name: "James", revenue: 160, rating: 90 },
];

const AnalyticsStaffPerformance = () => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-soft-br transition-smooth font-inter">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Staff Performance Comparison
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
          <div className="bg-muted p-3 rounded-lg text-center">
            <p className="text-sm text-subtle-foreground">Top Performer</p>
            <p className="font-semibold text-foreground">Maria Rodriguez</p>
            <p className="text-primary text-sm">$8,420 revenue</p>
          </div>

          <div className="bg-muted p-3 rounded-lg text-center">
            <p className="text-sm text-subtle-foreground">Highest Rating</p>
            <p className="font-semibold text-foreground">Maria Rodriguez</p>
            <p className="text-primary text-sm flex justify-center items-center gap-1">
              4.9 ⭐{" "}
              <span className="text-muted-foreground">(142 reviews)</span>
            </p>
          </div>

          <div className="bg-muted p-3 rounded-lg text-center">
            <p className="text-sm text-subtle-foreground">Most Efficient</p>
            <p className="font-semibold text-foreground">James Wilson</p>
            <p className="text-primary text-sm">96% efficiency</p>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              itemStyle={{ color: "hsl(var(--primary))" }}
            />
            <Bar dataKey="rating" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="revenue" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsStaffPerformance;
