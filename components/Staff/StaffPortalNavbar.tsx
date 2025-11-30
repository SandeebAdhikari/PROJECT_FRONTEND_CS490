"use client";

import React from "react";
import { Clock8, Sparkles, Users } from "lucide-react";

interface StaffPortalNavbarProps {
  staffName: string;
  staffRole: string;
  salonName: string;
  shiftWindow: string;
  focus: string;
  stats: { label: string; value: string }[];
  onBookAppointment: () => void;
  onOpenSchedule: () => void;
  onOpenTeam: () => void;
}

const StaffPortalNavbar: React.FC<StaffPortalNavbarProps> = ({
  staffName,
  staffRole,
  salonName,
  shiftWindow,
  focus,
  stats,
  onBookAppointment,
  onOpenSchedule,
  onOpenTeam,
}) => {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-emerald-500 text-white shadow-soft-br">
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
            {salonName}
          </p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Hey {staffName.split(" ")[0]}, it&apos;s a great day to create.
          </h1>
          <p className="text-white/80">
            {staffRole} • Shift {shiftWindow}
          </p>
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              type="button"
              onClick={onBookAppointment}
              className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-5 py-2 font-semibold shadow-lg hover:-translate-y-0.5 transition-smooth"
            >
              <Sparkles className="h-4 w-4" />
              Book a guest
            </button>
            <button
              type="button"
              onClick={onOpenSchedule}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 font-semibold text-white hover:bg-white/10 transition-smooth"
            >
              <Clock8 className="h-4 w-4" />
              View schedule
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            shift focus
          </p>
          <p className="mt-3 text-lg font-semibold">{focus}</p>
          <p className="text-white/70 text-sm mt-1">
            Celebrate the wins, take detailed notes, and rebook before checkout.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-white/15 p-3 text-center"
              >
                <p className="text-xs uppercase tracking-wide text-white/70">
                  {item.label}
                </p>
                <p className="text-2xl font-semibold mt-1">{item.value}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onOpenTeam}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25 transition-smooth"
          >
            <Users className="h-4 w-4" />
            Manage team roster
          </button>
        </div>
      </div>
    </section>
  );
};

export default StaffPortalNavbar;
