"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieIcon } from "lucide-react";

const data = [
  { name: "Haircuts", value: 35 },
  { name: "Coloring", value: 25 },
  { name: "Styling", value: 20 },
  { name: "Treatments", value: 15 },
  { name: "Other", value: 5 },
];

const COLORS = [
  "hsl(260, 85%, 65%)",
  "hsl(190, 80%, 55%)",
  "hsl(160, 60%, 50%)",
  "hsl(40, 90%, 55%)",
  "hsl(0, 80%, 60%)",
];

const ServiceDistribution = () => {
  return (
    <div className=" rounded-2xl bg-secondary border border-border p-4 shadow-soft-br font-inter transition-smooth">
      <div className="flex items-center gap-2 mb-4">
        <PieIcon className="w-5 h-5 text-color-primary-dark" />
        <h2 className="text-lg font-bold text-color-foreground">
          Service Distribution
        </h2>
      </div>

      <div className="h-[240px] flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
              labelLine={true}
              stroke="hsl(var(--color-background))"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--color-card))",
                border: "1px solid hsl(var(--color-border))",
                borderRadius: "var(--radius)",
                boxShadow: "var(--shadow-soft)",
                fontSize: "0.75rem",
              }}
              itemStyle={{ color: "hsl(var(--color-foreground))" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ServiceDistribution;
