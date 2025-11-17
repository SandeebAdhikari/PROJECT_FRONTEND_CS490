"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import DashboardCards from "@/components/Admin/DashboardCards";
import ChartCard from "@/components/Admin/ChartCard";
import { appointmentsPerHour, revenueData, demographicsData } from "@/libs/sampleData";

export default function Dashboard() {
  const stats = {
    engagement: 87,
    peakHours: "10 AM",
    revenue: 5100,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <DashboardCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <ChartCard title="Appointment Trends Per Hour">
          <LineChart width={400} height={250} data={appointmentsPerHour}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Monthly Revenue">
          <BarChart width={400} height={250} data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#818cf8" />
          </BarChart>
        </ChartCard>

        <ChartCard title="User Demographics">
          <PieChart width={400} height={250}>
            <Pie data={demographicsData} dataKey="users" nameKey="group" cx="50%" cy="50%" outerRadius={90}>
              {demographicsData.map((_, i) => (
                <Cell key={i} fill={["#818cf8", "#c084fc", "#22d3ee"][i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

        <ChartCard title="Customer Retention (%)">
          <BarChart width={400} height={250} data={[{ name: "Retention", value: 73 }]}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4ade80" />
          </BarChart>
        </ChartCard>

      </div>
    </div>
  );
}
