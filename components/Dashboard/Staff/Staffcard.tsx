"use client";

import React from "react";
import Image from "next/image";
import { Pencil, Star, Trash2 } from "lucide-react";
import MetricBar from "@/components/Dashboard/Staff/StaffMetricBar";

export type StaffMember = {
  staff_id: number;
  salon_id: number;
  user_id: number;
  staff_code?: string | null;
  staff_role: string;
  specialization: string | null;
  is_active: boolean;
  pin_hash?: string | null;
  pin_last_set?: string | null;
  pin_reset_token?: string | null;
  pin_reset_expires?: string | null;
  created_at?: string | null;
  updated_at?: string | null;

  // Joined / computed fields
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string | null;
  avg_rating?: number;
  review_count?: number;
  efficiency_percentage?: number;
  total_revenue?: number;
};

interface StaffCardProps {
  s: StaffMember;
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (id: number) => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ s, onEdit, onDelete }) => {
  const revenueDisplay =
    s.total_revenue && s.total_revenue > 0
      ? `$${s.total_revenue.toLocaleString()}`
      : "N/A";

  const initials = s.full_name
    ? s.full_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "NA";

  const specialties =
    s.specialization && s.specialization.length > 0
      ? s.specialization.split(",").map((sp) => sp.trim())
      : [];

  return (
    <div className="border border-border bg-muted/40 rounded-xl p-6 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-out relative overflow-hidden">
      {/* Active badge */}
      <div className="absolute right-4 top-4">
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-medium border border-transparent shadow-sm ${
            s.is_active
              ? "bg-emerald-500 text-white"
              : "bg-gray-300 text-gray-800"
          }`}
        >
          {s.is_active ? "active" : "inactive"}
        </span>
      </div>

      <div className="flex items-start gap-4">
        {s.avatar_url ? (
          <Image
            src={s.avatar_url}
            alt={s.full_name || "Staff"}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
            {initials}
          </div>
        )}

        <div className="flex-1">
          <h3 className="font-inter text-lg sm:text-xl font-extrabold">
            {s.full_name || "Unnamed"}
          </h3>
          <p className="text-sm text-muted-foreground font-inter">
            {s.staff_role || "—"}
          </p>

          <div className="mt-1 inline-flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="font-medium">
              {isNaN(Number(s.avg_rating))
                ? "0.0"
                : Number(s.avg_rating).toFixed(1)}
            </span>
            <span className="text-muted-foreground font-inter">
              ({s.review_count || 0} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="text-base">
          <div className="text-muted-foreground font-inter">Email:</div>
          <div className="mt-1 text-[16px] sm:text-lg font-medium break-all">
            {s.email || "—"}
          </div>

          <div className="mt-5 text-muted-foreground font-inter">
            Specialties:
          </div>

          <div className="mt-2 flex flex-wrap gap-2.5 ">
            {specialties.length > 0 ? (
              specialties.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-sm font-inter"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">None</span>
            )}
          </div>
        </div>

        <div className="text-base">
          <div className="text-muted-foreground font-inter">Phone:</div>
          <div className="mt-1 text-[16px] sm:text-lg font-medium">
            {s.phone || "N/A"}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <MetricBar
          label="Efficiency"
          value={Number(s.efficiency_percentage) || 0}
        />
        <MetricBar
          label="Customer Satisfaction"
          value={Number(s.avg_rating) || 0}
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
            title="Edit"
            onClick={() => onEdit?.(s)}
            className="rounded p-1 hover:text-foreground transition-smooth hover:cursor-pointer"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            title="Delete"
            onClick={() => onDelete?.(s.staff_id)}
            className="rounded p-1 hover:text-foreground transition-smooth hover:cursor-pointer text-red-600"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
