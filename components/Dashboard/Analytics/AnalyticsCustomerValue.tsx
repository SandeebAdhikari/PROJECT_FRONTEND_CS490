"use client";

import React, { useEffect } from "react";
import { Activity } from "lucide-react";

const AnalyticsCustomerValue = () => {
  useEffect(() => {
    const bars = document.querySelectorAll<HTMLDivElement>(".progress-bar");
    bars.forEach((bar) => {
      const progress = bar.dataset.progress;
      if (progress) bar.style.setProperty("--progress", `${progress}%`);
    });
  }, []);

  return (
    <>
      <div className="sm:h-132 bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-soft-br transition-smooth font-inter">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">
            Customer Lifetime Value
          </h2>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted p-4 rounded-xl text-center">
            <p className="text-sm text-subtle-foreground">Avg LTV</p>
            <p className="text-3xl font-bold text-foreground">$2,450</p>
          </div>
          <div className="bg-muted p-4 rounded-xl text-center">
            <p className="text-sm text-subtle-foreground">Avg Visits/Year</p>
            <p className="text-3xl font-bold text-foreground">8.5</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-foreground mb-1">
              <span>VIP Customers</span>
              <span className="font-semibold">$4,800 avg</span>
            </div>
            <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
              <div
                className="progress-bar bg-primary rounded-full"
                data-progress="90"
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-foreground mb-1">
              <span>Regular Customers</span>
              <span className="font-semibold">$2,200 avg</span>
            </div>
            <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
              <div
                className="progress-bar bg-primary-light rounded-full"
                data-progress="65"
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-foreground mb-1">
              <span>Occasional Customers</span>
              <span className="font-semibold">$850 avg</span>
            </div>
            <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
              <div
                className="progress-bar bg-accent-dark rounded-full"
                data-progress="30"
              ></div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-primary text-primary-foreground mt-6 rounded-xl p-5 text-center shadow-md">
          <p className="text-sm uppercase tracking-wide opacity-90">
            Total Customer Value
          </p>
          <p className="text-4xl font-bold">$487,500</p>
          <p className="text-sm opacity-90 mt-1">
            Based on <span className="font-semibold">199 active customers</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        .progress-bar {
          height: 100%;
          border-radius: var(--radius);
          transition: width 0.3s ease;
          width: var(--progress, 0%);
        }
      `}</style>
    </>
  );
};

export default AnalyticsCustomerValue;
