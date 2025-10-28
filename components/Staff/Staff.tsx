"use client";

import React, { useMemo, useState } from "react";
import { Users, Star, DollarSign, Activity, Filter, UserPlus } from "lucide-react";
import StaffCard, { StaffMember } from "./Staffcard";

// KPI card
function KPI({
  label,
  value,
  Icon,
  iconClass = "",
}: {
  label: string;
  value: string | number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconClass?: string;
}) {
  return (
    <div
      className="
        rounded-2xl border border-border bg-white
        p-5 sm:p-6 shadow-soft-br hover:shadow-md transition-smooth
        flex items-center justify-between min-h-[96px]
      "
    >
      <div>
        <div className="text-sm text-muted-foreground font-inter">{label}</div>
        <div className="mt-1 text-2xl font-semibold leading-tight">{value}</div>
      </div>
      <div
        className={`h-9 w-9 rounded-2xl flex items-center justify-center ${iconClass}`}
        aria-hidden
      >
        <Icon className="h-4 w-4" />
      </div>
    </div>
  );
}


//mock data 
const SEED: StaffMember[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    role: "Senior Stylist",
    email: "maria@luxehair.com",
    phone: "+1 (555) 123-4567",
    specialties: ["Haircuts", "Color", "Highlights"],
    rating: 4.9,
    reviewsCount: 248,
    efficiency: 94,
    customerSatisfaction: 98,
    monthlyRevenue: 12400,
    active: true,
  },
  {
    id: "2",
    name: "Lisa Chen",
    role: "Color Specialist",
    email: "lisa@luxehair.com",
    phone: "+1 (555) 234-5678",
    specialties: ["Color", "Highlights", "Balayage"],
    rating: 4.8,
    reviewsCount: 186,
    efficiency: 89,
    customerSatisfaction: 96,
    monthlyRevenue: 9800,
    active: true,
  },
  {
    id: "3",
    name: "James Wilson",
    role: "Senior Barber",
    email: "james@luxehair.com",
    phone: "+1 (555) 345-6789",
    specialties: ["Haircuts", "Beard Styling", "Hot Towel Shave"],
    rating: 4.7,
    reviewsCount: 312,
    efficiency: 96,
    customerSatisfaction: 94,
    monthlyRevenue: 8900,
    active: true,
  },
  {
    id: "4",
    name: "Sophie Turner",
    role: "Junior Stylist",
    email: "sophie@luxehair.com",
    phone: "+1 (555) 456-7890",
    specialties: ["Haircuts", "Styling", "Treatments"],
    rating: 4.6,
    reviewsCount: 142,
    efficiency: 87,
    customerSatisfaction: 92,
    monthlyRevenue: 5600,
    active: true,
  },
];

export default function Staff() {
  const [q, setQ] = useState("");

  const staff = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return SEED;
    return SEED.filter(
      (s) =>
        s.name.toLowerCase().includes(t) ||
        s.role.toLowerCase().includes(t) ||
        s.email.toLowerCase().includes(t) ||
        s.phone.toLowerCase().includes(t) ||
        s.specialties.some((sp) => sp.toLowerCase().includes(t))
    );
  }, [q]);

  // KPIs for this tab
  const total = staff.length;
  const avgRating = (staff.reduce((a, s) => a + s.rating, 0) / Math.max(1, total)).toFixed(1);
  const monthlyRevenue = staff.reduce((a, s) => a + s.monthlyRevenue, 0);
  const avgEfficiency = Math.round(
    staff.reduce((a, s) => a + s.efficiency, 0) / Math.max(1, total)
  );

  return (
    <section className="space-y-6 font-inter">
      {/* Title/actions */}
     
     <header className="flex items-start justify-between pt-2">
  <div>
    <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-extrabold">
      Staff Management
    </h2>
    <p className="text-muted-foreground text-base mt-1 sm:text-lg">
      Manage your salon team and their performance
    </p>
  </div>
  <div className="flex gap-2">
    <button className="px-4 py-2.5 rounded-lg border border-border bg-white text-sm font-medium text-gray-800 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
      Filter
    </button>
    <button className="px-4 py-2.5 rounded-lg border border-transparent bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 hover:shadow-md transform hover:-translate-y-[1px] transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
      Add Staff Member
    </button>
  </div>
</header>


      {/* KPI row  */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        <KPI label="Total Staff" value={total} Icon={Users} iconClass="bg-blue-100 text-blue-600" />
        <KPI label="Avg Rating" value={avgRating} Icon={Star} iconClass="bg-yellow-100 text-yellow-600" />
        <KPI
          label="Monthly Revenue"
          value={`$${monthlyRevenue.toLocaleString()}`}
          Icon={DollarSign}
          iconClass="bg-emerald-100 text-emerald-600"
        />
        <KPI
          label="Avg Efficiency"
          value={`${avgEfficiency}%`}
          Icon={Activity}
          iconClass="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Search */}
      <div className="flex items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, role, email, phone, specialty…"
          className="w-full max-w-md border border-border rounded-lg px-3 py-2"
        />
      </div>

      {/* Cards grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {staff.map((s) => (
          <StaffCard key={s.id} s={s} />
        ))}
      </div>
    </section>
  );
}
