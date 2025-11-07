"use client";

import { useState } from "react";
import CustomerNavbar from "@/components/Customer/CustomerNavbar";
import CustomerSearchCard from "@/components/Customer/CustomerSearchCard";
import ServiceButton from "@/components/Dashboard/Service/ServiceButton";

import { Scissors, Palette, Sparkles, Hand, Eye, Brush } from "lucide-react";
import CustomerTopSalon from "@/components/Customer/CustomerTopSalon";

const Page = () => {
  const [selectedService, setSelectedService] = useState("all");

  const services = [
    { id: "all", label: "All Services", icon: Sparkles },
    { id: "haircut", label: "Haircut", icon: Scissors },
    { id: "coloring", label: "Hair Coloring", icon: Palette },
    { id: "nails", label: "Nails", icon: Hand },
    { id: "eyebrows", label: "Eyebrows", icon: Eye },
    { id: "makeup", label: "Makeup", icon: Brush },
  ];

  return (
    <div className="bg-muted">
      <CustomerNavbar />
      <CustomerSearchCard />

      <div className="flex flex-wrap justify-center gap-3 mt-8 pb-16">
        {services.map((service) => (
          <ServiceButton
            key={service.id}
            label={service.label}
            icon={service.icon}
            active={selectedService === service.id}
            onClick={() => setSelectedService(service.id)}
          />
        ))}
      </div>
      <CustomerTopSalon />
    </div>
  );
};

export default Page;
