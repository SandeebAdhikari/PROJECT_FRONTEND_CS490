"use client";

import { 
  LineChart, Line, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell 
} from "recharts";

import DashboardCards from "@/components/Admin/DashboardCards";
import ChartCard from "@/components/Admin/ChartCard";
import AdminHeader from "@/components/Admin/AdminHeader";

import { 
  appointmentsPerHour, 
  revenueData, 
  demographicsData 
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

      {/* 🔥 TOP HEADER WITH LOGO, WELCOME, PROFILE, NOTIFICATIONS */}
      <AdminHeader adminName={ADMIN_NAME} />

      {/* 📊 QUICK STATS CARDS */}
      <DashboardCards stats={stats} />

      {/* 📈 DASHBOARD CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* APPOINTMENT TRENDS */}
        <ChartCard title="Appointment Trends Per Hour">
          <LineChart width={400} height={250} data={appointmentsPerHour}>
            <XAxis dataKey="hour" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ChartCard>

        {/* MONTHLY REVENUE */}
        <ChartCard title="Monthly Revenue">
          <BarChart width={400} height={250} data={revenueData}>
            <XAxis dataKey="month" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Bar dataKey="revenue" fill="#818cf8" />
          </BarChart>
        </ChartCard>

        {/* USER DEMOGRAPHICS */}
        <ChartCard title="User Demographics">
          <PieChart width={400} height={250}>
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
                  fill={["#818cf8", "#c084fc", "#22d3ee"][i]} 
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

        {/* CUSTOMER RETENTION */}
        <ChartCard title="Customer Retention (%)">
          <BarChart width={400} height={250} data={[{ name: "Retention", value: 73 }]}>
            <XAxis dataKey="name" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Bar dataKey="value" fill="#4ade80" />
          </BarChart>
        </ChartCard>

      </div>
    </div>
  );
}
