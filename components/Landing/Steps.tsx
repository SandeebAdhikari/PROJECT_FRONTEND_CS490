"use client";

import React from "react";
import { Search, Calendar, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse & Discover",
    description: "Search for salons and services. Filter by ratings and price.",
  },
  {
    number: "02",
    icon: Calendar,
    title: "Book Your Appointment",
    description: "Pick your time slot and book. Get instant confirmation.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Enjoy Your Experience",
    description: "Show up and enjoy. Rate your experience after.",
  },
];

const Steps: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
            Three simple steps to book your next appointment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="bg-card rounded-2xl p-8 border border-border">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-lg mb-4">
                {step.number}
              </div>
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-muted-foreground font-inter">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
