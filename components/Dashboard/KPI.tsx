"use client";

import React from "react";

interface KPIProps {
  label: string;
  value: string | number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconClass?: string;
}

const KPI: React.FC<KPIProps> = ({ label, value, Icon, iconClass = "" }) => {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-soft-br hover:shadow-md transition-smooth flex items-center justify-between min-h-[96px]">
      <div>
        <div className="text-sm text-muted-foreground font-inter">{label}</div>
        <div className="mt-1 text-2xl font-semibold leading-tight">{value}</div>
      </div>
      <div
        className={`h-9 w-9 rounded-2xl flex items-center justify-center ${iconClass}`}
        aria-hidden
      >
        <Icon className="h-4 w-4" />
      </div>
    </div>
  );
};

export default KPI;
