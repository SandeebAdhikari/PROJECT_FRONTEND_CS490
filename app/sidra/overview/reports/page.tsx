"use client";

import ChartCard from "@/components/Admin/ChartCard";
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
  retentionData,
  repeatVisitData,
  lifetimeValueData,
} from "@/libs/sampleData";

export default function CustomersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Customer Insights</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Retention, repeat visits, and lifetime value of customers.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      
        <ChartCard title="Customer Retention (%)">
          <BarChart width={400} height={250} data={retentionData}>
            <XAxis dataKey="month" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Bar dataKey="retention" fill="hsl(var(--primary))" />
          </BarChart>
        </ChartCard>

       
        <ChartCard title="Repeat Visit Frequency">
          <PieChart width={400} height={250}>
            <Pie
              data={repeatVisitData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={90}
            >
              {repeatVisitData.map((_, i) => (
                <Cell
                  key={i}
                  fill={[
                    "hsl(var(--primary))",
                    "hsl(var(--primary-light))",
                    "hsl(var(--accent))",
                  ][i]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

       
        <ChartCard title="Customer Lifetime Value (CLV)">
          <LineChart width={400} height={250} data={lifetimeValueData}>
            <XAxis dataKey="month" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--accent))"
              strokeWidth={3}
            />
          </LineChart>
        </ChartCard>
        
      </div>
    </div>
  );
}
