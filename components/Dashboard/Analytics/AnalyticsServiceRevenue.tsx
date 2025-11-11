"use client";

import React, { useEffect } from "react";
import { Target } from "lucide-react";
import { ServiceRevenueItem } from "@/libs/types/analytics";

interface ServiceRevenueProps {
  data: ServiceRevenueItem[];
}

const AnalyticsServiceRevenue: React.FC<ServiceRevenueProps> = ({ data }) => {
  const serviceData =
    data.length > 0
      ? data
      : [{ service: "No data", revenue: 0, bookings: 0, average: 0 }];
  const maxRevenue =
    Math.max(...serviceData.map((d) => d.revenue || 0)) || 1;

  useEffect(() => {
    const bars = document.querySelectorAll<HTMLDivElement>(".progress-bar");
    bars.forEach((bar) => {
      const progress = bar.dataset.progress;
      if (progress) bar.style.setProperty("--progress", `${progress}%`);
    });
  }, [serviceData]);

  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-soft-br transition-smooth font-inter">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-primary-light" />
          Service Revenue Breakdown
        </h2>

        <div className="space-y-5">
          {serviceData.map((srv) => (
            <div key={srv.service}>
              <div className="flex justify-between text-sm text-foreground mb-1">
                <span className="font-medium">{srv.service}</span>
                <span className="font-semibold">
                  ${srv.revenue.toLocaleString()}
                </span>
              </div>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-1">
                <div
                  className="progress-bar bg-primary rounded-full"
                  data-progress={((srv.revenue / maxRevenue) * 100).toFixed(1)}
                ></div>
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{srv.bookings} bookings</span>
                <span>${srv.average.toFixed(2)}/service</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .progress-bar {
          height: 100%;
          border-radius: var(--radius);
          width: var(--progress, 0%);
          transition: width 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default AnalyticsServiceRevenue;
