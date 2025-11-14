"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { ServiceDistributionItem } from "@/libs/types/analytics";

const COLORS = [
  "hsl(260, 85%, 65%)",
  "hsl(190, 80%, 55%)",
  "hsl(160, 60%, 50%)",
  "hsl(40, 90%, 55%)",
  "hsl(0, 80%, 60%)",
];

interface ServiceChartProps {
  data: ServiceDistributionItem[];
}

const AnalyticsServiceChart: React.FC<ServiceChartProps> = ({ data }) => {
  const [radius, setRadius] = useState(80);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        // sm: and larger → bigger chart radius
        setRadius(115);
      } else {
        // mobile → default radius
        setRadius(80);
      }
    };
    handleResize(); // run initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="sm:h-134.5 rounded-2xl bg-primary-foreground border border-border p-4 sm:p-6 hover:shadow-soft-br font-inter transition-smooth flex flex-col">
      <div className="flex items-center gap-2 mb-10">
        <PieIcon className="w-5 h-5 text-primary-dark" />
        <h2 className="text-lg font-bold text-foreground">
          Service Distribution
        </h2>
      </div>
      <div className="sm:justify-center sm:items-center">
        <div className="sm:mt-4 h-[240px] sm:h-[275px] flex justify-center items-center w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={
                  data.length > 0
                    ? data
                    : [{ name: "No Data", value: 1, percent: 100 }]
                }
                cx="50%"
                cy="50%"
                outerRadius={radius}
                dataKey="value"
                label={({ name, payload }) =>
                  `${name}: ${
                    (payload as ServiceDistributionItem)?.percent?.toFixed?.(
                      1
                    ) ?? 0
                  }%`
                }
                labelLine
                stroke="hsl(var(--color-background))"
              >
                {(data.length > 0
                  ? data
                  : [{ name: "No Data", value: 1, percent: 100 }]
                ).map((entry, index) => (
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
    </div>
  );
};

export default AnalyticsServiceChart;
