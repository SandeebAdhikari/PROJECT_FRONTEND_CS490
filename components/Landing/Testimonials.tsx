"use client";
import React from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Kara Mitchell",
    role: "Chief Experience Officer",
    company: "Aurora Collective",
    quote:
      "StyGo feels like an operating system for our salons. We launch markets in weeks instead of quarters and every partner has clarity.",
    metric: "+42% revenue YoY",
  },
  {
    name: "Andre Lewis",
    role: "VP Operations",
    company: "UrbanZen Spas",
    quote:
      "Our stylists trust the automations, executives trust the reporting, and finance trusts the controls. That combination is rare.",
    metric: "95 NPS",
  },
];

const proofPoints = [
  "SOC 2 ready infrastructure",
  "Dedicated enterprise success pod",
  "Migration + data assistance included",
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.55fr_0.45fr] gap-12 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary mb-3">
              Customer proof
            </p>
            <h2 className="font-sans text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Modern salon leaders ship faster with StyGo.
            </h2>
            <p className="text-lg text-muted-foreground font-inter mb-8 max-w-2xl">
              We pair enterprise-grade reliability with a product your stylists
              actually love. That{"'"}s how we turn pilots into multi-year
              partnerships.
            </p>

            <div className="space-y-4 text-sm font-inter">
              {proofPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 text-foreground">
                  <span className="inline-flex w-6 h-6 rounded-full bg-primary/10 items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary inline-flex" />
                  </span>
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-8 rounded-3xl border border-border/70 bg-card shadow-soft relative overflow-hidden"
              >
                <Quote className="w-8 h-8 text-primary mb-6" />
                <p className="font-sans text-lg text-foreground font-semibold mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground font-inter">
                  <span className="text-foreground font-semibold">
                    {testimonial.name}
                  </span>
                  <span>
                    {testimonial.role}, {testimonial.company}
                  </span>
                  <span className="text-primary font-semibold">
                    {testimonial.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

