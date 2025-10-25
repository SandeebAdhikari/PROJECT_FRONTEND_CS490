"use client";

import React from "react";
import {
  Calendar,
  Shield,
  Clock,
  CreditCard,
  Star,
  MapPin,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Book appointments in seconds. No phone calls needed.",
  },
  {
    icon: Shield,
    title: "Verified Professionals",
    description: "All salons are verified and rated by real customers.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Book anytime, anywhere. Platform always open.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Safe and secure payment options.",
  },
  {
    icon: Star,
    title: "Top Rated Services",
    description: "Access the highest-rated salons in your area.",
  },
  {
    icon: MapPin,
    title: "Find Nearby Salons",
    description: "Discover salons near you with location search.",
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Why Choose <span className="text-primary">StyGo</span>?
          </h2>
          <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
            Everything you need to book and manage salon appointments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 bg-card rounded-2xl border border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-inter">
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
