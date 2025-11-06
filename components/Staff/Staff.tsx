"use client";

import React, { useMemo, useState } from "react";
import { Users, Star } from "lucide-react";
import StaffCard, { StaffMember } from "./Staffcard";
import KPI from "@/components/KPI";
import data from "@/data/data.json";
import { Calendar1, Filter } from "lucide-react";

const Staff = () => {
  const [q, setQ] = useState("");
  const salonId = "1";
  const staffList = useMemo(() => {
    return (data.staff[salonId] || []) as unknown as StaffMember[];
  }, [salonId]);

  const staff = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return staffList;
    return staffList.filter(
      (s) =>
        s.name.toLowerCase().includes(t) ||
        s.role.toLowerCase().includes(t) ||
        s.specialties.some((sp) => sp.toLowerCase().includes(t))
    );
  }, [q, staffList]);

  const total = staff.length;
  const avgRating = (
    staff.reduce((a, s) => a + (s.rating || 0), 0) / Math.max(1, total)
  ).toFixed(1);
  const totalRevenue = staff.reduce((a, s) => a + (s.monthlyRevenue || 0), 0);

  return (
    <section className="space-y-6 font-inter">
      <header className="sm:flex sm:items-start sm:justify-between">
        <div>
          <h2 className="font-inter text-2xl sm:text-3xl font-extrabold">
            Salon Management
          </h2>
          <p className="text-muted-foreground text-base mt-2 sm:text-lg">
            Manage your salon team and their performance
          </p>
        </div>
        <div className="flex gap-3 mt-3">
          <button
            className="px-4 py-2.5 rounded-lg border border-border bg-primary-foreground
              text-sm font-medium text-gray-800
              hover:bg-accent hover:shadow-soft-br
              transition-smooth 
              focus:outline-none focus:ring-2 focus:ring-emerald-500/30 
              flex gap-4 justify-center cursor-pointer"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            className="px-4 py-2.5 rounded-lg border border-transparent
              bg-emerald-600 text-white text-sm font-medium
              hover:bg-emerald-700 hover:shadow-md
              transform hover:-translate-y-[1px]
              transition-smooth 
              focus:outline-none focus:ring-2 focus:ring-emerald-500/30 
              flex gap-4 justify-center cursor-pointer"
          >
            <Calendar1 className="w-4 h-4" />
            New Appointment
          </button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        <KPI
          label="Total Staff"
          value={total}
          Icon={Users}
          iconClass="bg-blue-100 text-blue-600"
        />
        <KPI
          label="Avg Rating"
          value={avgRating}
          Icon={Star}
          iconClass="bg-yellow-100 text-yellow-600"
        />
        <KPI
          label="Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          Icon={Star}
          iconClass="bg-emerald-100 text-emerald-600"
        />
      </div>

      <div className="flex items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, role, or specialty…"
          className="w-full max-w-md border border-border rounded-lg px-3 py-2"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {staff.map((s) => (
          <StaffCard key={s.id} s={s} />
        ))}
      </div>
    </section>
  );
};

export default Staff;
