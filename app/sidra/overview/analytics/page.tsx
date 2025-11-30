"use client";

import ChartCard from "@/components/Admin/ChartCard";
import { ResponsiveContainer } from "recharts";
import { appointmentsPerHour } from "@/libs/sampleData";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import {
  engagementData,
  demographicsData,
  activityData,
} from "@/libs/sampleData";

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Users Overview</h1>
      <p className="text-lg text-muted-foreground mb-10">
        User engagement, demographics, and platform activity insights.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* USER ENGAGEMENT */}
        <ChartCard title="User Engagement (Daily Active Users)">
        <ResponsiveContainer width="100%" height={250}>
  <LineChart data={appointmentsPerHour}>

            <XAxis dataKey="day" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
            />
          </LineChart>
     
</ResponsiveContainer>

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
                  fill={[
                    "hsl(var(--primary))",
                    "hsl(var(--primary-light))",
                    "hsl(var(--accent))",
                    "#8884d8",
                  ][i]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

        {/* PLATFORM ACTIVITY */}
        <ChartCard title="Platform Activity (Sessions Per Day)">
          <BarChart width={400} height={250} data={activityData}>
            <XAxis dataKey="day" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Bar dataKey="sessions" fill="hsl(var(--primary-light))" />
          </BarChart>
        </ChartCard>

      </div>
    </div>
  );
}
