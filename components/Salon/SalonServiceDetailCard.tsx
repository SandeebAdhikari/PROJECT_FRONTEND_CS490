"use client";

import React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

interface ServiceCardProps {
  service: {
    id: number;
    name: string;
    category: string;
    description: string;
    duration: string;
    price: number;
  };
  salonId?: string;
}

const SalonServiceDetailCard: React.FC<ServiceCardProps> = ({ service, salonId = "1" }) => {
  return (
    <div
      key={service.id}
      className="rounded-2xl border border-border bg-muted hover:shadow-medium-br transition-smooth font-inter"
    >
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex justify-between">
              <h4 className="font-semibold text-lg">{service.name}</h4>
              <span className="text-2xl font-extrabold text-primary">
                ${service.price}
              </span>
            </div>
            <span className="inline-block bg-faint-foreground/40 text-xs rounded-full px-3 py-0.5 mt-1 text-foreground">
              {service.category}
            </span>

            <p className="text-sm text-muted-foreground mt-6 pb-3 border-b border-border">
              {service.description}
            </p>
            <div className="flex justify-between text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
                <Clock className="w-4 h-4" />
                <span>{service.duration}</span>
              </div>
              <Link
                href={`/customer/booking-page?salonId=${salonId}&service=${encodeURIComponent(service.name)}&price=${service.price}`}
                className="mt-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:scale-105 transition-smooth cursor-pointer"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonServiceDetailCard;
