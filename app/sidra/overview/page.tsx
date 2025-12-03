"use client";

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
  ResponsiveContainer,
} from "recharts";

import DashboardCards from "@/components/Admin/DashboardCards";
import ChartCard from "@/components/Admin/ChartCard";
import AdminHeader from "@/components/Admin/AdminHeader";

import {
  appointmentsPerHour,
  revenueData,
  demographicsData,
} from "@/libs/sampleData";

export default function SidraDashboard() {
  const ADMIN_NAME = "Sami";

  const stats = {
    engagement: 87,
    peakHours: "10 AM",
    revenue: 5100,
  };

  return (
    <div className="pb-10">
      <AdminHeader adminName={ADMIN_NAME} />
      <DashboardCards stats={stats} />

      {/* ===========================
          Keep SAME GRID as BEFORE
          1 per row mobile
          2 per row desktop
      ============================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* APPOINTMENT TRENDS */}
        <ChartCard title="Appointment Trends Per Hour">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={appointmentsPerHour}>
              <XAxis dataKey="hour" stroke="hsl(var(--foreground) / 0.5)" />
              <YAxis stroke="hsl(var(--foreground) / 0.5)" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 3, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* MONTHLY REVENUE */}
        <ChartCard title="Monthly Revenue">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" stroke="hsl(var(--foreground) / 0.5)" />
              <YAxis stroke="hsl(var(--foreground) / 0.5)" />
              <Tooltip />
              <Bar
                dataKey="revenue"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* USER DEMOGRAPHICS */}
        <ChartCard title="User Demographics">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={demographicsData}
                dataKey="users"
                nameKey="group"
                cx="50%"
                cy="50%"
                outerRadius={90}
              >
                {demographicsData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={[
                      "hsl(var(--primary))",
                      "hsl(var(--foreground))",
                      "hsl(var(--border))",
                    ][i]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* CUSTOMER RETENTION */}
        <ChartCard title="Customer Retention (%)">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[{ name: "Retention", value: 73 }]}>
              <XAxis dataKey="name" stroke="hsl(var(--foreground) / 0.5)" />
              <YAxis stroke="hsl(var(--foreground) / 0.5)" />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}
