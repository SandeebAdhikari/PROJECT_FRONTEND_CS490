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
  reportsOverviewData,
  summaryKPIs,
} from "@/libs/sampleData";

export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Reports & Exports</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Download analytics and performance summaries for your team.
      </p>

     
      <div className="flex gap-4 mb-10">
        <button className="px-6 py-2 rounded-xl bg-primary text-primary-foreground shadow-soft transition-smooth hover:opacity-90">
          Export PDF
        </button>
        <button className="px-6 py-2 rounded-xl bg-secondary text-foreground shadow-soft transition-smooth hover:bg-muted">
          Export CSV
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {summaryKPIs.map((item) => (
          <div
            key={item.label}
            className="bg-card p-6 rounded-xl shadow-soft border border-border"
          >
            <p className="text-muted-foreground text-sm">{item.label}</p>
            <h2 className="text-3xl font-bold text-foreground mt-2">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* TRENDS CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <ChartCard title="Monthly Performance Overview">
        <ResponsiveContainer width="100%" height={250}>
  <LineChart data={appointmentsPerHour}>

            <XAxis dataKey="month" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
            />
          </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* INSIGHTS */}
        <ChartCard title="Key Insights">
          <ul className="space-y-4 text-muted-foreground">
            <li>• User engagement increased 12% this month.</li>
            <li>• Revenue is trending upward after seasonal dip.</li>
            <li>• Retention improved by 8% compared to last quarter.</li>
            <li>• Appointment volume highest on Fridays.</li>
          </ul>
        </ChartCard>

      </div>
    </div>
  );
}
