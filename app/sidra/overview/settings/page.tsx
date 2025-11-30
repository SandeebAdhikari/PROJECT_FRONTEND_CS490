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
  BarChart,
  Bar,
} from "recharts";

import {
  uptimeData,
  errorRateData,
  responseTimeData,
} from "@/libs/sampleData";

export default function SystemHealthPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">System Health</h1>
      <p className="text-muted-foreground mb-10">
        Monitor platform uptime, errors, and system performance.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* UPTIME TREND */}
        <ChartCard title="Platform Uptime (%)">
        <ResponsiveContainer width="100%" height={250}>
  <LineChart data={appointmentsPerHour}>
            <XAxis dataKey="day" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="uptime"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
            />
          </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ERROR RATE */}
        <ChartCard title="Error Rate (Errors per 1000 requests)">
          <BarChart width={400} height={250} data={errorRateData}>
            <XAxis dataKey="day" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Bar dataKey="errors" fill="hsl(var(--destructive))" />
          </BarChart>
        </ChartCard>

        {/* API RESPONSE TIME */}
        <ChartCard title="API Response Time (ms)">
        <ResponsiveContainer width="100%" height={250}>
  <LineChart data={appointmentsPerHour}>
            <XAxis dataKey="day" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="response"
              stroke="hsl(var(--accent))"
              strokeWidth={3}
            />
          </LineChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}
