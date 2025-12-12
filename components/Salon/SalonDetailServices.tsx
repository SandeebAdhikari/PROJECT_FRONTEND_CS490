"use client";

import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { API_ENDPOINTS } from "@/libs/api/config";
import SalonServiceDetailCard from "@/components/Salon/SalonServiceDetailCard";

interface Service {
  service_id: number;
  custom_name: string;
  category_name: string;
  description: string;
  duration: number;
  price: number | string;
}

interface ServiceApiResponse {
  service_id: number;
  custom_name: string;
  category_name: string;
  description?: string;
  duration: number | string;
  price: number | string;
}

export default function SalonDetailServices({ salonId }: { salonId: string }) {
  const [activeCategory, setActiveCategory] = useState("All Services");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      if (!salonId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(API_ENDPOINTS.SALONS.SERVICES_PUBLIC(salonId));
        if (response.ok) {
          const data = await response.json();
          const normalizedServices = Array.isArray(data)
            ? data.map((s: ServiceApiResponse) => ({
                ...s,
                description: s.description || "",
                price:
                  typeof s.price === "string"
                    ? parseFloat(s.price) || 0
                    : s.price || 0,
                duration:
                  typeof s.duration === "string"
                    ? parseInt(s.duration) || 0
                    : s.duration || 0,
              }))
            : [];
          setServices(normalizedServices);
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ error: response.statusText }));
          console.error(
            "Failed to fetch services:",
            errorData.error || response.statusText
          );
          setServices([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [salonId]);

  const categories = [
    "All Services",
    ...Array.from(new Set(services.map((s) => s.category_name))),
  ];
  const sortOptions = ["Most Popular", "Lowest Price", "Highest Price"];

  let filtered =
    activeCategory === "All Services"
      ? services
      : services.filter((s) => s.category_name === activeCategory);

  if (sortBy === "Lowest Price")
    filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
  if (sortBy === "Highest Price")
    filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));

  const groupNames = Array.from(new Set(filtered.map((s) => s.category_name)));

  if (loading) {
    return (
      <section className="mt-5 w-full">
        <p className="text-muted-foreground">Loading services...</p>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="mt-5 w-full">
        <h2 className="text-2xl font-extrabold mb-6">Our Services</h2>
        <p className="text-muted-foreground">
          No services available at this time.
        </p>
      </section>
    );
  }

  const sectionWidth = "w-full lg:max-w-[860px] xl:max-w-[900px] mx-auto";

  return (
    <section className="mt-5 w-full">
      <div className={sectionWidth}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <h2 className="text-2xl font-extrabold">Our Services</h2>

          <label className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground/80 bg-background shadow-sm">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              aria-label="Sort services"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex gap-2 overflow-x-auto sm:overflow-visible sm:flex-wrap bg-muted/70 rounded-lg sm:w-fit p-1 font-inter shadow-inner border border-border">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={[
                "px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap cursor-pointer",
                activeCategory === c
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className={sectionWidth}>
        {groupNames.map((group) => {
          const items = filtered.filter((s) => s.category_name === group);
          if (!items.length) return null;

          return (
            <div key={group} className="mb-10 pt-6">
              <h3 className="text-lg font-semibold mb-4">{group}</h3>
              <div className="space-y-4">
                {items.map((service) => (
                  <SalonServiceDetailCard
                    key={service.service_id}
                    service={{
                      id: service.service_id,
                      name: service.custom_name,
                      category: service.category_name,
                      description: service.description,
                      duration: `${service.duration} min`,
                      price: Number(service.price),
                    }}
                    salonId={salonId}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
