"use client";

import React from "react";
import NextImage from "next/image";
import {
  Calendar,
  Shield,
  Clock,
  CreditCard,
  Star,
  MapPin,
} from "lucide-react";
import featureCollageOne from "@/public/salons/2.png";
import featureCollageTwo from "@/public/salons/4.png";
import featureCollagePrimary from "@/public/salons/1.png";

const features = [
  {
    icon: Calendar,
    title: "Dynamic Scheduling",
    description: "AI-powered capacity planning and automatic waitlist routing.",
    tag: "Automation",
  },
  {
    icon: Shield,
    title: "Verified Professionals",
    description: "Compliance workflows, licensing records, and audit trails.",
    tag: "Trust",
  },
  {
    icon: Clock,
    title: "24/7 Concierge",
    description: "Hands-off guest messaging, reminders, and SLA monitoring.",
    tag: "Service",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Tokenised, cashless experiences with revenue reconciliation.",
    tag: "FinOps",
  },
  {
    icon: Star,
    title: "Experience Insights",
    description: "Real-time NPS, retention signals, and promo attribution.",
    tag: "Intelligence",
  },
  {
    icon: MapPin,
    title: "Geofenced Discovery",
    description: "Launch local storefronts with curated inventory per city.",
    tag: "Growth",
  },
];

const capabilityPillars = [
  {
    title: "Automation-first workflows",
    description:
      "Configured playbooks eliminate manual tasks across every journey.",
  },
  {
    title: "Enterprise-grade controls",
    description:
      "Fine-grained roles, SSO, and audit logging baked into every click.",
  },
  {
    title: "Actionable intelligence",
    description:
      "Portfolio-level dashboards keep executives and operators aligned.",
  },
];

const featureShots = [
  {
    src: featureCollagePrimary,
    alt: "Command dashboard",
    title: "Command hub",
    caption: "Live P&L across markets.",
  },
  {
    src: featureCollageOne,
    alt: "Operations room",
    title: "Ops war-room",
    caption: "Resolve issues in minutes.",
  },
  {
    src: featureCollageTwo,
    alt: "Stylist board",
    title: "Deskless app",
    caption: "Updates for every stylist.",
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.65fr_0.35fr] gap-12 mb-16 items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground mb-4">
              Platform Pillars
            </p>
            <h2 className="font-sans text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Why enterprise teams choose{" "}
              <span className="text-primary">StyGo</span>.
            </h2>
            <p className="text-lg text-muted-foreground font-inter mb-8 max-w-3xl">
              From automation to analytics, StyGo delivers the governance modern
              salon groups need without sacrificing the artisan experience.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {capabilityPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="p-5 rounded-2xl border border-border/60 bg-card/80"
                >
                  <p className="font-sans text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                    {pillar.title}
                  </p>
                  <p className="text-sm text-muted-foreground font-inter">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 border border-primary/30 shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary mb-3">
                Signal at a glance
              </p>
              <h3 className="font-sans text-2xl font-bold text-foreground mb-5">
                360° control in a single dashboard.
              </h3>
              <ul className="space-y-4 text-sm text-foreground/80 font-inter">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  Same-day occupancy projections across every location.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  Executive-level reporting for finance, ops, and CX.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  Dedicated success team with 30-minute response SLA.
                </li>
              </ul>
              <div className="mt-6 rounded-2xl bg-white/80 border border-border/40 p-4 backdrop-blur">
                <p className="font-sans text-sm font-semibold text-foreground">
                  Executive-ready deck
                </p>
                <p className="text-xs font-inter text-muted-foreground">
                  Delivered to your inbox every Monday at 7am.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {featureShots.map((shot) => (
            <div
              key={shot.title}
              className="rounded-2xl border border-border/50 bg-card/90 shadow-sm overflow-hidden"
            >
              <NextImage
                src={shot.src}
                alt={shot.alt}
                className="h-58 w-full object-cover"
              />
              <div className="p-3 space-y-1">
                <p className="font-sans text-sm font-semibold text-foreground">
                  {shot.title}
                </p>
                <p className="text-xs font-inter text-muted-foreground">
                  {shot.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-15 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-[32px] border border-border/60 bg-white p-7 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-2 hover:border-primary/60"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary mb-2">
                    {feature.tag}
                  </p>
                  <h3 className="font-sans text-xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground font-inter pl-16 -mt-2">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
