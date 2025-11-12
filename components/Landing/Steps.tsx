"use client";

import React from "react";
import { Search, Calendar, Sparkles } from "lucide-react";

const steps = [
  {
    number: "Phase 01",
    icon: Search,
    title: "Strategic discovery",
    description:
      "We workshop goals with your ops, CX, and finance leads to design the perfect workflows.",
    deliverable: "Blueprint & KPI map",
    timeline: "Week 1",
  },
  {
    number: "Phase 02",
    icon: Calendar,
    title: "Configuration & launch",
    description:
      "StyGo configures automation, SSO, and branded guest flows. Your teams onboard with white-glove support.",
    deliverable: "Live pilot in 2 markets",
    timeline: "Weeks 2-4",
  },
  {
    number: "Phase 03",
    icon: Sparkles,
    title: "Scale & optimise",
    description:
      "Dedicated success teams monitor adoption, surface insights, and continuously optimise performance.",
    deliverable: "Executive QBR + playbooks",
    timeline: "Ongoing",
  },
];

const Steps: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="py-20 lg:py-32 bg-gradient-to-b from-background via-muted/70 to-muted relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-12 mx-auto w-96 h-96 bg-primary/20 blur-3xl opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground mb-3">
            Implementation playbook
          </p>
          <h2 className="font-sans text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Enterprise onboarding in{" "}
            <span className="text-primary">three focussed phases.</span>
          </h2>
          <p className="text-lg text-muted-foreground font-inter max-w-3xl mx-auto">
            From initial alignment through scale, StyGo pairs software with a
            dedicated concierge team so you launch fast and stay optimised.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-1 gap-10 items-start">
          {/* Timeline Section */}
          <div className="relative w-full lg:max-w-5xl mx-auto">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent hidden sm:block" />
            <div className="space-y-10">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="timeline-card relative rounded-[32px] p-8 border border-white/70 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.12)]"
                  style={{ animationDelay: `${index * 0.6}s` }}
                >
                  <div className="absolute -left-[38px] top-8 w-10 h-10 rounded-full bg-white border border-border/60 flex items-center justify-center hidden sm:flex">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>

                  <div className="flex flex-wrap gap-3 items-center text-sm font-semibold mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {step.number}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      {step.timeline}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 sm:items-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-sans text-2xl font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground font-inter">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm font-inter">
                    <span className="text-muted-foreground uppercase tracking-wide">
                      Deliverable:
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary/5 text-primary font-semibold">
                      {step.deliverable}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Concierge Card — mobile only */}
          <div className="block lg:hidden bg-gradient-to-br from-primary/15 via-white to-white rounded-[32px] border border-primary/30 p-8 shadow-[0_30px_70px_rgba(15,23,42,0.15)] w-full">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary mb-4">
              Concierge team
            </p>
            <h3 className="font-sans text-2xl font-bold text-foreground mb-4">
              Dedicated enterprise pod
            </h3>
            <p className="text-muted-foreground font-inter mb-6">
              Solution architects, data specialists, and CX strategists work as
              an extension of your team with weekly steering sessions.
            </p>
            <ul className="space-y-4 text-sm text-foreground font-inter">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                30-day rollout across priority markets
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Executive QBRs with insight-ready decks
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Slack + email support with <strong>15 min</strong> response SLA
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .timeline-card {
          animation: floatSlow 12s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Steps;
