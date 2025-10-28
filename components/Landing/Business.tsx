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
    title: "Grow Your Business",
    description: "Reach thousands of potential customers actively looking for salon services.",
  },
  {
    icon: Users,
    title: "Manage Customers",
    description: "Keep track of all your clients and their preferences in one place.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Automated booking system that works 24/7 to fill your calendar.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Get insights into your business performance with detailed analytics.",
  },
];

const Business: React.FC = () => {
  return (
    <section id="for-owners" className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6 w-fit">
              <TrendingUp className="w-4 h-4 text-accent-dark" />
              <span className="text-sm font-inter text-accent-dark font-semibold">
                For Salon Owners
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Grow Your Salon with{" "}
              <span className="text-primary">StyGo</span>
            </h2>

            <p className="text-lg text-muted-foreground font-inter mb-8">
              List your salon and reach more customers. Simple tools to manage
              bookings and grow your business.
            </p>

            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground font-inter">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/sign-up"
              className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark font-inter font-semibold text-lg w-fit transition-colors"
            >
              List Your Salon
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div>
            <div className="bg-gradient-primary rounded-2xl p-8 lg:p-12 text-white">
              <h3 className="text-3xl font-bold mb-8">
                Why Salons Love StyGo
              </h3>

              <div className="space-y-6">
                <div className="bg-white/30 rounded-xl p-6">
                  <div className="text-4xl font-bold mb-2">2x</div>
                  <div className="text-white opacity-90 font-inter">
                    Average increase in bookings
                  </div>
                </div>

                <div className="bg-white/30 rounded-xl p-6">
                  <div className="text-4xl font-bold mb-2">85%</div>
                  <div className="text-white opacity-90 font-inter">
                    Reduction in no-shows
                  </div>
                </div>

                <div className="bg-white/30 rounded-xl p-6">
                  <div className="text-4xl font-bold mb-2">$5k+</div>
                  <div className="text-white opacity-90 font-inter">
                    Average monthly revenue increase
                  </div>
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
