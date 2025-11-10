"use client";

import React, { useState } from "react";
import { Filter } from "lucide-react";
import data from "@/data/data.json";
import SalonServiceDetailCard from "@/components/Salon/SalonServiceDetailCard";

interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: number;
}

interface DataType {
  services?: Record<string, Service[]>;
}

const typedData = data as DataType;

export default function SalonDetailServices({ salonId }: { salonId: string }) {
  const [activeCategory, setActiveCategory] = useState("All Services");
  const [sortBy, setSortBy] = useState("Most Popular");

  const services = typedData.services?.[salonId] ?? [];

  const categories = [
    "All Services",
    ...Array.from(new Set(services.map((s) => s.category))),
  ];
  const sortOptions = ["Most Popular", "Lowest Price", "Highest Price"];

  let filtered =
    activeCategory === "All Services"
      ? services
      : services.filter((s) => s.category === activeCategory);

  if (sortBy === "Lowest Price")
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "Highest Price")
    filtered = [...filtered].sort((a, b) => b.price - a.price);

  const groupNames = Array.from(new Set(filtered.map((s) => s.category)));

  return (
    <section className="mt-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-extrabold">Our Services</h2>

        <div className="flex items-center gap-2 ">
          <Filter className="w-4 h-4 text-muted-foreground " />
          <select
            aria-label="Sort services"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-border text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary bg-background cursor-pointer font-inter"
          >
            {sortOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide bg-muted rounded-lg sm:w-fit p-1 font-inter">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={[
              "px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap cursor-pointer",
              activeCategory === c
                ? "bg-primary-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {c}
          </button>
        ))}
      </div>

      {groupNames.map((group) => {
        const items = filtered.filter((s) => s.category === group);
        if (!items.length) return null;

        return (
          <div key={group} className="mb-10">
            <h3 className="text-lg font-semibold mb-4">{group}</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {items.map((service) => (
                <SalonServiceDetailCard key={service.id} service={service} salonId={salonId} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
