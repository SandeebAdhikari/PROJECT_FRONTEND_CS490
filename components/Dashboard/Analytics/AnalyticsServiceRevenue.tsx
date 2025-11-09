"use client";

import React, { useEffect } from "react";
import { Target } from "lucide-react";

const serviceData = [
  { service: "Women's Haircut", revenue: 2925, bookings: 45, avg: 65 },
  { service: "Men's Haircut", revenue: 1800, bookings: 40, avg: 45 },
  { service: "Full Color", revenue: 4900, bookings: 35, avg: 140 },
  { service: "Highlights", revenue: 3600, bookings: 30, avg: 120 },
  { service: "Beard Trim", revenue: 625, bookings: 25, avg: 25 },
  {
    service: "Deep Conditioning Treatment",
    revenue: 1100,
    bookings: 20,
    avg: 55,
  },
];

const AnalyticsServiceRevenue = () => {
  const maxRevenue = Math.max(...serviceData.map((d) => d.revenue));

  useEffect(() => {
    const bars = document.querySelectorAll<HTMLDivElement>(".progress-bar");
    bars.forEach((bar) => {
      const progress = bar.dataset.progress;
      if (progress) bar.style.setProperty("--progress", `${progress}%`);
    });
  }, []);

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
                <span>${srv.avg}/service</span>
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
