"use client";

import React from "react";
import { Clock, CreditCard } from "lucide-react";

const policies = [
  {
    icon: Clock,
    title: "Cancellation Policy",
    description: "Free cancellation up to 24 hours before appointment",
  },
  {
    icon: CreditCard,
    title: "Deposit Requirements",
    description: "No deposit required for most services",
  },
  {
    icon: Clock,
    title: "Late Arrival Policy",
    description:
      "15-minute grace period. Late arrivals may result in shortened service time",
  },
];

const SalonDetailBookingPolicy = () => {
  return (
    <div className="mt-5 bg-muted border border-border rounded-lg p-4">
      <h2 className="text-xl font-extrabold mb-6">Booking Policies</h2>

      <div className="space-y-5 font-inter">
        {policies.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalonDetailBookingPolicy;
