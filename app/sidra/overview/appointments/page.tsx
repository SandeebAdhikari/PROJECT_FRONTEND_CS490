"use client";

import ChartCard from "@/components/Admin/ChartCard";
import { ResponsiveContainer } from "recharts";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  appointmentsPerHour,
  revenueData,
  loyaltyData,
} from "@/libs/sampleData"; // add loyaltyData in sampleData.ts

export default function SalonPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Salon Overview</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Appointment trends, revenue performance, and loyalty program usage.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Appointment Trends */}
        <ChartCard title="Appointment Trends Per Hour">
        <ResponsiveContainer width="100%" height={250}>
  <LineChart data={appointmentsPerHour}>

            <XAxis dataKey="hour" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
            />
          </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Salon Revenue */}
        <ChartCard title="Monthly Salon Revenue">
          <BarChart width={400} height={250} data={revenueData}>
            <XAxis dataKey="month" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Bar dataKey="revenue" fill="hsl(var(--accent))" />
          </BarChart>
        </ChartCard>

        {/* Loyalty Program Usage */}
        <ChartCard title="Loyalty Program Usage">
          <PieChart width={400} height={250}>
            <Pie
              data={loyaltyData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={90}
            >
              {loyaltyData.map((_, i) => (
                <Cell
                  key={i}
                  fill={["hsl(var(--primary))", "hsl(var(--primary-light))", "hsl(var(--accent))"][i]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

      </div>
    </div>
  );
}
