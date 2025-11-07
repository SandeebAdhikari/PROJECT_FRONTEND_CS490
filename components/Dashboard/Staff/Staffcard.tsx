"use client";

import React from "react";
import Image from "next/image";
import { Eye, Pencil, Star } from "lucide-react";
import MetricBar from "@/components/Dashboard/Staff/StaffMetricBar";

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
  efficiency: number;
  customerSatisfaction: number;
  monthlyRevenue?: number;
  active: boolean;
};

const StaffCard: React.FC<{ s: StaffMember }> = ({ s }) => {
  const revenueDisplay = s.monthlyRevenue
    ? `$${s.monthlyRevenue.toLocaleString()}`
    : "N/A";

  return (
    <div className="border border-border bg-muted/40 rounded-xl p-6 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-out relative overflow-hidden">
      <div className="absolute right-4 top-4">
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-medium border border-transparent shadow-sm ${
            s.active ? "bg-emerald-500 text-white" : "bg-gray-300 text-gray-800"
          }`}
        >
          {s.active ? "active" : "inactive"}
        </span>
      </div>

      <div className="flex items-start gap-4">
        {s.avatarUrl ? (
          <Image
            src={s.avatarUrl}
            alt={s.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
            {s.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
        )}

        <div className="flex-1">
          <h3 className="font-inter text-lg sm:text-xl font-extrabold">
            {s.name}
          </h3>
          <p className="text-sm text-muted-foreground font-inter">{s.role}</p>

          <div className="mt-1 inline-flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="font-medium">{s.rating.toFixed(1)}</span>
            <span className="text-muted-foreground font-inter">
              ({s.reviewsCount} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="text-base">
          <div className="text-muted-foreground font-inter">Email:</div>
          <div className="mt-1 text-[16px] sm:text-lg font-medium">
            {s.email}
          </div>

          <div className="mt-5 text-muted-foreground font-inter">
            Specialties:
          </div>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {s.specialties.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-sm font-inter"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="text-base">
          <div className="text-muted-foreground font-inter">Phone:</div>
          <div className="mt-1 text-[16px] sm:text-lg font-medium">
            {s.phone}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <MetricBar label="Efficiency" value={s.efficiency} />
        <MetricBar
          label="Customer Satisfaction"
          value={s.customerSatisfaction}
        />
      </div>

      <div className="mt-6 border-t border-border" />

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm">
          <div className="text-muted-foreground font-inter">
            Monthly Revenue:
          </div>
          <div className="mt-0.5 font-semibold text-emerald-600">
            {revenueDisplay}
          </div>
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          <button
            title="View"
            className="rounded p-1 hover:text-foreground transition-smooth"
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            title="Edit"
            className="rounded p-1 hover:text-foreground transition-smooth"
          >
            <Pencil className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
