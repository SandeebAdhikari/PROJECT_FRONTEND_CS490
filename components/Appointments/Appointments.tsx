"use client";

import React from "react";
import { Calendar, CheckCircle, Clock, DollarSign } from "lucide-react";
import AppointmentCard, { Appointment } from "./AppointmentCard";

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


const APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    customer: "Emma Thompson",
    service: "Haircut & Highlights",
    stylist: "Maria Rodriguez",
    date: "2024-01-28",
    time: "10:00",
    price: 180,
    status: "confirmed",
    avatarUrl: "https://i.pravatar.cc/100?img=47",
  },
  {
    id: "2",
    customer: "Michael Brown",
    service: "Haircut & Beard Trim",
    stylist: "James Wilson",
    date: "2024-01-28",
    time: "14:00",
    price: 65,
    status: "confirmed",
    avatarUrl: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: "3",
    customer: "Sarah Johnson",
    service: "Color Refresh",
    stylist: "Lisa Chen",
    date: "2024-01-29",
    time: "11:30",
    price: 120,
    status: "pending",
    avatarUrl: "https://i.pravatar.cc/100?img=30",
  },
  {
    id: "4",
    customer: "Jessica Martinez",
    service: "Haircut & Style",
    stylist: "Sophie Turner",
    date: "2024-01-29",
    time: "16:00",
    price: 75,
    status: "confirmed",
    avatarUrl: "https://i.pravatar.cc/100?img=21",
  },
];


export default function Appointments() {
  const today = "2024-01-28";
  const todays = APPOINTMENTS.filter((a) => a.date === today);
  const confirmed = APPOINTMENTS.filter((a) => a.status === "confirmed");
  const pending = APPOINTMENTS.filter((a) => a.status === "pending");
  const revenueToday = todays.reduce((sum, a) => sum + a.price, 0);

  return (
    <section className="space-y-6 font-inter">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h2 className="font-sans text-2xl sm:text-3xl font-extrabold">
            Appointment Management
          </h2>
          <p className="text-muted-foreground text-base mt-2 sm:text-lg">
            Manage and track all salon appointments
          </p>
        </div>
        <div className="flex gap-3">
    <button
    className="
      px-4 py-2.5 rounded-lg border border-border bg-white
      text-sm font-medium text-gray-800
      hover:bg-gray-50 hover:shadow-sm
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-emerald-500/30
    "
  >
    Filter
  </button>

  {/* Add button */}
  <button
    className="
      px-4 py-2.5 rounded-lg border border-transparent
      bg-emerald-600 text-white text-sm font-medium
      hover:bg-emerald-700 hover:shadow-md
      transform hover:-translate-y-[1px]
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-emerald-500/30
    "
  >
    Add Staff Member
  </button>
</div>
      </header>

      

      {/* KPI Row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        <KPI
          label="Today's Appointments"
          value={todays.length}
          Icon={Calendar}
          iconClass="text-blue-500 bg-blue-50"
        />
        <KPI
          label="Confirmed"
          value={confirmed.length}
          Icon={CheckCircle}
          iconClass="text-emerald-500 bg-emerald-50"
        />
        <KPI
          label="Pending"
          value={pending.length}
          Icon={Clock}
          iconClass="text-amber-500 bg-amber-50"
        />
        <KPI
          label="Revenue Today"
          value={`$${revenueToday}`}
          Icon={DollarSign}
          iconClass="text-purple-500 bg-purple-50"
        />
      </div>

      {/* Recent Appointments */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Appointments</h3>
        <div className="space-y-4">
          {APPOINTMENTS.map((a) => (
            <AppointmentCard key={a.id} a={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
