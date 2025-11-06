"use client";

import React from "react";

interface MetricBarProps {
  label: string;
  value: number;
}

const MetricBar: React.FC<MetricBarProps> = ({ label, value }) => {
  const pct = Math.max(0, Math.min(100, value));
  const widthClass = `w-[${pct}%]`;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-foreground font-inter">{label}</span>
        <span className="font-medium">{pct}%</span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-2.5 rounded-full bg-emerald-500 transition-all duration-300 ${widthClass}`}
        />
      </div>
    </div>
  );
};

export default MetricBar;
