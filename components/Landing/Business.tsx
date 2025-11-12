"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Predictable growth engine",
    description:
      "Convert search demand into loyal members with dynamic inventory and instant promo attribution.",
  },
  {
    icon: Users,
    title: "Unified customer intelligence",
    description:
      "Every visit, preference, and membership is centralised for your stylists and marketing team.",
  },
  {
    icon: Calendar,
    title: "Smart scheduling guardrails",
    description:
      "Automations keep chairs full, enforce buffers, and sync with payroll in the background.",
  },
  {
    icon: BarChart3,
    title: "Executive analytics",
    description:
      "Portfolio dashboards show revenue, utilisation, and NPS by location instantly.",
  },
];

const metrics = [
  { label: "Net revenue uplift", value: "+38%", caption: "After 90 days on StyGo" },
  { label: "No-show reduction", value: "↓82%", caption: "With automated reminders" },
  { label: "Average ROI", value: "5.3x", caption: "Attributed to automation" },
];

const Business: React.FC = () => {
  return (
    <section id="for-owners" className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6 w-fit">
              <TrendingUp className="w-4 h-4 text-accent-dark" />
              <span className="text-sm font-inter text-accent-dark font-semibold uppercase tracking-[0.35em]">
                For salon leaders
              </span>
            </div>

            <h2 className="font-sans text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Grow every location with{" "}
              <span className="text-primary">StyGo Enterprise.</span>
            </h2>

            <p className="text-lg text-muted-foreground font-inter mb-8">
              A connected command centre for revenue, CX, and operation teams.
              Launch new markets faster with governance built in.
            </p>

            <div className="space-y-6 mb-10">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans text-lg font-bold text-foreground mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground font-inter">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary-dark font-inter font-semibold text-lg transition-colors"
              >
                Book live demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/sign-up"
                className="flex items-center gap-2 px-8 py-4 border border-border rounded-xl font-inter font-semibold text-lg text-foreground hover:border-primary transition-colors"
              >
                Download playbook
              </Link>
            </div>
          </div>

          <div>
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_60%)]" />
              <div className="relative">
                <h3 className="font-sans text-3xl font-bold mb-8">
                  Why brands switch to StyGo
                </h3>

                <div className="space-y-6">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="bg-white/20 rounded-2xl p-6 border border-white/30">
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80 mb-2">
                        {metric.label}
                      </p>
                      <div className="font-sans text-4xl font-bold mb-1">{metric.value}</div>
                      <p className="text-white/80 font-inter">{metric.caption}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-white/15 border border-white/20">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70 mb-2">
                    Customer spotlight
                  </p>
                  <p className="font-sans text-lg font-semibold">
                    &ldquo;StyGo removed five disconnected tools and gave us the clarity we needed to double locations.&rdquo;
                  </p>
                  <p className="text-sm text-white/70 mt-3 font-inter">
                    COO, Lumin Studio Group
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Business;
