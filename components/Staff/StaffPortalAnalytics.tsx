"use client";

import React from "react";
import { Activity, TrendingUp } from "lucide-react";

interface StaffPortalAnalyticsProps {
  stats: {
    label: string;
    value: string;
    change: string;
    positive?: boolean;
  }[];
  insights: {
    title: string;
    description: string;
    metric: string;
    progress: number;
  }[];
}

const StaffPortalAnalytics: React.FC<StaffPortalAnalyticsProps> = ({
  stats = [],
  insights = [],
}) => {
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-3xl border border-border bg-card p-5 shadow-soft-br"
          >
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-3xl font-semibold">{stat.value}</p>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  stat.positive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                {stat.change}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-white shadow-soft-br p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 text-primary p-3">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Momentum tracker</h3>
            <p className="text-sm text-muted-foreground">
              Where to focus during this shift
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          {insights.map((insight) => (
            <div key={insight.title}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{insight.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {insight.metric}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-smooth"
                  style={{ width: `${Math.min(insight.progress, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffPortalAnalytics;
